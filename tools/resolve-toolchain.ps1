<#
.SYNOPSIS
解析 Android 构建所需工具，不把维护者个人目录写入仓库。

.DESCRIPTION
显式参数拥有最高优先级，其次读取标准环境变量，最后尝试 PATH。NDK 还会在
Android SDK 的标准版本目录下查找。所有返回值都经过存在性检查，避免在构建中途
才因错误目录失败。
#>

function Resolve-ExistingFile {
    param(
        [string[]]$Candidates,
        [string[]]$CommandNames,
        [Parameter(Mandatory)][string]$Description
    )

    foreach ($candidate in @($Candidates)) {
        if ([string]::IsNullOrWhiteSpace($candidate)) { continue }
        $resolved = [System.IO.Path]::GetFullPath($candidate)
        if (Test-Path -LiteralPath $resolved -PathType Leaf) { return $resolved }
    }

    foreach ($commandName in @($CommandNames)) {
        if ([string]::IsNullOrWhiteSpace($commandName)) { continue }
        $command = Get-Command $commandName -CommandType Application -ErrorAction SilentlyContinue |
            Select-Object -First 1
        if ($command) { return [System.IO.Path]::GetFullPath($command.Source) }
    }

    throw "找不到 $Description；请通过脚本参数、标准环境变量或 PATH 提供。"
}

function Resolve-ExistingDirectory {
    param(
        [string[]]$Candidates,
        [Parameter(Mandatory)][string]$Description
    )

    foreach ($candidate in @($Candidates)) {
        if ([string]::IsNullOrWhiteSpace($candidate)) { continue }
        $resolved = [System.IO.Path]::GetFullPath($candidate)
        if (Test-Path -LiteralPath $resolved -PathType Container) { return $resolved }
    }

    throw "找不到 $Description；请通过脚本参数或标准环境变量提供。"
}

function Resolve-LongMarchToolchain {
    param(
        [string]$CreatorPath,
        [string]$JavaHome,
        [string]$AndroidSdk,
        [string]$NdkPath
    )

    $resolvedCreator = Resolve-ExistingFile `
        -Candidates @($CreatorPath, $env:COCOS_CREATOR_PATH) `
        -CommandNames @('CocosCreator.exe', 'CocosCreator') `
        -Description 'Cocos Creator 2.4.15'

    $javaCandidates = @($JavaHome, $env:JAVA_HOME)
    if (-not ($javaCandidates | Where-Object { -not [string]::IsNullOrWhiteSpace($_) })) {
        $javaCommand = Get-Command java -CommandType Application -ErrorAction SilentlyContinue |
            Select-Object -First 1
        if ($javaCommand) {
            $javaCandidates += Split-Path -Parent (Split-Path -Parent $javaCommand.Source)
        }
    }
    $resolvedJava = Resolve-ExistingDirectory -Candidates $javaCandidates -Description 'JDK 17+'

    $resolvedSdk = Resolve-ExistingDirectory `
        -Candidates @($AndroidSdk, $env:ANDROID_SDK_ROOT, $env:ANDROID_HOME) `
        -Description 'Android SDK'

    # 固定 NDK 版本是 Creator 2.4 原生工程的兼容约束，因此仅在该标准子目录自动补全。
    $resolvedNdk = Resolve-ExistingDirectory `
        -Candidates @(
            $NdkPath,
            $env:ANDROID_NDK_ROOT,
            $env:ANDROID_NDK_HOME,
            (Join-Path $resolvedSdk 'ndk\20.1.5948944')
        ) `
        -Description 'Android NDK 20.1.5948944'

    $creatorHome = Split-Path -Parent $resolvedCreator
    $engineRoot = Resolve-ExistingDirectory `
        -Candidates @((Join-Path $creatorHome 'resources\cocos2d-x')) `
        -Description 'Cocos Creator 2.4.15 原生引擎'

    [pscustomobject]@{
        CreatorPath = $resolvedCreator
        JavaHome = $resolvedJava
        AndroidSdk = $resolvedSdk
        NdkPath = $resolvedNdk
        CocosEngineRoot = $engineRoot
    }
}
