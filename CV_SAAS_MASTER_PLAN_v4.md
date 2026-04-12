# CV SaaS — Master Plan v4.0
# Tài liệu khởi động dự án (Project Initiation Document)

---

## 📋 CHANGE LOG — LÝ DO PHIÊN BẢN 4.0

> **Phiên bản trước:** [v3.0 — Archived](docs/history/CV_SAAS_MASTER_PLAN_v3_ARCHIVED_2026-04-12.md)
> **Ngày thay đổi:** 2026-04-12
> **Quyết định liên quan:** [[DECISIONS]] → D008, D011

### Tại sao thay đổi?

| # | Vấn đề ở v3 | Thay đổi ở v4 | Lý do (PMP Rationale) |
|---|---|---|---|
| 1 | Phase Gate 1 yêu cầu "5 paying users" — mâu thuẫn với mục tiêu "học trước, revenue sau" | Bỏ revenue target khỏi Phase 1. Revenue chuyển sang Phase 5 | **Scope Alignment** *(căn chỉnh phạm vi)*: Phase Gate phải align với mục tiêu dự án. Mục tiêu = học → Gate phải đo learning, không đo revenue |
| 2 | Chỉ dùng 1 model Gemma 4, vội launch | Tận dụng multi-model miễn phí (Qwen, Groq, Gemma) + local RTX3060 | **Resource Optimization** *(tối ưu nguồn lực)*: Nguồn lực miễn phí có sẵn mà không dùng = lãng phí |
| 3 | Đẩy Automation sau MVP launch | Automation lên trước launch, hệ thống tự evaluate quality | **Quality Management** *(quản lý chất lượng)*: PMBOK nguyên tắc #8 — Quality phải built-in, không phải inspect-in (chất lượng phải xây từ quy trình, không phải kiểm tra sau) |
| 4 | 4 phases, không có internal beta | 5 phases, thêm Phase 4 (Internal Beta) trước khi launch | **Risk Avoidance** *(tránh rủi ro)*: Launch sản phẩm chưa test với người thật = rủi ro rất cao |
| 5 | Roadmap chỉ có Phase 0 chi tiết | Tất cả phases đều có WBS + Phase Gate chi tiết | **Progressive Elaboration** *(chi tiết hóa dần)*: Plan càng gần thực hiện càng phải chi tiết |

### Tóm tắt triết lý v4

```
v3: Build → Launch → Improve → Expand
v4: Build → Automate → Evaluate → Test → Launch
    "Build Deep, Launch When Ready"
v4.1: D011 — Core UX thay đổi: form → AI chat split-screen
```

---

## 🔴 HƯỚNG DẪN CHO AI TƯ VẤN

> Đây là master plan của dự án CV SaaS. Nếu bạn là AI được hỏi về dự án này, hãy đọc toàn bộ tài liệu này trước khi tư vấn bất kỳ điều gì.

**Nguyên tắc tư vấn bắt buộc:**
1. **Học trước, revenue sau** — Mọi quyết định kỹ thuật ưu tiên giá trị học tập trước khi hỏi "có giúp kiếm tiền không?"
2. **Không đề xuất thay đổi stack Tier 1** nếu chưa có lý do học tập rõ ràng
3. **Luôn hỏi "học được gì?"** trước khi propose thêm tính năng
4. **Bám vào constraint phần cứng** — i7-10, 16GB RAM, RTX3060 12GB là cố định
5. **[[DECISIONS]] là nguồn sự thật** — đọc trước khi đề xuất thứ đã được quyết định
6. **Đây là dự án solo, 1–2 tiếng/ngày** — đừng đề xuất giải pháp cần team hay full-time
7. **Quality first** — KHÔNG khuyên launch khi AI output chưa đạt ≥ 8/10
8. **Tận dụng nguồn lực miễn phí** — Nhiều LLM API đang free (Qwen, Groq, Gemma...), phải exploit trước khi mua

**Khi bị hỏi về tính năng mới:** Trước tiên hỏi "Nằm trong phase nào? Học được gì?" — nếu không trả lời được thì thuộc backlog, không làm ngay.

---

## PHẦN A — PROJECT CHARTER

*(PMP: Initiating Process Group — Nhóm quy trình khởi tạo dự án. Đây là tài liệu chính thức xác nhận dự án tồn tại và cấp quyền cho PM sử dụng nguồn lực.)*

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

### A.2 High-Level Scope *(Phạm vi tổng quan — những gì làm và KHÔNG làm)*

**Trong scope (In Scope):**
- Web app tạo CV hỗ trợ Vi/En/Zh
- **AI Conversational Split-Screen:** Chat phỏng vấn + live CV preview (D011)
- **Dual Flow:** Luồng A (chat tạo mới) + Luồng B (upload CV cũ → AI score + rewrite)
- AI rewrite CV qua multi-model (Gemma 4 + Qwen + Groq + local fallback)
- AI CV Scorer: chấm điểm 1-10, gợi ý cải thiện
- Template HTML với watermark — unlock sau thanh toán
- Self-evaluating AI system (hệ thống tự đánh giá chất lượng AI output)
- Multi-agent pipeline (Writer → Critic → Rewrite)
- Hệ thống tự động học (LLM Wiki, n8n pipelines)
- Self-hosted infrastructure trên PC nhà (Ubuntu + RTX3060)
- Learning documentation system (DECISIONS.md, LEARNINGS.md, EXPERIMENTS.md)

**Ngoài scope (Out of Scope):**
- PDF export (dùng HTML thuần)
- Mobile app native
- Job board integration
- Multi-user team features
- Bất kỳ thứ gì yêu cầu >2 tiếng/ngày để maintain

### A.3 High-Level Milestones *(Các mốc quan trọng)*

| Milestone | Phase | Điều kiện hoàn thành |
|---|---|---|
| M0 — Infrastructure Ready | Phase 0 ✅ | SSH từ remote vào PC nhà thành công |
| M1 — App Functional | Phase 1 | App chạy end-to-end, multi-model AI hoạt động |
| M2 — Automation Active | Phase 2 | n8n chạy 3+ workflows 7 ngày không lỗi, AI auto-evaluation |
| M3 — Multi-Agent Working | Phase 3 | Router → 2+ specialist agents, CV score ≥ 8/10 |
| M4 — Beta Validated | Phase 4 | 10 beta testers, feedback ≥ 4/5 |
| M5 — Market Launch | Phase 5 | ≥ 20 paying users, revenue ≥ 1tr/tháng |
| M6 — Career Pivot Ready | Ongoing | Portfolio đủ để phỏng vấn AI Engineer |

### A.4 High-Level Budget

*(PMP: Cost Management — Quản lý chi phí. Đặt ngân sách tối đa và theo dõi chi tiêu thực tế.)*

| Hạng mục | Chi phí ước tính | Ghi chú |
|---|---|---|
| Điện cho PC server | ~300k VNĐ/tháng | 200W × 8h × 30 ngày |
| Antigravity Ultra | Đã có | Google One subscription |
| Google AI Studio | Free | 1000 req/ngày Gemma 4 |
| Qwen API | Free | Alibaba Cloud free tier |
| Groq API | Free | Inference cực nhanh |
| Supabase | Free tier | Đến 500MB / 50k rows |
| Vercel | Free tier | Đủ cho MVP |
| Domain (optional) | ~300k/năm | Phase 5+ |
| **Tổng tháng đầu** | **~400k VNĐ** | Chủ yếu là điện + đã có sẵn |

**Cost Baseline:** ~400k VNĐ/tháng (giảm từ 700k nhờ bỏ Claude Pro, dùng Antigravity)
**Break-even:** 8 users/tháng × 50k = 400k
**Revenue Target (Phase 5+):** 50–60 users/tháng = 2.5–3tr VNĐ

### A.5 Project Assumptions & Constraints

*(Assumptions = Giả định — những điều ta TIN là đúng nhưng chưa chắc chắn. Constraints = Ràng buộc — những giới hạn CỨNG không thay đổi được.)*

**Assumptions (Giả định):**
- Gemma 4 API free tier của Google duy trì ít nhất 6 tháng
- Qwen/Groq free tier duy trì ít nhất 3 tháng (nếu mất → local fallback)
- RTX3060 hoạt động ổn định không cần thay thế
- Bạn có 1–2 tiếng/ngày đều đặn kể cả khi ở Shanghai
- Tailscale duy trì kết nối ổn định VN ↔ Shanghai
- PayOS tiếp tục hỗ trợ thanh toán cá nhân

**Constraints (Ràng buộc cứng):**
- Phần cứng: i7-10, 16GB RAM, RTX3060 12GB — không upgrade
- Thời gian: tối đa 2 tiếng/ngày
- Ngân sách: tối đa 1tr VNĐ/tháng operating cost
- Solo project: không thuê người, không có team

---

## PHẦN B — STAKEHOLDER MANAGEMENT

*(PMP: Stakeholder Register — Sổ đăng ký các bên liên quan. Xác định ai quan tâm đến dự án, kỳ vọng gì, và cách quản lý họ.)*

### B.1 Stakeholder Register

| Stakeholder | Loại | Kỳ vọng | Mức quan tâm | Chiến lược |
|---|---|---|---|---|
| **Bản thân (PM/Dev)** | Internal | Học AI Engineering thực chiến, career pivot | Cao/Cao | Manage closely *(theo dõi sát)* |
| **Bản thân tương lai** | Internal | Portfolio đủ mạnh để phỏng vấn | Cao/Trung | Keep satisfied *(giữ hài lòng)* |
| **Beta testers** | External | CV chất lượng, UX mượt | Trung/Cao | Keep informed *(thông tin đầy đủ)* |
| **Paying users** | External | CV chất lượng, giá hợp lý | Thấp/Cao | Keep informed |
| **Potential employers** | External | Chứng minh AI engineering skill | Thấp/Cao | Monitor *(theo dõi)* |
| **LLM Providers (Google, Alibaba, Groq)** | External (vendor) | API usage trong free tier | Thấp/Cao | Monitor quota |
| **Supabase** | External (vendor) | Không exceed free tier | Thấp/Cao | Monitor usage |
| **PayOS** | External (vendor) | Giao dịch hợp lệ | Thấp/Cao | Manage |

### B.2 Communication Management Plan

*(Kế hoạch truyền thông — ai nhận gì, qua kênh nào, bao lâu 1 lần)*

| Đối tượng | Thông tin gì | Kênh | Tần suất | Người thực hiện |
|---|---|---|---|---|
| Bản thân | Daily learning report | Telegram bot | Hằng ngày 19:00 | n8n automation |
| Bản thân | Weekly review | Telegram bot | Thứ Hai 08:00 | n8n automation |
| Bản thân | System health alert | Telegram bot | Realtime khi có vấn đề | n8n automation |
| Beta testers | Mời test + hướng dẫn | Telegram/Zalo | Phase 4 | Manual |
| Users | Thông báo tính năng mới | Email (Supabase) | Khi có release | Manual |

---

## PHẦN C — SCOPE MANAGEMENT

*(PMP: Scope Baseline — Đường cơ sở phạm vi. WBS = Work Breakdown Structure = Cấu trúc phân rã công việc. Chia toàn bộ dự án thành các work packages nhỏ, dễ quản lý.)*

### C.1 Work Breakdown Structure (WBS)

```
CV SaaS Project
│
├── 1.0 INFRASTRUCTURE (Phase 0) ✅ COMPLETED
│   ├── 1.1 Ubuntu Server Setup ✅
│   ├── 1.2 Container Stack (Docker, Ollama, n8n) ✅
│   └── 1.3 Remote Access (Tailscale) ✅
│
├── 2.0 CORE APP + AI FOUNDATION (Phase 1) ← ĐANG LÀM
│   ├── 2.1 Frontend — AI Conversational Split-Screen (D011)
│   │   ├── 2.1.1 Split-screen layout (Chat Left + Preview Right)
│   │   ├── 2.1.2 ChatPanel (AI interview bubbles, quick actions)
│   │   ├── 2.1.3 CVPreview (A4 render, language tabs, template switch)
│   │   └── 2.1.4 Landing Page ✅ FROZEN
│   ├── 2.2 Backend (Supabase, Auth, API routes)
│   │   ├── 2.2.1 Supabase schema (cvs, chat_sessions)
│   │   └── 2.2.2 CRUD helpers + RLS
│   ├── 2.3 AI Integration — MULTI-MODEL
│   │   ├── 2.3.1 Model Router (Gemma/Qwen/Groq/Local)
│   │   ├── 2.3.2 AI Interview API (chat → structured JSON)
│   │   ├── 2.3.3 AI Rewrite API (polish CV text)
│   │   ├── 2.3.4 AI Scorer API (evaluate CV quality)
│   │   ├── 2.3.5 Prompt Engineering cho CV domain
│   │   └── 2.3.6 Fallback chain: API → API2 → Local
│   ├── 2.4 CV Templates (3 designs minimum)
│   ├── 2.5 Upload + Parse (PDF/DOCX → structured data) — Luồng B
│   └── 2.6 Payment (Stub — KHÔNG bật live)
│
├── 3.0 AUTOMATION & SELF-LEARNING (Phase 2)
│   ├── 3.1 n8n Workflows (quality check, model tracker, health)
│   ├── 3.2 Python Scripts (crawler, wiki compiler, evaluator)
│   ├── 3.3 LLM Wiki (50+ articles, auto-compile)
│   └── 3.4 Multi-Model Infrastructure (benchmark, smart routing)
│
├── 4.0 MULTI-AGENT & QUALITY (Phase 3)
│   ├── 4.1 Agent Architecture (Router, Protocol)
│   ├── 4.2 Specialist Agents (Writer, Critic, Translator, ATS)
│   ├── 4.3 Quality Loop (Writer→Critic→Rewrite, dashboard)
│   └── 4.4 MCP Servers (tự build)
│
├── 5.0 POLISH & INTERNAL BETA (Phase 4) — MỚI v4
│   ├── 5.1 UX Polish (responsive, animations, accessibility)
│   ├── 5.2 Internal Beta (5–10 testers, structured feedback)
│   ├── 5.3 Security Hardening (audit, RLS test, rate limit)
│   ├── 5.4 Legal (ToS, Privacy, Refund policy)
│   └── 5.5 Documentation & Portfolio (blog posts)
│
├── 6.0 CONTROLLED MARKET LAUNCH (Phase 5) — MỚI v4
│   ├── 6.1 Launch Prep (PayOS live, domain, SEO, analytics)
│   ├── 6.2 Soft Launch (public, monitor 7 ngày)
│   ├── 6.3 Marketing nhẹ (LinkedIn, content, referral)
│   └── 6.4 Revenue Tracking (dashboard, funnel)
│
└── 7.0 PROJECT MANAGEMENT (Continuous)
    ├── 7.1 SPEC.md maintenance
    ├── 7.2 DECISIONS.md logging
    ├── 7.3 LEARNINGS.md daily
    ├── 7.4 EXPERIMENTS.md
    └── 7.5 Risk monitoring
```

### C.2 Scope Change Control Process

*(Quy trình kiểm soát thay đổi — bất kỳ thay đổi nào với phạm vi dự án phải đi qua quy trình chính thức, không được "thêm vì tiện".)*

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

## PHẦN D — SCHEDULE MANAGEMENT

*(PMP: Schedule Baseline — Đường cơ sở tiến độ. Xác định khi nào làm gì và bao lâu.)*

### D.1 Phase Overview (v4 — Updated)

```
Phase 0 — Infrastructure          2 ngày         ✅ COMPLETED
Phase 1 — Core App + AI           10–14 ngày     ← ĐANG LÀM
Phase 2 — Automation & Learning   2–3 tuần
Phase 3 — Multi-Agent & Quality   3–4 tuần
Phase 4 — Polish & Beta           1–2 tuần       ← MỚI v4
Phase 5 — Market Launch           1–2 tuần       ← MỚI v4
```

**Tổng timeline dự kiến:** ~3 tháng (Phase 0–5)
**Calibration:** Phase 0 dự kiến 2 tuần → xong 2 ngày. Timing đã hiệu chỉnh theo tốc độ thực.
**So với v3:** Cùng thời gian nhưng thêm 1 phase (Beta) + chất lượng cao hơn

### D.2 Schedule Reserve *(Dự trữ tiến độ)*

Mỗi phase thêm 30% buffer cho học thêm, debug, và thực tế bao giờ cũng chậm hơn ước tính.
Đây là **management reserve** *(dự trữ quản lý)* — không dùng hết thì chuyển sang phase sau.

---

## PHẦN E — QUALITY MANAGEMENT

*(PMP: Quality Management Plan — Kế hoạch quản lý chất lượng. Định nghĩa "thế nào là đủ tốt" và cách đo.)*

### E.1 Quality Objectives *(Mục tiêu chất lượng)*

| Đối tượng | Metric *(Chỉ số đo)* | Ngưỡng chấp nhận | Cách đo |
|---|---|---|---|
| CV output quality | User chỉnh sửa sau khi AI tạo | < 30% câu bị sửa | Log edit history |
| AI response time | Thời gian từ submit → CV hiển thị | < 10 giây | Server-side timing |
| System uptime | PC nhà online | > 95%/tháng | n8n health check |
| API quota usage | Không vượt free tier | < 80% quota/ngày | Daily check |
| Code quality | Không có critical security issues | 0 critical | npm audit |
| Learning quality | Có LEARNINGS.md entry | Mỗi ngày build | Manual check |
| Multi-model coverage | Số models đã benchmark | ≥ 3 models | EXPERIMENTS.md |

### E.2 AI Output Quality Rubric *(Thang đánh giá chất lượng AI)*

Mỗi CV do AI tạo ra được đánh giá theo rubric:

```
1. Completeness (0–3đ): Đầy đủ các mục cần thiết
2. Language quality (0–3đ): Ngôn ngữ tự nhiên, không robotic
3. ATS keywords (0–2đ): Có keywords phù hợp ngành
4. Format compliance (0–2đ): Đúng format chuẩn Vi/En/Zh

Total: 10đ
Phase 1 target: ≥ 6/10
Phase 2 target: ≥ 7/10
Phase 3 target: ≥ 8/10 (với multi-agent)
Phase 5 launch: phải duy trì ≥ 8/10
```

Nếu < target → prompt cần được cải thiện → ghi vào EXPERIMENTS.md.

---

## PHẦN F — RISK MANAGEMENT

*(PMP: Risk Register — Sổ đăng ký rủi ro. Liệt kê mọi thứ CÓ THỂ sai và chuẩn bị phương án.)*

### F.1 Risk Register (v4 Updated)

| ID | Rủi ro | P | I | Mức | Owner | Chiến lược | Ghi chú v4 |
|---|---|---|---|---|---|---|---|
| R01 | Gemma API free tier bị cắt | TB | Cao | 🟠 | Tuấn | Mitigate | v4: giảm phụ thuộc nhờ multi-model |
| R02 | PC nhà mất điện/offline | TB | TB | 🟡 | Tuấn | Accept | — |
| R03 | User data leak | Thấp | Rất cao | 🟠 | Tuấn | Mitigate | v4: Phase 4 security hardening |
| R04 | PayOS webhook fail | Thấp | Cao | 🟢 | Tuấn | Mitigate | v4: giảm từ 🟡→🟢 nhờ Phase 4 sandbox test |
| R05 | Scope creep / feature bloat | Cao | TB | 🟠 | Tuấn | Avoid | — |
| R06 | Burnout / mất động lực | TB | Rất cao | 🟡 | Tuấn | Mitigate | v4: giảm từ 🔴→🟡 nhờ bỏ revenue pressure |
| R07 | Học công nghệ lỗi thời | Thấp | Cao | 🟡 | Tuấn | Monitor | — |
| R08 | RTX3060 hỏng | Rất thấp | Cao | 🟡 | Tuấn | Accept | — |
| R09 | Google AI ToS thay đổi | Thấp | Cao | 🟡 | Tuấn | Monitor | — |
| R10 | Tailscale outage | Rất thấp | Cao | 🟢 | Tuấn | Accept | — |
| R11 | Free LLM APIs bị cắt đồng loạt | Thấp | TB | 🟡 | Tuấn | Mitigate | **MỚI v4**: Local RTX3060 = ultimate fallback |
| R12 | Over-engineering trước market validation | TB | TB | 🟡 | Tuấn | Monitor | **MỚI v4**: Phase 4 beta = validation sớm |

### F.2 Risk Response Strategies *(Giải thích chiến lược)*

| Chiến lược PMP | Nghĩa tiếng Việt | Khi nào dùng |
|---|---|---|
| **Avoid** *(Tránh)* | Thay đổi kế hoạch để rủi ro không xảy ra | Rủi ro quá lớn, không chấp nhận được |
| **Mitigate** *(Giảm nhẹ)* | Giảm xác suất hoặc tác động | Rủi ro có thể xảy ra nhưng giảm thiệt hại được |
| **Accept** *(Chấp nhận)* | Không làm gì, chấp nhận nếu xảy ra | Rủi ro nhỏ hoặc chi phí xử lý > thiệt hại |
| **Transfer** *(Chuyển giao)* | Đẩy rủi ro cho bên thứ 3 | Ví dụ: mua bảo hiểm, dùng dịch vụ managed |
| **Monitor** *(Theo dõi)* | Quan sát, hành động khi trigger | Rủi ro chưa rõ, cần thêm dữ liệu |

---

## PHẦN G — LEARNING & DEVELOPMENT

*(Không có trong PMP chuẩn — nhưng đây là CỐT LÕI của dự án này. Nếu không học được gì → dự án thất bại dù có revenue.)*

### G.1 Learning Roadmap

#### Phase 0 — Infrastructure & DevOps AI ✅
**Đã học:** Linux, Docker, GPU setup, Remote dev workflow, SSH troubleshooting
**Portfolio artifact:** Script tự động setup toàn bộ stack

#### Phase 1 — Full-Stack + Multi-Model AI Integration
**Sẽ học:** Prompt engineering, Multi-LLM API, Model routing, Auth, Payment stub
**Kỹ năng đích:** Build AI-powered web app end-to-end với nhiều models
**Portfolio artifact:** Working app với intelligent model selection

#### Phase 2 — AI Automation & Orchestration
**Sẽ học:** n8n workflow design, AI evaluation systems, Python AI scripting, LLM Wiki
**Kỹ năng đích:** Design self-running AI systems
**Portfolio artifact:** Hệ thống tự vận hành 7 ngày không can thiệp

#### Phase 3 — Multi-Agent Systems
**Sẽ học:** Agent routing, agent evaluation, MCP protocol, inter-agent communication
**Kỹ năng đích:** Orchestrate multiple specialized AI agents
**Portfolio artifact:** Multi-agent CV system với quality evaluation loop

#### Phase 4 — Product Polish & Beta Management
**Sẽ học:** UX design, user feedback analysis, security hardening, beta management
**Kỹ năng đích:** Prepare AI product for real users
**Portfolio artifact:** Beta results + user feedback analysis

#### Phase 5 — Market Launch & Operations
**Sẽ học:** Payment integration, marketing, analytics, user support
**Kỹ năng đích:** Ship and operate an AI product
**Portfolio artifact:** Live product với paying users

### G.2 Technology Governance *(Quản trị công nghệ — tier system)*

```
Tier 1 — PRODUCTION (ổn định, không đổi):
├── Antigravity Ultra (IDE chính)
├── Gemma 4 API / Local (AI primary)
├── Qwen API (AI secondary — multilingual)     ← MỚI v4
├── Groq API (AI fast inference)                ← MỚI v4
├── Supabase (DB + Auth)
├── n8n (Automation)
├── Next.js 14 (Frontend)
├── Vercel (Hosting)
└── Tailscale (Networking)

Tier 2 — EXPERIMENTING (thử nghiệm):
├── Mistral API (free tier)
├── Together AI
├── Gemini CLI
├── Kiro / Spec Kit
└── OpenClaw skills

Tier 3 — WATCHING (theo dõi, không implement):
├── VibeTunnel
├── A2A protocol
└── LoRA fine-tuning

Tier 4 — RADAR (update hàng tuần):
└── GitHub Trending + Karpathy posts
```

### G.3 Resource Allocation Matrix *(Ma trận phân bổ nguồn lực)*

*(Đây là phần MỚI v4 — ai/cái gì làm việc gì, tận dụng tối đa tất cả nguồn lực)*

| Nguồn lực | Vai trò | Phase | Chi phí | Ghi chú |
|---|---|---|---|---|
| **Antigravity Opus** | Architecture, review tổng, Phase Gate decisions | 1–5 | Included | ~15% workload, dùng cho việc KHÓ |
| **Antigravity Sonnet** | Complex logic, AI router, evaluator, debug | 1–5 | Included | ~25% workload, escalation từ Gemini |
| **Antigravity Gemini Pro** | **Primary workhorse**: code features, API integration, tra cứu docs, documentation | 1–5 | Included | **~60% workload**, không chỉ boilerplate |
| **Gemma 4 API (Google AI Studio)** | AI inference cho CV rewrite | 1–5 | Free | 1000 req/ngày |
| **Qwen 3 API (Alibaba)** | AI inference — mạnh multilingual Zh | 1–5 | Free | Tốt cho CV tiếng Trung |
| **Groq API** | AI inference — tốc độ cực nhanh | 1–5 | Free | Dùng khi cần response nhanh |
| **Local RTX3060 (Ollama)** | AI inference — fallback vĩnh viễn | 1–5 | Điện | Không quota, chậm hơn |
| **n8n (self-hosted)** | Automation, scheduling, monitoring | 2–5 | Free | Docker trên server |
| **Vercel** | Hosting frontend | 1–5 | Free tier | Auto-deploy từ GitHub |
| **Supabase** | Database, Auth | 1–5 | Free tier | 500MB / 50k rows |
| **Server PC** | Compute, storage, GPU | 1–5 | Điện | i7-10, 16GB, RTX3060 |
| **GitHub Actions** | CI/CD, lint, test | 1–5 | Free tier | 2000 min/tháng |

---

## PHẦN H — HARDWARE OPTIMIZATION

*(Quản lý tài nguyên phần cứng — đặc thù AI Engineering)*

### H.1 Resource Baseline

| Resource | Spec | Constraint | Strategy |
|---|---|---|---|
| CPU | i7-10900K (10C/20T) | Không upgrade | Async I/O, tránh CPU-bound |
| RAM | 16GB DDR4 | Không upgrade | Docker memory limits |
| GPU VRAM | RTX3060 12GB | Không upgrade | Quantization (Q4_K_M) |
| Storage | 477GB SSD | Có thể thêm HDD | Models trên SSD |
| Network | ISP VN ~100Mbps | Không kiểm soát | Tailscale + retry logic |

### H.2 Intelligent Model Routing (v4 — Multi-model)

```
Decision tree:
Context > 8000 tokens       → Cloud API (Gemma/Qwen)
Task = cv_rewrite_zh         → Qwen API (best for Chinese)
Task = cv_rewrite_vi/en      → Gemma API (primary)
Need fast response           → Groq API
All API quotas < 20%         → Local RTX3060
Local inference > 15s        → Alert + try cloud
Cloud API error              → Next cloud → Local fallback
```

---

## PHẦN J — INTEGRATION MANAGEMENT

*(PMP: Project Management Plan Integration — Tích hợp tất cả phần lại với nhau. Nhìn toàn cảnh hệ thống.)*

### J.1 System Architecture (Integrated View)

```
┌────────────────────────────────────────────────────────┐
│  GOVERNANCE LAYER  (Quản trị dự án — PMP)              │
│  [[SPEC]] · [[DECISIONS]] · [[LEARNINGS]] · [[EXPERIMENTS]]   │
│  Risk Register · WBS · Quality Plan · Comms Plan       │
└──────────────────────────┬─────────────────────────────┘
                           │ governs (quản trị)
┌──────────────────────────▼─────────────────────────────┐
│  APPLICATION LAYER  (Sản phẩm)                          │
│  Next.js · Supabase · PayOS · Vercel                   │
│  Quality gate: npm audit + RLS test + mobile check     │
└──────────────────────────┬─────────────────────────────┘
                           │ powered by (vận hành bởi)
┌──────────────────────────▼─────────────────────────────┐
│  AI LAYER  (Năng lực cốt lõi)                           │
│  Gemma 4 → Qwen 3 → Groq → Local RTX3060              │
│  Model Router · Quality Scoring · Critic Agent          │
│  Quality gate: CV score ≥ 8/10                          │
└──────────────────────────┬─────────────────────────────┘
                           │ fed by (được nuôi bởi)
┌──────────────────────────▼─────────────────────────────┐
│  AUTOMATION LAYER  (Hệ thống tự học)                    │
│  n8n · Python · Crawl4AI · LLM Wiki                   │
│  Quality gate: 7 ngày không lỗi liên tiếp             │
└──────────────────────────┬─────────────────────────────┘
                           │ runs on (chạy trên)
┌──────────────────────────▼─────────────────────────────┐
│  INFRASTRUCTURE LAYER  (Hạ tầng — đã cố định)          │
│  Ubuntu 22.04 · Docker · Ollama · Tailscale            │
│  i7-10 · 16GB RAM · RTX3060 12GB                      │
│  Quality gate: uptime > 95%, VRAM < 90%               │
└────────────────────────────────────────────────────────┘
```

### J.2 Phase Gate Criteria *(Tiêu chí vượt cổng giữa các Phase)*

*(Phase Gate = cửa kiểm soát. Phải đạt TẤT CẢ tiêu chí mới được chuyển sang Phase tiếp.)*

**Gate 0 → Phase 1:** ✅ CLEARED (2026-04-12)

**Gate 1 → Phase 2:** (Updated per D011)
- [ ] Split-screen AI chat → CV flow works end-to-end (Luồng A)
- [ ] Upload CV → AI score + rewrite suggestions (Luồng B MVP)
- [ ] ≥ 3 CV templates rendering correctly
- [ ] ≥ 2 AI models working (Gemma + Qwen or Groq)
- [ ] Supabase RLS tested — user isolation confirmed
- [ ] DECISIONS.md có ≥ 15 entries
- [ ] EXPERIMENTS.md có ≥ 3 completed (model comparison)
- [ ] CV AI output đạt ≥ 6/10 trung bình
- [ ] 0 critical security vulnerabilities

**Gate 2 → Phase 3:**
- [ ] n8n chạy ổn định 7 ngày — 0 workflow failures
- [ ] CV quality score trung bình ≥ 7/10
- [ ] ≥ 3 models benchmark, có data so sánh rõ ràng
- [ ] Smart router chọn đúng model ≥ 80% cases
- [ ] Wiki có ≥ 50 articles
- [ ] EXPERIMENTS.md có ≥ 8 completed
- [ ] Hệ thống tự tạo + đánh giá 5 CV/ngày không can thiệp

**Gate 3 → Phase 4:**
- [ ] Multi-agent pipeline hoạt động (Writer → Critic → Rewrite)
- [ ] CV quality score ≥ 8/10 (với critic loop)
- [ ] ≥ 1 MCP server tự build
- [ ] DECISIONS.md có ≥ 30 entries
- [ ] Quality dashboard hiển thị trend 30 ngày

**Gate 4 → Phase 5:**
- [ ] 10 beta testers thật đã tạo CV thành công
- [ ] Feedback score trung bình ≥ 4/5
- [ ] Mobile responsive tested OK
- [ ] Security checklist all green
- [ ] Legal docs ready (ToS, Privacy, Refund)
- [ ] npm audit — 0 critical
- [ ] PayOS sandbox verified
- [ ] ≥ 2 blog posts published

**Gate 5 — Market Mature:**
- [ ] ≥ 20 paying users
- [ ] Revenue ≥ 1tr VNĐ/tháng
- [ ] CV quality duy trì ≥ 8/10 trong 30 ngày
- [ ] System uptime ≥ 99%
- [ ] DECISIONS.md có ≥ 50 entries
- [ ] Portfolio sẵn sàng cho phỏng vấn AI Engineer

---

## PHẦN K — DAILY & WEEKLY REPORTING

*(PMP: Work Performance Reports — Báo cáo hiệu suất công việc. Tự động hóa bằng n8n để không tốn effort thủ công.)*

### K.1 Daily Report (19:00 — n8n tự gửi Telegram)

```
🧠 LEARNING REPORT [DD/MM/YYYY] | Phase X
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 LEARNED TODAY
├── Concept: [tên concept]
├── Implemented: [code/config gì]
└── Logged: LEARNINGS.md ✓

🤖 AI QUALITY (Model Performance)
├── Gemma: X req, avg score X/10
├── Qwen:  X req, avg score X/10
├── Groq:  X req, avg score X/10
├── Local: X req, avg Xs response
└── Best model today: [tên]

⚙️ SYSTEM HEALTH
├── n8n: X workflows OK / X failed
├── API quotas: Gemma X% | Qwen X% | Groq X%
└── Uptime: X%

🎯 TOMORROW FOCUS
└── [1 learning objective cụ thể]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## PHẦN L — CAREER DEVELOPMENT

### L.1 Portfolio Artifacts (Living Document)

| Artifact | Target | Status | Bằng chứng |
|---|---|---|---|
| GitHub repo (public) | Phase 5 done | ⬜ | Multi-model AI app |
| DECISIONS.md | 50+ entries | 7/50 | Decision Log |
| EXPERIMENTS.md | 20+ completed | 0/20 | Scientific experiments |
| LEARNINGS.md | 180+ entries (6 tháng) | 3/180 | Project Journal |
| Multi-agent system | Working | ⬜ | Writer→Critic→Rewrite |
| MCP server tự build | ≥ 1 | ⬜ | Protocol implementation |
| Blog technical posts | 3+ | 0/3 | Public knowledge share |
| Live product | Paying users | ⬜ | Product acceptance |

---

## PHẦN M — SECURITY & COMPLIANCE

### M.1 Security Baseline (Trước launch Phase 5)

- HTTPS (Vercel auto)
- Supabase RLS: user chỉ xem data của mình
- PayOS webhook signature verification
- API keys trong .env.local — không commit Git
- Input sanitization (chống prompt injection)
- Rate limiting: 10 AI req/ngày/user (free tier)

*(Chi tiết implementation → Phase 4 security hardening)*

---

## PHẦN N — NGUYÊN TẮC VÀNG (v4 Updated)

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
   (Giả thuyết → Đo lường → Kết luận)

5. CHANGE CONTROL NGHIÊM TÚC
   Mọi thay đổi scope phải qua quy trình Mục C.2

6. QUALITY FIRST, THEN SHIP                            ← CHANGED v4
   Hệ thống tự đánh giá chất lượng → beta test → launch
   "Ship bad quality = negative feedback loop"

7. KEEP IT SIMPLE ENOUGH TO RUN SOLO
   Nếu cần >2 tiếng/ngày để maintain → quá phức tạp

8. EXPLOIT FREE RESOURCES                              ← NEW v4
   Dùng hết nguồn lực miễn phí (Qwen, Groq, Gemma...) trước khi trả tiền
   Multi-model > Single-model
```

---

## APPENDIX — PMP THUẬT NGỮ GIẢI THÍCH

*(Bảng tra cứu cho AI coder hoặc bản thân khi quên)*

| Thuật ngữ PMP | Nghĩa tiếng Việt | Giải thích đơn giản |
|---|---|---|
| **WBS** (Work Breakdown Structure) | Cấu trúc phân rã công việc | Chia dự án to thành mảnh nhỏ dễ quản lý |
| **Phase Gate** | Cổng kiểm soát pha | Checklist phải pass hết mới qua phase tiếp |
| **Scope Baseline** | Đường cơ sở phạm vi | "Bản hợp đồng" về những gì sẽ làm/không làm |
| **Schedule Baseline** | Đường cơ sở tiến độ | Kế hoạch thời gian gốc để so sánh thực tế |
| **Risk Register** | Sổ đăng ký rủi ro | Danh sách mọi thứ có thể sai + phương án |
| **Stakeholder** | Bên liên quan | Ai bị ảnh hưởng hoặc quan tâm đến dự án |
| **Deliverable** | Sản phẩm bàn giao | Output cụ thể của mỗi phase |
| **Change Control** | Kiểm soát thay đổi | Quy trình chính thức khi muốn đổi scope |
| **Progressive Elaboration** | Chi tiết hóa dần | Phases gần → plan chi tiết, phases xa → plan sơ bộ |
| **Management Reserve** | Dự trữ quản lý | Thời gian/ngân sách buffer cho bất ngờ |
| **Quality Gate** | Cổng chất lượng | Tiêu chí chất lượng phải đạt trước khi tiến tiếp |
| **Lessons Learned** | Bài học kinh nghiệm | Ghi lại để không lặp lại sai lầm |

---

*Version: 4.1 | Created: Tháng 4/2026 | Updated: 2026-04-12*
*Owner: Nguyễn Văn Tuấn*
*v4.0 → v4.1: D011 — Core UX changed to AI Conversational Split-Screen*
*v3 → v4: Quality-first approach, multi-model, 5 phases*
*Previous version: [[docs/history/CV_SAAS_MASTER_PLAN_v3_ARCHIVED_2026-04-12]]*
*Reference: PMBOK Guide 7th Edition + Agile Practice Guide (PMI)*
*Related: [[SPEC]] | [[ROADMAP_PHASE1]] | [[RISK_LOG]] | [[docs/backlog/UI_IDEAS_BACKLOG]]*
