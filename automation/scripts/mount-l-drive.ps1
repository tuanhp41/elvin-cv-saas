# Mount L:\ drive via rclone (ubuntu: remote)
# Chạy khi Windows login — được gọi bởi Task Scheduler
# Nếu mount lỗi sau 3 lần thử, ghi log và thoát

$LogFile = "$env:APPDATA\mount-l-drive.log"
$Remote  = "ubuntu:"
$MountPoint = "L:"
$MaxRetries = 3

function Write-Log {
    param([string]$msg)
    $ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Add-Content -Path $LogFile -Value "[$ts] $msg"
}

Write-Log "=== mount-l-drive.ps1 started ==="

# Chờ Tailscale kết nối (tối đa 30s)
$attempt = 0
do {
    $tailscaleStatus = tailscale status 2>&1
    if ($tailscaleStatus -match "100\.\d+\.\d+\.\d+") {
        Write-Log "Tailscale OK"
        break
    }
    $attempt++
    Write-Log "Waiting for Tailscale... attempt $attempt"
    Start-Sleep -Seconds 5
} while ($attempt -lt 6)

# Kiểm tra xem L:\ đã mount chưa
$existingMount = Get-PSDrive -Name L -ErrorAction SilentlyContinue
if ($existingMount) {
    Write-Log "L:\ already mounted. Exiting."
    exit 0
}

# Mount L:\ với rclone
$retries = 0
while ($retries -lt $MaxRetries) {
    Write-Log "Mounting $Remote → $MountPoint (attempt $($retries+1))"
    
    $proc = Start-Process -FilePath "rclone" `
        -ArgumentList "mount $Remote $MountPoint --vfs-cache-mode writes --network-mode --no-console" `
        -WindowStyle Hidden `
        -PassThru
    
    Start-Sleep -Seconds 3
    
    if (Test-Path "$MountPoint\") {
        Write-Log "Mount SUCCESS. rclone PID: $($proc.Id)"
        exit 0
    }
    
    $retries++
    Write-Log "Mount failed, retry in 5s..."
    Start-Sleep -Seconds 5
}

Write-Log "ERROR: Failed to mount L:\ after $MaxRetries attempts"
exit 1
