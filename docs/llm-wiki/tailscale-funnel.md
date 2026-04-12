# Tailscale Funnel — Self-hosted HTTPS Exposure

> Verified: 2026-04-12 | Tailscale v1.x | Ubuntu Linux

---

## Mục đích
Tạo HTTPS public URL cho service đang chạy trên local/server không có public IP hoặc SSL cert.

## Setup (một lần)

### Bước 1: Enable Funnel trên Tailscale Admin
Truy cập online — **bắt buộc trước khi dùng CLI**:
```
https://login.tailscale.com/f/funnel?node=<node-id>
```
Node ID lấy từ output khi chạy `tailscale funnel ...` lần đầu.

### Bước 2: Set operator để không cần sudo
```bash
sudo tailscale set --operator=$USER
```

### Bước 3: Start Funnel
```bash
tailscale funnel --bg 5678    # expose port 5678 qua HTTPS
tailscale funnel status       # xem URL
```

Output URL: `https://<hostname>.<tailnet>.ts.net`

---

## Dùng với Docker container

Nếu service chạy trong Docker container, container cần resolve Tailscale hostname.

### Giải pháp: `network_mode: host`
```yaml
services:
  myservice:
    network_mode: host    # ← container dùng host network, thấy Tailscale DNS
    # không dùng ports: mapping khi dùng host mode
```

---

## Cạm bẫy ❌

| Vấn đề | Fix |
|--------|-----|
| `tailscale funnel: Access denied` | Cần `sudo tailscale set --operator=$USER` trước |
| `Funnel is not enabled on your tailnet` | Enable từ Admin Console online trước |
| Docker container không resolve hostname | Dùng `network_mode: host` |
| Funnel tắt sau reboot | Thêm vào startup script hoặc systemd service |

---

## Sau mỗi reboot server

Tailscale Funnel cần được restart:
```bash
tailscale funnel --bg 5678
```
Sau đó n8n cũng cần re-activate workflows (webhook re-register).

## Tham khảo
- [Tailscale Funnel docs](https://tailscale.com/kb/1223/funnel)
