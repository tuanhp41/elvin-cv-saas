# DECISIONS.md
# Mọi quyết định kỹ thuật quan trọng — KHÔNG xóa entries cũ

## Format
```
## [DATE] [ID] Chọn X thay vì Y
**Context:** Tại sao phải quyết định
**Học được:** Sự khác biệt thực sự giữa X và Y
**Quyết định:** Chọn X
**Rationale:** [lý do kỹ thuật cụ thể]
**Trade-off chấp nhận:** Mất gì, được gì
**Revisit khi:** Điều kiện nào thì xem xét lại
```

---

## [2026-04-10] [D001] Chọn Ubuntu Desktop thay vì Server
**Context:** Cần remote GUI để dùng Antigravity IDE
**Học được:** Desktop dễ debug hơn khi mới setup, có thể tắt GUI sau
**Quyết định:** Ubuntu 24.04 Desktop
**Rationale:** Antigravity cần GUI, Remote Desktop dễ hơn X11 forwarding
**Trade-off chấp nhận:** Tốn thêm ~400MB RAM cho GUI
**Revisit khi:** Khi SSH + headless đủ ổn định

## [2026-04-10] [D002] Dùng gemma4:latest thay vì gemma4:12b
**Context:** Ollama registry không có tag gemma4:12b
**Học được:** Ollama dùng tag :latest cho model mới, không có size qualifier
**Quyết định:** gemma4:latest (9.6GB)
**Rationale:** Đây là bản available duy nhất, likely là 12B variant
**Trade-off chấp nhận:** Không chắc chắn về size, cần verify
**Revisit khi:** Khi Ollama release tag gemma4:12b chính thức

## [2026-04-10] [D003] Chọn xrdp + TigerVNC cho Remote Desktop
**Context:** Cần remote GUI từ Windows qua Tailscale
**Học được:** GNOME không support concurrent local + remote session với xrdp/VNC backend
**Quyết định:** TigerVNC tạo independent session
**Rationale:** Không conflict với physical desktop session
**Trade-off chấp nhận:** Cần logout physical session khi dùng xrdp
**Revisit khi:** Nếu có giải pháp tốt hơn
