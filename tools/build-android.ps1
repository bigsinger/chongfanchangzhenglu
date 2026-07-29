[CmdletBinding()]
param(
    [string]$CreatorPath = 'E:\temp\CocosCreator-2.4.15\CocosCreator.exe',
    [string]$JavaHome = 'E:\temp\jdk17',
    [string]$AndroidSdk = 'D:\Android\Sdk',
    [string]$NdkPath = 'D:\Android\Sdk\ndk\20.1.5948944',
    [ValidatePattern('^[A-Z]$')]
    [string]$DriveLetter = 'R',
    [switch]$SkipGenerate,
    [switch]$IncrementalGenerate,
    [switch]$SkipNative,
    [switch]$IncrementalNative
)

$ErrorActionPreference = 'Stop'

function Assert-File {
    param([string]$Path, [string]$Description)
    if (-not (Test-Path -LiteralPath $Path -PathType Leaf)) {
        throw "$Description does not exist: $Path"
    }
}

function Set-Utf8Text {
    param([string]$Path, [string]$Text)
    $encoding = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($Path, $Text, $encoding)
}

function Replace-Required {
    param(
        [string]$Path,
        [string]$Pattern,
        [string]$Replacement
    )

    $text = [System.IO.File]::ReadAllText($Path)
    if (-not [System.Text.RegularExpressions.Regex]::IsMatch($text, $Pattern)) {
        # Incremental Creator builds preserve some of our previous generated
        # project patches. Treat an already-applied replacement as success so
        # the debug build remains repeatable.
        if ($text.Contains($Replacement)) {
            return
        }
        throw "Expected generated setting was not found in: $Path"
    }
    $updated = [System.Text.RegularExpressions.Regex]::Replace($text, $Pattern, $Replacement)
    if ($updated -ne $text) {
        Set-Utf8Text -Path $Path -Text $updated
    }
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
$buildRoot = Join-Path $projectRoot 'build\jsb-link'
$runtimeSource = Join-Path $buildRoot 'frameworks\runtime-src'
$androidProject = Join-Path $runtimeSource 'proj.android-studio'
$packageName = 'com.game.longmarch.creator243'
$expectedAbis = @('arm64-v8a')

if ($SkipGenerate -and $IncrementalGenerate) {
    throw '-SkipGenerate and -IncrementalGenerate cannot be used together.'
}

Assert-File -Path $CreatorPath -Description 'Cocos Creator 2.4.15'
Assert-File -Path (Join-Path $JavaHome 'bin\java.exe') -Description 'JDK 17 java.exe'
Assert-File -Path (Join-Path $AndroidSdk 'platforms\android-36\android.jar') -Description 'Android API 36'
Assert-File -Path (Join-Path $AndroidSdk 'build-tools\35.0.0\aapt.exe') -Description 'Android Build Tools 35.0.0'
Assert-File -Path (Join-Path $NdkPath 'source.properties') -Description 'Android NDK r20b'

$ndkProperties = Get-Content -LiteralPath (Join-Path $NdkPath 'source.properties') -Raw
if ($ndkProperties -notmatch 'Pkg\.Revision\s*=\s*20\.1\.5948944') {
    throw "Expected NDK 20.1.5948944, found a different version in $NdkPath"
}

& node (Join-Path $projectRoot 'tools\verify-build-inputs.js') `
    "--creator-root=$([System.IO.Path]::GetDirectoryName($CreatorPath))" `
    "--ndk-root=$NdkPath"
if ($LASTEXITCODE -ne 0) {
    throw 'Creator/NDK build input hash verification failed.'
}

$javaVersion = (& (Join-Path $JavaHome 'bin\java.exe') -version 2>&1) -join "`n"
if ($javaVersion -notmatch 'version "(17|18|19|2[0-9])') {
    throw "Debug build requires JDK 17+. Found: $javaVersion"
}

& node (Join-Path $projectRoot 'tools\apply-runtime-fixes.js') --verify
if ($LASTEXITCODE -ne 0) {
    throw 'Runtime input fix verification failed.'
}

& node (Join-Path $projectRoot 'tools\restore-original-resources.js') --verify
if ($LASTEXITCODE -ne 0) {
    throw 'Original resource UUID verification failed.'
}
& npm test
if ($LASTEXITCODE -ne 0) {
    throw 'Automated quality gate failed.'
}

if (-not $SkipGenerate) {
    # The release pipeline modernizes the generated Android project in place.
    # Creator only refreshes assets on a later incremental build. The default
    # therefore recreates the exact generated subtree; maintainers may opt into
    # an incremental Creator refresh when the existing tree is known to be the
    # unmodified debug project.
    if (-not $IncrementalGenerate -and (Test-Path -LiteralPath $buildRoot)) {
        $resolvedGeneratedBuild = [System.IO.Path]::GetFullPath($buildRoot)
        $resolvedProject = [System.IO.Path]::GetFullPath($projectRoot)
        if (-not $resolvedGeneratedBuild.StartsWith($resolvedProject + [System.IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase) -or
            [System.IO.Path]::GetFileName($resolvedGeneratedBuild) -ne 'jsb-link' -or
            [System.IO.Path]::GetFileName([System.IO.Path]::GetDirectoryName($resolvedGeneratedBuild)) -ne 'build') {
            throw "Refusing to remove unexpected generated path: $resolvedGeneratedBuild"
        }
        Remove-Item -LiteralPath $resolvedGeneratedBuild -Recurse -Force
    }

    $buildOptions = 'platform=android;template=link;debug=true;md5Cache=false;buildPath=' +
        $projectRoot.Replace('\', '/') +
        '/build;autoCompile=false;packageName=' +
        $packageName

    $creatorBuildStarted = Get-Date
    $creatorProcess = Start-Process -FilePath $CreatorPath `
        -ArgumentList @('--path', $projectRoot, '--build', $buildOptions) `
        -WindowStyle Hidden -PassThru

    # Creator 2.4.15's launcher exits before its Electron build worker. Wait for
    # the worker's success marker and the final settings.js instead of letting
    # Gradle package a half-written native build.
    $creatorLog = Join-Path $env:USERPROFILE '.CocosCreator\logs\CocosCreator.log'
    $successMarker = 'Built to "' + $buildRoot + '" successfully'
    $failureMarker = 'Build Failed:'
    $creatorDeadline = (Get-Date).AddMinutes(15)
    $creatorCompleted = $false
    try {
        do {
            $settingsItem = Get-ChildItem -LiteralPath (Join-Path $buildRoot 'src') -Filter 'settings*.js' -File -ErrorAction SilentlyContinue |
                Sort-Object LastWriteTime -Descending | Select-Object -First 1
            $bundleItem = Get-ChildItem -LiteralPath (Join-Path $buildRoot 'assets\main') -Filter 'index*.js' -File -ErrorAction SilentlyContinue |
                Sort-Object LastWriteTime -Descending | Select-Object -First 1
            if ((Test-Path -LiteralPath $creatorLog) -and $settingsItem -and $bundleItem) {
                $recentLog = (Get-Content -LiteralPath $creatorLog -Tail 240) -join [Environment]::NewLine
                $logItem = Get-Item -LiteralPath $creatorLog
                if ($logItem.LastWriteTime -ge $creatorBuildStarted -and $recentLog.Contains($failureMarker)) {
                    throw 'Cocos Creator debug asset build failed. Check CocosCreator.log.'
                }
                if ($settingsItem.LastWriteTime -ge $creatorBuildStarted.AddSeconds(-2) -and
                    $bundleItem.LastWriteTime -ge $creatorBuildStarted.AddSeconds(-2) -and
                    $recentLog.Contains($successMarker)) {
                    $creatorCompleted = $true
                    break
                }
            }
            Start-Sleep -Seconds 1
        } while ((Get-Date) -lt $creatorDeadline)
        if (-not $creatorCompleted) {
            throw "Timed out waiting for Cocos Creator to finish generating $buildRoot"
        }
    } finally {
        Stop-ProcessTree -RootId $creatorProcess.Id
    }
}

& node (Join-Path $projectRoot 'tools\prune-production-bundle.js')
if ($LASTEXITCODE -ne 0) {
    throw 'Production bundle pruning failed.'
}
& node (Join-Path $projectRoot 'tools\verify-production-bundle.js')
if ($LASTEXITCODE -ne 0) {
    throw 'Production bundle verification failed.'
}

Assert-File -Path (Join-Path $androidProject 'gradlew.bat') -Description 'Generated Gradle wrapper'

$env:LONGMARCH_COCOS_ENGINE = 'E:/temp/CocosCreator-2.4.15/resources/cocos2d-x'
$env:LONGMARCH_VERSION_CODE = '2026072902'
$env:LONGMARCH_VERSION_NAME = '1.2.0'
& node (Join-Path $projectRoot 'tools\modernize-android-project.js')
if ($LASTEXITCODE -ne 0) {
    throw 'Android modernization failed.'
}
& node (Join-Path $projectRoot 'tools\verify-android-branding.js') `
    "--generated-root=$(Join-Path $androidProject 'res')"
if ($LASTEXITCODE -ne 0) {
    throw 'Original Android launcher icon verification failed.'
}

$localProperties = Join-Path $androidProject 'local.properties'
Set-Utf8Text -Path $localProperties -Text (
    'sdk.dir=' + (Convert-ToPropertiesPath $AndroidSdk) + [Environment]::NewLine
)

$nativeRoot = Join-Path $buildRoot 'native-debug'
$nativeObjectRoot = Join-Path $nativeRoot 'obj'
$nativeLibraryRoot = Join-Path $nativeRoot 'lib'
$nativeRootPrefix = [System.IO.Path]::GetFullPath($nativeRoot).TrimEnd('\') + '\'
foreach ($staleAbiDirectory in @(
    (Join-Path $nativeObjectRoot 'local\armeabi-v7a'),
    (Join-Path $nativeLibraryRoot 'armeabi-v7a')
)) {
    $resolvedStaleAbiDirectory = [System.IO.Path]::GetFullPath($staleAbiDirectory)
    if (-not $resolvedStaleAbiDirectory.StartsWith($nativeRootPrefix, [StringComparison]::OrdinalIgnoreCase)) {
        throw "Refusing to clean stale ABI outside native build root: $resolvedStaleAbiDirectory"
    }
    if (Test-Path -LiteralPath $resolvedStaleAbiDirectory) {
        Remove-Item -LiteralPath $resolvedStaleAbiDirectory -Recurse -Force
    }
}
$cocosEngineRoot = 'E:/temp/CocosCreator-2.4.15/resources/cocos2d-x'
$modulePath = @($cocosEngineRoot, "$cocosEngineRoot/cocos", "$cocosEngineRoot/external") -join ';'
$nativeArguments = @(
    'NDK_PROJECT_PATH=null',
    ('APP_BUILD_SCRIPT=' + (Join-Path $androidProject 'app\jni\Android.mk').Replace('\', '/')),
    ('NDK_APPLICATION_MK=' + (Join-Path $androidProject 'app\jni\Application.mk').Replace('\', '/')),
    'APP_ABI=arm64-v8a',
    'APP_PLATFORM=android-21',
    ('NDK_OUT=' + $nativeObjectRoot.Replace('\', '/')),
    ('NDK_LIBS_OUT=' + $nativeLibraryRoot.Replace('\', '/')),
    ('NDK_MODULE_PATH=' + $modulePath),
    'NDK_TOOLCHAIN_VERSION=clang',
    'NDK_DEBUG=1'
)
$ndkBuild = Join-Path $NdkPath 'ndk-build.cmd'
if (-not $SkipNative) {
    if (-not $IncrementalNative) {
        & $ndkBuild @nativeArguments clean
        if ($LASTEXITCODE -ne 0) {
            throw "NDK debug clean failed: $LASTEXITCODE"
        }
    }
    $nativeJobs = [Math]::Max(2, [Math]::Floor([Environment]::ProcessorCount / 2))
    & $ndkBuild @nativeArguments "-j$nativeJobs" cocos2djs
    if ($LASTEXITCODE -ne 0) {
        throw "NDK arm64 debug build failed: $LASTEXITCODE"
    }
} else {
    Write-Host 'Reusing verified arm64 debug native libraries.'
}
foreach ($abi in $expectedAbis) {
    $linkedLibrary = Join-Path $nativeObjectRoot "local\$abi\libcocos2djs.so"
    Assert-File -Path $linkedLibrary -Description "$abi linked native library"
    $abiLibraryRoot = Join-Path $nativeLibraryRoot $abi
    New-Item -ItemType Directory -Path $abiLibraryRoot -Force | Out-Null
    Copy-Item -LiteralPath $linkedLibrary -Destination (Join-Path $abiLibraryRoot 'libcocos2djs.so') -Force
}

$drive = $DriveLetter + ':'
$substOutput = (& subst) -join [Environment]::NewLine
$escapedDrive = [System.Text.RegularExpressions.Regex]::Escape($drive)
$existingMatch = [System.Text.RegularExpressions.Regex]::Match($substOutput, "(?im)^$escapedDrive\\:\s*=>\s*(.+)$")
$createdMapping = $false

if ($existingMatch.Success) {
    $existingTarget = $existingMatch.Groups[1].Value.Trim()
    if (-not $existingTarget.Equals($runtimeSource, [System.StringComparison]::OrdinalIgnoreCase)) {
        throw "$drive is already mapped to a different path: $existingTarget"
    }
} else {
    & subst $drive $runtimeSource
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to map $drive to $runtimeSource"
    }
    $createdMapping = $true
}

$oldJavaHome = $env:JAVA_HOME
$oldAndroidHome = $env:ANDROID_HOME
$oldAndroidSdkRoot = $env:ANDROID_SDK_ROOT
$oldNdkRoot = $env:NDK_ROOT
$oldAndroidNdkHome = $env:ANDROID_NDK_HOME
$oldCocosSource = $env:COCOS_JSB_SOURCE_DIR
$oldNativeLibDir = $env:LONGMARCH_NATIVE_LIB_DIR

try {
    $env:JAVA_HOME = $JavaHome
    $env:ANDROID_HOME = $AndroidSdk
    $env:ANDROID_SDK_ROOT = $AndroidSdk
    $env:NDK_ROOT = $NdkPath
    $env:ANDROID_NDK_HOME = $NdkPath
    $env:COCOS_JSB_SOURCE_DIR = $buildRoot.Replace('\', '/')
    $env:LONGMARCH_NATIVE_LIB_DIR = $nativeLibraryRoot.Replace('\', '/')

    Push-Location ($drive + '\proj.android-studio')
    try {
        & .\gradlew.bat --no-daemon clean :app:lintDebug :app:assembleDebug
        if ($LASTEXITCODE -ne 0) {
            throw "Gradle lintDebug/assembleDebug failed with exit code $LASTEXITCODE."
        }
    } finally {
        Pop-Location
    }
} finally {
    $env:JAVA_HOME = $oldJavaHome
    $env:ANDROID_HOME = $oldAndroidHome
    $env:ANDROID_SDK_ROOT = $oldAndroidSdkRoot
    $env:NDK_ROOT = $oldNdkRoot
    $env:ANDROID_NDK_HOME = $oldAndroidNdkHome
    $env:COCOS_JSB_SOURCE_DIR = $oldCocosSource
    $env:LONGMARCH_NATIVE_LIB_DIR = $oldNativeLibDir

    if ($createdMapping) {
        & subst $drive /D | Out-Null
    }
}

$apk = Get-ChildItem -LiteralPath (Join-Path $androidProject 'app\build\outputs\apk\debug') -Filter '*.apk' -File |
    Sort-Object LastWriteTime -Descending |
    Select-Object -First 1
if (-not $apk) {
    throw 'Gradle completed but no debug APK was found.'
}

Add-Type -AssemblyName System.IO.Compression.FileSystem
$archive = [System.IO.Compression.ZipFile]::OpenRead($apk.FullName)
try {
    $actualAbis = @($archive.Entries |
        Where-Object { $_.FullName -like 'lib/*/*.so' } |
        ForEach-Object { ($_.FullName -split '/')[1] } |
        Sort-Object -Unique)
} finally {
    $archive.Dispose()
}

$abiDifference = Compare-Object -ReferenceObject $expectedAbis -DifferenceObject $actualAbis
if ($abiDifference) {
    throw "APK ABI verification failed. Found: $($actualAbis -join ', ')"
}

$aapt = Join-Path $AndroidSdk 'build-tools\35.0.0\aapt.exe'
$badging = (& $aapt dump badging $apk.FullName) -join "`n"
if ($badging -notmatch "targetSdkVersion:'36'" -or
    $badging -notmatch "sdkVersion:'21'" -or
    $badging -notmatch 'application-debuggable') {
    throw "Debug APK API/debuggable verification failed: $badging"
}
$permissions = (& $aapt dump permissions $apk.FullName) -join "`n"
if ($permissions -match 'uses-permission') {
    throw "Offline debug APK must not request system permissions: $permissions"
}

$archive = [System.IO.Compression.ZipFile]::OpenRead($apk.FullName)
try {
    $forbiddenRuntime = @('org/cocos2dx/okhttp', 'okhttp3/', 'okio/')
    $offlineStubFound = $false
    foreach ($dex in $archive.Entries | Where-Object { $_.FullName -like 'classes*.dex' }) {
        $stream = $dex.Open()
        try {
            $memory = New-Object System.IO.MemoryStream
            $stream.CopyTo($memory)
            $dexText = [System.Text.Encoding]::ASCII.GetString($memory.ToArray())
        } finally {
            if ($memory) { $memory.Dispose() }
            $stream.Dispose()
        }
        foreach ($needle in $forbiddenRuntime) {
            if ($dexText.Contains($needle)) {
                throw "Offline debug APK still contains forbidden runtime: $needle"
            }
        }
        if ($dexText.Contains('Offline build does not support download tasks')) {
            $offlineStubFound = $true
        }
    }
    if (-not $offlineStubFound) {
        throw 'Offline downloader compatibility stub was not packaged.'
    }
} finally {
    $archive.Dispose()
}

$dist = Join-Path $projectRoot 'dist'
New-Item -ItemType Directory -Path $dist -Force | Out-Null
$distApk = Join-Path $dist 'chongfanchangzhenglu-arm64-debug.apk'
Copy-Item -LiteralPath $apk.FullName -Destination $distApk -Force

Write-Output "APK: $distApk"
Write-Output "ABIs: $($actualAbis -join ', ')"
Write-Output 'API: min 21 / target 36; permissions: 0; debug: true'
Write-Output 'Offline runtime: OkHttp/Okio absent; non-network downloader compatibility stub present'
