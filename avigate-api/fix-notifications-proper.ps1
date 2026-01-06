# PowerShell script to fix notification calls properly

$files = @(
    "src\modules\journey\services\journey-notification.service.ts",
    "src\modules\location-share\location-share.service.ts",
    "src\modules\community\services\feed.service.ts",
    "src\modules\admin\services\contribution-management.service.ts"
)

foreach ($file in $files) {
    $content = Get-Content $file -Raw

    # Pattern to match and fix notification calls
    # This matches: body: '...',\n      data: {\n        type: 'xxx',
    # And replaces with: body: '...',\n      type: 'xxx' as any,\n      data: {

    $content = $content -replace "(?ms)(body:.*?,)\s*data:\s*\{\s*type:\s*'([^']+)',", ('$1' + [Environment]::NewLine + '      type: ''$2'' as any,' + [Environment]::NewLine + '      data: {')

    Set-Content -Path $file -Value $content -NoNewline
    Write-Host "Fixed: $file"
}

Write-Host "Done!"
