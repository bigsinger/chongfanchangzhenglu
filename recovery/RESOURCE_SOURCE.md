# APK resource recovery inputs

The JSON files in this directory are copied verbatim from the APK asset bundles.
They are recovery inputs only and are not imported by Cocos Creator.

- `resources-config.json`: original `assets/assets/resources/config.json`
- `main-config.json`: original `assets/assets/main/config.json`
- `internal-config.json`: original `assets/assets/internal/config.json`

`tools/restore-original-resources.js` uses the `resources` configuration as the
authoritative mapping between original asset paths, types, and UUIDs.
