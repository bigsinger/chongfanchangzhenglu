[CmdletBinding()]
param(
    [string]$CreatorPath = 'E:\temp\CocosCreator-2.4.15\CocosCreator.exe',
    [string]$JavaHome = 'E:\temp\jdk17',
    [string]$AndroidSdk = 'D:\Android\Sdk',
    [string]$NdkPath = 'D:\Android\Sdk\ndk\20.1.5948944',
    [Parameter(Mandatory)]
    [string]$SigningProperties,
    [ValidateRange(1, 2100000000)]
    [int]$VersionCode = 2026072802,
    [ValidatePattern('^\d+\.\d+\.\d+(?:[-+][A-Za-z0-9.-]+)?$')]
    [string]$VersionName = '1.1.3',
    [ValidatePattern('^[A-Z]$')]
    [string]$DriveLetter = 'S',
    [switch]$SkipGenerate,
    [switch]$SkipNative,
    [switch]$AllowDirtySource
)

$ErrorActionPreference = 'Stop'

function Assert-File {
    param([string]$Path, [string]$Description)
    if (-not (Test-Path -LiteralPath $Path -PathType Leaf)) {
        throw "$Description 不存在：$Path"
    }
}

function Set-Utf8Text {
    param([string]$Path, [string]$Text)
    $encoding = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($Path, $Text, $encoding)
}

function Convert-ToPropertiesPath {
    param([string]$Path)
    return $Path.Replace('\', '\\').Replace(':', '\:')
}

function Stop-ProcessTree {
    param([int]$RootId)
    $all = @(Get-CimInstance Win32_Process)
    $pending = @($RootId)
    $ids = New-Object System.Collections.Generic.List[int]
    while ($pending.Count) {
        $current = [int]$pending[0]
        $pending = @($pending | Select-Object -Skip 1)
        $ids.Add($current)
        $pending += @($all | Where-Object { $_.ParentProcessId -eq $current } | ForEach-Object ProcessId)
    }
    foreach ($id in ($ids | Sort-Object -Descending)) {
        Stop-Process -Id $id -Force -ErrorAction SilentlyContinue
    }
}

$projectRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$signingPath = [System.IO.Path]::GetFullPath($SigningProperties)
$buildRoot = Join-Path $projectRoot 'build\jsb-link'
$runtimeSource = Join-Path $buildRoot 'frameworks\runtime-src'
$androidProject = Join-Path $runtimeSource 'proj.android-studio'
$packageName = 'com.game.longmarch.creator243'
$expectedAbis = @('arm64-v8a', 'armeabi-v7a')
$sourceCommit = (& git -C $projectRoot rev-parse HEAD).Trim()
if ($LASTEXITCODE -ne 0) { throw '无法读取 Git 源码版本' }
$sourceChanges = @(& git -C $projectRoot status --porcelain)
if ($sourceChanges.Count -and -not $AllowDirtySource) {
    throw '正式构建要求干净工作树；如仅做本地诊断可显式传入 -AllowDirtySource'
}

Assert-File -Path $CreatorPath -Description 'Cocos Creator 2.4.15'
Assert-File -Path (Join-Path $JavaHome 'bin\java.exe') -Description 'JDK 17'
Assert-File -Path (Join-Path $AndroidSdk 'platforms\android-36\android.jar') -Description 'Android API 36'
Assert-File -Path (Join-Path $AndroidSdk 'build-tools\35.0.0\apksigner.bat') -Description 'apksigner'
Assert-File -Path (Join-Path $NdkPath 'source.properties') -Description 'Android NDK r20b'
Assert-File -Path $signingPath -Description '签名配置'

& node (Join-Path $projectRoot 'tools\verify-build-inputs.js') `
    "--creator-root=$([System.IO.Path]::GetDirectoryName($CreatorPath))" `
    "--ndk-root=$NdkPath"
if ($LASTEXITCODE -ne 0) { throw 'Creator/NDK 构建输入哈希验证失败' }

$javaVersion = (& (Join-Path $JavaHome 'bin\java.exe') -version 2>&1) -join "`n"
if ($javaVersion -notmatch 'version "(17|18|19|2[0-9])') {
    throw "正式构建要求 JDK 17+，当前：$javaVersion"
}

& node (Join-Path $projectRoot 'tools\apply-runtime-fixes.js') --verify
if ($LASTEXITCODE -ne 0) { throw '运行时代码验证失败' }
& node (Join-Path $projectRoot 'tools\restore-original-resources.js') --verify
if ($LASTEXITCODE -ne 0) { throw '资源 UUID 验证失败' }
& npm test
if ($LASTEXITCODE -ne 0) { throw '自动质量门禁失败' }

if (-not $SkipGenerate) {
    $buildOptions = 'platform=android;template=link;debug=false;md5Cache=true;buildPath=' +
        $projectRoot.Replace('\', '/') +
        '/build;autoCompile=false;packageName=' +
        $packageName +
        ';apiLevel=android-36;textureCompress=true;encryptJs=false;zipCompressJs=true'

    $creatorBuildStarted = Get-Date
    $creatorProcess = Start-Process -FilePath $CreatorPath `
        -ArgumentList @('--path', $projectRoot, '--build', $buildOptions) `
        -WindowStyle Hidden -PassThru

    $creatorLog = Join-Path $env:USERPROFILE '.CocosCreator\logs\CocosCreator.log'
    $settingsDirectory = Join-Path $buildRoot 'src'
    $bundleDirectory = Join-Path $buildRoot 'assets\main'
    $successMarker = 'Built to "' + $buildRoot + '" successfully'
    $failureMarker = 'Build Failed:'
    $deadline = (Get-Date).AddMinutes(20)
    $completed = $false
    try {
        do {
            $settingsFile = Get-ChildItem -LiteralPath $settingsDirectory -Filter 'settings*.js' -File -ErrorAction SilentlyContinue |
                Sort-Object LastWriteTime -Descending | Select-Object -First 1
            $bundleFile = Get-ChildItem -LiteralPath $bundleDirectory -Filter 'index*.js' -File -ErrorAction SilentlyContinue |
                Sort-Object LastWriteTime -Descending | Select-Object -First 1
            if ((Test-Path -LiteralPath $creatorLog) -and $settingsFile -and $bundleFile) {
                $recentLog = (Get-Content -LiteralPath $creatorLog -Tail 240) -join [Environment]::NewLine
                $logItem = Get-Item -LiteralPath $creatorLog
                if ($logItem.LastWriteTime -ge $creatorBuildStarted -and $recentLog.Contains($failureMarker)) {
                    throw 'Cocos Creator 正式资源构建失败，请检查日志'
                }
                if ($settingsFile.LastWriteTime -ge $creatorBuildStarted.AddSeconds(-2) -and
                    $bundleFile.LastWriteTime -ge $creatorBuildStarted.AddSeconds(-2) -and
                    $recentLog.Contains($successMarker)) {
                    $completed = $true
                    break
                }
            }
            Start-Sleep -Seconds 1
        } while ((Get-Date) -lt $deadline)
        if (-not $completed) { throw '等待 Cocos Creator 正式构建超时' }
    } finally {
        Stop-ProcessTree -RootId $creatorProcess.Id
    }
}

& node (Join-Path $projectRoot 'tools\prune-production-bundle.js')
if ($LASTEXITCODE -ne 0) { throw '生产包裁剪失败' }
& node (Join-Path $projectRoot 'tools\verify-production-bundle.js')
if ($LASTEXITCODE -ne 0) { throw '生产包裁剪验证失败' }

$env:LONGMARCH_COCOS_ENGINE = 'E:/temp/CocosCreator-2.4.15/resources/cocos2d-x'
$env:LONGMARCH_VERSION_CODE = "$VersionCode"
$env:LONGMARCH_VERSION_NAME = $VersionName
& node (Join-Path $projectRoot 'tools\modernize-android-project.js')
if ($LASTEXITCODE -ne 0) { throw 'Android 现代化迁移失败' }

$localProperties = Join-Path $androidProject 'local.properties'
Set-Utf8Text -Path $localProperties -Text (
    'sdk.dir=' + (Convert-ToPropertiesPath $AndroidSdk) + [Environment]::NewLine
)

$nativeRoot = Join-Path $buildRoot 'native-release'
$nativeObjectRoot = Join-Path $nativeRoot 'obj'
$nativeLibraryRoot = Join-Path $nativeRoot 'lib'
$cocosEngineRoot = 'E:/temp/CocosCreator-2.4.15/resources/cocos2d-x'
$modulePath = @($cocosEngineRoot, "$cocosEngineRoot/cocos", "$cocosEngineRoot/external") -join ';'
$nativeArguments = @(
    'NDK_PROJECT_PATH=null',
    ('APP_BUILD_SCRIPT=' + (Join-Path $androidProject 'app\jni\Android.mk').Replace('\', '/')),
    ('NDK_APPLICATION_MK=' + (Join-Path $androidProject 'app\jni\Application.mk').Replace('\', '/')),
    'APP_ABI=armeabi-v7a arm64-v8a',
    'APP_PLATFORM=android-21',
    ('NDK_OUT=' + $nativeObjectRoot.Replace('\', '/')),
    ('NDK_LIBS_OUT=' + $nativeLibraryRoot.Replace('\', '/')),
    ('NDK_MODULE_PATH=' + $modulePath),
    'NDK_TOOLCHAIN_VERSION=clang',
    'NDK_DEBUG=0'
)
$ndkBuild = Join-Path $NdkPath 'ndk-build.cmd'
if (-not $SkipNative) {
    & $ndkBuild @nativeArguments clean
    if ($LASTEXITCODE -ne 0) { throw "NDK 正式清理失败：$LASTEXITCODE" }
    $nativeJobs = [Math]::Max(2, [Math]::Floor([Environment]::ProcessorCount / 2))
    & $ndkBuild @nativeArguments "-j$nativeJobs" cocos2djs
    if ($LASTEXITCODE -ne 0) { throw "NDK 双 ABI 正式构建失败：$LASTEXITCODE" }
} else {
    Write-Host '复用已验证的双 ABI release 原生库'
}
foreach ($abi in $expectedAbis) {
    $linkedLibrary = Join-Path $nativeObjectRoot "local\$abi\libcocos2djs.so"
    Assert-File -Path $linkedLibrary -Description "$abi 链接产物"
    $abiLibraryRoot = Join-Path $nativeLibraryRoot $abi
    New-Item -ItemType Directory -Path $abiLibraryRoot -Force | Out-Null
    Copy-Item -LiteralPath $linkedLibrary -Destination (Join-Path $abiLibraryRoot 'libcocos2djs.so') -Force
    Assert-File -Path (Join-Path $nativeLibraryRoot "$abi\libcocos2djs.so") -Description "$abi 原生库"
}

$drive = $DriveLetter + ':'
$mapping = (& subst) -join [Environment]::NewLine
$escapedDrive = [regex]::Escape($drive)
$existing = [regex]::Match($mapping, "(?im)^$escapedDrive\\:\s*=>\s*(.+)$")
$createdMapping = $false
if ($existing.Success) {
    if (-not $existing.Groups[1].Value.Trim().Equals($runtimeSource, [StringComparison]::OrdinalIgnoreCase)) {
        throw "$drive 已映射到其他目录"
    }
} else {
    & subst $drive $runtimeSource
    if ($LASTEXITCODE -ne 0) { throw "无法创建短路径映射 $drive" }
    $createdMapping = $true
}

$oldEnvironment = @{
    JAVA_HOME = $env:JAVA_HOME
    ANDROID_HOME = $env:ANDROID_HOME
    ANDROID_SDK_ROOT = $env:ANDROID_SDK_ROOT
    NDK_ROOT = $env:NDK_ROOT
    ANDROID_NDK_HOME = $env:ANDROID_NDK_HOME
    COCOS_JSB_SOURCE_DIR = $env:COCOS_JSB_SOURCE_DIR
    LONGMARCH_NATIVE_LIB_DIR = $env:LONGMARCH_NATIVE_LIB_DIR
    LONGMARCH_SIGNING_PROPERTIES = $env:LONGMARCH_SIGNING_PROPERTIES
}

try {
    $env:JAVA_HOME = $JavaHome
    $env:ANDROID_HOME = $AndroidSdk
    $env:ANDROID_SDK_ROOT = $AndroidSdk
    $env:NDK_ROOT = $NdkPath
    $env:ANDROID_NDK_HOME = $NdkPath
    $env:COCOS_JSB_SOURCE_DIR = $buildRoot.Replace('\', '/')
    $env:LONGMARCH_NATIVE_LIB_DIR = $nativeLibraryRoot.Replace('\', '/')
    $env:LONGMARCH_SIGNING_PROPERTIES = $signingPath

    Push-Location ($drive + '\proj.android-studio')
    try {
        & .\gradlew.bat --no-daemon clean :app:lintRelease :app:assembleRelease :app:bundleRelease
        if ($LASTEXITCODE -ne 0) { throw "Gradle 正式构建失败：$LASTEXITCODE" }
    } finally {
        Pop-Location
    }
} finally {
    $env:JAVA_HOME = $oldEnvironment.JAVA_HOME
    $env:ANDROID_HOME = $oldEnvironment.ANDROID_HOME
    $env:ANDROID_SDK_ROOT = $oldEnvironment.ANDROID_SDK_ROOT
    $env:NDK_ROOT = $oldEnvironment.NDK_ROOT
    $env:ANDROID_NDK_HOME = $oldEnvironment.ANDROID_NDK_HOME
    $env:COCOS_JSB_SOURCE_DIR = $oldEnvironment.COCOS_JSB_SOURCE_DIR
    $env:LONGMARCH_NATIVE_LIB_DIR = $oldEnvironment.LONGMARCH_NATIVE_LIB_DIR
    $env:LONGMARCH_SIGNING_PROPERTIES = $oldEnvironment.LONGMARCH_SIGNING_PROPERTIES
    if ($createdMapping) { & subst $drive /D | Out-Null }
}

$apk = Get-ChildItem (Join-Path $androidProject 'app\build\outputs\apk\release') -Filter '*.apk' -File |
    Sort-Object LastWriteTime -Descending | Select-Object -First 1
$aab = Get-ChildItem (Join-Path $androidProject 'app\build\outputs\bundle\release') -Filter '*.aab' -File |
    Sort-Object LastWriteTime -Descending | Select-Object -First 1
if (-not $apk -or -not $aab) { throw '未找到正式 APK/AAB' }

$buildTools = Join-Path $AndroidSdk 'build-tools\35.0.0'
& (Join-Path $buildTools 'zipalign.exe') -c -P 16 4 $apk.FullName
if ($LASTEXITCODE -ne 0) { throw 'APK zipalign 验证失败' }
& (Join-Path $buildTools 'apksigner.bat') verify --verbose --print-certs $apk.FullName
if ($LASTEXITCODE -ne 0) { throw 'APK 签名验证失败' }
$aabVerification = & (Join-Path $JavaHome 'bin\jarsigner.exe') -verify $aab.FullName 2>&1
if ($LASTEXITCODE -ne 0) { throw 'AAB 签名验证失败' }
Write-Host 'AAB JAR 签名验证：通过'

$badging = (& (Join-Path $buildTools 'aapt.exe') dump badging $apk.FullName) -join "`n"
if ($badging -notmatch "targetSdkVersion:'36'" -or
    $badging -notmatch "versionCode='$VersionCode'" -or
    $badging -notmatch "versionName='$([regex]::Escape($VersionName))'") {
    throw "APK 版本/API 验证失败：$badging"
}
$permissions = (& (Join-Path $buildTools 'aapt.exe') dump permissions $apk.FullName) -join "`n"
if ($permissions -match 'uses-permission') {
    throw "离线 APK 不应申请系统权限：$permissions"
}

Add-Type -AssemblyName System.IO.Compression.FileSystem
$archive = [IO.Compression.ZipFile]::OpenRead($apk.FullName)
try {
    $actualAbis = @($archive.Entries |
        Where-Object { $_.FullName -like 'lib/*/*.so' } |
        ForEach-Object { ($_.FullName -split '/')[1] } |
        Sort-Object -Unique)
    $forbiddenRuntime = @('org/cocos2dx/okhttp', 'okhttp3/', 'okio/')
    $offlineStubFound = $false
    foreach ($dex in $archive.Entries | Where-Object { $_.FullName -like 'classes*.dex' }) {
        $stream = $dex.Open()
        try {
            $memory = New-Object System.IO.MemoryStream
            $stream.CopyTo($memory)
            $dexText = [Text.Encoding]::ASCII.GetString($memory.ToArray())
        } finally {
            if ($memory) { $memory.Dispose() }
            $stream.Dispose()
        }
        foreach ($needle in $forbiddenRuntime) {
            if ($dexText.Contains($needle)) {
                throw "正式离线包仍包含禁用网络运行时：$needle"
            }
        }
        if ($dexText.Contains('Offline build does not support download tasks')) {
            $offlineStubFound = $true
        }
    }
    if (-not $offlineStubFound) {
        throw '正式包未包含离线 Downloader 兼容桩'
    }
} finally {
    $archive.Dispose()
}
if (Compare-Object $expectedAbis $actualAbis) {
    throw "ABI 验证失败：$($actualAbis -join ', ')"
}

$dist = Join-Path $projectRoot 'dist'
New-Item -ItemType Directory -Path $dist -Force | Out-Null
$distApk = Join-Path $dist "chongfanchangzhenglu-$VersionName-$VersionCode-release.apk"
$distAab = Join-Path $dist "chongfanchangzhenglu-$VersionName-$VersionCode-release.aab"
Copy-Item $apk.FullName $distApk -Force
Copy-Item $aab.FullName $distAab -Force

$generatedBundle = Get-ChildItem (Join-Path $buildRoot 'assets\main') -Filter 'index*.js' -File |
    Sort-Object LastWriteTime -Descending | Select-Object -First 1
Assert-File -Path $generatedBundle.FullName -Description 'Cocos 主代码包'
$apkHash = (Get-FileHash $distApk -Algorithm SHA256).Hash
$aabHash = (Get-FileHash $distAab -Algorithm SHA256).Hash
$buildManifestPath = Join-Path $dist "chongfanchangzhenglu-$VersionName-$VersionCode-build-manifest.json"
$buildManifest = [ordered]@{
    schemaVersion = 1
    builtAt = (Get-Date).ToUniversalTime().ToString('o')
    gitCommit = $sourceCommit
    dirtySource = [bool]$sourceChanges.Count
    versionName = $VersionName
    versionCode = $VersionCode
    creator = '2.4.15'
    gradle = '8.11.1'
    agp = '8.9.2'
    java = (($javaVersion -split "`n")[0]).Trim()
    ndk = '20.1.5948944'
    targetSdk = 36
    abis = $actualAbis
    bundleSha256 = (Get-FileHash $generatedBundle.FullName -Algorithm SHA256).Hash
    apkSha256 = $apkHash
    aabSha256 = $aabHash
}
Set-Utf8Text -Path $buildManifestPath -Text ($buildManifest | ConvertTo-Json -Depth 4)

Write-Output "APK: $distApk"
Write-Output "AAB: $distAab"
Write-Output "Build manifest: $buildManifestPath"
Write-Output "ABIs: $($actualAbis -join ', ')"
Write-Output "APK SHA256: $apkHash"
Write-Output "AAB SHA256: $aabHash"
