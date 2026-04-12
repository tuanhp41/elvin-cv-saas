# sync-obsidian.ps1
# Auto pull latest code from GitHub to local Obsidian vault
# Usage: .\sync-obsidian.ps1

$OBSIDIAN_PATH = "C:\Users\tuanh\ObsidianVaults\cv-saas"
$LOG_FILE = "C:\Users\tuanh\ObsidianVaults\sync.log"

function Log($msg) {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $line = "[$timestamp] $msg"
    Write-Host $line
    Add-Content -Path $LOG_FILE -Value $line -Encoding UTF8
}

Log "=== Start Obsidian vault sync ==="

if (-not (Test-Path $OBSIDIAN_PATH)) {
    Log "ERROR: Path not found: $OBSIDIAN_PATH"
    Log "Run: git clone https://github.com/tuanhp41/elvin-cv-saas.git '$OBSIDIAN_PATH'"
    exit 1
}

Set-Location $OBSIDIAN_PATH
$result = git pull origin main 2>&1

if ($LASTEXITCODE -eq 0) {
    Log "OK: $result"
    Log "=== Sync done ==="
} else {
    Log "ERROR: git pull failed. Output: $result"
    exit 1
}
