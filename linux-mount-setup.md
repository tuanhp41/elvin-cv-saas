# 🖥️ Mount Linux Server → Ổ đĩa Windows (qua Tailscale)

> **Mục tiêu:** Truy cập `/home/elvin/projects/` trên Ubuntu như ổ `L:\` trên Windows  
> **Network:** Tailscale (WireGuard) — IP server: `100.67.85.6`  
> **Đã test:** Windows 11 + Ubuntu 24.04 LTS (elvin-Veriton-M4670G)

---

## Thông tin kết nối

| Key | Value |
|---|---|
| Server IP (Tailscale) | `100.67.85.6` |
| SSH Username | `elvin` |
| SSH Key (Windows) | `C:\Users\tuanh\.ssh\id_ed25519` |
| SSH Config alias | `ubuntu-server` |
| Remote path | `/home/elvin/projects/` |
| Windows drive | `L:\` |
| Git remote | `github.com:tuanhp41/elvin-cv-saas.git` |

---

## 📊 So sánh phương án (chọn trước khi làm)

| Phương án | Tốc độ | Độ khó setup | Windows native | Ghi chú |
|---|---|---|---|---|
| **✅ SMB/Samba** | ⭐⭐⭐⭐⭐ | Trung bình | ✅ | Tối ưu nhất với Tailscale |
| **✅ rclone + SFTP** | ⭐⭐⭐ | Dễ | ✅ | Đã hoạt động, double-encrypt |
| ❌ Remote SSH IDE | N/A | Dễ | ❌ | AI crash SIGILL (AVX-512 vs AVX2) |

> **Lý do SMB tốt hơn:** Tailscale đã mã hóa bằng WireGuard rồi.  
> SFTP mã hóa thêm 1 lần → overhead thừa. SMB thuần hơn, Windows-native hơn.

---

## ⚡ Phương án 1 — Samba/SMB (Tối ưu nhất)

### Trên Ubuntu server

```bash
# Cài Samba
sudo apt update && sudo apt install samba -y

# Thêm share vào config
sudo nano /etc/samba/smb.conf
```

Thêm vào cuối `/etc/samba/smb.conf`:

```ini
[projects]
   path = /home/elvin/projects
   valid users = elvin
   read only = no
   browsable = yes
   create mask = 0644
   directory mask = 0755
```

```bash
# Tạo Samba password
sudo smbpasswd -a elvin

# Bật service + mở firewall cho Tailscale interface
sudo systemctl enable smbd
sudo systemctl restart smbd
sudo ufw allow in on tailscale0 to any port 445
sudo ufw allow in on tailscale0 to any port 139
```

### Trên Windows

```powershell
# Mount (nhập Samba password khi được hỏi)
net use L: \\100.67.85.6\projects /user:elvin /persistent:yes
```

---

## ✅ Phương án 2 — rclone + SFTP (Đã hoạt động hôm nay)

### Bước 1 — Cài phần mềm

```powershell
winget install --id WinFsp.WinFsp -e --silent
winget install --id SSHFS-Win.SSHFS-Win -e --silent
winget install --id Rclone.Rclone -e --silent
```

### Bước 2 — SSH Key (nếu máy mới chưa có)

```powershell
# Tạo key
ssh-keygen -t ed25519 -C "my-windows-pc"

# Copy lên server (Windows không có ssh-copy-id)
type C:\Users\tuanh\.ssh\id_ed25519.pub | ssh elvin@100.67.85.6 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys && chmod 700 ~/.ssh"

# Test (phải vào không hỏi password)
ssh elvin@100.67.85.6
```

### Bước 3 — SSH Config

File: `C:\Users\tuanh\.ssh\config`

```
Host ubuntu-server
    HostName 100.67.85.6
    User elvin
    IdentityFile C:/Users/tuanh/.ssh/id_ed25519
    StrictHostKeyChecking no
```

### Bước 4 — Rclone Config

```powershell
$config = @"
[ubuntu]
type = sftp
host = 100.67.85.6
user = elvin
port = 22
key_file = C:\Users\tuanh\.ssh\id_ed25519
"@
New-Item -ItemType Directory -Force -Path "$env:APPDATA\rclone" | Out-Null
Set-Content -Path "$env:APPDATA\rclone\rclone.conf" -Value $config -Encoding UTF8
```

### Bước 5 — Mount script (`mount-linux.ps1`)

```powershell
$rclone = (Get-ChildItem "$env:LOCALAPPDATA\Microsoft\WinGet\Packages" -Recurse -Filter "rclone.exe" | Select-Object -First 1).FullName
$config  = "$env:APPDATA\rclone\rclone.conf"

if (Test-Path "L:\") { Write-Host "L:\ already mounted."; exit 0 }

Write-Host "Mounting Ubuntu server as L:\..."
Start-Process -FilePath $rclone `
    -ArgumentList "mount ubuntu:projects L: --config `"$config`" --vfs-cache-mode full --network-mode" `
    -WindowStyle Hidden

Start-Sleep 3
if (Test-Path "L:\") { Write-Host "✅ L:\ mounted! (/home/elvin/projects/)" }
else { Write-Host "❌ Failed. Kiểm tra Tailscale đang chạy không." }
```

---

## 🔁 Auto-mount khi khởi động Windows

```powershell
# Đăng ký Task Scheduler — chạy 1 lần là xong
$action   = New-ScheduledTaskAction -Execute "powershell.exe" `
              -Argument "-WindowStyle Hidden -File `"d:\GA API\mount-linux.ps1`""
$trigger  = New-ScheduledTaskTrigger -AtLogon
$settings = New-ScheduledTaskSettingsSet -ExecutionTimeLimit (New-TimeSpan -Minutes 1)
Register-ScheduledTask -TaskName "Mount Linux L Drive" `
    -Action $action -Trigger $trigger -Settings $settings -RunLevel Limited -Force
```

---

## ⚠️ Lưu ý

- **Tailscale phải đang chạy** trước khi mount
- Unmount khi xong: `net use L: /delete` hoặc kill tiến trình rclone
- Antigravity AI chạy trên **Windows** — không mở Remote SSH vào Linux (SIGILL crash)
- Mở project trong Antigravity: **File → Open Folder → `L:\cv-saas\`**
- SSH chạy lệnh trực tiếp: `ssh ubuntu-server 'lệnh linux'`
