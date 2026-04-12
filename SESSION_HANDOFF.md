# 🔄 Session Handoff — CV SaaS Project
> **Tạo lúc:** 2026-04-12 07:52 +07:00  
> **Từ:** Session #7 (máy Windows — tuanh)  
> **Mục đích:** Bàn giao sang session mới / máy tính khác

---

## 📍 Trạng thái hiện tại

| Field | Value |
|---|---|
| **Phase** | 0 — Infrastructure & Governance |
| **Progress** | ~95% |
| **Session** | #7 |
| **Branch** | main |
| **Latest commit** | `7758852` — chore: update session protocol |
| **GitHub** | https://github.com/tuanhp41/elvin-cv-saas |

---

## ✅ Đã hoàn thành (Phase 0)

| # | Hạng mục | Commit |
|---|---|---|
| ✅ | Ubuntu 24.04 server setup | b99ba64 |
| ✅ | Tailscale VPN (IP: 100.67.85.6) | b99ba64 |
| ✅ | Docker + n8n self-hosted | b99ba64 |
| ✅ | Ollama + gemma4 + gemma3:12b | b99ba64 |
| ✅ | NVIDIA RTX3060 GPU fix | 4d7cf05 |
| ✅ | 10 governance files đầy đủ | fc7c59b |
| ✅ | LLM Wiki (compile_wiki.py → 22KB) | b99ba64 |
| ✅ | ESLint + Husky pre-commit hooks | 3e79afa |
| ✅ | Samba mount L:\\ → Linux (Windows) | f1e3911 |
| ✅ | .antigravity-rules với PMP prompts | d914718 |
| ✅ | Session startup/close protocol | d914718 |
| ⏳ | DashChat /status /done test live | — |
| ⏳ | git tag v0.1.0-phase0-complete | — |

---

## 🔌 Kết nối & Môi trường

### Linux Server (Ubuntu 24.04)
```
IP Tailscale : 100.67.85.6
User         : elvin
SSH Key      : ~/.ssh/id_ed25519
SSH Alias    : ubuntu-server (trong ~/.ssh/config)
Project path : /home/elvin/projects/cv-saas/
```

### Windows Client (máy này)
```
Git          : v2.48.1  ✅
SSH          : OpenSSH 9.5p2  ✅
Node.js      : v24.14.1  ✅
npm          : v11.11.0  ✅
rclone       : v1.73.4  ✅
L:\ drive    : mount = /home/elvin/projects/ (qua rclone SFTP)
Auto-mount   : Startup folder shortcut  ✅
Tailscale    : C:\Program Files\Tailscale\  ✅
```

### SSH Config (C:\Users\tuanh\.ssh\config)
```
Host ubuntu-server
    HostName 100.67.85.6
    User elvin
    IdentityFile C:/Users/tuanh/.ssh/id_ed25519
    StrictHostKeyChecking no
```

### Rclone Config (%APPDATA%\rclone\rclone.conf)
```ini
[ubuntu]
type = sftp
host = 100.67.85.6
user = elvin
port = 22
key_file = C:\Users\tuanh\.ssh\id_ed25519
```

---

## 🎯 Task đầu tiên session tới

> Test DashChat live: gửi `/status` trên Telegram → n8n phải response trong <5 giây

---

## 📋 Governance files quan trọng (trên server)

| File | Mục đích | Được phép sửa? |
|---|---|---|
| [[CURRENT_STATE]] | Snapshot session | ✅ Cuối mỗi session |
| [[RISK_LOG]] | 13 risks tracked | ✅ Khi có risk mới |
| [[ROADMAP]] | Phase Gate checklist | ❌ Frozen |
| [[SPEC]] | Source of truth | ❌ Frozen |
| [[DECISIONS]] | D001-D007 logged | ✅ Append only |
| [[LEARNINGS]] | 2 sessions logged | ✅ Append only |
| [[EXPERIMENTS]] | EXP-001 done, EXP-002 pending | ✅ Append only |
| .antigravity-rules | AI rules + PMP prompts | ✅ Khi cần cập nhật |
| [[ARCHITECTURE]] | Folder structure frozen | ❌ Frozen |

---

## 🖥️ Setup máy tính mới (chạy theo thứ tự)

### Bước 1 — SSH Key
```powershell
# Tạo key mới
ssh-keygen -t ed25519 -C "new-machine"

# Copy lên server (nhập password Tuan1235@ lần này thôi)
type C:\Users\<bạn>\.ssh\id_ed25519.pub | ssh elvin@100.67.85.6 "cat >> ~/.ssh/authorized_keys"

# Test (phải vào không hỏi password)
ssh elvin@100.67.85.6
```

### Bước 2 — SSH Config
```
Tạo C:\Users\<bạn>\.ssh\config:

Host ubuntu-server
    HostName 100.67.85.6
    User elvin
    IdentityFile C:/Users/<bạn>/.ssh/id_ed25519
    StrictHostKeyChecking no
```

### Bước 3 — Cài tools
```powershell
winget install --id Rclone.Rclone -e --silent
winget install --id WinFsp.WinFsp -e --silent
winget install --id OpenJS.NodeJS.LTS -e --silent
```

### Bước 4 — Rclone config
```powershell
$config = @"
[ubuntu]
type = sftp
host = 100.67.85.6
user = elvin
port = 22
key_file = C:\Users\$env:USERNAME\.ssh\id_ed25519
"@
New-Item -ItemType Directory -Force -Path "$env:APPDATA\rclone" | Out-Null
Set-Content "$env:APPDATA\rclone\rclone.conf" $config -Encoding UTF8
```

### Bước 5 — Mount L:\
```powershell
$rclone = (Get-ChildItem "$env:LOCALAPPDATA\Microsoft\WinGet\Packages" -Recurse -Filter "rclone.exe" | Select-Object -First 1).FullName
Start-Process $rclone -ArgumentList "mount ubuntu:projects L: --config `"$env:APPDATA\rclone\rclone.conf`" --vfs-cache-mode full --network-mode" -WindowStyle Hidden
Start-Sleep 4; Test-Path "L:\"   # phải ra True
```

### Bước 6 — Mở project
```
Antigravity → File → Open Folder → L:\cv-saas\
```

---

## 📊 Git History (11 commits)

```
7758852  chore: update session protocol, n8n workflow
a0daab5  chore: update state session #7 — phase 0 at 95%
f1e3911  chore: add Windows auto-mount L drive startup script
79c4cdc  chore: setup Husky pre-commit + ESLint + LLM Wiki
3e79afa  chore: setup ESLint v9 + Husky pre-commit hook
eb5ae4e  chore: add lead_engineer_role + ai_resource_strategy
d914718  chore: add session startup/close protocol (PMP)
fc7c59b  docs: update CURRENT_STATE, antigravity-rules (PMP)
34deeff  chore: EXPERIMENTS.md EXP-001 done, n8n docker-compose
4d7cf05  fix: NVIDIA GPU driver mismatch resolved
b99ba64  feat: governance files, LLM Wiki, n8n workflows
```

---

## ⚠️ Lưu ý quan trọng

> - Tailscale **phải đang chạy** trước khi mount L:\
> - `L:\` mất sau reboot → chạy lại mount script hoặc đợi Startup shortcut
> - **KHÔNG** mở Remote SSH vào Linux từ Antigravity IDE → SIGILL crash (CPU thiếu AVX-512)
> - Antigravity AI chạy trên **Windows** — SSH qua PowerShell để điều khiển Linux
> - Stack FROZEN: Next.js 14, Supabase, Gemma 4, PayOS, Vercel, Tailwind, shadcn/ui

---

*Session Handoff Document | CV SaaS Phase 0 | 2026-04-12*
