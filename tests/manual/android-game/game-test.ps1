[CmdletBinding()]
param(
    [Parameter(Position = 0)]
    [ValidateSet('state', 'launch', 'stop', 'tap', 'swipe', 'screenshot', 'inspect', 'logs', 'checkpoint', 'restore', 'direct', 'relocate', 'jump', 'smoke', 'background', 'corrupt', 'oldsave', 'stability')]
    [string]$Command = 'state',

    [string]$Name = 'current',
    [int]$X = 960,
    [int]$Y = 540,
    [int]$X2 = 960,
    [int]$Y2 = 540,
    [int]$DurationMs = 500,
    [int]$Chapter = 1,
    [int]$Map = 1,
    [int]$WaitSeconds = 8,
    [ValidateRange(1, 240)]
    [int]$Minutes = 30,
    [switch]$RequireArm64,
    [string]$Serial = 'emulator-5554',
    [string]$Adb = 'D:\Android\Sdk\platform-tools\adb.exe'
)

$ErrorActionPreference = 'Stop'
$Package = 'com.game.longmarch.creator243'
$Activity = 'org.cocos2dx.javascript.AppActivity'
$ResultDir = Join-Path $PSScriptRoot '..\results'
$ResultDir = [System.IO.Path]::GetFullPath($ResultDir)

if (-not (Test-Path -LiteralPath $Adb)) {
    throw "ADB 不存在：$Adb"
}
if ($Name -notmatch '^[A-Za-z0-9_.-]+$') {
    throw 'Name 只能包含字母、数字、点、下划线和短横线'
}
if ($Chapter -lt 1 -or $Chapter -gt 3 -or $Map -lt 1 -or $Map -gt 9) {
    throw '章节或地图编号超出测试范围'
}

New-Item -ItemType Directory -Force -Path $ResultDir | Out-Null

function Invoke-Adb {
    param([Parameter(Mandatory)][string[]]$Arguments)
    & $Adb -s $Serial @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "ADB 命令失败：$($Arguments -join ' ')"
    }
}

function Stop-Game {
    Invoke-Adb -Arguments @('shell', 'am', 'force-stop', $Package)
}

function Start-Game {
    Invoke-Adb -Arguments @(
        'shell', 'am', 'start', '-W',
        '-n', "$Package/$Activity"
    )
}

function Get-GameState {
    $focus = (Invoke-Adb -Arguments @('shell', 'dumpsys', 'window', 'windows') |
        Select-String 'mCurrentFocus|mFocusedApp' |
        ForEach-Object { $_.Line.Trim() })
    $sql = 'select key,value from data where key in (''chapter'',''mapIndex'',''unlockchapters'',''heroSpine'') union all select key,''bytes='' || length(value) from data where key in (''longmarch_save_v2_current'',''longmarch_save_v2_previous'') order by key;'
    $remote = "run-as $Package sqlite3 databases/jsb.sqlite `"$sql`""
    $save = Invoke-Adb -Arguments @('shell', $remote)
    [pscustomobject]@{
        serial = $Serial
        focus = @($focus)
        save = @($save)
    }
}

function Assert-GameInForeground {
    $state = Get-GameState
    if (($state.focus -join "`n") -notmatch [regex]::Escape($Package)) {
        throw '游戏未保持在前台'
    }
    return $state
}

function Save-Screenshot {
    $remotePath = "/sdcard/$Name.png"
    $localPath = Join-Path $ResultDir "$Name.png"
    Invoke-Adb -Arguments @('shell', 'screencap', '-p', $remotePath)
    Invoke-Adb -Arguments @('pull', $remotePath, $localPath)
    Invoke-Adb -Arguments @('shell', 'rm', $remotePath)
    Write-Output $localPath
}

function Save-Logs {
    $localPath = Join-Path $ResultDir "$Name.log"
    $lines = Invoke-Adb -Arguments @('logcat', '-d', '-v', 'time', '-t', '3000')
    $lines | Set-Content -LiteralPath $localPath -Encoding utf8
    $errors = $lines | Select-String 'TypeError|ReferenceError|FATAL EXCEPTION|Fatal signal|SIGSEGV|SIGABRT|crash_dump|tombstone|ANR in|Uncaught Exception|asset.*failed|load.*failed|Error processing arguments|Failed to invoke'
    if ($errors) {
        $errors | ForEach-Object { Write-Error $_.Line }
        throw "运行日志包含错误，完整日志：$localPath"
    }
    Write-Output $localPath
}

function Save-Checkpoint {
    $remote = "run-as $Package mkdir -p files/checkpoints"
    Invoke-Adb -Arguments @('shell', $remote)
    # SQLite online backup keeps the running game in place and includes WAL data.
    $remote = "run-as $Package sqlite3 databases/jsb.sqlite `".backup 'files/checkpoints/$Name.sqlite'`""
    Invoke-Adb -Arguments @('shell', $remote)
    $remote = "run-as $Package ls -l files/checkpoints/$Name.sqlite"
    Invoke-Adb -Arguments @('shell', $remote)
}

function Restore-Checkpoint {
    param([switch]$DirectToGame)
    Stop-Game
    $remote = "run-as $Package test -s files/checkpoints/$Name.sqlite"
    Invoke-Adb -Arguments @('shell', $remote)
    $remote = "run-as $Package cp files/checkpoints/$Name.sqlite databases/jsb.sqlite"
    Invoke-Adb -Arguments @('shell', $remote)
    $remote = "run-as $Package rm -f databases/jsb.sqlite-wal databases/jsb.sqlite-shm"
    Invoke-Adb -Arguments @('shell', $remote)
    if ($DirectToGame) {
        $sql = "insert or replace into data(key,value) values('codex_direct_scene','gameScene');"
        $remote = "run-as $Package sqlite3 databases/jsb.sqlite `"$sql`""
        Invoke-Adb -Arguments @('shell', $remote)
    }
    Start-Game
}

function Set-MapStart {
    Stop-Game
    $sql = @"
begin;
delete from data where key in ('tempData','cross','heroItem','heroFollow','heroSpine');
  insert or replace into data(key,value) values('chapter','$Chapter');
  insert or replace into data(key,value) values('mapIndex','$Map');
  insert or replace into data(key,value) values('unlockchapters','$([Math]::Max(0, $Chapter - 1))');
  insert or replace into data(key,value) values('codex_direct_scene','gameScene');
  commit;
"@ -replace "`r?`n", ' '
    $remote = "run-as $Package sqlite3 databases/jsb.sqlite `"$sql`""
    Invoke-Adb -Arguments @('shell', $remote)
    Start-Game
}

function Set-HeroPosition {
    Stop-Game
    $sceneKey = "scenes_d${Chapter}_${Map}"
    $query = "select value from data where key='tempData';"
    $json = $query | & $Adb -s $Serial shell run-as $Package sqlite3 databases/jsb.sqlite
    if ($LASTEXITCODE -ne 0 -or -not $json) {
        throw '读取 tempData 失败'
    }
    $tempData = $json | ConvertFrom-Json
    $scene = $tempData.$sceneKey
    if (-not $scene) {
        throw "存档中不存在场景：$sceneKey"
    }
    $scene.heroPos = [pscustomobject]@{ x = $X; y = $Y }
    $updated = $tempData | ConvertTo-Json -Compress -Depth 100
    $escaped = $updated.Replace("'", "''")
    $sql = @"
begin;
update data set value='$escaped' where key='tempData';
insert or replace into data(key,value) values('chapter','$Chapter');
insert or replace into data(key,value) values('mapIndex','$Map');
insert or replace into data(key,value) values('codex_direct_scene','gameScene');
commit;
"@ -replace "`r?`n", ' '
    $sql | & $Adb -s $Serial shell run-as $Package sqlite3 databases/jsb.sqlite
    if ($LASTEXITCODE -ne 0) {
        throw '写入重定位存档失败'
    }
    Start-Game
}

function Test-BackgroundRecovery {
    Invoke-Adb -Arguments @('logcat', '-c')
    Start-Game
    Start-Sleep -Seconds $WaitSeconds
    Invoke-Adb -Arguments @('shell', 'input', 'keyevent', '3')
    Start-Sleep -Seconds 3
    Start-Game
    Start-Sleep -Seconds $WaitSeconds
    $state = Assert-GameInForeground
    $state | ConvertTo-Json -Depth 5 |
        Set-Content -LiteralPath (Join-Path $ResultDir "$Name-background-state.json") -Encoding utf8
    Save-Screenshot
    Save-Logs
}

function Test-CorruptSaveRecovery {
    $checkpointName = "$Name-before-corrupt"
    $originalName = $Name
    $script:Name = $checkpointName
    Save-Checkpoint
    try {
        Stop-Game
        $sql = "update data set value='{`"schemaVersion`":2,`"revision`":' where key='longmarch_save_v2_current';"
        $remote = "run-as $Package sqlite3 databases/jsb.sqlite `"$sql`""
        Invoke-Adb -Arguments @('shell', $remote)
        Invoke-Adb -Arguments @('logcat', '-c')
        Start-Game
        Start-Sleep -Seconds $WaitSeconds
        $script:Name = "$originalName-corrupt-recovered"
        $state = Assert-GameInForeground
        $state | ConvertTo-Json -Depth 5 |
            Set-Content -LiteralPath (Join-Path $ResultDir "$originalName-corrupt-state.json") -Encoding utf8
        Save-Screenshot
        Save-Logs
    } finally {
        $script:Name = $checkpointName
        Restore-Checkpoint
        $script:Name = $originalName
    }
}

function Test-OldSaveMigration {
    $checkpointName = "$Name-before-oldsave"
    $originalName = $Name
    $sceneKey = 'scenes_d3_3'
    $script:Name = $checkpointName
    Save-Checkpoint
    try {
        Stop-Game
        $tempQuery = "select value from data where key='tempData';"
        $tempJson = $tempQuery | & $Adb -s $Serial shell run-as $Package sqlite3 databases/jsb.sqlite
        if ($LASTEXITCODE -ne 0 -or -not $tempJson) {
            throw '读取 tempData 失败'
        }
        $tempData = $tempJson | ConvertFrom-Json
        $scene = $tempData.$sceneKey
        if (-not $scene -or -not $scene.itemArr) {
            throw "旧存档迁移前置场景不存在：$sceneKey"
        }
        $beforeCount = @($scene.itemArr | Where-Object {
            $_.eventTrigger -and
            @($_.eventTrigger | Where-Object { $_.param -eq 'prop113' }).Count -gt 0
        }).Count
        if ($beforeCount -ne 1) {
            throw "旧存档迁移前置收藏品数量异常：$beforeCount"
        }
        $scene.itemArr = @($scene.itemArr | Where-Object {
            -not ($_.eventTrigger -and
                @($_.eventTrigger | Where-Object { $_.param -eq 'prop113' }).Count -gt 0)
        })

        $longmarchQuery = "select value from data where key='longmarch';"
        $longmarchJson = $longmarchQuery | & $Adb -s $Serial shell run-as $Package sqlite3 databases/jsb.sqlite
        if ($LASTEXITCODE -ne 0 -or -not $longmarchJson) {
            throw '读取 longmarch 失败'
        }
        $longmarch = $longmarchJson | ConvertFrom-Json
        if ($longmarch.itemData -and $longmarch.itemData.PSObject.Properties['prop113']) {
            $longmarch.itemData.PSObject.Properties.Remove('prop113')
        }

        $updatedTemp = ($tempData | ConvertTo-Json -Compress -Depth 100).Replace("'", "''")
        $updatedLongmarch = ($longmarch | ConvertTo-Json -Compress -Depth 100).Replace("'", "''")
        $sql = @"
begin;
update data set value='$updatedTemp' where key='tempData';
update data set value='$updatedLongmarch' where key='longmarch';
delete from data where key in ('longmarch_save_v2_current','longmarch_save_v2_previous');
insert or replace into data(key,value) values('chapter','3');
insert or replace into data(key,value) values('mapIndex','3');
insert or replace into data(key,value) values('codex_direct_scene','gameScene');
commit;
"@ -replace "`r?`n", ' '
        $sql | & $Adb -s $Serial shell run-as $Package sqlite3 databases/jsb.sqlite
        if ($LASTEXITCODE -ne 0) {
            throw '构造旧版本存档失败'
        }

        Invoke-Adb -Arguments @('logcat', '-c')
        Start-Game
        Start-Sleep -Seconds $WaitSeconds
        $migratedJson = $tempQuery | & $Adb -s $Serial shell run-as $Package sqlite3 databases/jsb.sqlite
        if ($LASTEXITCODE -ne 0 -or -not $migratedJson) {
            throw '读取迁移后 tempData 失败'
        }
        $migratedScene = ($migratedJson | ConvertFrom-Json).$sceneKey
        $afterCount = @($migratedScene.itemArr | Where-Object {
            $_.eventTrigger -and
            @($_.eventTrigger | Where-Object { $_.param -eq 'prop113' }).Count -gt 0
        }).Count
        if ($afterCount -ne 1) {
            throw "旧存档迁移失败：prop113 数量为 $afterCount"
        }

        $state = Assert-GameInForeground
        [pscustomobject]@{
            scene = $sceneKey
            removedBeforeLaunch = $beforeCount
            restoredAfterLaunch = $afterCount
            state = $state
        } | ConvertTo-Json -Depth 6 |
            Set-Content -LiteralPath (Join-Path $ResultDir "$originalName-oldsave-state.json") -Encoding utf8
        $script:Name = "$originalName-oldsave-migrated"
        Save-Screenshot
        $source = Join-Path $ResultDir "$script:Name.png"
        $analyzer = Join-Path $PSScriptRoot 'analyze-screenshot.py'
        & python $analyzer --input $source
        if ($LASTEXITCODE -ne 0) {
            throw '旧存档迁移截图压缩/OCR 失败'
        }
        Save-Logs
    } finally {
        $script:Name = $checkpointName
        Restore-Checkpoint
        $script:Name = $originalName
    }
}

function Test-Stability {
    $primaryAbi = (Invoke-Adb -Arguments @('shell', 'getprop', 'ro.product.cpu.abi') | Select-Object -First 1).Trim()
    if ($RequireArm64 -and $primaryAbi -ne 'arm64-v8a') {
        throw "真实 ARM64 门禁失败：设备主 ABI 为 $primaryAbi"
    }

    $checkpointName = "$Name-before-stability"
    $originalName = $Name
    $script:Name = $checkpointName
    Save-Checkpoint
    $memoryLog = Join-Path $ResultDir "$originalName-stability-memory.log"
    $deadline = (Get-Date).AddMinutes($Minutes)
    $cycle = 0
    # Keep runtime stability coverage aligned with the same machine-readable
    # manifest used by the content-completeness gate.
    $publishedMapFile = Join-Path $PSScriptRoot 'published-maps.json'
    $maps = @(Get-Content -Raw $publishedMapFile | ConvertFrom-Json)
    if ($maps.Count -ne 7) {
        throw "发布地图清单异常：$publishedMapFile"
    }
    try {
        Invoke-Adb -Arguments @('logcat', '-c')
        while ((Get-Date) -lt $deadline) {
            $target = $maps[$cycle % $maps.Count]
            $script:Chapter = $target.Chapter
            $script:Map = $target.Map
            Set-MapStart
            Start-Sleep -Seconds $WaitSeconds
            Invoke-Adb -Arguments @('shell', 'input', 'swipe', '960', '540', '1320', '540', '600')
            Start-Sleep -Seconds 2
            Invoke-Adb -Arguments @('shell', 'input', 'keyevent', '3')
            Start-Sleep -Seconds 2
            Start-Game
            Start-Sleep -Seconds $WaitSeconds
            $state = Assert-GameInForeground
            $stamp = Get-Date -Format o
            "[$stamp] cycle=$cycle chapter=$($target.chapter) map=$($target.map) scene=$($target.scene) abi=$primaryAbi" |
                Add-Content -LiteralPath $memoryLog -Encoding utf8
            Invoke-Adb -Arguments @('shell', 'dumpsys', 'meminfo', $Package) |
                Select-String 'TOTAL PSS|TOTAL RSS|Native Heap|Dalvik Heap' |
                ForEach-Object { $_.Line.Trim() } |
                Add-Content -LiteralPath $memoryLog -Encoding utf8
            if ($cycle % 5 -eq 0) {
                $script:Name = "$originalName-stability-$cycle"
                Save-Screenshot
            }
            $cycle++
            Write-Output "stability cycle=$cycle remaining=$([Math]::Max(0, [Math]::Ceiling(($deadline - (Get-Date)).TotalMinutes)))m"
        }
        $script:Name = "$originalName-stability"
        Save-Logs
    } finally {
        $script:Name = $checkpointName
        Restore-Checkpoint
        $script:Name = $originalName
    }
}

switch ($Command) {
    'state' {
        Get-GameState | ConvertTo-Json -Depth 5
    }
    'launch' {
        Start-Game
    }
    'stop' {
        Stop-Game
    }
    'tap' {
        Invoke-Adb -Arguments @('shell', 'input', 'tap', "$X", "$Y")
    }
    'swipe' {
        Invoke-Adb -Arguments @('shell', 'input', 'swipe', "$X", "$Y", "$X2", "$Y2", "$DurationMs")
    }
    'screenshot' {
        Save-Screenshot
    }
    'inspect' {
        Save-Screenshot
        $source = Join-Path $ResultDir "$Name.png"
        $analyzer = Join-Path $PSScriptRoot 'analyze-screenshot.py'
        & python $analyzer --input $source
        if ($LASTEXITCODE -ne 0) {
            throw '本地截图压缩/OCR 失败'
        }
    }
    'logs' {
        Save-Logs
    }
    'checkpoint' {
        Save-Checkpoint
    }
    'restore' {
        Restore-Checkpoint
    }
    'direct' {
        Restore-Checkpoint -DirectToGame
    }
    'relocate' {
        Set-HeroPosition
    }
    'jump' {
        Set-MapStart
    }
    'smoke' {
        Invoke-Adb -Arguments @('logcat', '-c')
        Start-Game
        Start-Sleep -Seconds $WaitSeconds
        $state = Get-GameState
        $state | ConvertTo-Json -Depth 5 |
            Set-Content -LiteralPath (Join-Path $ResultDir 'smoke-state.json') -Encoding utf8
        Save-Screenshot
        if (($state.focus -join "`n") -notmatch [regex]::Escape($Package)) {
            throw '游戏未保持在前台'
        }
        Save-Logs
    }
    'background' {
        Test-BackgroundRecovery
    }
    'corrupt' {
        Test-CorruptSaveRecovery
    }
    'oldsave' {
        Test-OldSaveMigration
    }
    'stability' {
        Test-Stability
    }
}
