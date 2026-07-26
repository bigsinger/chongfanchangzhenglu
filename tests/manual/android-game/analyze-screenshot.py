"""Create a small preview and run fully local Chinese/English OCR."""

from __future__ import annotations

import argparse
from pathlib import Path

import easyocr
from PIL import Image


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True, type=Path)
    parser.add_argument("--max-width", type=int, default=960)
    args = parser.parse_args()

    source = args.input.resolve()
    preview = source.with_name(f"{source.stem}.preview.jpg")
    ocr_output = source.with_name(f"{source.stem}.ocr.txt")

    with Image.open(source) as image:
        image = image.convert("RGB")
        if image.width > args.max_width:
            height = round(image.height * args.max_width / image.width)
            image = image.resize((args.max_width, height), Image.Resampling.LANCZOS)
        image.save(preview, "JPEG", quality=55, optimize=True, progressive=True)

    reader = easyocr.Reader(["ch_sim", "en"], gpu=False, download_enabled=False)
    lines = reader.readtext(str(source), detail=0, paragraph=False)
    text = "\n".join(str(line).strip() for line in lines if str(line).strip())
    ocr_output.write_text(text, encoding="utf-8")

    print(f"preview={preview}")
    print(f"ocr={ocr_output}")
    print(text)


if __name__ == "__main__":
    main()
