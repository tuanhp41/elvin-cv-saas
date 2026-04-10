# CV SaaS — Master Plan v3.0
# Tài liệu khởi động dự án (Project Initiation Document)

---

## 🔴 HƯỚNG DẪN CHO AI TƯ VẤN

> Đây là master plan của dự án CV SaaS. Nếu bạn là AI được hỏi về dự án này, hãy đọc toàn bộ tài liệu này trước khi tư vấn bất kỳ điều gì.

**Nguyên tắc tư vấn bắt buộc:**
1. **Học trước, revenue sau** — Mọi quyết định kỹ thuật ưu tiên giá trị học tập trước khi hỏi "có giúp kiếm tiền không?"
2. **Không đề xuất thay đổi stack Tier 1** nếu chưa có lý do học tập rõ ràng
3. **Luôn hỏi "học được gì?"** trước khi propose thêm tính năng
4. **Bám vào constraint phần cứng** — i7-10, 16GB RAM, RTX3060 12GB là cố định
5. **DECISIONS.md là nguồn sự thật** — đọc trước khi đề xuất thứ đã được quyết định
6. **Đây là dự án solo, 1–2 tiếng/ngày** — đừng đề xuất giải pháp cần team hay full-time

**Khi bị hỏi về tính năng mới:** Trước tiên hỏi "Nằm trong phase nào? Học được gì?" — nếu không trả lời được thì thuộc backlog, không làm ngay.

---

## PHẦN A — PROJECT CHARTER (PMP: Initiating Process Group)

### A.1 Project Purpose & Justification

| Trường | Nội dung |
|---|---|
| **Tên dự án** | CV SaaS — AI-Powered CV Builder |
| **Project Sponsor** | Nguyễn Văn Tuấn (self-sponsored) |
| **Project Manager** | Nguyễn Văn Tuấn |
| **Ngày khởi động** | Tháng 4/2026 |
| **Mục tiêu cốt lõi** | Học AI Engineering toàn diện thông qua dự án thực tế có sản phẩm chạy được |
| **Mục tiêu thứ yếu** | Tạo ra 2–3tr VNĐ/tháng để bù chi phí học và duy trì động lực |
| **Business Case** | Thị trường CV tiếng Trung cho lao động VN làm tại công ty FDI TQ chưa có sản phẩm chuyên biệt. Niche đủ nhỏ để 1 người làm, đủ thật để học được production AI engineering. |

### A.2 High-Level Scope

**Trong scope (In Scope):**
- Web app tạo CV hỗ trợ Vi/En/Zh
- AI rewrite CV qua Gemma 4 (API + local fallback)
- Template HTML với watermark — unlock sau thanh toán
- Hệ thống tự động học (LLM Wiki, n8n pipelines)
- Self-hosted infrastructure trên PC nhà (Ubuntu + RTX3060)
- Learning documentation system (DECISIONS.md, LEARNINGS.md, EXPERIMENTS.md)

**Ngoài scope (Out of Scope):**
- PDF export (dùng HTML thuần)
- Mobile app native
- Job board integration
- Multi-user team features
- Bất kỳ thứ gì yêu cầu >2 tiếng/ngày để maintain

### A.3 High-Level Milestones

| Milestone | Phase | Điều kiện hoàn thành |
|---|---|---|
| M0 — Infrastructure Ready | Phase 0 | SSH từ Shanghai vào PC nhà thành công |
| M1 — MVP Live | Phase 1 | 5 người trả tiền thật |
| M2 — Automation Active | Phase 2 | n8n chạy 3+ workflows 7 ngày không lỗi |
| M3 — Multi-Agent Working | Phase 3 | Router → 2 specialist agents hoạt động |
| M4 — Career Pivot Ready | Phase 4 | Portfolio đủ để phỏng vấn AI Engineer |

### A.4 High-Level Budget (PMP: Cost Management)

| Hạng mục | Chi phí ước tính | Ghi chú |
|---|---|---|
| Điện cho PC server | ~90k VNĐ/tháng | 200W × 8h × 30 ngày |
| Claude Pro subscription | ~500k VNĐ/tháng | Đã có, dùng cho architecture |
| Antigravity Ultra | Đã có | Google One subscription |
| Google AI Studio | Free | 1000 req/ngày Gemma 4 |
| Supabase | Free tier | Đến 500MB / 50k rows |
| Vercel | Free tier | Đủ cho MVP |
| Domain (optional) | ~300k/năm | Phase 1+ |
| **Tổng tháng đầu** | **~700k VNĐ** | Chủ yếu là đã có |

**Cost Baseline:** ~700k VNĐ/tháng  
**Break-even:** 14 users/tháng × 50k = 700k  
**Revenue Target:** 50–60 users/tháng = 2.5–3tr VNĐ

### A.5 Project Assumptions & Constraints

**Assumptions (Giả định):**
- Gemma 4 API free tier của Google duy trì ít nhất 6 tháng
- RTX3060 hoạt động ổn định không cần thay thế
- Bạn có 1–2 tiếng/ngày đều đặn kể cả khi ở Shanghai
- Tailscale duy trì kết nối ổn định VN ↔ Shanghai
- PayOS tiếp tục hỗ trợ thanh toán cá nhân

**Constraints (Ràng buộc cứng):**
- Phần cứng: i7-10, 16GB RAM, RTX3060 12GB — không upgrade
- Thời gian: tối đa 2 tiếng/ngày
- Ngân sách: tối đa 1tr VNĐ/tháng operating cost
- Solo project: không thuê người, không có team

### A.6 Project Authorization

Tài liệu này được approve bởi Project Sponsor (Nguyễn Văn Tuấn) ngày tháng 4/2026 và là nguồn sự thật duy nhất cho toàn bộ dự án.

---

## PHẦN B — STAKEHOLDER MANAGEMENT (PMP: Stakeholder Register)

### B.1 Stakeholder Register

| Stakeholder | Loại | Kỳ vọng | Mức quan tâm | Chiến lược |
|---|---|---|---|---|
| **Bản thân (PM/Dev)** | Internal | Học AI Engineering thực chiến, career pivot | Cao/Cao | Manage closely |
| **Bản thân tương lai (6 tháng sau)** | Internal | Portfolio đủ mạnh để phỏng vấn | Cao/Trung | Keep satisfied |
| **Paying users** | External | CV chất lượng, giá hợp lý | Thấp/Cao | Keep informed |
| **Potential employers** | External | Chứng minh AI engineering skill | Thấp/Cao | Monitor |
| **Google AI Studio** | External (vendor) | API usage trong free tier | Thấp/Cao | Monitor quota |
| **Supabase** | External (vendor) | Không exceed free tier | Thấp/Cao | Monitor usage |
| **PayOS** | External (vendor) | Giao dịch hợp lệ | Thấp/Cao | Manage |

### B.2 Communication Management Plan

| Đối tượng | Thông tin gì | Kênh | Tần suất | Người thực hiện |
|---|---|---|---|---|
| Bản thân | Daily learning report | Telegram bot | Hằng ngày 08:00 | n8n automation |
| Bản thân | Weekly review | Telegram bot | Thứ Hai 08:00 | n8n automation |
| Bản thân | System health alert | Telegram bot | Realtime khi có vấn đề | n8n automation |
| Users | Thông báo tính năng mới | Email (Supabase) | Khi có release | Manual |
| Users | Xác nhận thanh toán | Email auto | Ngay sau payment | PayOS + n8n |

---

## PHẦN C — SCOPE MANAGEMENT (PMP: Scope Baseline)

### C.1 Work Breakdown Structure (WBS)

```
CV SaaS Project
│
├── 1.0 INFRASTRUCTURE (Phase 0)
│   ├── 1.1 Ubuntu Server Setup
│   │   ├── 1.1.1 Cài Ubuntu 22.04 LTS Server
│   │   ├── 1.1.2 Driver NVIDIA + CUDA
│   │   └── 1.1.3 SSH hardening
│   ├── 1.2 Container Stack
│   │   ├── 1.2.1 Docker + Compose
│   │   ├── 1.2.2 Ollama + Gemma 4 12B
│   │   └── 1.2.3 n8n
│   └── 1.3 Remote Access
│       ├── 1.3.1 Tailscale setup
│       └── 1.3.2 VibeTunnel (optional)
│
├── 2.0 CV SAAS APPLICATION (Phase 1)
│   ├── 2.1 Frontend
│   │   ├── 2.1.1 Landing page
│   │   ├── 2.1.2 CV form (Vi/En/Zh)
│   │   ├── 2.1.3 Template picker (3 templates)
│   │   └── 2.1.4 CV preview + watermark
│   ├── 2.2 Backend
│   │   ├── 2.2.1 Supabase schema + RLS
│   │   ├── 2.2.2 Auth (email/password)
│   │   └── 2.2.3 API routes (Next.js)
│   ├── 2.3 AI Integration
│   │   ├── 2.3.1 Gemma API call
│   │   ├── 2.3.2 Local fallback router
│   │   └── 2.3.3 Prompt engineering CV
│   └── 2.4 Payment
│       ├── 2.4.1 PayOS integration
│       └── 2.4.2 Webhook + unlock logic
│
├── 3.0 AUTOMATION LAYER (Phase 2)
│   ├── 3.1 n8n Workflows
│   │   ├── 3.1.1 Daily JD crawler
│   │   ├── 3.1.2 Wiki compiler trigger
│   │   ├── 3.1.3 Marketing content gen
│   │   ├── 3.1.4 Daily report → Telegram
│   │   └── 3.1.5 System health monitor
│   ├── 3.2 Python Scripts
│   │   ├── 3.2.1 crawl4ai scraper
│   │   ├── 3.2.2 compile_wiki.py
│   │   └── 3.2.3 upgrade_checker.py
│   └── 3.3 LLM Wiki
│       ├── 3.3.1 Wiki structure setup
│       ├── 3.3.2 Initial content (50 articles)
│       └── 3.3.3 Auto-compile pipeline
│
├── 4.0 MULTI-AGENT SYSTEM (Phase 3)
│   ├── 4.1 Agent Router
│   ├── 4.2 Specialist Agents (Writer, Critic, Translator)
│   ├── 4.3 MCP Servers
│   └── 4.4 Agent Evaluation Framework
│
└── 5.0 PROJECT MANAGEMENT (Continuous)
    ├── 5.1 SPEC.md maintenance
    ├── 5.2 DECISIONS.md logging
    ├── 5.3 LEARNINGS.md daily
    ├── 5.4 EXPERIMENTS.md
    └── 5.5 Risk monitoring
```

### C.2 Scope Change Control Process

Bất kỳ thay đổi nào với scope phải qua quy trình sau:

```
1. Ghi vào DECISIONS.md: "Change Request: [mô tả]"
2. Trả lời 3 câu hỏi:
   a. Học được gì thêm? (nếu không học được gì → từ chối)
   b. Mất bao nhiêu thời gian? (>4 tiếng → defer sang phase sau)
   c. Ảnh hưởng đến WBS item nào? (phải update WBS)
3. Nếu approve → cập nhật SPEC.md + ROADMAP.md
4. Nếu từ chối → ghi vào Backlog, không xóa
```

**Change Control Board:** Chỉ có 1 người — bản thân. Nhưng phải "ngủ một đêm" trước khi approve thay đổi lớn.

---

## PHẦN D — SCHEDULE MANAGEMENT (PMP: Schedule Baseline)

### D.1 Phase Overview

```
Phase 0 — Infrastructure    Tuần 1–2      (sau khi về từ Shanghai)
Phase 1 — MVP               Tuần 3–6      (~1 tháng)
Phase 2 — Automation        Tháng 2–3     (~2 tháng)
Phase 3 — Multi-Agent       Tháng 4–6     (~3 tháng)
Phase 4 — Frontier Skills   Tháng 7+      (ongoing)
```

### D.2 Phase 0 — Infrastructure (Chi tiết)

| WBS | Task | Effort | Dependency | Done? |
|---|---|---|---|---|
| 1.1.1 | Tạo USB boot Ubuntu | 30 phút | — | ⬜ |
| 1.1.1 | Cài Ubuntu 22.04 Server | 1 tiếng | USB boot | ⬜ |
| 1.1.2 | Cài NVIDIA driver 535 | 30 phút | Ubuntu | ⬜ |
| 1.1.2 | Test nvidia-smi | 15 phút | Driver | ⬜ |
| 1.2.1 | Cài Docker + Compose | 30 phút | Ubuntu | ⬜ |
| 1.2.2 | Cài Ollama | 15 phút | Docker | ⬜ |
| 1.2.2 | Pull Gemma 4 12B | 30 phút (download) | Ollama | ⬜ |
| 1.2.3 | Cài n8n qua Docker | 30 phút | Docker | ⬜ |
| 1.3.1 | Setup Tailscale | 15 phút | Ubuntu | ⬜ |
| 1.3.1 | Test SSH từ laptop | 15 phút | Tailscale | ⬜ |

**Phase Gate 0:** SSH thành công → ghi vào LEARNINGS.md → bắt đầu Phase 1

### D.3 Schedule Reserve

Mỗi phase thêm 30% buffer cho học thêm, debug, và thực tế bao giờ cũng chậm hơn ước tính.

---

## PHẦN E — QUALITY MANAGEMENT (PMP: Quality Management Plan)

### E.1 Quality Objectives

| Đối tượng | Metric | Ngưỡng chấp nhận | Cách đo |
|---|---|---|---|
| CV output quality | User chỉnh sửa sau khi AI tạo | < 30% câu bị sửa | Log edit history |
| AI response time | Thời gian từ submit → CV hiển thị | < 10 giây | Server-side timing |
| System uptime | PC nhà online | > 95%/tháng | n8n health check |
| API quota usage | Không vượt free tier | < 80% quota/ngày | Daily check |
| Code quality | Không có critical security issues | 0 critical | npm audit |
| Learning quality | Có LEARNINGS.md entry | Mỗi ngày build | Manual check |

### E.2 Quality Control Checklist

**Trước mỗi deployment:**
- [ ] npm audit — không có critical vulnerabilities
- [ ] Supabase RLS test — user A không xem được data user B
- [ ] PayOS webhook test với sandbox
- [ ] AI output sanity check — CV không chứa hallucination rõ ràng
- [ ] Mobile responsive test

**Hàng tuần:**
- [ ] CV quality score trung bình có tăng không?
- [ ] Có LEARNINGS.md entry đủ không?
- [ ] EXPERIMENTS.md có kết quả mới không?
- [ ] Wiki có articles mới không?

### E.3 AI Output Quality Framework

Mỗi CV do AI tạo ra được đánh giá theo rubric:

```
1. Completeness (0–3đ): Đầy đủ các mục cần thiết
2. Language quality (0–3đ): Ngôn ngữ tự nhiên, không robotic
3. ATS keywords (0–2đ): Có keywords phù hợp ngành
4. Format compliance (0–2đ): Đúng format chuẩn Vi/En/Zh

Total: 10đ — Ngưỡng acceptable: ≥ 7đ
```

Nếu <7đ → prompt cần được cải thiện → ghi vào EXPERIMENTS.md.

---

## PHẦN F — RISK MANAGEMENT (PMP: Risk Register)

### F.1 Risk Register

| ID | Rủi ro | Xác suất | Tác động | Mức độ | Owner | Chiến lược | Response |
|---|---|---|---|---|---|---|---|
| R01 | Gemma API free tier bị cắt | Trung bình | Cao | 🟠 | Tuấn | Mitigate | Auto-fallback RTX3060 local, test fallback hàng tuần |
| R02 | PC nhà mất điện/offline | Trung bình | Trung bình | 🟡 | Tuấn | Accept | Vercel frontend vẫn serve, chỉ mất AI local |
| R03 | User data leak | Thấp | Rất cao | 🟠 | Tuấn | Mitigate | Supabase RLS + encrypt at rest, audit hàng tháng |
| R04 | PayOS webhook fail | Thấp | Cao | 🟡 | Tuấn | Mitigate | Idempotency key + retry + manual reconcile |
| R05 | Scope creep / feature bloat | Cao | Trung bình | 🟠 | Tuấn | Avoid | Change Control Process nghiêm túc (Mục C.2) |
| R06 | Burnout / mất động lực | Trung bình | Rất cao | 🔴 | Tuấn | Mitigate | Revenue metric làm gamification, celebrate small wins |
| R07 | Học công nghệ lỗi thời | Thấp | Cao | 🟡 | Tuấn | Monitor | Follow Karpathy + GitHub Trending hàng tuần |
| R08 | RTX3060 hỏng | Rất thấp | Cao | 🟡 | Tuấn | Accept | Cloud API backup sẵn, không phụ thuộc local 100% |
| R09 | Google AI ToS thay đổi | Thấp | Cao | 🟡 | Tuấn | Monitor | Theo dõi release notes, có Anannas gateway làm buffer |
| R10 | Tailscale outage | Rất thấp | Cao | 🟢 | Tuấn | Accept | WireGuard config backup, chấp nhận downtime ngắn |

### F.2 Risk Response Triggers

| Rủi ro | Trigger | Action ngay lập tức |
|---|---|---|
| R01 | Quota < 20% | n8n tự switch sang local, alert Telegram |
| R02 | Health check fail 3 lần liên tiếp | Alert Telegram: "PC offline" |
| R03 | Unusual query pattern trong Supabase logs | Audit ngay, tạm disable nếu cần |
| R05 | DECISIONS.md có >3 "unapproved changes" trong 1 tuần | Review và prune backlog |
| R06 | Không có LEARNINGS.md entry 3 ngày liên tiếp | Đơn giản hóa task, giảm scope |

---

## PHẦN G — LEARNING & DEVELOPMENT (Ngoài PMP — AI Engineering Specific)

> *Phần này không có trong PMP chuẩn nhưng là cốt lõi của dự án này*

### G.1 Learning Roadmap

#### Phase 0 — Infrastructure & DevOps AI
**Domain học:** Linux, Docker, GPU setup, Remote dev workflow  
**Kỹ năng đích:** Setup production AI environment từ zero  
**Portfolio artifact:** Script tự động setup toàn bộ stack

#### Phase 1 — Full-Stack AI Integration
**Domain học:** Prompt engineering, LLM API, Auth, Payment  
**Kỹ năng đích:** Build AI-powered web app end-to-end  
**Portfolio artifact:** Live product có paying users

#### Phase 2 — AI Automation & Orchestration
**Domain học:** n8n, Python AI scripting, LLM Wiki, MCP  
**Kỹ năng đích:** Design self-running AI systems  
**Portfolio artifact:** Hệ thống tự vận hành 7 ngày không can thiệp

#### Phase 3 — Multi-Agent Systems
**Domain học:** Agent routing, evaluation, fine-tuning basics  
**Kỹ năng đích:** Orchestrate multiple specialized AI agents  
**Portfolio artifact:** Multi-agent CV system với quality evaluation

#### Phase 4 — Frontier AI Engineering
**Domain học:** Agentic engineering, observability, spec-driven dev  
**Kỹ năng đích:** Production-grade AI system design  
**Portfolio artifact:** DECISIONS.md với 50+ documented decisions

### G.2 Knowledge Management System

**File structure:**
```
project-root/
├── SPEC.md           # Project scope, stack, out-of-scope
├── CLAUDE.md         # Rules cho AI coding sessions
├── GEMINI.md         # Rules cho Gemini CLI sessions
├── ROADMAP.md        # WBS checklist — tick khi xong
├── DECISIONS.md      # Mọi quyết định kỹ thuật + rationale
├── LEARNINGS.md      # Daily learning journal
├── EXPERIMENTS.md    # Lab notebook — hypothesis + results
└── RISK_LOG.md       # Cập nhật risk register khi có thay đổi
```

**DECISIONS.md format:**
```markdown
## [DATE] [ID] Chọn X thay vì Y
**Context:** Tại sao phải quyết định
**Học được:** Sự khác biệt thực sự giữa X và Y
**Quyết định:** Chọn X
**Rationale:** [lý do kỹ thuật cụ thể]
**Trade-off chấp nhận:** Mất gì, được gì
**PMP Note:** Thuộc Knowledge Area nào (nếu có)
**Revisit khi:** Điều kiện nào thì xem xét lại
```

**EXPERIMENTS.md format:**
```markdown
## [EXP-ID] Tên experiment
**Hypothesis:** Giả thuyết cần kiểm chứng
**Setup:** Cách tiến hành
**Metric:** Đo bằng gì
**Kết quả:** Số liệu thực tế
**Kết luận:** Hypothesis đúng/sai — tại sao
**Action:** Integrate / Discard / Investigate more
**Học được:** 1 câu tóm tắt
```

### G.3 Technology Governance

**Tier system — không thay đổi mà không có DECISIONS.md entry:**

```
Tier 1 — PRODUCTION (stable):
├── Antigravity Ultra (IDE)
├── Gemma 4 API / Local (AI)
├── Supabase (DB + Auth)
├── n8n (Automation)
├── Next.js (Frontend)
├── Vercel (Hosting)
└── Tailscale (Networking)

Tier 2 — EXPERIMENTING (feature branch):
├── Gemini CLI
├── Kiro / Spec Kit
├── OpenClaw skills
└── Anannas LLM gateway

Tier 3 — WATCHING (không implement):
├── VibeTunnel
├── A2A protocol
└── LoRA fine-tuning

Tier 4 — RADAR (update hàng tuần):
└── GitHub Trending + Karpathy posts
```

**Quy trình nhặt công nghệ mới (Change Control cho tech):**
```
Phát hiện → Ghi EXPERIMENTS.md → Time-box 2 tiếng POC
→ Kết quả → Integrate (Tier 2) hoặc Discard → DECISIONS.md entry
```

---

## PHẦN H — HARDWARE OPTIMIZATION (Ngoài PMP — AI Engineering Specific)

> *Resource constraint management áp dụng vào AI hardware*

### H.1 Resource Baseline

| Resource | Spec | Constraint | Strategy |
|---|---|---|---|
| CPU | i7-10900K (10C/20T) | Không upgrade | Async I/O, tránh CPU-bound inference |
| RAM | 16GB DDR4 | Không upgrade | Docker memory limits, swap nếu cần |
| GPU VRAM | RTX3060 12GB | Không upgrade | Quantization (Q4_K_M default) |
| Storage | 477GB SSD | Có thể thêm HDD | Models trên SSD, data trên HDD |
| Network | ISP VN ~100Mbps | Không kiểm soát | Tailscale + retry logic |

### H.2 VRAM Allocation Plan

```
RTX3060 12GB budget:
├── Gemma 4 12B Q4_K_M:  ~7.2GB  (primary inference)
├── Context buffer:       ~2.0GB
├── OS/Driver overhead:   ~0.8GB
└── Free buffer:          ~2.0GB  (embedding model nhỏ nếu cần)

Kịch bản Gemma 4 27B (research only):
└── Q3_K_M: ~11.5GB — chạy được nhưng không còn buffer
    → Chỉ dùng khi experiment, không dùng production
```

### H.3 Intelligent Model Routing

```
Decision tree:
Context > 8000 tokens    → Gemma API (cloud)
Task = cv_rewrite        → Gemma local 12B
Task = market_analysis   → Gemma API
API quota < 20%          → Auto-switch local
Local inference > 15s    → Alert + fallback API
```

### H.4 Cost Baseline (chi tiết)

```
Điện/tháng:
├── PC idle 16h:    80W × 16h × 30 = 38.4 kWh
├── PC active 8h:   200W × 8h × 30 = 48 kWh
└── Total: ~86 kWh × 3.5k = ~300k VNĐ/tháng

API costs (zero nếu trong free tier):
├── Gemma 4 32B: FREE (1000 req/day)
├── Supabase: FREE (<500MB)
└── Vercel: FREE (<100GB bandwidth)

Total operating cost: ~700k VNĐ/tháng (bao gồm Claude Pro)
```

---

## PHẦN I — PROCUREMENT MANAGEMENT (PMP: Make-or-Buy Analysis)

### I.1 Vendor Assessment

| Vendor/Service | Make or Buy | Rationale | Risk | Fallback |
|---|---|---|---|---|
| Gemma 4 API | Buy (free) | Không tự train model được | ToS change | Local inference |
| Supabase | Buy (free) | Auth + DB tự build mất 2 tuần | Free tier limit | Self-hosted Supabase |
| PayOS | Buy | Tích hợp thanh toán VN phức tạp | API deprecation | Chuyển khoản thủ công |
| n8n | Buy (OSS) | Tự build automation từ đầu không worth it | Licence change | Apache 2.0 — an toàn |
| Vercel | Buy (free) | CI/CD + hosting sẵn | Cold start | Railway / Render |
| Tailscale | Buy (free tier) | WireGuard phức tạp hơn | Service down | WireGuard raw |
| LLM Wiki | Make | Học được từ việc tự build | Không có vendor risk | N/A |
| MCP Servers | Make | Mục đích là học | Không có vendor risk | N/A |

### I.2 Vendor Monitoring Triggers

| Vendor | Alert khi | Action |
|---|---|---|
| Google AI Studio | Usage > 80% quota/ngày | Switch local |
| Supabase | DB > 400MB hoặc rows > 40k | Export + plan upgrade |
| PayOS | Webhook failure rate > 5% | Debug + manual reconcile |
| Tailscale | Disconnect > 10 phút | Check ISP, WireGuard fallback |

---

## PHẦN J — INTEGRATION MANAGEMENT (PMP: Project Management Plan Integration)

### J.1 System Architecture (Integrated View)

```
┌────────────────────────────────────────────────────────┐
│  GOVERNANCE LAYER (PMP: Project Management Plan)        │
│  SPEC.md · DECISIONS.md · LEARNINGS.md · EXPERIMENTS   │
│  Risk Register · WBS · Quality Plan · Comms Plan       │
└──────────────────────────┬─────────────────────────────┘
                           │ governs
┌──────────────────────────▼─────────────────────────────┐
│  APPLICATION LAYER (Deliverable)                        │
│  Next.js · Supabase · PayOS · Vercel                   │
│  Quality gate: npm audit + RLS test + mobile check     │
└──────────────────────────┬─────────────────────────────┘
                           │ powered by
┌──────────────────────────▼─────────────────────────────┐
│  AI LAYER (Core Competency)                             │
│  Gemma 4 API → Router → Local RTX3060                  │
│  Quality gate: CV score ≥ 7/10                         │
└──────────────────────────┬─────────────────────────────┘
                           │ fed by
┌──────────────────────────▼─────────────────────────────┐
│  AUTOMATION LAYER (Self-Learning System)                │
│  n8n · Python · Crawl4AI · LLM Wiki                   │
│  Quality gate: 7 ngày không lỗi liên tiếp             │
└──────────────────────────┬─────────────────────────────┘
                           │ runs on
┌──────────────────────────▼─────────────────────────────┐
│  INFRASTRUCTURE LAYER (Constrained Resource)            │
│  Ubuntu 22.04 · Docker · Ollama · Tailscale            │
│  i7-10 · 16GB RAM · RTX3060 12GB                      │
│  Quality gate: uptime > 95%, VRAM < 90%               │
└────────────────────────────────────────────────────────┘
```

### J.2 Phase Gate Criteria (Integrated)

**Gate 0 → Phase 1:**
- [ ] SSH từ remote vào PC nhà thành công
- [ ] nvidia-smi hiển thị RTX3060
- [ ] Ollama chạy Gemma 4 12B, inference < 10 giây
- [ ] n8n accessible tại localhost:5678
- [ ] Ghi LEARNINGS.md entry đầu tiên

**Gate 1 → Phase 2:**
- [ ] Web app live trên Vercel
- [ ] 5 người đã trả tiền thật (validate willingness to pay)
- [ ] CV AI output đạt ≥ 7/10 trung bình
- [ ] 0 critical security vulnerabilities
- [ ] DECISIONS.md có ≥ 10 entries

**Gate 2 → Phase 3:**
- [ ] n8n chạy ổn định 7 ngày không lỗi
- [ ] Wiki có ≥ 100 articles tự biên soạn
- [ ] Daily report Telegram hoạt động
- [ ] Revenue ≥ 1tr/tháng (validate product-market fit nhỏ)
- [ ] EXPERIMENTS.md có ≥ 5 completed experiments

**Gate 3 → Phase 4:**
- [ ] Multi-agent system hoạt động (2+ specialized agents)
- [ ] MCP server tự build ít nhất 1 cái
- [ ] DECISIONS.md có ≥ 30 entries
- [ ] Portfolio đủ để viết vào CV xin việc AI Engineer

---

## PHẦN K — DAILY & WEEKLY REPORTING (PMP: Work Performance Reports)

### K.1 Daily Learning Report (08:00 — n8n tự gửi Telegram)

```
🧠 LEARNING REPORT [DD/MM/YYYY] | Phase X
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 LEARNED TODAY
├── Concept: [tên concept]
├── Implemented: [code/config gì]
├── Result: [hoạt động như thế nào]
└── Logged: LEARNINGS.md ✓

🧪 ACTIVE EXPERIMENT
├── [EXP-ID]: [tên]
├── Status: [running/pending result]
└── Next action: [gì]

⚙️ SYSTEM HEALTH (PMP: Work Performance Data)
├── Gemma API: X/1000 req (X% quota)
├── Local GPU: X req, avg Xs response
├── Wiki: X articles total (+X mới)
├── n8n: X workflows OK / X failed
└── Uptime: X%

🎯 QUALITY METRICS
├── CV score avg (7 ngày): X/10
└── User edits ratio: X%

💰 PRODUCT (secondary)
├── New users: X | Paying: X
└── Revenue hôm nay: X VNĐ

⚠️ RISKS & ISSUES
└── [Nếu có — link với Risk Register ID]

🔬 TECH RADAR UPDATE
└── [Tool/paper mới nếu có]

🎯 TOMORROW FOCUS
└── [1 learning objective cụ thể]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### K.2 Weekly Review Report (Thứ Hai 08:00)

```
📊 WEEKLY REVIEW — Tuần X | Phase X
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LEARNING PROGRESS (PMP: Lessons Learned)
├── Skills gained: [list]
├── Experiments completed: [EXP-IDs]
├── LEARNINGS.md entries: X/7 ngày
└── DECISIONS.md entries mới: X

SCHEDULE PERFORMANCE (PMP: Schedule Variance)
├── WBS items completed: X/X planned
├── Phase Gate progress: X%
└── Blockers: [nếu có]

QUALITY PERFORMANCE (PMP: Quality Metrics)
├── CV score avg: X/10 (vs tuần trước: X)
├── System uptime: X%
└── Security issues: X critical / X minor

RISK STATUS (PMP: Risk Review)
├── Risks triggered: [IDs nếu có]
├── New risks identified: [nếu có]
└── Risk response effectiveness: [đánh giá]

COST PERFORMANCE (PMP: Cost Variance)
├── API usage vs budget: X% quota dùng
├── Electricity: ước ~Xk VNĐ tuần này
└── Revenue: X VNĐ (target/tháng: 2.5tr)

TECHNOLOGY (Ngoài PMP)
├── Tier 2 experiments: [status]
├── Best technology finding: [gì]
└── Radar updates: [tools mới nếu có]

NEXT WEEK PLAN
├── Learning focus: [1 domain]
├── WBS items target: [list]
└── Experiments to start: [EXP-ID nếu có]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## PHẦN L — CAREER DEVELOPMENT (Ngoài PMP — Mục tiêu dài hạn)

### L.1 Career Transition Map

```
Hiện tại (2026):          IT Professional 9 năm
                          Network, Sysadmin, MES/ERP, Mendix
                               │
                               ▼ Dự án này (6–12 tháng)
Near-term:                AI Integration Specialist
                          Low-code + AI Developer
                          AI Automation Engineer
                               │
                               ▼ (1–2 năm)
Mid-term:                 AI Engineer (startup VN/SG)
                          ML Engineer (thêm Python ML)
                               │
                               ▼ (2+ năm)
Long-term:                Senior AI Engineer
                          AI Architect
```

### L.2 Portfolio Artifacts (Living Document)

| Artifact | Target | Status | PMP Analogy |
|---|---|---|---|
| GitHub repo (public) | Phase 1 done | ⬜ | Project deliverable |
| DECISIONS.md | 50+ entries | 0/50 | Decision Log |
| EXPERIMENTS.md | 20+ completed | 0/20 | Lessons Learned |
| LEARNINGS.md | 180+ entries (6 tháng) | 0/180 | Project Journal |
| Live product | Paying users | ⬜ | Product acceptance |
| Blog/writeup | 3+ technical posts | 0/3 | Stakeholder report |

### L.3 Interview Preparation Script

```
"Kinh nghiệm AI của bạn?"

Trả lời: "Tôi tự build AI-powered CV SaaS từ đầu trong 6 tháng.
Hệ thống bao gồm:

Technical:
- Multi-model routing: Gemma 4 API → local RTX3060 fallback
- Self-maintaining LLM Wiki (Karpathy pattern) thay vì RAG
- MCP servers tự build để connect AI với tools
- n8n pipelines tự vận hành không cần can thiệp

Process (PMP-aligned):
- DECISIONS.md với 50+ technical decisions có đầy đủ rationale
- Risk register với response strategies
- Quality framework đo CV output score
- WBS-based project tracking

Business:
- Live product với paying users
- Tự handle full stack: infra → AI → frontend → payment

EXPERIMENTS.md ghi lại 20+ experiments có hypothesis
và kết quả cụ thể — ví dụ Gemma 4 12B vs 27B
cho CV rewriting task..."
```

---

## PHẦN M — SECURITY & COMPLIANCE (PMP: Project Governance)

### M.1 Security Baseline (Minimum Viable)

**Trước launch Phase 1:**
- HTTPS (Vercel auto)
- Supabase RLS: user chỉ xem data của mình
- PayOS webhook signature verification
- API keys trong .env.local — không commit Git
- Input sanitization (chống prompt injection)
- Rate limiting: 10 AI req/ngày/user (free tier)

### M.2 Data Protection

```sql
-- Supabase RLS — BẮT BUỘC trước launch
CREATE POLICY "Users see own CVs only"
ON cvs FOR ALL
USING (auth.uid() = user_id);
```

```javascript
// Prompt injection defense
function sanitizeForPrompt(input) {
  return input
    .replace(/ignore.*instructions?/gi, '')
    .replace(/system\s*prompt/gi, '')
    .slice(0, 3000);
}
```

### M.3 Legal Minimum (VN Context)

- Terms of Service: phải có trước khi thu tiền
- Privacy Policy: đề cập Google AI xử lý data
- Refund policy: "Hoàn tiền trong 24h nếu CV lỗi"
- Disclaimer: "CV do AI tạo — tự review trước khi nộp"
- Không claim "đảm bảo có việc làm" hay "pass ATS 100%"
- Ngưỡng đăng ký kinh doanh: khi revenue > 100tr/năm

---

## PHẦN N — PROJECT CLOSURE CRITERIA (PMP: Close Project)

Dự án được coi là "Phase Complete" khi đạt tất cả Phase Gate criteria (Mục J.2).

Dự án được coi là "Mature" khi:
- Revenue ổn định ≥ 2tr/tháng trong 3 tháng liên tiếp
- LEARNINGS.md có ≥ 180 entries chất lượng
- Portfolio đủ để pass vòng 1 phỏng vấn AI Engineer
- Hệ thống tự vận hành ≥ 30 ngày không cần can thiệp

Tuy nhiên dự án không có "end date" — đây là living system.  
Lessons Learned cuối mỗi phase được compile từ LEARNINGS.md + EXPERIMENTS.md.

---

## APPENDIX 1 — PMP Knowledge Area Mapping

| PMP Knowledge Area | Mục trong tài liệu này | Ghi chú |
|---|---|---|
| Integration Management | Phần J | Architecture + Phase Gates |
| Scope Management | Phần C | WBS + Change Control |
| Schedule Management | Phần D | Phases + Task breakdown |
| Cost Management | Phần A.4, H.4 | Budget baseline |
| Quality Management | Phần E | Quality metrics + CV rubric |
| Resource Management | Phần H | Hardware constraint management |
| Communications Management | Phần B.2 | Telegram reports |
| Risk Management | Phần F | Risk Register + Response |
| Procurement Management | Phần I | Make-or-Buy analysis |
| Stakeholder Management | Phần B | Stakeholder Register |

| Ngoài PMP | Mục trong tài liệu này | Domain |
|---|---|---|
| AI Engineering | Phần G, H | MLOps, LLM systems |
| Career Development | Phần L | Personal development |
| Technology Governance | Phần G.3 | Tech radar + tiers |

---

## APPENDIX 2 — Nguyên tắc vàng (cho AI tư vấn đọc)

```
1. HỌC TRƯỚC, BUILD SAU, REVENUE ĐẾN TỰ NHIÊN
   Mỗi giờ code phải gắn với 1 LEARNINGS.md entry

2. DOCUMENT QUYẾT ĐỊNH — KHÔNG CHỈ CODE
   DECISIONS.md là portfolio thực sự, không phải GitHub repo

3. CONSTRAINT LÀ THẦY GIÁO
   RTX3060 12GB buộc học quantization, routing, optimization
   — đây là kỹ năng production thực sự

4. EXPERIMENT SCIENTIFICALLY
   Hypothesis → Measure → Conclude — không "tôi nghĩ là..."

5. CHANGE CONTROL NGHIÊM TÚC
   Mọi thay đổi scope phải qua quy trình Mục C.2
   Đặc biệt khi AI tư vấn đề xuất tính năng mới

6. SHIPPING = REAL FEEDBACK
   User thật + tiền thật = feedback loop không thể fake

7. KEEP IT SIMPLE ENOUGH TO RUN SOLO
   Nếu cần >2 tiếng/ngày để maintain → quá phức tạp
```

---

*Version: 3.0 | Created: Tháng 4/2026 | Owner: Nguyễn Văn Tuấn*
*Living document — cập nhật khi có Phase Gate hoặc quyết định quan trọng*
*Tham chiếu: PMBOK Guide 7th Edition + Agile Practice Guide (PMI)*
