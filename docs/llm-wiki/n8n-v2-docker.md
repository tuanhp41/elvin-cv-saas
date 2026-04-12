# n8n v2 trên Docker — Lessons Learned

> Verified: 2026-04-12 | n8n version: 2.15.1 | Docker | Linux Ubuntu

---

## 1. Code Node — Module Restriction

### Triệu chứng
```
Module 'fs' is disallowed [line 1]
Module 'child_process' is disallowed [line 1]
```

### Nguyên nhân gốc
n8n v2 Code node chạy trong sandbox VM bảo mật. Mặc định **không cho phép** bất kỳ Node.js built-in module nào (`fs`, `child_process`, `path`, v.v.)

### Giải pháp đã verify ✅
Thêm vào `docker-compose.yml`:
```yaml
environment:
  - NODE_FUNCTION_ALLOW_BUILTIN=fs,child_process   # ← tên ĐÚNG
  - NODE_FUNCTION_ALLOW_EXTERNAL=*                  # npm packages
  - N8N_RUNNERS_MODE=internal                       # dùng internal runner
```
Sau đó restart container.

### Cạm bẫy (Pitfalls) ❌
| Sai | Đúng |
|-----|------|
| `N8N_ALLOW_BUILTIN_MODULES=fs,child_process` | `NODE_FUNCTION_ALLOW_BUILTIN=fs,child_process` |
| Dùng `:` làm separator (`fs:child_process`) | Dùng `,` làm separator |
| Chỉ set env cho main container (external runner mode) | Dùng `N8N_RUNNERS_MODE=internal` hoặc config task runner riêng |

---

## 2. Workflow Import — Node ID requirement

### Triệu chứng
```
SQLITE_CONSTRAINT: NOT NULL constraint failed: workflow_entity.id
```

### Nguyên nhân gốc
n8n v2 yêu cầu **tất cả nodes và workflow phải có field `id`** trong JSON. Workflow cũ (v0.x/v1.x) không có field này.

### Giải pháp đã verify ✅
Dùng script Python để thêm id trước khi import:
```python
import json, uuid
with open('workflow.json') as f:
    wf = json.load(f)
wf['id'] = 'custom-id-001'          # string ID
for node in wf.get('nodes', []):
    if 'id' not in node:
        node['id'] = str(uuid.uuid4())
with open('workflow-fixed.json', 'w') as f:
    json.dump(wf, f)
```
Sau đó:
```bash
docker cp workflow-fixed.json n8n-n8n-1:/home/node/.n8n/
docker exec n8n-n8n-1 n8n import:workflow --input=/home/node/.n8n/workflow-fixed.json
```

---

## 3. Switch Node v3.1 — Fallback Output

### Triệu chứng
```
Issues: The value "extra-output-0" is not supported!
```

### Nguyên nhân gốc
Switch node typeVersion 3.1 không chấp nhận `"extra-output-0"` làm fallback output. Đây là format của phiên bản cũ hơn.

### Giải pháp đã verify ✅
Trong workflow JSON, xóa hoặc để trống fallbackOutput:
```json
"options": {}
```
Và xóa connection key `"extra-output-0"` trong connections.

---

## 4. Workflow Import vs API Update

### Vấn đề
`n8n import:workflow` CLI **không update đúng** workflow đang tồn tại — connections có thể bị mất hoặc không đồng bộ.

### Giải pháp đã verify ✅
Dùng n8n REST API để update:
```powershell
$r = Invoke-RestMethod -Uri "http://n8n-host:5678/api/v1/workflows/{id}" `
     -Headers @{"X-N8N-API-KEY"=$key; "Content-Type"="application/json"} `
     -Method PUT -Body $json
```

---

## 5. Telegram Webhook — HTTPS Required

### Triệu chứng
```
Bad Request: bad webhook: An HTTPS URL must be provided for webhook
Bad Request: bad webhook: Failed to resolve host: Name or service not known
```

### Nguyên nhân gốc
Telegram Bot API chỉ chấp nhận **HTTPS webhook URL**. n8n mặc định chạy HTTP.

### Giải pháp đã verify ✅ (Tailscale Funnel)
```bash
# Enable Tailscale Funnel operator (một lần)
sudo tailscale set --operator=$USER

# Start funnel
tailscale funnel --bg 5678

# Lấy HTTPS URL
tailscale funnel status
# → https://hostname.tailaecdd.ts.net
```
Update `docker-compose.yml`:
```yaml
environment:
  - WEBHOOK_URL=https://hostname.tailaecdd.ts.net/
```
Dùng `network_mode: host` để Docker container resolve Tailscale DNS.

### Cạm bẫy ❌
- Tailscale Funnel cần **bật từ Tailscale Admin Console** trước (online): https://login.tailscale.com/f/funnel
- Sau mỗi lần restart n8n, phải **re-activate workflow** vì Telegram webhook được re-register

---

## 6. n8n Credential ID Mismatch

### Vấn đề
Workflow JSON tham chiếu credential bằng `id` (e.g., `"telegram-elvin-bot"`). Sau khi import vào n8n mới, credential thực tế có ID khác.

### Giải pháp đã verify ✅
1. Lấy credential ID thực tế qua API:
```powershell
Invoke-RestMethod -Uri "http://n8n:5678/api/v1/credentials" -Headers @{"X-N8N-API-KEY"=$key}
```
2. Update tất cả nodes trong JSON với ID đúng trước khi import.

---

## 7. n8n API Key — Tên đúng

Trong n8n API header:
```
X-N8N-API-KEY: <your-api-key>
```
**Không phải** `Authorization: Bearer` hay `X-API-KEY`.

---

## Tham khảo
- [n8n Environment Variables](https://docs.n8n.io/hosting/configuration/environment-variables/)
- [n8n Code Node](https://docs.n8n.io/code/code-node/)
- [n8n REST API](https://docs.n8n.io/api/)
- [Tailscale Funnel](https://tailscale.com/kb/1223/funnel)
