$content = Get-Content 'assets\widgets\ProductGridWidget.js' -Raw
$content = $content -replace 'id: source === ''dynamic'' \? `prod_\$\{item\.id\}` :', 'id: source === ''dynamic'' ? item.id :'
Set-Content 'assets\widgets\ProductGridWidget.js' -Value $content -NoNewline
Write-Host "Fixed ProductGridWidget.js"
