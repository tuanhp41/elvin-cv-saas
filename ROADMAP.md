# PHASE 0 — Infrastructure & Governance Roadmap
# CV SaaS Project | Frozen: Tháng 4/2026

> **Trạng thái:** FROZEN — Không thêm/bớt cho đến khi Phase 0 hoàn thành  
> **Thời gian ước tính:** 2 tuần (1–2 tiếng/ngày)  
> **Mục tiêu:** Hạ tầng + Governance sẵn sàng trước khi viết 1 dòng app code  
> **Phase Gate:** SSH từ remote thành công + Dashchat bot phản hồi được

---

## WEEK 1 — Hardware & OS

### Day 1 — Boot & Install
```
[ ] Flash USB boot Ubuntu 22.04 LTS Server (Rufus đã có)
[ ] Boot vào PC nhà từ USB
[ ] Cài Ubuntu Server (chọn minimal install, không GUI)
[ ] Tạo user non-root, setup sudo
[ ] SSH key authentication (tắt password login)
```
**Validate:** `ssh tuanpc` từ laptop thành công

### Day 2 — GPU & Network
```
[ ] sudo apt update && sudo apt upgrade -y
[ ] Cài NVIDIA driver: sudo apt install nvidia-driver-535
[ ] Reboot → verify: nvidia-smi (thấy RTX3060)
[ ] Cài CUDA toolkit
[ ] Cài Tailscale: curl -fsSL https://tailscale.com/install.sh | sh
[ ] tailscale up → test ping từ laptop
```
**Validate:** `nvidia-smi` + `tailscale status` đều green

### Day 3 — Docker & Ollama
```
[ ] Cài Docker + Docker Compose:
    sudo apt install docker.io docker-compose-v2
    sudo usermod -aG docker $USER
[ ] Cài Ollama:
    curl -fsSL https://ollama.com/install.sh | sh
[ ] Pull model: ollama pull gemma3:12b
[ ] Test inference: ollama run gemma3:12b "Xin chào"
[ ] Cấu hình systemd: Ollama + Docker start on boot
```
**Validate:** Inference < 10 giây, model load tự động sau reboot

### Day 4 — n8n Setup
```
[ ] Tạo docker-compose.yml cho n8n:

version: '3.8'
services:
  n8n:
    image: n8nio/n8n
    restart: always
    ports:
      - "5678:5678"
    environment:
      - N8N_HOST=0.0.0.0
      - N8N_PORT=5678
      - N8N_PROTOCOL=http
      - WEBHOOK_URL=http://[TAILSCALE_IP]:5678/
    volumes:
      - n8n_data:/home/node/.n8n
      - /home/tuan/projects:/home/node/projects
volumes:
  n8n_data:

[ ] docker compose up -d
[ ] Truy cập n8n tại http://[TAILSCALE_IP]:5678
[ ] Tạo tài khoản n8n admin
[ ] Test workflow đơn giản: Schedule → Log
```
**Validate:** n8n accessible từ laptop qua Tailscale IP

### Day 5 — Telegram Bot Setup
```
[ ] Tạo Telegram Bot:
    Mở Telegram → BotFather → /newbot
    Đặt tên: CV SaaS Admin Bot
    Lưu API Token vào .env

[ ] Tạo Telegram Channel/Group riêng cho alerts
[ ] Lấy Chat ID của group
[ ] Test gửi tin nhắn qua curl:
    curl -X POST https://api.telegram.org/bot[TOKEN]/sendMessage \
    -d chat_id=[CHAT_ID] -d text="n8n connected"
```
**Validate:** Nhận được tin nhắn test trên Telegram

---

## WEEK 2 — Governance & Dashchat

### Day 6 — Git & Project Structure
```
[ ] Cài Git, tạo SSH key cho GitHub
[ ] Tạo GitHub repo: cv-saas (private)
[ ] Clone về PC: git clone git@github.com:[user]/cv-saas.git
[ ] Tạo cấu trúc thư mục chuẩn:

cv-saas/
├── .antigravity-rules      ← Tạo ngay (nội dung bên dưới)
├── SPEC.md                 ← Tạo ngay
├── CLAUDE.md               ← Tạo ngay
├── GEMINI.md               ← Tạo ngay
├── ARCHITECTURE.md         ← Tạo ngay
├── CURRENT_STATE.md        ← Tạo ngay
├── DECISIONS.md            ← Tạo ngay
├── LEARNINGS.md            ← Tạo ngay
├── EXPERIMENTS.md          ← Tạo ngay
├── ROADMAP.md              ← File này
├── RISK_LOG.md             ← Tạo ngay
├── src/
│   └── components/
│       ├── ui/
│       ├── features/
│       └── layout/
├── automation/
│   ├── n8n/
│   └── scripts/
└── wiki/
    ├── raw/
    └── compiled/

[ ] git add . && git commit -m "chore: init project structure + governance files"
[ ] git push origin main
```

### Day 7 — Governance Files Setup
```
[ ] Tạo .antigravity-rules (nội dung bên dưới)
[ ] Tạo ARCHITECTURE.md (nội dung bên dưới)
[ ] Tạo CURRENT_STATE.md (nội dung bên dưới)
[ ] Tạo CLAUDE.md với stack + rules cơ bản
[ ] Cài Node.js + npm cho Next.js sau này:
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install nodejs
[ ] npm init -y trong thư mục src/
[ ] Cài ESLint + pre-commit hooks:
    npm install -D eslint eslint-plugin-import husky lint-staged
    npx husky init
[ ] Tạo .eslintrc.json (nội dung bên dưới)
[ ] Cấu hình lint-staged trong package.json
[ ] git commit -m "chore: setup governance files + linting"
```

### Day 8-9 — n8n Dashchat Build
```
[ ] Bước 1: Import Telegram AI Agent template từ n8n library
    → Search "Telegram AI Agent" trong n8n templates
    → Import và customize

[ ] Bước 2: Tạo Telegram Bot Credentials trong n8n
    → Settings → Credentials → New → Telegram API
    → Paste token từ BotFather

[ ] Bước 3: Build workflow theo kiến trúc 3 nodes:
    Telegram Trigger → AI Agent → Telegram Send

[ ] Bước 4: Cấu hình AI Agent node:
    Model: Gemma API (Google AI Studio key)
    System Prompt: (xem bên dưới)
    Tools: read_current_state, log_learning

[ ] Bước 5: Test các commands:
    /status   → đọc CURRENT_STATE.md
    /done     → git diff → ghi LEARNINGS.md
    /help     → list commands

[ ] Bước 6: Build 19:00 daily kick-off workflow:
    Schedule 19:00 → Read CURRENT_STATE.md
    → Gemma format → Telegram send
```

### Day 10 — SSH từ Shanghai Test & Phase Gate
```
[ ] Mô phỏng kịch bản Shanghai:
    Dùng điện thoại (4G, không dùng Wifi nhà)
    SSH vào PC qua Tailscale IP
    Truy cập n8n qua browser trên 4G
    Nhắn tin Dashchat bot → nhận phản hồi

[ ] Nếu pass → Phase Gate 0 CLEARED
[ ] Ghi LEARNINGS.md entry đầu tiên
[ ] Ghi DECISIONS.md: "Chọn Tailscale vì..."
[ ] git tag v0.1.0-phase0-complete
```

---

## CONFIG FILES

### `.antigravity-rules`
```xml
<system_constraints>
  <rule>Before modifying or creating files, ALWAYS read
        ARCHITECTURE.md to strictly follow folder structures
        and data flow.</rule>
  <rule>At the beginning of every session, read
        CURRENT_STATE.md to establish context.</rule>
  <rule>At the end of every session, overwrite
        CURRENT_STATE.md with latest progress,
        maintaining exact format with new timestamp.</rule>
  <rule>Never create new UI components outside of
        src/components/ui,
        src/components/features,
        src/components/layout.</rule>
  <rule>Do not modify SPEC.md, DECISIONS.md, or
        LEARNINGS.md unless explicitly instructed
        by the user.</rule>
  <rule>Enforce strict linting: Prevent circular
        dependencies (eslint-plugin-import/no-cycle).
        </rule>
  <rule>Always check CURRENT_STATE.md for pending
        blockers before starting new tasks.</rule>
</system_constraints>
```

### `ARCHITECTURE.md` (starter)
```markdown
# ARCHITECTURE.md
# Source of truth cho folder structure — AI không được tạo ngoài đây

## Folder Structure (FROZEN)
src/
├── components/
│   ├── ui/          # shadcn + base: Button, Input, Badge
│   ├── features/    # CV form, CV preview, payment modal
│   └── layout/      # Header, Footer, PageWrapper
├── pages/           # Next.js routes
│   ├── index.jsx    # Landing
│   ├── create.jsx   # Tạo CV
│   └── api/         # API routes
├── lib/             # Clients — KHÔNG đổi tên file này
│   ├── gemma.js     # Gemma API client
│   ├── supabase.js  # Supabase client
│   └── payos.js     # PayOS client
└── wiki/            # LLM Wiki markdown

automation/
├── n8n/             # n8n workflow JSON exports
└── scripts/         # Python scripts

## Data Flow (1 chiều — không reverse)
User Input → pages/ → lib/gemma.js → CV Output
                   → lib/supabase.js → Database
                   → lib/payos.js → Payment

## Naming Conventions
Components: PascalCase (CVForm.jsx)
Files: kebab-case (cv-form.jsx nếu không phải component)
API routes: /api/[resource]/[action]
Wiki files: kebab-case.md

## Sacred Files (AI không được xóa hoặc rename)
lib/gemma.js, lib/supabase.js, lib/payos.js
SPEC.md, CLAUDE.md, DECISIONS.md, .antigravity-rules
```

### `CURRENT_STATE.md` (template)
```markdown
# CURRENT_STATE.md
# ⚠️ OVERWRITE ONLY — không append — chỉ có 1 snapshot mới nhất

## Snapshot
- **Timestamp:** YYYY-MM-DD HH:MM +07:00
- **Phase:** 0 | **Session:** #1
- **Branch:** main

## Đang làm dở
- File: [path]
- Việc: [mô tả]
- Trạng thái: [X% hoàn thành]

## Lỗi chưa xử lý
- [ ] [mô tả lỗi — file — dòng nếu có]

## Quyết định pending
- [ ] [cần quyết định gì trước khi tiếp tục]

## Task đầu tiên session tới
→ [1 việc cụ thể, không list dài]

## Context cho AI
[1-2 câu tóm tắt AI cần biết để không hỏi lại]
```

### `.eslintrc.json`
```json
{
  "plugins": ["import"],
  "rules": {
    "import/no-cycle": ["error", { "maxDepth": "∞" }],
    "import/order": ["warn", {
      "groups": ["builtin", "external", "internal"],
      "newlines-between": "always"
    }]
  }
}
```

### `package.json` (lint-staged section)
```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  },
  "scripts": {
    "prepare": "husky"
  }
}
```

---

## N8N DASHCHAT

### Kiến trúc workflow

```
[Telegram Trigger]
      ↓
[Switch Node] ── /status ──→ [Read File: CURRENT_STATE.md]
              ── /done ────→ [Execute Command: git diff]
              ── /metrics ─→ [HTTP Request: Supabase] (Phase 1+)
              ── default ──→ [AI Agent Node]
                                    ↓
                          [Telegram Send Message]
```

### System Prompt cho AI Agent Node
```
Bạn là AI quản trị dự án CV SaaS của Nguyễn Văn Tuấn.

Nguyên tắc:
- Chỉ trả lời súc tích, dùng emoji để dễ đọc trên mobile
- Dựa trên dữ liệu từ Tools, không bịa số liệu
- Trả lời bằng tiếng Việt, giữ technical terms bằng tiếng Anh
- Nếu không có data → nói thẳng "chưa có data"

Commands hỗ trợ:
/status  → đọc CURRENT_STATE.md
/done    → tóm tắt git diff → ghi LEARNINGS.md
/risk    → đọc RISK_LOG.md, highlight items màu đỏ
/help    → list commands này
```

### Daily 19:00 Kick-off (n8n Schedule Workflow)
```
Trigger: Cron 0 19 * * *
Node 1:  Read File → /home/tuan/projects/cv-saas/CURRENT_STATE.md
Node 2:  Read File → /home/tuan/projects/cv-saas/ROADMAP.md
Node 3:  Gemma API → Format thành kick-off message
Node 4:  Telegram Send → Chat ID của bạn

Output format:
🟢 KICK-OFF [DD/MM/YYYY] | Phase X | Session #N
━━━━━━━━━━━━━━━━━━━━━━

🎯 TASK TỐI NAY:
→ [từ CURRENT_STATE.md — Task đầu tiên]

🐛 BLOCKER ĐANG CHỜ:
• [từ CURRENT_STATE.md — Lỗi chưa xử lý]

📍 PHASE PROGRESS:
[X/10 items Phase 0 checklist]

Gõ /done khi xong để log learning tự động.
```

---

## WIREFRAME-TO-CODE WORKFLOW

### Công thức prompt chuẩn (dùng cho mọi CV template)

```
[Đính kèm ảnh wireframe/screenshot]

Phân tích wireframe này và tạo Next.js component.

Ràng buộc bắt buộc:
1. Chỉ dùng TailwindCSS — không inline style, không CSS module
2. Đặt file đúng theo ARCHITECTURE.md:
   - Base UI → src/components/ui/
   - CV feature → src/components/features/
3. Không thêm elements ngoài wireframe
4. Export default component, tên PascalCase
5. Trả về toàn bộ code trong 1 block, không giải thích

Component name: [tên bạn muốn]
```

### Nguồn wireframe Phase 0
```
Excalidraw (free, web-based): excalidraw.com
→ Vẽ layout CV template Vi/En/Zh
→ Export PNG → đưa vào Antigravity

Tham khảo có thể screenshot:
→ TopCV.vn templates
→ WonderCV.com (TQ format)
→ CV cá nhân của bạn tại tuanhp41.github.io/my-cv/
```

---

## PHASE GATE CHECKLIST

Tất cả phải GREEN trước khi bắt đầu Phase 1:

```
INFRASTRUCTURE:
[ ] SSH từ 4G mobile vào PC nhà qua Tailscale: OK
[ ] nvidia-smi: RTX3060 detected
[ ] Ollama inference Gemma 4 12B: < 10 giây
[ ] n8n accessible từ Tailscale IP: OK
[ ] Docker auto-start sau reboot: OK

GOVERNANCE:
[ ] .antigravity-rules tại root: OK
[ ] ARCHITECTURE.md tạo xong: OK
[ ] CURRENT_STATE.md template ready: OK
[ ] ESLint import/no-cycle: configured
[ ] husky pre-commit hook: active
[ ] git commit đầu tiên: pushed

DASHCHAT:
[ ] Telegram bot nhận được /status: OK
[ ] 19:00 kick-off gửi được Telegram: OK
[ ] /done command tạo được LEARNINGS.md entry: OK

LEARNING:
[ ] LEARNINGS.md có entry đầu tiên: OK
[ ] DECISIONS.md có ≥ 1 entry: OK

→ Khi tất cả tick xong: git tag v0.1.0-phase0-complete
→ Bắt đầu Phase 1
```

---

## KPI PHASE 0

> Không phải revenue — là learning + system readiness

| KPI | Target | Đo bằng |
|---|---|---|
| Infrastructure uptime | 100% trong 10 ngày | n8n health check |
| Governance files created | 10/10 | git ls-files |
| LEARNINGS.md entries | ≥ 10 | wc -l |
| DECISIONS.md entries | ≥ 5 | wc -l |
| Dashchat response time | < 5 giây | manual test |
| Pre-commit hooks blocked bad commit | ≥ 1 lần | git log |

---

*Phase 0 Roadmap — Frozen tháng 4/2026*
*Mọi thay đổi phải qua Change Control Process trong Master Plan v3*
