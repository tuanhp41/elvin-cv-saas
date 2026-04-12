# ENVIRONMENT.md
# 🌐 Dev Environment Reference — CV SaaS Project
# ⚠️ AI đọc file này ĐẦU TIÊN mỗi session — TRƯỚC KHI tìm kiếm bất cứ thứ gì
# ⚠️ Cuối session: cập nhật file này trước khi commit
# Last Updated: 2026-04-12 08:08 +07:00 | Session #9

---

## 🗺️ TOPOLOGY OVERVIEW

```
[LAPTOP-PERSONAL]  ──── Tailscale ────┐
  Windows 11, full admin               ├──→ [SERVER-PC]
  L:\ = rclone mount                   │     Ubuntu 22.04
                                       │     Tailscale: 100.67.85.6
[LAPTOP-COMPANY]   ──── [TODO] ────────┘     Server User: elvin
  Windows 11, hạn chế                         n8n :5678
  FortiVPN thường xuyên                       Ollama :11434
  SSH method: plink/ssh
```

---

## 💻 MACHINE 1 — LAPTOP-PERSONAL (Laptop Cá Nhân)

**Nhận diện máy này:** Full admin rights, rclone + Tailscale cài được, L:\ drive available

| Thông tin | Giá trị |
|---|---|
| OS | Windows 11 |
| Permissions | Full Admin |
| Hostname | [TODO — điền hostname để AI nhận diện] |
| Username | tuanh |

### Tools đã cài
| Tool | Version | Status |
|---|---|---|
| Git | v2.48.1 | ✅ |
| Node.js | v24.14.1 | ✅ |
| SSH | built-in | ✅ |
| Tailscale | latest | ✅ Automatic startup |
| rclone | latest | ✅ |
| L:\ drive | auto-mount | ✅ Qua startup shortcut |

### SSH vào Server từ LAPTOP-PERSONAL
```powershell
# Cách 1 — SSH alias (chính thức, đã cấu hình trong .ssh/config)
ssh ubuntu-server   # user: elvin, path: /home/elvin/projects/cv-saas/

# Cách 2 — Direct Tailscale IP
ssh elvin@100.67.85.6

# ⚠️ QUAN TRỌNG: User trên server là elvin, project nằm trong /home/elvin/projects/cv-saas
# Git remote: github.com/tuanhp41/elvin-cv-saas

# ubuntu-server/elvin = alias Antigravity dùng
# Git remote là CÙNG repo: github.com/tuanhp41/elvin-cv-saas
# SSH config tại: C:\Users\tuanh\.ssh\config
# ⚠️ Known issue: file từng bị BOM — đã fix 2026-04-12
```

### L:\ Drive
```powershell
# Mount thủ công nếu cần
L:\cv-saas\automation\scripts\mount-l-drive.ps1

# Auto-mount: Startup shortcut tại:
# %APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\Mount-L-Drive.lnk

# rclone remote name: ubuntu:
# Project trên server map tới: L:\cv-saas\
```

### PowerShell Rules (LAPTOP-PERSONAL)
```powershell
# ❌ KHÔNG dùng && 
git add . && git commit -m "msg"

# ✅ Dùng ; 
git add .; git commit -m "msg"

# ✅ Commit qua SSH vào server (tránh Husky Windows issue)
ssh tuanpc "cd /home/tuan/projects/cv-saas; git add -A; git commit -m 'msg'"
```

---

## 💼 MACHINE 2 — LAPTOP-COMPANY (Laptop Công Ty)

**Nhận diện máy này:** [TODO — điền dấu hiệu nhận biết: hostname? username? không có L:\?]

| Thông tin | Giá trị |
|---|---|
| OS | Windows 11 |
| Permissions | Hạn chế — không full admin |
| Hostname | [TODO — điền khi lần đầu dùng] |
| Username | [TODO — điền khi lần đầu dùng] |
| FortiVPN | Chỉ bật khi cần (không thường xuyên) |
| Tailscale | ✅ Cài được |

### ⚠️ Limitations (Laptop Công Ty)
```
[x] Tailscale: CÀI ĐƯỢC
[ ] rclone / L:\ drive: [TODO — chưa test]
[ ] PowerShell script .ps1: [TODO — chưa test ExecutionPolicy]
[ ] Port 22 SSH: [TODO — chưa test khi có/không FortiVPN]
[ ] Cài phần mềm tự do: [TODO — chưa biết IT policy]
```

### SSH vào Server từ LAPTOP-COMPANY
```
⚠️ CHƯA CONFIRM — cập nhật lần đầu ngồi laptop công ty

Đang test: plink (PuTTY CLI) — chưa verify
  plink tuan@100.67.85.6

Nếu Tailscale OK → có thể dùng:
  ssh tuan@100.67.85.6  (nếu OpenSSH available)

Fallback nếu SSH fail:
  - n8n web UI: http://100.67.85.6:5678
  - Tailscale SSH web console (browser-based)
  - FortiVPN tắt trước khi thử (FortiVPN có thể block Tailscale)
```

### Cách tiếp cận Project từ LAPTOP-COMPANY
```
⚠️ CHƯA CONFIRM — cập nhật lần đầu ngồi laptop công ty

Nếu không có L:\ → workflow thay thế:
  - VS Code Remote SSH extension → edit file trực tiếp trên server
  - Commit trực tiếp trên server qua SSH/plink terminal
  - Dùng n8n web UI cho automation tasks
  - KHÔNG dùng Antigravity file tools (không có L:\)
```

### Risk liên quan: R-NEW-001
- FortiVPN có thể block Tailscale → mất SSH
- Workaround: Tailscale port 443, Tailscale web console
- Xem chi tiết: RISK_LOG.md → R-NEW-001

---

## 🖥️ MACHINE 3 — SERVER-PC (PC Nhà / Remote Server)

**Không ngồi trực tiếp — chỉ access qua SSH hoặc web UI**

| Thông tin | Giá trị |
|---|---|
| OS | Ubuntu 22.04 LTS Server |
| Tailscale IP | `100.67.85.6` |
| SSH User | `elvin` |
| Project Path | `/home/elvin/projects/cv-saas/` |
| GPU | RTX3060 12GB |

### Services
| Service | URL | Port | Status |
|---|---|---|---|
| n8n | `http://100.67.85.6:5678` | 5678 | ✅ docker restart:always |
| Ollama API | `http://100.67.85.6:11434` | 11434 | ✅ systemd |
| Ollama model | `gemma3:12b` | — | ✅ loaded |

### n8n Docker — Critical Config
```yaml
# docker-compose.yml PHẢI có dòng này:
environment:
  - NODE_FUNCTION_ALLOW_BUILTIN=fs,child_process
# Thiếu dòng này → Execute Command node FAIL
```

### Server-side Commands thường dùng
```bash
# SSH vào server (chạy từ laptop)
ssh ubuntu-server
# hoặc
ssh elvin@100.67.85.6

# Kiểm tra services
docker ps
systemctl status ollama

# GPU check
nvidia-smi

# Commit & Push từ server (Cách an toàn nhất, tránh Husky Windows issue & SSH key issue)
ssh ubuntu-server "cd /home/elvin/projects/cv-saas && git add -A && git commit -m 'type(scope): message' && git push origin main"

# NẾU COMMIT TRÊN WINDOWS:
# Git trên Windows có thể bị fail push do thiếu SSH key Github, hãy dùng lệnh sau để push nhờ server:
ssh ubuntu-server "cd /home/elvin/projects/cv-saas && git push origin main"

# Husky issue: sau npm install trên server
chmod +x node_modules/.bin/*
```

---

## 🔀 ACCESS MATRIX

| Từ \ Đến | SERVER-PC SSH | n8n Web UI | L:\ Drive |
|---|---|---|---|
| **LAPTOP-PERSONAL** | ✅ `ssh tuanpc` | ✅ direct | ✅ rclone mount |
| **LAPTOP-COMPANY** | [TODO] | [TODO] | ❌ không có |

---

## 🤖 AI Session Start Protocol

**Bước 0: Xác định đang ở máy nào**

```
Dấu hiệu LAPTOP-PERSONAL:
- L:\ drive available (Test: Test-Path L:\)
- Username: tuanh
- [TODO: hostname]

Dấu hiệu LAPTOP-COMPANY:
- [TODO: dấu hiệu nhận biết]
- Không có L:\

→ Sau khi xác định máy → dùng access method tương ứng ở trên
→ KHÔNG thử SSH methods của máy kia
```

**KHÔNG bao giờ:**
- Tìm file bằng `Get-ChildItem -Recurse` nếu path đã có trong file này
- Thử cài Tailscale / rclone trên LAPTOP-COMPANY nếu chưa confirm được phép
- Dùng `&&` trong PowerShell (dùng `;` thay thế)

---

## 🛠️ Known Issues & Fixes

| Issue | Máy | Ngày fix | Fix |
|---|---|---|---|
| SSH config BOM `\357\273\277host` | LAPTOP-PERSONAL | 2026-04-12 | Remove BOM bằng PowerShell (xem bên dưới) |
| Husky fail khi commit từ Windows | LAPTOP-PERSONAL | — | Commit trực tiếp trên server qua SSH |
| `&&` không hợp lệ trong PowerShell | LAPTOP-PERSONAL | 2026-04-12 | Dùng `;` thay thế |
| Tailscale không auto-start after reboot | LAPTOP-PERSONAL | 2026-04-12 | Startup shortcut tạo trong %APPDATA%\...\Startup\ |
| L:\ mất sau khi Tailscale tắt | LAPTOP-PERSONAL | 2026-04-12 | Chạy mount-l-drive.ps1 sau khi Tailscale reconnect |
| Tailscale exe path: KHÔNG phải Program Files\Tailscale\tailscale.exe | LAPTOP-PERSONAL | 2026-04-12 | Đúng path: `C:\Program Files\Tailscale\tailscale-ipn.exe` |
| `?.Property` (null-conditional) không hợp lệ trong PowerShell 5.x | LAPTOP-PERSONAL | 2026-04-12 | Dùng thủ tục if/else thay thế |
| `Get-ChildItem -Recurse` treo khi scan `~/` trên Linux qua SSH | SERVER-PC | 2026-04-12 | Thêm `timeout 5` trước lệnh, hoặc giới hạn `-maxdepth` |

### Fix BOM trong SSH config (nếu gặp lại)
```powershell
$f = "$env:USERPROFILE\.ssh\config"
$c = Get-Content $f -Raw
[System.IO.File]::WriteAllText($f, $c.TrimStart([char]0xFEFF), [System.Text.Encoding]::UTF8)
```

### Khởi động lại Tailscale thủ công
```powershell
Start-Process "C:\Program Files\Tailscale\tailscale-ipn.exe" -WindowStyle Hidden
Start-Sleep 5
# Kiểm tra
Get-Process tailscale* | Select-Object Name, Id
```

---

## 🤖 AI Resource Strategy (TOKEN POOLS)

```
⚠️ Antigravity có 2 TOKEN POOLS RIÊNG BIỆT:

POOL A: Claude (Opus + Sonnet DÙNG CHUNG)
POOL B: Gemini Pro (RIÊNG)
Reset: mỗi 5 giờ + weekly limit

→ Dùng Opus nhiều = Sonnet cũng hết
→ Xen kẽ Pool A ↔ Pool B trong mỗi session
→ Khi 1 pool hết → chuyển sang pool còn lại
→ Cả 2 hết → dùng Free AI APIs hoặc đợi reset
```

| Task | Model | Pool | Ghi chú |
|---|---|---|---|
| Architecture, Phase Gate | Opus | A (Claude) | ~10% — TIẾT KIỆM |
| Complex logic, debug khó | Sonnet | A (Claude) | ~20% — chỉ khi Gemini không đủ |
| Features, APIs, docs, review nhẹ | **Gemini Pro** | **B (Gemini)** | **~60% — WORKHORSE CHÍNH** |
| Bulk code, pattern tasks | Free AIs (Gemma/Qwen API) | Không tốn | ~10% — Stage 3+ |

**Chi tiết phân công:** xem ROADMAP_PHASE1.md → "PHÂN CÔNG NGUỒN LỰC CHI TIẾT"

---

## 📝 Update Log

| Session | Ngày | Thay đổi |
|---|---|---|
| #8 | 2026-04-12 | Tạo file, structure 3-machine, fix SSH BOM, PowerShell gotcha |
| #9 | 2026-04-12 | Antigravity session: xác nhận ubuntu-server/elvin alias, Node.js v24.14.1, Tailscale path, Known Issues mới x5 |
| #10 | 2026-04-12 | Master Plan v4, token pool strategy, AI workforce pipeline design |
