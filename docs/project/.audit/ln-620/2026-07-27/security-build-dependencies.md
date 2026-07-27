# Security / Build / Dependencies follow-up audit

- Snapshot: 2026-07-27 13:51:48 +08:00
- Root: `F:\bigsinger\chongfanchangzhenglu`
- Context: `docs/project/.audit/ln-620/2026-07-27/context.json`
- Scope: current readable-name source, current generated Android project, and the current `dist` APK/AAB
- Method: `ln-621-security-auditor`, `ln-622-build-auditor`, and `ln-625-dependencies-auditor`. The installed package lacks the shared contract/scoring/template references, so this report uses the worker rules' documented severity penalties and equivalent evidence tables.
- Mutation policy: read-only audit; no production source or build configuration was changed.

## Executive result

| Category | Score | Findings | Current conclusion |
|---|---:|---:|---|
| Security | **8.8/10** | C:0 H:0 M:2 L:1 | Release signing, API 36, non-debuggable state, backup/cleartext hardening, and legacy-network pruning all verify. Residual risks are dependency/build-supply-chain related. |
| Build health | **7.5/10** | C:0 H:1 M:3 L:0 | Static gates and a release build pass, but the current APK/AAB predate material gameplay/save changes and are not the current source. |
| Dependencies & reuse | **6.5/10** | C:0 H:2 M:3 L:0 | The project still uses an end-of-life Creator/native runtime and packages two known-vulnerable shaded networking libraries that ordinary npm/Gradle SCA cannot see. |

Scoring used the available worker examples: `critical -2.0`, `high -1.0`, `medium -0.5`, `low -0.2`, floor at zero. Cross-cutting risks appear in each applicable category and are scored independently.

## Verified improvements / non-findings

These are current facts and should not be reopened as old findings:

- `npm test` exited `0`: 67 scripts/config JSON parse, published-content integrity, gameplay contracts, readable naming, and texture-budget checks passed.
- `tools/verify-production-bundle.js` exited `0`; executable modules `LegacyHotUpdate`, `LegacyHttpClient`, `LegacySceneEditor`, `LegacyItemEventModel`, `LegacyItemModel`, and `LegacyNetworkTip` are pruned from the production bundle.
- Release APK/AAB exist and were built with AGP `8.9.2`, Gradle `8.11.1`, JDK 17, `compileSdk/targetSdk 36`, `minSdk 21`, and both `arm64-v8a` and `armeabi-v7a`.
- `apksigner verify --verbose --print-certs` exited `0`; the APK verifies with v1/v2/v3, has one signer, and is not signed by the Android Debug identity.
- `aapt dump badging` reports version `1.1.0 (2026072701)`, target SDK 36, and no `application-debuggable`.
- Release manifest has `android:allowBackup="false"`, does not enable cleartext traffic, and does not request `INTERNET`.
- No production credential, API key, private key, or signing secret is tracked. `signing.properties.example` contains placeholders only; real signing files are ignored.
- The earlier listener cleanup, JSON failure handling, resource lifecycle, and persistence parsing fixes are not repeated here.

## Security — 8.8/10

### SEC-01 — Packaged vulnerable HTTP stack is dormant, not absent

| Field | Detail |
|---|---|
| Severity | **MEDIUM** effective application risk. The dependency CVSS severities remain High/Medium and are recorded separately as DEP-02/DEP-03. |
| Effort | M |
| Location | Relative: `tools/modernize-android-project.js:217-221`, `tools/modernize-android-project.js:265-272`; absolute: `F:\bigsinger\chongfanchangzhenglu\tools\modernize-android-project.js:217`, `F:\bigsinger\chongfanchangzhenglu\tools\modernize-android-project.js:265`. Packaged inputs: `E:\temp\CocosCreator-2.4.3\resources\cocos2d-x\cocos\platform\android\java\libs\okhttp-3.12.7.jar` and `...\okio-1.15.0.jar`. |
| Evidence | `apkanalyzer dex packages dist\chongfanchangzhenglu-1.1.0-2026072701-release.apk` finds `org.cocos2dx.okhttp3` and `org.cocos2dx.okio` in the final DEX. OSV queries identify GHSA-3cqm-mf7h-prrj / CVE-2021-0341 (CVSS 7.5) and GHSA-w33c-445m-f8w7 / CVE-2023-3635 (CVSS 5.9). `aapt dump permissions` reports only `ACCESS_NETWORK_STATE`, not `INTERNET`; production JS has no downloader/hot-update call site, so the remote exploit path is currently blocked. |
| Minimum fix | Prefer removing the downloader Java source and shaded OkHttp/Okio JARs from the offline release variant. If native symbol/link expectations make removal unsafe, rebuild the Creator 2.4 native engine against patched, relocated versions and keep the no-`INTERNET` manifest assertion. |
| Verification | Rebuild release; assert `apkanalyzer dex packages <apk> | Select-String 'okhttp|okio|Cocos2dxDownloader'` returns no rows, `aapt dump permissions <apk>` contains no `INTERNET`, and the full ADB playthrough still passes. If the classes must remain, document the compensated risk and add an automated fail if `INTERNET` reappears. |
| Sources | [OSV OkHttp advisory](https://osv.dev/vulnerability/GHSA-3cqm-mf7h-prrj), [OSV Okio advisory](https://osv.dev/vulnerability/GHSA-w33c-445m-f8w7) |

Reproduction:

```powershell
$env:JAVA_HOME = 'E:\temp\jdk17'
D:\Android\Sdk\cmdline-tools\latest\bin\apkanalyzer.bat dex packages `
  dist\chongfanchangzhenglu-1.1.0-2026072701-release.apk |
  Select-String 'okhttp|okio|Cocos2dxDownloader'
D:\Android\Sdk\build-tools\35.0.0\aapt.exe dump permissions `
  dist\chongfanchangzhenglu-1.1.0-2026072701-release.apk
```

### SEC-02 — Executed build inputs are version-named but not integrity-pinned

| Field | Detail |
|---|---|
| Severity | **MEDIUM** |
| Effort | S-M |
| Location | Relative: `tools/modernize-android-project.js:68-75`, `tools/modernize-android-project.js:8`, `tools/build-android-release.ps1:3-6`, `.github/workflows/quality-gates.yml:20`, `.github/workflows/quality-gates.yml:23`; absolute: `F:\bigsinger\chongfanchangzhenglu\tools\modernize-android-project.js:68`, `F:\bigsinger\chongfanchangzhenglu\.github\workflows\quality-gates.yml:20`. |
| Evidence | Generated `gradle-wrapper.properties` has `distributionUrl` and `validateDistributionUrl=true` but no `distributionSha256Sum`. Creator, NDK, and engine are accepted by path/version label without a repository-held expected hash. Workflow actions use mutable `actions/checkout@v4` and `actions/setup-node@v4` tags. |
| Minimum fix | Add Gradle's published `distributionSha256Sum`; verify the wrapper JAR; record approved SHA-256 values for Creator/engine/NDK inputs; pin GitHub Actions to full commit SHAs with version comments. |
| Verification | A clean machine build must fail after deliberately changing any expected hash. `rg 'distributionSha256Sum'` and `rg 'uses: .+@[0-9a-f]{40}' .github/workflows` should both succeed. |
| Sources | [Gradle wrapper checksum verification](https://docs.gradle.org/current/userguide/gradle_wrapper.html#sec:verification), [GitHub secure-use reference](https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions) |

### SEC-03 — Offline release retains an unnecessary network-state permission

| Field | Detail |
|---|---|
| Severity | **LOW** |
| Effort | S |
| Location | Relative: `tools/modernize-android-project.js:274-276`; absolute: `F:\bigsinger\chongfanchangzhenglu\tools\modernize-android-project.js:274`. Generated source: `build/jsb-link/frameworks/runtime-src/proj.android-studio/libcocos2dx/AndroidManifest.xml:3`. |
| Evidence | The modernizer removes network permissions from the app manifest at lines 265-272, but only removes the library manifest's package attribute at lines 274-276. Manifest merge therefore reintroduces `android.permission.ACCESS_NETWORK_STATE`; `aapt dump permissions <release.apk>` returns that single permission. |
| Minimum fix | Remove `ACCESS_NETWORK_STATE` from the copied `libcocos2dx` manifest for the offline variant and make the release verifier enforce an explicit zero-permission allowlist (or a documented minimal allowlist). |
| Verification | `aapt dump permissions <release.apk>` returns no permissions and the app launches/plays offline on the emulator. |

### Security applicability / N/A

| Check | Status |
|---|---|
| Hardcoded secrets | PASS — no tracked production secrets; signing values are externalized. Unlock-dialog “password” fields are puzzle state, not credentials. |
| SQL injection | **N/A** — no SQL query construction or server/database API exists in application code; JSB localStorage is used through the engine. |
| XSS / HTML injection | **N/A** — native Cocos renderer, no WebView/DOM/HTML sink. |
| Authentication, authorization, CSRF, CORS, payment endpoint validation | **N/A** — standalone offline client with no backend/API endpoints in the release. |
| File upload / remote form validation | **N/A** — no upload or public input endpoint. Local save/config boundary validation is applicable and is covered by current `SaveManager`/config contracts; the artifact freshness issue is BUILD-01. |

## Build health — 7.5/10

### BUILD-01 — Current release artifacts do not contain the current source

| Field | Detail |
|---|---|
| Severity | **HIGH** |
| Effort | S now; M to prevent recurrence |
| Location | Artifact: `F:\bigsinger\chongfanchangzhenglu\dist\chongfanchangzhenglu-1.1.0-2026072701-release.apk` and `.aab`. Current source: relative `assets/Scripts/ConfigRepair.js:41`, `assets/Scripts/SaveManager.js:18`, `assets/Scripts/SaveManager.js:109`, `package.json:9`; absolute `F:\bigsinger\chongfanchangzhenglu\assets\Scripts\ConfigRepair.js:41`, `...\SaveManager.js:109`. Pipeline: `tools/build-android-release.ps1:217-264`. |
| Evidence | Release APK time is `2026-07-27 10:59:18`; generated main bundle is `10:56:08`. Current `ConfigRepair.js`, `SaveManager.js`, and `package.json` changed around `13:40-13:41`. Current source contains `收藏品-红星报`, `PUBLISHED_MAP_COUNTS`, and `isStateValid`; `rg` finds none in `build/jsb-link/assets/main/index.6b1f7.js`. The current worktree also has material uncommitted gameplay/save/test changes. |
| Impact | Shipping the existing APK/AAB omits the newly added collectible placement, published-map bounds, and semantic save validation; it is not a release candidate for the current project state. |
| Minimum fix | Rebuild after the current changes are finalized. Extend the release script to require a clean tree by default and emit a build manifest containing Git commit, dirty-state flag, source/bundle hashes, tool versions, version code/name, signer certificate digest, and APK/AAB hashes. Refuse `-SkipGenerate`/`-SkipNative` reuse when recorded input hashes differ. |
| Verification | A fresh release timestamp/hash must postdate current inputs; `rg` of the generated main bundle must find the new contracts; install the release APK (not the debug APK) and run the ADB stability/playthrough suite. Archive the build manifest beside APK/AAB. |

Reproduction:

```powershell
Get-Item dist\chongfanchangzhenglu-1.1.0-2026072701-release.apk,
  build\jsb-link\assets\main\index.6b1f7.js,
  assets\Scripts\ConfigRepair.js,
  assets\Scripts\SaveManager.js |
  Select-Object FullName, LastWriteTime, Length
rg -n '收藏品-红星报|PUBLISHED_MAP_COUNTS|isStateValid' `
  assets\Scripts\ConfigRepair.js assets\Scripts\SaveManager.js `
  build\jsb-link\assets\main\index.6b1f7.js
```

### BUILD-02 — Release gate can modify source after tests have passed

| Field | Detail |
|---|---|
| Severity | **MEDIUM** |
| Effort | S |
| Location | Relative: `tools/build-android-release.ps1:59-65`, `tools/apply-runtime-fixes.js:434-438`; absolute: `F:\bigsinger\chongfanchangzhenglu\tools\build-android-release.ps1:59`, `F:\bigsinger\chongfanchangzhenglu\tools\apply-runtime-fixes.js:434`. |
| Evidence | The release script runs `npm test` at line 59, then calls `apply-runtime-fixes.js` at line 62. That utility writes `assets/Scripts/GameplaySceneController.js` at line 438 when its patch is absent. Therefore a permitted code path builds source different from the source that passed the quality gate. The current canonical source makes the operation idempotent, but the pipeline invariant is still unsafe. |
| Minimum fix | Make release use `apply-runtime-fixes.js --verify` and fail when changes would be needed. If repair mode is retained for recovery work, run it explicitly before the release pipeline, review/commit the result, then test and build without source writes. |
| Verification | Record `git status --porcelain` before/after release; it must be identical. A fixture with an unapplied patch must fail the release gate rather than rewrite source. |

### BUILD-03 — Debug testing and production packaging target different Android contracts

| Field | Detail |
|---|---|
| Severity | **MEDIUM** |
| Effort | M |
| Location | Relative: `settings/builder.json:13`, `settings/builder.panel.json:8`, `tools/build-android.ps1:169-171`, `tools/build-android-release.ps1:68-72`, `tools/modernize-android-project.js:152-164`; absolute: `F:\bigsinger\chongfanchangzhenglu\settings\builder.json:13`, `F:\bigsinger\chongfanchangzhenglu\tools\modernize-android-project.js:152`. |
| Evidence | `aapt dump badging` reports the emulator-oriented debug APK as min/target `16/28`, version `1.0 (1)`, debuggable; the release APK is min/target `21/36`, version `1.1.0 (2026072701)`, non-debuggable. The manual ADB workflow can therefore pass on behavior/permissions different from production. |
| Minimum fix | Generate both variants from one modernized Android template with shared min/target SDK and package/version defaults; vary only debug flags/signing/minification. Add a required release-APK smoke/stability stage before accepting a build. |
| Verification | `aapt dump badging` for debug and release must show the same min/target SDK and intended version family; run the same ADB launch, checkpoint/restore, background, corrupt-save, and stability checks against both. |

### BUILD-04 — Quality gate accepts 440 warnings and has no JS/Android lint or type analysis

| Field | Detail |
|---|---|
| Severity | **MEDIUM** |
| Effort | M |
| Location | Relative: `package.json:6-13`, `jsconfig.json:2-5`, `tools/check-syntax.js:7-16`, `tools/validate-game-config.js:153-178`, `.github/workflows/quality-gates.yml:27-49`, `tools/build-android-release.ps1:200`; absolute: `F:\bigsinger\chongfanchangzhenglu\package.json:6`, `F:\bigsinger\chongfanchangzhenglu\.github\workflows\quality-gates.yml:27`. |
| Evidence | `npm test` exits `0` with `0 errors, 440 warnings`, mostly `UNREACHABLE_EVENT`. The syntax gate only compiles files with `vm.Script`; `jsconfig.json` does not enable `checkJs`, there is no ESLint script, and release runs `assembleRelease`/`bundleRelease` without `lintRelease`. CI runs the same npm gates plus PowerShell parsing only. |
| Minimum fix | Baseline intentional recovered-content warnings by exact code/location and fail only on new warnings; reduce or explain the 440-item baseline. Add an engine-aware ESLint configuration, `checkJs`/JSDoc or a lightweight static checker for maintained modules, and `:app:lintRelease` to the release gate. |
| Verification | CI reports `0 new warnings`; deliberately introduce an unreachable published event, undefined maintained-module symbol, and Android lint violation and confirm all three fail. Existing recovered/minified modules should be scoped out or baselined rather than mass-reformatted. |

### Build applicability / N/A

| Check | Status |
|---|---|
| Compiler/syntax failure | PASS for snapshot — `npm test` and the current release build completed; no current syntax/config error. |
| Linter/type-check result | Not N/A; **missing tooling is BUILD-04**. The source is ES5 JavaScript rather than TypeScript, so strict `tsc` compilation itself is N/A, but JS static checking remains applicable. |
| Failed/skipped unit tests | No failing command and no `.skip`/`xit` test framework suite. Traditional framework skip counting is **N/A**; contract and ADB harnesses are the applicable tests. |
| Android release packaging | PASS for the 10:59 artifact itself: APK/AAB, signature, version/API, ABI, zipalign, minification, and resource shrinking verified. BUILD-01 supersedes it as a current-source artifact. |

## Dependencies & reuse — 6.5/10

### DEP-01 — Runtime remains on an end-of-life engine line and below its final patch

| Field | Detail |
|---|---|
| Severity | **HIGH** |
| Effort | L |
| Location | Relative: `project.json:6-8`, `tools/build-android-release.ps1:3`, `tools/build-android-release.ps1:115-130`, `tools/modernize-android-project.js:8`, `tools/modernize-android-project.js:156-157`; absolute: `F:\bigsinger\chongfanchangzhenglu\project.json:6`, `F:\bigsinger\chongfanchangzhenglu\tools\build-android-release.ps1:3`. |
| Evidence | Project and release paths pin Cocos Creator `2.4.3`; the official 2.4 manual identifies `2.4.15` as the final 2.x feature level, says Creator 2.x updates ceased in 2023, and recommends Creator 3.x for new work. The native runtime is the Creator-specific customized Cocos2d-x, not a drop-in current Cocos2d-x package. NDK `20.1.5948944` is retained for compatibility while current NDK releases are many major revisions newer. |
| Minimum fix | Near term, evaluate Creator `2.4.15` in an isolated branch using the UUID/config/content/ADB regression gates. Long term, treat Creator 3.x or another maintained runtime as a staged port, not an in-place Cocos2d-x library swap. Preserve the current 2.4.3 build as a reproducible compatibility baseline until parity is demonstrated. |
| Verification | Build/install the candidate engine with both ABIs and target 36; compare all 7 published maps, 13 collectibles, 10 histories, 6 quizzes, save migration/corruption recovery, memory/crash logs, and screenshots against the baseline. |
| Sources | [Cocos Creator 2.4 product-line status](https://docs.cocos.com/creator/2.4/manual/en/), [Creator 2.4 engine customization](https://docs.cocos.com/creator/2.4/manual/en/advanced-topics/engine-customization.html), [Android NDK revision history](https://developer.android.com/ndk/downloads/revision_history) |

### DEP-02 — Shaded OkHttp 3.12.7-SNAPSHOT ships with a High CVE

| Field | Detail |
|---|---|
| Severity | **HIGH** — CVSS 3.1 **7.5** |
| Effort | M-L |
| Fix type | Major/custom engine dependency replacement |
| Location | Relative dependency inclusion: `tools/modernize-android-project.js:217-221`; absolute input: `E:\temp\CocosCreator-2.4.3\resources\cocos2d-x\cocos\platform\android\java\libs\okhttp-3.12.7.jar`; absolute project script: `F:\bigsinger\chongfanchangzhenglu\tools\modernize-android-project.js:217`. |
| Evidence | JAR `pom.properties` reports `com.squareup.okhttp3:okhttp:3.12.7-SNAPSHOT`; SHA-256 is `D1293FC300F59B9391ADAF397B3D436EF3CA2E81AB03C3ED8AACFC0685F10C13`. OSV returns GHSA-3cqm-mf7h-prrj / CVE-2021-0341, wrong-certificate acceptance, affected through 4.9.1 and fixed in 4.9.2. `apkanalyzer` confirms relocated `org.cocos2dx.okhttp3` classes in the release APK. |
| Minimum fix | Remove the unused offline downloader stack or rebuild the Creator native Java layer with a patched, package-relocated OkHttp while preserving the `org.cocos2dx` integration contract. Do not merely replace the JAR with an upstream unrelocated artifact. |
| Verification | Query OSV for the exact replacement version, confirm no affected class/version remains in APK, run native downloader tests only if the feature is intentionally retained, and rerun the full offline playthrough. |
| Source | [GHSA-3cqm-mf7h-prrj](https://osv.dev/vulnerability/GHSA-3cqm-mf7h-prrj) |

### DEP-03 — Shaded Okio 1.15.0 ships with a Medium CVE

| Field | Detail |
|---|---|
| Severity | **MEDIUM** — CVSS 3.1 **5.9** |
| Effort | M |
| Fix type | Patch/backport or removal with DEP-02 |
| Location | Relative dependency inclusion: `tools/modernize-android-project.js:217-221`; absolute project script: `F:\bigsinger\chongfanchangzhenglu\tools\modernize-android-project.js:217`; absolute input: `E:\temp\CocosCreator-2.4.3\resources\cocos2d-x\cocos\platform\android\java\libs\okio-1.15.0.jar`. |
| Evidence | JAR metadata reports `com.squareup.okio:okio:1.15.0`; SHA-256 is `9A6D895F48B7C6C29E77A1674CFFF19AF486CCAF23F541C340DBC15135FF624D`. OSV returns GHSA-w33c-445m-f8w7 / CVE-2023-3635, crafted-GZIP denial of service, fixed for the 1.x line in 1.17.6. `apkanalyzer` confirms `org.cocos2dx.okio.GzipSource` in the release APK. |
| Minimum fix | If the downloader stack remains, rebuild its relocated Okio from at least the fixed 1.17.6 source compatible with the engine, or remove the complete stack for the offline variant. |
| Verification | OSV exact-version query returns no advisory; APK DEX reports the intended fixed/removed package; malformed-GZIP regression cannot crash or hang the process if remote download remains enabled. |
| Source | [GHSA-w33c-445m-f8w7](https://osv.dev/vulnerability/GHSA-w33c-445m-f8w7) |

### DEP-04 — Dependency inventory and vulnerability scan do not describe what the APK ships

| Field | Detail |
|---|---|
| Severity | **MEDIUM** |
| Effort | M |
| Fix type | Dependency governance |
| Location | Relative: `package.json:1-14`, `tools/modernize-android-project.js:217-221`; absolute: `F:\bigsinger\chongfanchangzhenglu\package.json:1`, `F:\bigsinger\chongfanchangzhenglu\tools\modernize-android-project.js:217`. |
| Evidence | `package.json` has no dependencies/devDependencies and there is no npm lockfile. `npm audit --json` exits `1` with `ENOLOCK`; `npm outdated --json` returns `{}`. Android dependencies are globbed from external `*.jar`/`*.aar` directories, so their coordinates/hashes/CVEs are invisible to npm and normal Gradle metadata. No SBOM, Gradle dependency lock, or verification metadata exists. DEP-02/03 demonstrate the blind spot. |
| Minimum fix | Maintain a checked-in dependency inventory for engine/native binaries with coordinates, versions, hashes, source/license, CVE status, and whether each reaches the APK. Generate CycloneDX/SPDX for each release and add OSV/Dependency-Check or an equivalent scanner that accepts the binary inventory. A package lock is optional while npm has no packages, but the audit command should explicitly report “no npm dependencies” rather than fail. |
| Verification | Release produces an SBOM listing Creator/native engine, OkHttp/Okio (or their removal), AGP/Gradle/NDK, and hashes; an intentionally vulnerable fixture fails CI; `npm audit` is either cleanly skipped with a reason or runs against a lockfile. |

### DEP-05 — Dependency download and automation references are not immutable

| Field | Detail |
|---|---|
| Severity | **MEDIUM** |
| Effort | S-M |
| Fix type | Integrity pin |
| Location | Relative: `tools/modernize-android-project.js:68-75`, `.github/workflows/quality-gates.yml:20-23`, `tools/build-android-release.ps1:3-6`; absolute: `F:\bigsinger\chongfanchangzhenglu\tools\modernize-android-project.js:68`, `F:\bigsinger\chongfanchangzhenglu\.github\workflows\quality-gates.yml:20`. |
| Evidence | No `distributionSha256Sum`, no Gradle verification metadata, mutable GitHub Action tags, and no checked-in expected hashes for external Creator/NDK trees. Version strings prevent accidental gross mismatch but do not establish artifact identity. |
| Minimum fix | Apply SEC-02: pin hashes/SHAs, add wrapper validation, and record engine binary provenance. |
| Verification | Tampering with any downloaded/external input fails before build execution; dependency/SBOM output records the verified hashes. |

### Dependencies applicability / N/A

| Check | Status |
|---|---|
| npm outdated | `npm outdated --json` returned `{}` because there are no npm package dependencies. Package-level outdated comparison is **N/A**; engine/native binary aging is DEP-01. |
| Unused npm dependencies / “available native feature” replacements | **N/A** — no npm dependencies are declared. The unused native downloader libraries are handled by DEP-02/03. |
| pip, NuGet, Cargo, Go, Bundler, Composer scans | **N/A** — those ecosystems are absent. |
| Custom crypto | **N/A / false positive** — `SaveManager`'s FNV checksum detects accidental save corruption and is not used for authentication, confidentiality, or signature verification. |
| Custom domain implementations | No generic wheel-reinvention finding. Recovered gameplay/config repair logic is domain-specific and replacing it with a third-party library would not reduce risk. |

## Prioritized handoff

1. **Do not distribute the current 10:59 APK/AAB as the build of the current tree.** Finalize the active gameplay/save changes, rerun all gates, rebuild release, install that release APK, and rerun ADB stability/playthrough.
2. Remove or patch the shaded OkHttp/Okio stack; at minimum preserve the no-`INTERNET` release invariant and document the compensated risk.
3. Make release builds immutable and attestable: clean tree, tested-equals-built, input hashes, Gradle checksum, action SHAs, and build manifest/SBOM.
4. Unify debug/release target SDK behavior and add release-APK ADB coverage.
5. Plan a controlled Creator 2.4.15 compatibility trial before any larger maintained-engine port.

## Commands and outcomes

| Command | Snapshot outcome |
|---|---|
| `npm test` | Exit 0; 67 scripts; 0 config errors; 440 warnings; content/contracts/naming/textures pass. |
| `node tools/verify-production-bundle.js` | Exit 0; six legacy modules excluded. |
| `npm audit --json` | Exit 1, `ENOLOCK`; scanner has no lock/inventory. |
| `npm outdated --json` | Exit 0, `{}`. |
| `aapt dump badging <release.apk>` | `1.1.0 (2026072701)`, min 21, target 36, not debuggable. |
| `aapt dump permissions <release.apk>` | Only `ACCESS_NETWORK_STATE`; no `INTERNET`. |
| `apksigner verify --verbose --print-certs <release.apk>` | Exit 0; v1/v2/v3 true; one non-debug signer. |
| `apkanalyzer dex packages <release.apk>` under JDK 17 | OkHttp/Okio/Cocos downloader classes present. |
| OSV Maven queries | OkHttp: GHSA-3cqm-mf7h-prrj; Okio: GHSA-w33c-445m-f8w7; AGP 8.9.2: no advisory returned. |
| `git status --short` | Active concurrent worktree changes exist; this report did not overwrite them. |
