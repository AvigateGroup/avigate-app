# PowerShell script to fix notification calls

$files = @(
    "src\modules\journey\services\journey-notification.service.ts",
    "src\modules\location-share\location-share.service.ts",
    "src\modules\community\services\feed.service.ts",
    "src\modules\admin\services\contribution-management.service.ts"
)

foreach ($file in $files) {
    $content = Get-Content $file -Raw

    # Replace patterns: move type from data to root level
    $content = $content -replace "(?ms)(sendToUser\([^,]+,\s*\{\s*title:.*?body:.*?)\s*data:\s*\{\s*type:\s*'([^']+)',", '$1type: ''$2'' as any,`n      data: {'

    # Remove the standalone type lines within data blocks (cleanup)
    $content = $content -replace "(?m)^\s*type:\s*'[^']+',?\s*$\n", ""

    Set-Content -Path $file -Value $content
    Write-Host "Fixed: $file"
}

Write-Host "Done!"
