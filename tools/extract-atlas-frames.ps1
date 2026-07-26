param(
    [string]$JobsPath = (Join-Path (Split-Path -Parent $PSScriptRoot) 'recovery\atlas-frame-jobs.json')
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$resolvedJobsPath = (Resolve-Path -LiteralPath $JobsPath).Path
$jobs = Get-Content -Raw -LiteralPath $resolvedJobsPath | ConvertFrom-Json
$completed = 0

foreach ($job in $jobs) {
    $sourcePath = [System.IO.Path]::GetFullPath([string]$job.source)
    $destinationPath = [System.IO.Path]::GetFullPath([string]$job.destination)
    if (-not (Test-Path -LiteralPath $sourcePath -PathType Leaf)) {
        throw "Atlas source does not exist: $sourcePath"
    }

    $destinationDirectory = Split-Path -Parent $destinationPath
    [System.IO.Directory]::CreateDirectory($destinationDirectory) | Out-Null

    $atlas = [System.Drawing.Bitmap]::FromFile($sourcePath)
    try {
        $physicalWidth = if ([bool]$job.rotated) { [int]$job.height } else { [int]$job.width }
        $physicalHeight = if ([bool]$job.rotated) { [int]$job.width } else { [int]$job.height }
        $x = [int]$job.x
        $y = [int]$job.y

        if ($x -lt 0 -or $y -lt 0 -or $x + $physicalWidth -gt $atlas.Width -or $y + $physicalHeight -gt $atlas.Height) {
            throw "Crop rectangle is outside atlas bounds for $($job.path): ($x,$y,$physicalWidth,$physicalHeight) in $($atlas.Width)x$($atlas.Height)"
        }

        $frame = New-Object System.Drawing.Bitmap($physicalWidth, $physicalHeight, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
        try {
            $graphics = [System.Drawing.Graphics]::FromImage($frame)
            try {
                $graphics.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
                $graphics.DrawImage(
                    $atlas,
                    [System.Drawing.Rectangle]::new(0, 0, $physicalWidth, $physicalHeight),
                    [System.Drawing.Rectangle]::new($x, $y, $physicalWidth, $physicalHeight),
                    [System.Drawing.GraphicsUnit]::Pixel
                )
            }
            finally {
                $graphics.Dispose()
            }

            if ([bool]$job.rotated) {
                $frame.RotateFlip([System.Drawing.RotateFlipType]::Rotate270FlipNone)
            }

            $temporaryPath = "$destinationPath.extracting.png"
            if (Test-Path -LiteralPath $temporaryPath) {
                Remove-Item -LiteralPath $temporaryPath -Force
            }
            $frame.Save($temporaryPath, [System.Drawing.Imaging.ImageFormat]::Png)
            Move-Item -LiteralPath $temporaryPath -Destination $destinationPath -Force
        }
        finally {
            $frame.Dispose()
        }
    }
    finally {
        $atlas.Dispose()
    }

    $completed += 1
    if ($completed % 100 -eq 0) {
        Write-Host "Extracted $completed / $($jobs.Count) frames"
    }
}

Write-Host "Extracted $completed original frames from APK atlases."
