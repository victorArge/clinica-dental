# Test de Clinicadental

Write-Host "=== Test Clinica Dental ===" -ForegroundColor Cyan

Write-Host "`n1. Salud del balanceador:" -ForegroundColor Yellow
Invoke-WebRequest -Uri http://localhost:8080/health -UseBasicParsing | Select-Object -ExpandProperty Content

Write-Host "`n2. Frontend:" -ForegroundColor Yellow
$frontend = Invoke-WebRequest -Uri http://localhost:8080 -UseBasicParsing
if ($frontend.Content -match "<title>(.*?)</title>") {
    Write-Host "Titulo: $($Matches[1])"
}

Write-Host "`n3. API medicos:" -ForegroundColor Yellow
try {
    $medicos = Invoke-RestMethod -Uri http://localhost:8080/api/medicos -UseBasicParsing -ErrorAction Stop
    Write-Host "Medicos encontrados: $($medicos.Count)"
} catch {
    Write-Host "Error: $_"
}

Write-Host "`n4. Estado de contenedores:" -ForegroundColor Yellow
docker ps --format "table {{.Names}}`t{{.Status}}"

Write-Host "`n5. MongoDB Replica Set:" -ForegroundColor Yellow
docker exec clinica_mongo1 mongosh --quiet -u admin -p 2004 --authenticationDatabase admin clinica_dental --eval "rs.status().ok" 2>$null

Write-Host "`n=== Fin tests ===" -ForegroundColor Green