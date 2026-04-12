# PHASE 1 — Core App + AI Foundation
# CV SaaS Project | Bắt đầu: 2026-04-12 | Dự kiến: 6 tuần

> **Trạng thái:** ACTIVE — Đang thực hiện
> **Thời gian ước tính:** 6 tuần (1–2 tiếng/ngày)
> **Mục tiêu:** App chạy end-to-end + multi-model AI hoạt động
> **Mục tiêu KHÔNG có:** Revenue. Không thu tiền. Không launch công khai.
> **Phase Gate:** App on Vercel (password-protected) + ≥2 models + CV score ≥6/10

---

## 🔧 NGUỒN LỰC THAM GIA PHASE 1

*(Tận dụng tối đa — không chỉ dựa vào Antigravity)*

### AI Coders / IDE

| Nguồn lực | Vai trò trong Phase 1 | Khi nào dùng | Giới hạn |
|---|---|---|---|
| **Antigravity Opus** | Architecture decisions, complex logic, code review | Khi cần thiết kế hệ thống, debug khó | Quota cao, dùng tiết kiệm |
| **Antigravity Sonnet** | Code implementation chính, refactor | Phần lớn coding sessions | Quota vừa phải |
| **Antigravity Gemini Pro** | Scaffolding, boilerplate, simple edits | Tasks đơn giản, tạo file template | Quota thấp, dùng cho việc nhẹ |
| **Gemini CLI (local/API)** | Code generation phụ, quick scripts | Khi hết quota Antigravity hoặc cần nhanh | Free, nhưng context nhỏ hơn |
| **Server Ollama (gemma4)** | Code review phụ, test prompt trên terminal | Test prompt cho CV rewrite trực tiếp | Free, chậm ~11s |

### AI Inference (cho sản phẩm CV SaaS)

| Model | Provider | Endpoint | Vai trò | Free Quota | Strengths |
|---|---|---|---|---|---|
| **Gemma 4** | Google AI Studio | `generativelanguage.googleapis.com` | Primary CV rewrite Vi/En | 1000 req/ngày | Google ecosystem, tốt Vi |
| **Qwen 3** | Alibaba Cloud / Hugging Face | Dashscope API | CV rewrite Zh (tiếng Trung) | Generous free | Tốt nhất Zh, multilingual |
| **Groq (Llama/Gemma)** | Groq | `api.groq.com` | Fast inference, backup | 14,400 req/ngày | Cực nhanh (<1s) |
| **gemma4:latest local** | Ollama RTX3060 | `http://100.67.85.6:11434` | Ultimate fallback | ♾️ Không giới hạn | Privacy, no quota |

### Infrastructure

| Resource | Vai trò Phase 1 | Access |
|---|---|---|
| **Server PC** (Ubuntu) | Run Ollama, Docker, n8n, git push | `ssh ubuntu-server` |
| **L:\\ drive** (rclone) | Edit files từ Windows | Auto-mount |
| **Vercel** | Deploy preview builds | Auto-deploy từ GitHub |
| **Supabase** | Database + Auth | Dashboard web |
| **GitHub** | Version control, CI | `git push` qua server |

### Người thực hiện

| Vai trò | Ai | Effort |
|---|---|---|
| **PM + Dev** | Nguyễn Văn Tuấn | 1–2h/ngày |
| **Architect** | Tuấn + Antigravity Opus | Đầu phase |
| **Coder** | Tuấn + Antigravity Sonnet/Gemini | Daily |
| **Reviewer** | Tuấn + AI code review | Mỗi PR |

---

## 📅 WEEKLY BREAKDOWN

### TUẦN 1 (Ngày 1–5): Foundation Setup

**Mục tiêu tuần:** Next.js project chạy được + Supabase connected + deploy Vercel

```
Day 1 — Next.js Project Init
[x] Scaffold src/ folder structure (đã làm Session #9)
[x] Tạo pages/_app.jsx, _document.jsx (đã làm)
[x] Tạo tailwind.config.js, postcss.config.js (đã làm)
[x] Tạo globals.css với shadcn design tokens (đã làm)
[x] Tạo lib/utils.js (cn helper) (đã làm)
[ ] npm install trên server → verify build thành công
[ ] npm run dev → app chạy tại localhost:3000

Day 2 — Supabase Setup
  🤖 Dùng: Antigravity Sonnet hoặc Gemini Pro
[ ] Tạo Supabase project (dashboard web)
[ ] Design schema:
    - Table: users (id, email, created_at)
    - Table: cvs (id, user_id, data_json, language, created_at, updated_at)
    - Table: payments (id, user_id, cv_id, amount, status, payos_order_id)
[ ] Setup RLS policies:
    - users: chỉ read own profile
    - cvs: CRUD chỉ own records
    - payments: read chỉ own records
[ ] Cập nhật lib/supabase.js với real credentials
[ ] Test connection từ Next.js → Supabase
[ ] Ghi DECISIONS.md: D009 — Supabase Schema Design

Day 3 — Auth Implementation
  🤖 Dùng: Antigravity Sonnet
[ ] Tạo pages/auth/login.jsx
[ ] Tạo pages/auth/register.jsx
[ ] Implement Supabase Auth (email/password)
[ ] Tạo middleware/auth check
[ ] Protected route: /create chỉ accessible khi logged in
[ ] Test: register → login → access /create → logout

Day 4 — Component Library Init
  🤖 Dùng: Antigravity Gemini Pro (boilerplate)
[ ] Tạo components/ui/Button.jsx (shadcn style)
[ ] Tạo components/ui/Input.jsx
[ ] Tạo components/ui/Textarea.jsx
[ ] Tạo components/ui/Badge.jsx
[ ] Tạo components/ui/Card.jsx
[ ] Tạo components/ui/Tabs.jsx
[ ] Tất cả dùng cn() helper + CSS variables

Day 5 — Vercel Deploy + Git Tag
  🤖 Dùng: Manual + Antigravity Gemini Pro
[ ] Connect GitHub repo → Vercel
[ ] Cấu hình env vars trên Vercel (Supabase keys)
[ ] Deploy preview → verify app chạy trên internet
[ ] Password protect Vercel deployment (nếu cần)
[ ] git tag v0.2.0-phase1-week1
[ ] Ghi LEARNINGS.md: tuần 1 Phase 1
```

**Validate tuần 1:**
- [ ] `npm run dev` → app hiển thị Landing page
- [ ] Register/Login hoạt động
- [ ] Vercel deployment accessible
- [ ] Supabase RLS tested

---

### TUẦN 2 (Ngày 6–10): CV Form + Templates

**Mục tiêu tuần:** CV Form đa ngôn ngữ hoàn chỉnh + 3 templates pixel-perfect

```
Day 6 — CV Form Completion
  🤖 Dùng: Antigravity Sonnet
[ ] Nâng cấp CVForm.jsx (skeleton → full):
    - Thông tin cá nhân (họ tên, email, phone, address)
    - Kinh nghiệm làm việc (dynamic — thêm/xóa entries)
    - Học vấn (dynamic entries)
    - Kỹ năng (tag-based input)
    - Mục tiêu nghề nghiệp
    - Chứng chỉ / Awards
[ ] Form validation (required fields, email format)
[ ] Auto-save draft vào Supabase
[ ] Tab switching Vi/En/Zh chuyển label + placeholder

Day 7 — CV Data Model
  🤖 Dùng: Antigravity Sonnet + Opus (nếu cần review schema)
[ ] Tạo lib/cv-schema.js — JSON schema cho CV data
[ ] Tạo lib/cv-storage.js — Save/Load CV từ Supabase
[ ] CV versioning: mỗi lần save = 1 snapshot
[ ] Test: tạo CV → save → reload page → data still there

Day 8–9 — Template Design (3 templates)
  🤖 Dùng: Antigravity Sonnet cho code, Opus cho design review
[ ] Template 1: "Professional" — clean, minimal, ATS-friendly
    → components/features/templates/TemplateProfessional.jsx
[ ] Template 2: "Modern" — sidebar layout, accent colors
    → components/features/templates/TemplateModern.jsx
[ ] Template 3: "Executive" — formal, boardroom style
    → components/features/templates/TemplateExecutive.jsx
[ ] Tất cả templates nhận CV data JSON → render HTML
[ ] Responsive preview (desktop + mobile view)
[ ] Watermark overlay component (chữ "PREVIEW" mờ)

Day 10 — Template Picker + Preview Page
  🤖 Dùng: Antigravity Gemini Pro
[ ] Tạo pages/create.jsx — flow: Form → Pick Template → Preview
[ ] Tạo components/features/TemplatePicker.jsx
[ ] Thumbnail preview cho mỗi template
[ ] Tạo pages/preview/[id].jsx — full CV preview
[ ] Print-ready styling (CSS @media print)
[ ] git tag v0.3.0-phase1-week2
```

**Validate tuần 2:**
- [ ] Tạo CV → chọn template → xem preview: hoạt động
- [ ] Data persist qua page reload
- [ ] 3 templates render đúng với sample data
- [ ] Watermark hiển thị trên preview

---

### TUẦN 3 (Ngày 11–15): Multi-Model AI Integration

**Mục tiêu tuần:** ≥2 models hoạt động cho CV rewrite + comparison data

```
Day 11 — Gemma 4 API Integration
  🤖 Dùng: Antigravity Sonnet
[ ] Tạo lib/ai/gemma-client.js — Google AI Studio API
[ ] Tạo lib/ai/prompts.js — Prompt templates cho CV rewrite
    - System prompt: CV expert persona
    - User prompt template: [section] + [language] + [context]
[ ] Tạo pages/api/ai/rewrite.js — API route
[ ] Test: gửi "Kinh nghiệm: Làm ở công ty A 3 năm" → nhận rewrite
[ ] Ghi EXPERIMENTS.md: EXP-001 — Gemma 4 CV rewrite quality baseline

Day 12 — Qwen API Integration
  🤖 Dùng: Antigravity Sonnet
[ ] Research: Qwen 3 API docs (Dashscope / Hugging Face endpoint)
[ ] Tạo lib/ai/qwen-client.js
[ ] Dùng cùng prompt template → so sánh output với Gemma
[ ] Test đặc biệt: CV tiếng Trung — Qwen vs Gemma
[ ] Ghi EXPERIMENTS.md: EXP-002 — Qwen vs Gemma for Chinese CV

Day 13 — Groq API Integration
  🤖 Dùng: Antigravity Gemini Pro (simple API call)
[ ] Tạo lib/ai/groq-client.js
[ ] Test: response time comparison (Groq vs Gemma vs Qwen)
[ ] Groq dùng model Gemma hoặc Llama (free)
[ ] Ghi EXPERIMENTS.md: EXP-003 — Groq speed vs quality tradeoff

Day 14 — Model Router
  🤖 Dùng: Antigravity Opus (architecture decision)
[ ] Tạo lib/ai/router.js — Intelligent Model Selection
    Logic:
    - language === 'zh' → try Qwen first → Gemma fallback
    - language === 'vi' || 'en' → try Gemma first → Groq fallback
    - all APIs fail → local Ollama fallback
    - quota check trước khi gọi
[ ] Tạo lib/ai/index.js — unified interface
    export async function rewriteCV(section, language, context)
    // Caller không cần biết model nào đang xử lý
[ ] Ghi DECISIONS.md: D010 — Model Router Design

Day 15 — Quality Scoring (Basic)
  🤖 Dùng: Antigravity Sonnet
[ ] Tạo lib/ai/evaluator.js — đánh giá CV output
    - Dùng 1 LLM (Gemma) để chấm điểm output của LLM khác
    - Rubric 10 điểm (Completeness, Language, ATS, Format)
    - Return: { score: 7, breakdown: {...}, suggestions: [...] }
[ ] Tạo pages/api/ai/evaluate.js — API route
[ ] Test: đưa 5 CV samples → evaluate → log scores
[ ] So sánh: Gemma output vs Qwen output vs Groq output
[ ] Ghi EXPERIMENTS.md: EXP-004 — Cross-model evaluation results
[ ] git tag v0.4.0-phase1-week3
```

**Validate tuần 3:**
- [ ] 3 models (Gemma, Qwen, Groq) đều callable
- [ ] Router chọn model đúng theo language
- [ ] Fallback chain hoạt động khi 1 model fail
- [ ] Evaluator cho ra điểm số hợp lý
- [ ] ≥ 3 EXPERIMENTS.md entries

---

### TUẦN 4 (Ngày 16–20): End-to-End Integration

**Mục tiêu tuần:** Toàn bộ flow liên thông từ đăng ký → tạo CV → AI rewrite → preview

```
Day 16 — Connect AI to CV Form
  🤖 Dùng: Antigravity Sonnet
[ ] Thêm nút "AI Rewrite" vào mỗi section của CV Form
[ ] Click → gọi API /ai/rewrite → hiển thị suggestion
[ ] User chọn: Accept / Reject / Edit
[ ] Loading state + error handling
[ ] Rate limit: hiển thị "X lượt còn lại hôm nay"

Day 17 — Payment Stub (NO live money)
  🤖 Dùng: Antigravity Gemini Pro
[ ] Tạo lib/payos.js — PayOS SDK integration (SANDBOX MODE)
[ ] Tạo pages/api/payment/create.js — tạo payment link
[ ] Tạo pages/api/payment/webhook.js — nhận callback
[ ] Business logic: payment confirmed → remove watermark
[ ] Test toàn bộ flow trong sandbox
[ ] ⚠️ KHÔNG chuyển sang production mode

Day 18 — User Dashboard
  🤖 Dùng: Antigravity Sonnet
[ ] Tạo pages/dashboard.jsx — danh sách CV đã tạo
[ ] Mỗi CV: status (draft/paid/preview), last updated
[ ] Quick actions: Edit / Preview / Delete
[ ] Stats: số CV tạo, ngôn ngữ nào phổ biến nhất

Day 19 — Error Handling & Edge Cases
  🤖 Dùng: Antigravity Sonnet
[ ] API error responses (4xx, 5xx) → user-friendly messages
[ ] Network offline → retry logic
[ ] Empty form → validation messages
[ ] AI timeout → fallback message
[ ] Supabase connection lost → graceful degradation

Day 20 — Integration Testing
  🤖 Dùng: Manual + Antigravity (browser test)
[ ] Full flow test: Register → Login → Create CV → AI Rewrite
    → Pick Template → Preview → (Stub Payment) → Download
[ ] Test trên 3 browsers (Chrome, Firefox, Edge)
[ ] Test mobile responsive
[ ] Fix bugs phát hiện
[ ] git tag v0.5.0-phase1-week4
```

**Validate tuần 4:**
- [ ] End-to-end flow hoạt động không lỗi
- [ ] AI rewrite suggestions hiển thị đúng
- [ ] Payment sandbox flow hoạt động
- [ ] Mobile responsive OK

---

### TUẦN 5 (Ngày 21–25): Polish + Optimize

**Mục tiêu tuần:** UX cải thiện, performance optimize, code cleanup

```
Day 21 — UI/UX Polish
  🤖 Dùng: Antigravity Opus (design review) + Sonnet (implement)
[ ] Landing page: hero section + CTA rõ ràng
[ ] Consistent color scheme (dark mode support optional)
[ ] Loading skeletons cho AI response
[ ] Micro-animations (hover, transition, page change)
[ ] Typography: Google Fonts (Inter hoặc Noto Sans)

Day 22 — Performance
  🤖 Dùng: Antigravity Sonnet
[ ] Lighthouse audit → fix issues
[ ] Image optimization (next/image)
[ ] API response caching (SWR hoặc React Query)
[ ] Bundle size check
[ ] SEO: meta tags, OG images

Day 23 — Code Quality
  🤖 Dùng: Antigravity Gemini Pro
[ ] ESLint fix all warnings
[ ] Remove unused imports/variables
[ ] Add JSDoc comments cho public functions
[ ] Tạo README.md cho developer onboarding

Day 24–25 — Documentation + Review
[ ] Cập nhật ARCHITECTURE.md nếu structure thay đổi
[ ] Ghi LEARNINGS.md: tổng kết tuần 5
[ ] EXPERIMENTS.md: compile kết quả tất cả experiments
[ ] Code review toàn bộ (Antigravity Opus)
[ ] git tag v0.6.0-phase1-week5
```

---

### TUẦN 6 (Ngày 26–30): Phase Gate Preparation

**Mục tiêu tuần:** Đạt tất cả Phase Gate 1 criteria

```
Day 26 — Phase Gate Checklist
  🤖 Dùng: Manual review
[ ] App chạy end-to-end trên Vercel?
[ ] CV form → AI rewrite → Preview hoạt động?
[ ] ≥ 2 models hoạt động?
[ ] Supabase RLS tested?
[ ] 0 critical security vulnerabilities?

Day 27 — Fix Blockers
[ ] Fix bất kỳ Phase Gate item nào chưa pass
[ ] Rerun all tests
[ ] Deployment verification

Day 28 — CV Quality Evaluation
  🤖 Dùng: Server Ollama + Cloud APIs
[ ] Tạo 10 CV mẫu (tay) cho 3 ngôn ngữ
[ ] Chạy AI rewrite cho tất cả 30 samples
[ ] Evaluate score → tính trung bình
[ ] Target: ≥ 6/10 (Phase 1 quality bar)
[ ] Nếu < 6 → improve prompts → re-evaluate

Day 29 — Governance Update
[ ] DECISIONS.md: verify ≥ 15 entries
    (D001–D007 đã có, cần thêm D008–D015)
[ ] EXPERIMENTS.md: verify ≥ 3 completed
[ ] LEARNINGS.md: compile weekly entries
[ ] CURRENT_STATE.md: update to Phase 1 complete
[ ] RISK_LOG.md: review + update status

Day 30 — Phase Gate Review & Close
[ ] Self-review: tất cả Gate criteria ✅?
[ ] git tag v1.0.0-phase1-complete
[ ] Push + notify (Telegram)
[ ] Ghi DECISIONS.md: D016 — Phase 1 Gate Review Results
[ ] Update ROADMAP.md cho Phase 2 chi tiết
[ ] 🎉 Phase 1 Complete → bắt đầu Phase 2
```

---

## 📊 PHASE 1 KPIs

> Không đo revenue — đo learning + technical depth

| KPI | Target | Đo bằng |
|---|---|---|
| DECISIONS.md entries mới | ≥ 8 (D008–D015+) | Document count |
| EXPERIMENTS.md completed | ≥ 3 | Completed experiments |
| LEARNINGS.md entries | ≥ 30 (6 tuần × 5) | Entry count |
| Models integrated | ≥ 3 (Gemma, Qwen, Groq) | Working API calls |
| CV quality score avg | ≥ 6/10 | evaluator.js output |
| Bug count at Gate | 0 critical, < 5 minor | Manual test |
| Components created | ≥ 15 (ui + features) | File count |
| API routes | ≥ 5 | pages/api/ count |

---

## ⚠️ QUAN TRỌNG — CÁCH LÀM VIỆC PHASE 1

### Quy trình Session hằng ngày

```
1. Mở ENVIRONMENT.md → xác định máy
2. Đọc CURRENT_STATE.md → biết hôm nay làm gì
3. Chọn AI tool phù hợp:
   - Việc khó (architecture, debug phức tạp) → Antigravity Opus
   - Việc code chính → Antigravity Sonnet
   - Việc đơn giản (scaffold, boilerplate) → Antigravity Gemini Pro
   - Quick script / test prompt → Gemini CLI hoặc Ollama
4. Code → Test → Commit
5. Cuối session:
   - Ghi LEARNINGS.md 1 entry
   - Update CURRENT_STATE.md
   - git commit + push (qua server SSH)
```

### Quy trình tự động hóa dần

```
Phase 1 Early:  Manual everything (code, test, review)
Phase 1 Mid:    AI evaluator tự chấm điểm CV output
Phase 1 Late:   Model router tự chọn model, evaluator tự log
→ Phase 2:      n8n tự chạy quality check daily
→ Phase 3:      Multi-agent tự cải thiện quality
```

---

*Phase 1 Roadmap — Version 1.0 | 2026-04-12*
*Part of CV_SAAS_MASTER_PLAN_v4.md*
*Mọi thay đổi phải qua Change Control Process*
