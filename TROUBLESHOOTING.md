# TROUBLESHOOTING.md
# Known issues + fixes — AI đọc file này để không hỏi lại vấn đề đã giải quyết
# Format: [TRB-ID] | Append only — không xóa entries cũ

---

## [TRB-001] Antigravity Language Server SIGILL Crash trên Ubuntu Server
**Date:** 2026-04-10
**Status:** ✅ RESOLVED
**Severity:** High — IDE hoàn toàn không dùng được trên server

### Triệu chứng
- Chạy Antigravity trên Ubuntu server (elvin@100.67.85.6)
- Language Server process crash ngay sau khi mở project
- Error: `Illegal instruction (core dumped)` → SIGILL signal
- VS Code extension features không hoạt động (IntelliSense, completions)

### Nguyên nhân gốc
- CPU: Intel i7-10900K **không có AVX-512** instruction set
- Antigravity Language Server binary được compile với AVX-512 optimizations
- Khi binary thực thi AVX-512 instruction trên CPU không hỗ trợ → SIGILL crash
- Đây là hardware limitation — không phải bug của software hay config sai

### Fix đã áp dụng
1. **Chạy Antigravity trên Windows** (laptop/PC có CPU hỗ trợ) thay vì trên server Ubuntu
2. **Mount ~/projects/ của server lên Windows** qua Samba (SMB protocol):
   ```
   net use L: \\100.67.85.6\projects /user:elvin [password] /persistent:yes
   ```
3. **Mở L:\cv-saas\ trong Antigravity** → edit files trực tiếp
4. Files thay đổi tức thì available trên server (không cần sync/push)

### Tại sao Samba thay vì SFTP/rsync
- Samba = Windows-native SMB protocol → Antigravity xem L:\ như local drive
- SFTP/rsync cần plugin riêng + latency khi save
- Tailscale đã encrypt traffic → không cần thêm encryption layer

### Workaround tạm (nếu cần chạy command trên server)
```powershell
# SSH vào server từ Windows Terminal
ssh elvin@100.67.85.6
# hoặc dùng alias (đã config)
ssh ubuntu-server
```

### Không cần làm
- Không cần compile lại Antigravity từ source
- Không cần cài Rosetta/emulation
- Không cần đổi CPU hay VM
- Không cần dùng Remote SSH extension (architecture đã được fix ở tầng mount)

### Context cho AI
Khi user nói "mở project", "edit file", "chạy Antigravity" → hiểu là đang làm việc
qua L:\ trên Windows. Server Ubuntu chỉ chạy services (Docker, Ollama, n8n).

---

## [TRB-002] xrdp Remote Desktop — Conflict với Physical Session
**Date:** 2026-04-10
**Status:** ✅ RESOLVED (workaround)
**Severity:** Medium — Remote Desktop cần bước manual

### Triệu chứng
- Kết nối xrdp từ Windows Remote Desktop
- Màn hình bị đen hoặc session disconnect ngay lập tức
- Error trong xrdp log: `session disconnect`

### Nguyên nhân
- GNOME Desktop không hỗ trợ concurrent sessions (local + remote cùng lúc)
- Nếu physical monitor đang hiển thị GNOME session → remote không thể tạo session mới

### Fix (Workaround)
1. Trên physical machine: **Logout** khỏi GNOME session (không chỉ lock screen)
2. Kết nối lại từ Windows Remote Desktop
3. xrdp sẽ tạo independent TigerVNC session thành công

### Lưu ý
- Lock screen ≠ Logout — phải logout hoàn toàn
- Sau khi xrdp connected, physical monitor sẽ về login screen
- Đây là design của GNOME, không phải bug của xrdp

### Tham chiếu
- DECISIONS.md → D003: Chọn xrdp + TigerVNC

---

## [TRB-003] NVIDIA Driver Version Mismatch — Ollama chạy CPU-only
**Date:** 2026-04-11
**Status:** ✅ RESOLVED
**Severity:** Critical — Ollama inference 30s thay vì <10s, GPU không được dùng

### Triệu chứng
- `nvidia-smi` báo: `Failed to initialize NVML: Driver/library version mismatch`
- `NVML library version: 535.288`
- Ollama `ps` command: PROCESSOR = CPU (không phải GPU)
- Inference time: 30+ giây cho prompt ngắn
- GPU memory usage: chỉ 32MiB (GUI only, không có ML workload)

### Nguyên nhân gốc
Ubuntu kernel upgrade tự động build lại NVIDIA kernel module qua DKMS,
nhưng upgrade lên version mới hơn (580.x) trong khi userspace packages (nvidia-utils, NVML library) vẫn ở 535.x.

```
Kernel module (DKMS):  nvidia 580.126.09  ← mới hơn
Userspace NVML lib:    535.288.01         ← cũ hơn
nvidia-smi:            535.288.01         ← cũ hơn
→ MISMATCH → nvidia-smi crash → Ollama không detect GPU
```

### Fix
```bash
sudo apt install nvidia-utils-580
```
Cài userspace utilities version 580 để match kernel module.

### Verify sau fix
```
nvidia-smi: Driver Version 580.126.09 ✅
RTX 3060 12288MiB visible ✅
Ollama ps: 100% GPU ✅
Benchmark gemma3:12b: 11s ✅ (Phase Gate G.3 PASSED)
```

### Prevention sau này
Sau mỗi kernel upgrade (`uname -r` thay đổi): chạy `nvidia-smi` để xác nhận.
Nếu fail → `sudo apt install nvidia-utils-$(nvidia-driver version)`.

### Tham chiếu
- DECISIONS.md → D007: Fix NVIDIA driver mismatch

---
*Thêm entries mới bên dưới với format [TRB-XXX]*
