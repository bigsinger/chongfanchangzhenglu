[CmdletBinding()]
param(
    [string]$CreatorPath = 'E:\temp\CocosCreator-2.4.3\CocosCreator.exe',
    [string]$JavaHome = 'E:\temp\jdk8u492-b09',
    [string]$AndroidSdk = 'D:\Android\Sdk',
    [string]$NdkPath = 'D:\Android\Sdk\ndk\20.1.5948944',
    [ValidatePattern('^[A-Z]$')]
    [string]$DriveLetter = 'R',
    [switch]$SkipGenerate,
    [switch]$IncrementalGenerate
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

$projectRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$buildRoot = Join-Path $projectRoot 'build\jsb-link'
$runtimeSource = Join-Path $buildRoot 'frameworks\runtime-src'
$androidProject = Join-Path $runtimeSource 'proj.android-studio'
$packageName = 'com.game.longmarch.creator243'
$expectedAbis = @('arm64-v8a', 'armeabi-v7a')

if ($SkipGenerate -and $IncrementalGenerate) {
    throw '-SkipGenerate and -IncrementalGenerate cannot be used together.'
}

Assert-File -Path $CreatorPath -Description 'Cocos Creator 2.4.3'
Assert-File -Path (Join-Path $JavaHome 'bin\java.exe') -Description 'JDK 8 java.exe'
Assert-File -Path (Join-Path $AndroidSdk 'build-tools\28.0.3\aapt.exe') -Description 'Android Build Tools 28.0.3'
Assert-File -Path (Join-Path $NdkPath 'source.properties') -Description 'Android NDK r20b'

$ndkProperties = Get-Content -LiteralPath (Join-Path $NdkPath 'source.properties') -Raw
if ($ndkProperties -notmatch 'Pkg\.Revision\s*=\s*20\.1\.5948944') {
    throw "Expected NDK 20.1.5948944, found a different version in $NdkPath"
}

& node (Join-Path $projectRoot 'tools\apply-runtime-fixes.js') --verify
if ($LASTEXITCODE -ne 0) {
    throw 'Runtime input fix verification failed.'
}

& node (Join-Path $projectRoot 'tools\restore-original-resources.js') --verify
if ($LASTEXITCODE -ne 0) {
    throw 'Original resource UUID verification failed.'
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
    & $CreatorPath --path $projectRoot --build $buildOptions
    if ($LASTEXITCODE -ne 0) {
        throw "Cocos Creator Android project generation failed with exit code $LASTEXITCODE."
    }

    # Creator 2.4.3's launcher exits before its Electron build worker. Wait for
    # the worker's success marker and the final settings.js instead of letting
    # Gradle package a half-written native build.
    $creatorLog = Join-Path $env:USERPROFILE '.CocosCreator\logs\CocosCreator.log'
    $settingsFile = Join-Path $buildRoot 'src\settings.js'
    $bundleFile = Join-Path $buildRoot 'assets\main\index.js'
    $successMarker = 'Built to "' + $buildRoot + '" successfully'
    $creatorDeadline = (Get-Date).AddMinutes(15)
    $creatorCompleted = $false
    do {
        if ((Test-Path -LiteralPath $creatorLog) -and
            (Test-Path -LiteralPath $settingsFile) -and
            (Test-Path -LiteralPath $bundleFile)) {
            $settingsItem = Get-Item -LiteralPath $settingsFile
            $bundleItem = Get-Item -LiteralPath $bundleFile
            $recentLog = (Get-Content -LiteralPath $creatorLog -Tail 200) -join [Environment]::NewLine
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

$localProperties = Join-Path $androidProject 'local.properties'
$gradleProperties = Join-Path $androidProject 'gradle.properties'
$appBuildGradle = Join-Path $androidProject 'app\build.gradle'
$gameBuildGradle = Join-Path $androidProject 'game\build.gradle'
$appManifest = Join-Path $androidProject 'app\AndroidManifest.xml'
$settingsGradle = Join-Path $androidProject 'settings.gradle'

Set-Utf8Text -Path $localProperties -Text (
    'ndk.dir=' + (Convert-ToPropertiesPath $NdkPath) + [Environment]::NewLine +
    'sdk.dir=' + (Convert-ToPropertiesPath $AndroidSdk) + [Environment]::NewLine
)

Replace-Required -Path $gradleProperties -Pattern '(?m)^PROP_COMPILE_SDK_VERSION=.*$' -Replacement 'PROP_COMPILE_SDK_VERSION=28'
Replace-Required -Path $gradleProperties -Pattern '(?m)^PROP_TARGET_SDK_VERSION=.*$' -Replacement 'PROP_TARGET_SDK_VERSION=28'
Replace-Required -Path $gradleProperties -Pattern '(?m)^PROP_BUILD_TOOLS_VERSION=.*$' -Replacement 'PROP_BUILD_TOOLS_VERSION=28.0.3'
Replace-Required -Path $gradleProperties -Pattern '(?m)^PROP_APP_ABI=.*$' -Replacement 'PROP_APP_ABI=armeabi-v7a:arm64-v8a'
Replace-Required -Path $appBuildGradle -Pattern '(?m)^\s*applicationId\s+"[^"]+"\s*$' -Replacement ('        applicationId "' + $packageName + '"')
Replace-Required -Path $appManifest -Pattern 'package="[^"]+"' -Replacement ('package="' + $packageName + '"')

$sourceDirLine = '        def sourceDir = System.getenv("COCOS_JSB_SOURCE_DIR") ?: "${buildDir}/../../../../.."'
Replace-Required -Path $appBuildGradle -Pattern '(?m)^\s*def sourceDir = .*$' -Replacement $sourceDirLine
Replace-Required -Path $gameBuildGradle -Pattern '(?m)^\s*def sourceDir = .*$' -Replacement $sourceDirLine
$nativeJobsLine = "                    arguments '-j' + Math.min(8, Runtime.runtime.availableProcessors())"
Replace-Required -Path $appBuildGradle -Pattern "(?m)^\s*arguments '-j' \+ Runtime\.runtime\.availableProcessors\(\)\s*$" -Replacement $nativeJobsLine
Replace-Required -Path $gameBuildGradle -Pattern "(?m)^\s*arguments '-j' \+ Runtime\.runtime\.availableProcessors\(\)\s*$" -Replacement $nativeJobsLine

$appProjectLine = Get-Content -LiteralPath $settingsGradle | Where-Object {
    $_ -match "project\(':.*'\)\.projectDir = new File\(settingsDir, 'app'\)"
} | Select-Object -First 1
if (-not $appProjectLine) {
    throw "Could not find the Android app module in $settingsGradle"
}
$appProjectName = [System.Text.RegularExpressions.Regex]::Match($appProjectLine, "project\(':([^']+)'\)").Groups[1].Value
if ([string]::IsNullOrWhiteSpace($appProjectName)) {
    throw "Could not parse the Android app module name from $settingsGradle"
}
$assembleTask = ':' + $appProjectName + ':assembleDebug'

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

try {
    $env:JAVA_HOME = $JavaHome
    $env:ANDROID_HOME = $AndroidSdk
    $env:ANDROID_SDK_ROOT = $AndroidSdk
    $env:NDK_ROOT = $NdkPath
    $env:ANDROID_NDK_HOME = $NdkPath
    $env:COCOS_JSB_SOURCE_DIR = $buildRoot.Replace('\', '/')

    Push-Location ($drive + '\proj.android-studio')
    try {
        & .\gradlew.bat --no-daemon $assembleTask
        if ($LASTEXITCODE -ne 0) {
            throw "Gradle assembleDebug failed with exit code $LASTEXITCODE."
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

    if ($createdMapping) {
        & subst $drive /D | Out-Null
    }
}

$apk = Get-ChildItem -LiteralPath (Join-Path $androidProject 'app\build\outputs\apk\debug') -Filter '*-debug.apk' -File |
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

$dist = Join-Path $projectRoot 'dist'
New-Item -ItemType Directory -Path $dist -Force | Out-Null
$distApk = Join-Path $dist 'chongfanchangzhenglu-armv7-arm64-debug.apk'
Copy-Item -LiteralPath $apk.FullName -Destination $distApk -Force
$hash = Get-FileHash -LiteralPath $distApk -Algorithm SHA256

Write-Output "APK: $distApk"
Write-Output "ABIs: $($actualAbis -join ', ')"
Write-Output "SHA256: $($hash.Hash)"
