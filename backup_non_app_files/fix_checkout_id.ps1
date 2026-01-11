$content = Get-Content 'assets\widgets\CheckoutWidget.js' -Raw
# Find and replace the items mapping section
$oldPattern = 'items: cartItems\.map\(item => \(\{ id: item\.id, name: item\.name, price: parseFloat\(String\(item\.price\)\.replace\(/\[^0-9\.-\]\+/g, ''''\)\), quantity: item\.qty \}\)\)'
$newPattern = 'items: cartItems.map(item => ({ id: typeof item.id === ''string'' ? parseInt(item.id.replace(/\D/g, '''')) || 0 : item.id, name: item.name, price: parseFloat(String(item.price).replace(/[^0-9.-]+/g, '''')), quantity: item.qty }))'
$content = $content -replace [regex]::Escape($oldPattern), $newPattern
Set-Content 'assets\widgets\CheckoutWidget.js' -Value $content -NoNewline
Write-Host "Fixed CheckoutWidget.js - now parses product IDs correctly"
