$r = Invoke-WebRequest -Uri 'http://127.0.0.1:5173/' -UseBasicParsing -TimeoutSec 10
Write-Host "Status:" $r.StatusCode