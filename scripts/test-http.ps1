$response = [System.Net.HttpWebRequest]::Create("http://127.0.0.1:8080/")
try {
    $resp = $response.GetResponse()
    Write-Host "Status:" $resp.StatusCode
    Write-Host "Description:" $resp.StatusDescription
} catch {
    $e = $_.Exception
    if ($e.Response) {
        Write-Host "Status:" $e.Response.StatusCode
        Write-Host "Description:" $e.Response.StatusDescription
    } else {
        Write-Host "Error:" $e.Message
    }
}