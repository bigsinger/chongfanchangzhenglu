#!/usr/bin/env python3
"""Operate on a debuggable Android app's SQLite database from the host.

Recent Android builds no longer ship a shell sqlite3 executable.  ADB can
still stream the private database through ``run-as``; all SQL is therefore
executed by Python's host-side sqlite3 module and the modified database is
streamed back while the app is stopped.
"""

from __future__ import annotations

import argparse
import os
from pathlib import Path
import sqlite3
import subprocess
import sys
import tempfile


DEFAULT_PACKAGE = "com.game.longmarch.creator243"
DEFAULT_DATABASE = "databases/jsb.sqlite"


def adb_command(args: argparse.Namespace, *command: str) -> list[str]:
    return [args.adb, "-s", args.serial, *command]


def run_checked(command: list[str], **kwargs: object) -> subprocess.CompletedProcess[bytes]:
    result = subprocess.run(command, **kwargs)
    if result.returncode != 0:
        printable = " ".join(command)
        raise RuntimeError(f"ADB command failed ({result.returncode}): {printable}")
    return result


def export_database(args: argparse.Namespace, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    with destination.open("wb") as output:
        run_checked(
            adb_command(
                args,
                "exec-out",
                "run-as",
                args.package,
                "cat",
                args.database,
            ),
            stdout=output,
        )
    if destination.stat().st_size < 4096:
        raise RuntimeError(f"Exported database is unexpectedly small: {destination}")
    # Android's LocalStorage database normally runs in WAL mode. A newly
    # created database can keep even its schema exclusively in -wal, so the
    # main file alone is not a valid snapshot.
    # Never copy -shm: it is transient shared-memory coordination state and
    # can make a perfectly valid main+WAL pair look malformed on another host.
    for suffix in ("-wal",):
        companion = destination.with_name(destination.name + suffix)
        with companion.open("wb") as output:
            run_checked(
                adb_command(
                    args,
                    "exec-out",
                    "run-as",
                    args.package,
                    "sh",
                    "-c",
                    f"if [ -f {args.database}{suffix} ]; then cat {args.database}{suffix}; fi",
                ),
                stdout=output,
            )
        if companion.stat().st_size == 0:
            companion.unlink()


def checkpoint_database(database: Path) -> None:
    connection = sqlite3.connect(database)
    try:
        connection.execute("pragma wal_checkpoint(truncate)").fetchone()
        connection.commit()
    finally:
        connection.close()
    for suffix in ("-wal", "-shm"):
        companion = database.with_name(database.name + suffix)
        if companion.exists() and companion.stat().st_size == 0:
            companion.unlink()


def import_database(args: argparse.Namespace, source: Path) -> None:
    if not source.is_file() or source.stat().st_size < 4096:
        raise RuntimeError(f"Input database is missing or invalid: {source}")
    checkpoint_database(source)
    run_checked(
        adb_command(
            args,
            "shell",
            "run-as",
            args.package,
            "rm",
            "-f",
            f"{args.database}-journal",
            f"{args.database}-wal",
            f"{args.database}-shm",
        )
    )
    remote_staging = f"/data/local/tmp/{args.package}-jsb.sqlite"
    try:
        run_checked(
            adb_command(
                args,
                "push",
                str(source),
                remote_staging,
            ),
            stdout=subprocess.DEVNULL,
        )
        run_checked(adb_command(args, "shell", "chmod", "0644", remote_staging))
        run_checked(
            adb_command(
                args,
                "shell",
                "run-as",
                args.package,
                "cp",
                remote_staging,
                args.database,
            ),
        )
    finally:
        subprocess.run(
            adb_command(args, "shell", "rm", "-f", remote_staging),
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )


def validate_database(database: Path) -> None:
    connection = sqlite3.connect(database)
    try:
        result = connection.execute("pragma integrity_check").fetchone()
        if result != ("ok",):
            raise RuntimeError(f"SQLite integrity check failed: {result}")
    finally:
        connection.close()


def query_database(args: argparse.Namespace, database: Path) -> None:
    connection = sqlite3.connect(database)
    try:
        rows = connection.execute(args.sql).fetchall()
    finally:
        connection.close()
    if args.format == "scalar":
        if rows and rows[0]:
            sys.stdout.write("" if rows[0][0] is None else str(rows[0][0]))
        return
    for row in rows:
        print("|".join("" if value is None else str(value) for value in row))


def execute_database(args: argparse.Namespace, database: Path) -> None:
    sql = args.sql
    if args.sql_file:
        sql = Path(args.sql_file).read_text(encoding="utf-8")
    if not sql:
        raise RuntimeError("execute requires --sql or --sql-file")
    connection = sqlite3.connect(database)
    try:
        connection.executescript(sql)
        connection.commit()
        connection.execute("pragma wal_checkpoint(truncate)").fetchone()
    finally:
        connection.close()
    validate_database(database)


def temporary_database() -> tuple[tempfile.TemporaryDirectory[str], Path]:
    directory = tempfile.TemporaryDirectory(prefix="longmarch-device-db-")
    return directory, Path(directory.name) / "jsb.sqlite"


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser()
    parser.add_argument("command", choices=("export", "import", "query", "execute"))
    parser.add_argument("--adb", required=True)
    parser.add_argument("--serial", required=True)
    parser.add_argument("--package", default=DEFAULT_PACKAGE)
    parser.add_argument("--database", default=DEFAULT_DATABASE)
    parser.add_argument("--file")
    parser.add_argument("--sql")
    parser.add_argument("--sql-file")
    parser.add_argument("--format", choices=("rows", "scalar"), default="rows")
    return parser


def main() -> int:
    # PowerShell captures native stdout before ConvertFrom-Json. Force UTF-8
    # so Chinese item/NPC names survive a read-modify-write checkpoint round
    # trip instead of becoming replacement characters.
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="strict")
    if hasattr(sys.stderr, "reconfigure"):
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    args = build_parser().parse_args()
    if not os.path.isfile(args.adb):
        raise RuntimeError(f"ADB does not exist: {args.adb}")

    if args.command == "export":
        if not args.file:
            raise RuntimeError("export requires --file")
        destination = Path(args.file).resolve()
        export_database(args, destination)
        validate_database(destination)
        checkpoint_database(destination)
        print(destination)
        return 0

    if args.command == "import":
        if not args.file:
            raise RuntimeError("import requires --file")
        source = Path(args.file).resolve()
        validate_database(source)
        import_database(args, source)
        return 0

    temporary_directory, database = temporary_database()
    try:
        export_database(args, database)
        validate_database(database)
        if args.command == "query":
            if not args.sql:
                raise RuntimeError("query requires --sql")
            query_database(args, database)
        else:
            execute_database(args, database)
            import_database(args, database)
    finally:
        temporary_directory.cleanup()
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as error:  # Tests must fail loudly instead of hiding ADB errors.
        print(f"device-sqlite: {error}", file=sys.stderr)
        raise SystemExit(1)
