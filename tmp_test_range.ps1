$url = 'https://kabbik-space.sgp1.cdn.digitaloceanspaces.com/demo_playlist/shorts/dramatic-background-short-music-29-sec-hip-hop-violin-orchestral-148927.mp3'
try {
    $resp = Invoke-WebRequest -Uri $url -Method Get -Headers @{ 'Range'='bytes=0-1' } -OutFile .\tmp_range.bin -ErrorAction Stop
    Write-Output "StatusCode: $($resp.StatusCode)"
    foreach ($pair in $resp.Headers.GetEnumerator()) {
        Write-Output ($pair.Key + ': ' + $pair.Value)
    }
} catch {
    Write-Output "Range request failed: $($_.Exception.Message)"
    exit 1
}
