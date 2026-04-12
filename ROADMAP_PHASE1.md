# PHASE 1 — Core App + AI Foundation
# CV SaaS Project | Bắt đầu: 2026-04-12 | Dự kiến: 10–14 ngày

> **Trạng thái:** ACTIVE
> **Tốc độ thực tế:** Phase 0 dự kiến 2 tuần → xong trong 2 ngày. Timing đã điều chỉnh.
> **Mục tiêu:** App chạy end-to-end + multi-model AI + bắt đầu xây AI development pipeline
> **KHÔNG có:** Revenue. Không thu tiền. Không launch công khai.
> **Phase Gate:** App on Vercel (protected) + ≥2 models + CV score ≥6/10 + AI pipeline prototype

---

## 🏗️ CHIẾN LƯỢC: Progressive AI Workforce

*(Xây dần bộ máy AI — không dựa 100% vào Antigravity)*

```
STAGE 1 (Day 1–3): BOOTSTRAPPING
  Opus thiết kế architecture + standards
  Gemini Pro build skeleton theo hướng dẫn Opus
  Output: App skeleton chạy được + CODING_STANDARDS.md + compiled wiki

STAGE 2 (Day 4–7): PARALLEL BUILD
  Gemini Pro: code phần lớn features (có standards guide sẵn)
  Sonnet: code phần phức tạp (AI router, evaluator)
  Opus: review architecture decisions
  BẮT ĐẦU: Test free AI APIs (Gemma/Qwen) viết code
  Output: App functional end-to-end + EXP-005 (free AI code quality)

STAGE 3 (Day 8–12): PIPELINE BUILD
  Free AIs (Gemma/Qwen API): code tasks theo standards
  Gemini Pro: review + fix code từ free AIs
  n8n: orchestrate pipeline tự động
  Opus: tuần tra tổng + approve
  Output: AI development pipeline chạy được + Phase Gate pass
```

---

## 🤖 PHÂN CÔNG NGUỒN LỰC CHI TIẾT

### Trong Antigravity (3 models — 2 TOKEN POOLS)

```
⚠️ CƠ CHẾ TOKEN ANTIGRAVITY — PHẢI NHỚ:

┌─────────────────────────────────┐  ┌──────────────────────────┐
│   POOL A: Claude                │  │  POOL B: Gemini          │
│   Opus + Sonnet DÙNG CHUNG      │  │  Gemini Pro RIÊNG        │
│                                 │  │                          │
│   Dùng Opus nhiều → Sonnet hết  │  │  Quota độc lập           │
│   Dùng Sonnet nhiều → Opus hết  │  │  Không ảnh hưởng Pool A  │
└────────────┬────────────────────┘  └────────────┬─────────────┘
             │                                    │
             └──────── Reset mỗi 5 GIỜ ──────────┘
                      + Weekly limit cả 2 pool
```

**Hệ quả cho phân công:**
- Dùng Opus = ăn token của Sonnet → phải THẬT tiết kiệm Opus
- Nếu Claude hết quota → CHUYỂN NGAY sang Gemini Pro (vẫn làm được)
- Nếu Gemini hết quota → CHUYỂN NGAY sang Claude (vẫn làm được)
- **Lý tưởng nhất: xen kẽ Claude ↔ Gemini trong 1 session** để 2 pools cùng giảm đều

| Model | Pool | Strengths | Phân công Phase 1 | % Workload |
|---|---|---|---|---|
| **Opus** | Claude (shared) | Kiến trúc, review sâu, debug khó | Architecture, Phase Gate, approval ONLY | **~10%** |
| **Sonnet** | Claude (shared) | Code logic phức tạp, refactor | AI Router, Evaluator, complex logic | **~20%** |
| **Gemini Pro** | Gemini (riêng) | Code nhanh, tra cứu, context lớn | Primary workhorse — features, APIs, docs | **~60%** |
| **Free AIs** | Không tốn token | Code theo pattern | Pipeline tasks (Stage 3) | **~10%** |

### 🔄 Chiến lược xen kẽ Token trong 1 Session

```
MỖI SESSION LÀM VIỆC (1–2h), XEN KẼ NHƯ SAU:

Session bắt đầu:
  ├── [Gemini Pro] 🟢 Đọc context, plan tasks (15 phút)
  ├── [Claude/Sonnet] 🔵 Code logic phức tạp nếu có (20 phút)
  ├── [Gemini Pro] 🟢 Code features, components (30 phút)
  ├── [Claude/Sonnet] 🔵 Review + fix nếu cần (15 phút)
  └── [Gemini Pro] 🟢 Commit, update docs (10 phút)

KHI 1 POOL HẾT TOKEN:
  Pool A (Claude) hết → Gemini Pro làm tất cả, kể cả review
  Pool B (Gemini) hết → Sonnet làm tất cả, Opus chỉ khi cần
  CẢ 2 hết → Dùng Free AI APIs qua script/n8n, hoặc nghỉ đợi 5h reset

LẬP LỊCH SESSION TỐI ƯU (reset 5h):
  Session 1: 08:00–10:00 → Dùng cả 2 pools
  ── Reset 13:00 ──
  Session 2: 13:00–15:00 → Dùng cả 2 pools (đã reset)
  ── Reset 18:00 ──  
  Session 3: 19:00–21:00 → Dùng cả 2 pools (đã reset)
  → 3 sessions/ngày × 2h = 6h coding (nếu rảnh)
  → Thực tế: 1–2 sessions/ngày = đủ
```

### 📋 Quy tắc phân Pool cho từng loại task

```
POOL A (Claude) — chỉ dùng khi THẬT SỰ cần:
  ✅ Architecture decisions (Opus)
  ✅ Complex algorithm: router, evaluator (Sonnet)
  ✅ Debug lỗi lạ mà Gemini không giải quyết được (Sonnet)
  ✅ Full codebase review (Opus, cuối stage)
  ✅ Phase Gate approval (Opus)
  ❌ KHÔNG dùng cho: scaffold, boilerplate, UI components, API clients

POOL B (Gemini Pro) — workhorse hàng ngày:
  ✅ Tất cả UI components
  ✅ API routes (follow pattern)
  ✅ Supabase integration
  ✅ Tra cứu docs (Qwen API, Groq docs...)
  ✅ Fix bugs đơn giản → trung bình
  ✅ Code review nhẹ (per commit)
  ✅ Documentation, wiki update
  ✅ Generate test data

FREE AIs (Stage 3 — không tốn pool nào):
  ✅ Code components theo CODING_STANDARDS.md
  ✅ Cross-review code
  ✅ Generate prompt variants
  ✅ Bulk tasks (5+ components cùng lúc)
```

> ⚠️ **Gemini Pro là workhorse chính** — không chỉ làm boilerplate.
> Với hướng dẫn rõ ràng (standards + examples), Gemini Pro code complex features rất tốt.
> Chỉ escalate lên Sonnet/Opus khi: architecture decision, bug lạ, hoặc code cần reasoning nhiều bước.

### Ngoài Antigravity (Free AI APIs — cho sản phẩm VÀ cho development)

| Resource | Dùng cho sản phẩm (inference) | Dùng cho development (code gen) |
|---|---|---|
| **Gemma 4 API** (Google AI Studio) | CV rewrite Vi/En | Test viết code components (Stage 2–3) |
| **Qwen 3 API** (Alibaba) | CV rewrite Zh | Test viết code + review (Stage 2–3) |
| **Groq API** (Llama/Gemma) | Fast inference backup | Quick code generation tasks |
| **Local Ollama** (RTX3060) | Ultimate fallback | Prompt testing, offline dev |
| **n8n** | — | Orchestrate AI pipeline (Stage 3) |

### Cách chuyển task giữa các AI

```
Task nhận vào → Phân loại:

[SIMPLE] Tạo component theo pattern có sẵn
  → Gemini Pro (hoặc Free AI khi pipeline sẵn)
  → Ví dụ: UI components, simple API routes, form fields

[MEDIUM] Logic business, API integration, data flow
  → Gemini Pro với hướng dẫn chi tiết từ CODING_STANDARDS
  → Ví dụ: Supabase CRUD, auth middleware, template rendering
  
[COMPLEX] Architecture decision, multi-system integration
  → Sonnet hoặc Opus
  → Ví dụ: Model Router design, Evaluator algorithm, pipeline orchestration

[REVIEW] Code review, bug hunt, quality check
  → Opus cho review tổng (cuối stage)
  → Gemini Pro cho review từng PR/commit (nhanh, rẻ)
  → Free AI để cross-check (khi pipeline sẵn)

[RESEARCH] Tra cứu docs, tìm best practice, compare options
  → Gemini Pro (tốt hơn Claude cho search/lookup)
  → Ví dụ: Qwen API docs, Groq pricing, Supabase RLS patterns
```

---

## 📅 STAGE 1: BOOTSTRAPPING (Day 1–3)

### Day 1 — Architecture Lock + Skeleton ✅ (mostly done)

**🤖 Opus:** Thiết kế + Review
**🤖 Gemini Pro:** Execute scaffold

```
[x] Scaffold src/ folder structure (Session #9 — Gemini Pro)
[x] pages/_app.jsx, _document.jsx (Gemini Pro)
[x] tailwind.config.js, postcss.config.js (Gemini Pro)
[x] globals.css + shadcn design tokens (Gemini Pro)
[x] lib/utils.js, lib/supabase.js, lib/gemma.js, lib/payos.js (Gemini Pro)
[x] components/layout/Header.jsx (Gemini Pro)
[x] components/features/CVForm.jsx skeleton (Gemini Pro)
[x] pages/index.jsx Landing page (Gemini Pro)
[x] package.json updated with deps (Gemini Pro)
[ ] npm install trên server → verify build
[ ] npm run dev → confirm app runs
```

### Day 2 — Standards + Knowledge Base + Supabase

**🤖 Opus:** Tạo CODING_STANDARDS.md (quyết định pattern)
**🤖 Gemini Pro:** Build Supabase schema + compile wiki

```
MỤC TIÊU: Mọi AI (kể cả free API) đều có thể đọc standards và code đúng

[ ] [Opus] Tạo CODING_STANDARDS.md:
    - Component naming conventions (PascalCase, file structure)
    - API route patterns (input validation, error format, response shape)
    - State management patterns (React hooks, no Redux)
    - Supabase query patterns (helper functions, error handling)
    - CSS patterns (cn() helper, design tokens, when to use what)
    - Import order rules
    - Code examples cho TỪNG pattern (AI copy theo)
    
[ ] [Gemini Pro] Update wiki/compiled/knowledge.md:
    - Architecture summary
    - File tree hiện tại
    - Coding standards summary
    - API endpoints planned
    → Đây là "bộ não chung" feed vào prompt khi gọi free AI APIs

[ ] [Gemini Pro] Supabase setup:
    - Tạo project trên Supabase dashboard
    - Schema: users, cvs (data_json, language), payments
    - RLS policies: user isolation
    - Update lib/supabase.js với real credentials
    - Test connection

[ ] [Gemini Pro] Auth implementation:
    - pages/auth/login.jsx + register.jsx
    - Supabase Auth (email/password)
    - Protected route middleware
    - Test: register → login → access protected page

[ ] Ghi DECISIONS.md: D009 — Supabase Schema, D010 — Coding Standards rationale
```

### Day 3 — Component Library + Deploy

**🤖 Gemini Pro:** Toàn bộ (theo CODING_STANDARDS pattern)

```
[ ] UI Components (theo shadcn pattern trong standards):
    - Button, Input, Textarea, Select
    - Card, Badge, Tabs
    - Dialog/Modal, Toast/Alert
    - Spinner/Loading skeleton
    
[ ] Vercel deploy:
    - Connect GitHub repo → Vercel
    - Env vars (Supabase keys)  
    - Verify deployment
    - Password protect nếu cần

[ ] git tag v0.2.0-phase1-stage1
```

**✅ STAGE 1 CHECKPOINT:**
- [ ] App chạy trên localhost + Vercel
- [ ] Auth works (register/login)
- [ ] Supabase connected + RLS tested
- [ ] CODING_STANDARDS.md exists (mọi AI đọc được)
- [ ] compiled wiki updated (knowledge base cho free AIs)
- [ ] ≥ 10 UI components ready

---

## 📅 STAGE 2: PARALLEL BUILD (Day 4–7)

### Day 4 — CV Form Full + Templates

**🤖 Gemini Pro:** CV Form + 2 templates
**🤖 Sonnet:** 1 template phức tạp (nếu cần)

```
[ ] [Gemini Pro] Nâng cấp CVForm.jsx → full form:
    - Dynamic entries (thêm/xóa kinh nghiệm, học vấn)
    - Tab Vi/En/Zh switching
    - Form validation
    - Auto-save to Supabase
    
[ ] [Gemini Pro] Template 1: "Professional" (clean, ATS-friendly)
[ ] [Gemini Pro] Template 2: "Modern" (sidebar, accent colors)
[ ] [Sonnet nếu cần] Template 3: "Executive" (complex layout)

[ ] [Gemini Pro] Template Picker component
[ ] [Gemini Pro] Preview page với watermark overlay
```

### Day 5 — Multi-Model AI Integration

**🤖 Sonnet:** Router logic (complex)
**🤖 Gemini Pro:** API clients (follow pattern)

```
[ ] [Gemini Pro] Research: Qwen 3 API docs, Groq API docs
    → Gemini Pro TỐT cho tra cứu docs — tận dụng

[ ] [Gemini Pro] lib/ai/gemma-client.js — Google AI Studio
[ ] [Gemini Pro] lib/ai/qwen-client.js — Alibaba Dashscope
[ ] [Gemini Pro] lib/ai/groq-client.js — Groq API
[ ] [Gemini Pro] lib/ai/prompts.js — CV rewrite prompt templates

[ ] [Sonnet] lib/ai/router.js — Intelligent Model Router:
    - language routing (zh→Qwen, vi/en→Gemma, fast→Groq)
    - quota checking
    - fallback chain
    - unified interface: rewriteCV(section, lang, context)
    
[ ] [Sonnet] lib/ai/evaluator.js — CV Quality Scorer:
    - Dùng 1 model chấm điểm output của model khác
    - Rubric 10 điểm
    - Return: { score, breakdown, suggestions }

[ ] EXPERIMENTS.md: EXP-001 to EXP-003 (model comparison)
```

### Day 6 — End-to-End Integration

**🤖 Gemini Pro:** Wiring everything together

```
[ ] [Gemini Pro] Connect AI to CV Form:
    - "AI Rewrite" button per section
    - Loading state, error handling
    - Accept/Reject/Edit flow
    - Rate limit display

[ ] [Gemini Pro] User Dashboard:
    - pages/dashboard.jsx
    - List CVs, status, quick actions
    
[ ] [Gemini Pro] Payment stub (PayOS sandbox):
    - Create payment link API
    - Webhook handler
    - Unlock watermark on pay
    - ⚠️ SANDBOX ONLY

[ ] Full flow test: Register → Create CV → AI Rewrite → Template → Preview → Stub Pay
```

### Day 7 — EXPERIMENT: Free AI Code Generation

**🤖 Gemini Pro:** Setup experiment
**🤖 Free AIs:** Write test code
**🤖 Opus:** Evaluate results

```
MỤC TIÊU: Test xem Gemma/Qwen API có thể viết code đủ tốt
          theo CODING_STANDARDS.md không?

[ ] [Gemini Pro] Tạo script: tools/ai-coder.js
    - Đọc CODING_STANDARDS.md + compiled wiki
    - Nhận task description
    - Gọi Gemma API → generate code
    - Save output to file

[ ] [Test] Giao 3 tasks cho Gemma API:
    - Task A: Tạo 1 UI component mới (VD: Footer)
    - Task B: Tạo 1 API route mới (VD: /api/cv/list)
    - Task C: Tạo 1 utility function (VD: date formatter)

[ ] [Test] Giao cùng 3 tasks cho Qwen API

[ ] [Opus] Review 6 outputs:
    - Đúng coding standards?
    - Code chạy được?
    - Quality so với Gemini Pro viết?
    - Kết luận: Free AI có thể giao tasks gì?

[ ] EXPERIMENTS.md: EXP-005 — Free AI Code Generation Quality
[ ] DECISIONS.md: D011 — Free AI Delegation Policy

[ ] git tag v0.3.0-phase1-stage2
```

**✅ STAGE 2 CHECKPOINT:**
- [ ] App functional end-to-end
- [ ] ≥ 2 AI models hoạt động (Gemma + Qwen hoặc Groq)
- [ ] Router chọn model đúng
- [ ] Evaluator cho ra score hợp lý
- [ ] EXP-005 completed: biết free AI code quality level
- [ ] Payment sandbox flow works

---

## 📅 STAGE 3: PIPELINE BUILD (Day 8–12)

### Day 8–9 — Build AI Development Pipeline

**🤖 Sonnet:** Pipeline architecture
**🤖 Gemini Pro:** n8n workflows + scripts

```
DỰA TRÊN KẾT QUẢ EXP-005 để phân công pipeline

[ ] [Sonnet] Design pipeline architecture:
    Task Queue → AI Worker → AI Reviewer → Auto-test → Human Approve
    
[ ] [Gemini Pro] Tạo tools/task-queue.json:
    - Danh sách tasks còn lại Phase 1
    - Mỗi task: description, complexity, assigned_ai, status
    
[ ] [Gemini Pro] n8n workflow: "AI Code Worker"
    1. Read next task from queue
    2. Read CODING_STANDARDS.md + wiki
    3. Call Gemma/Qwen API → generate code
    4. Save to scratch file
    5. Call another model → review code
    6. If review OK → create git branch + commit
    7. If review FAIL → retry with feedback
    8. Notify Telegram: "Task X done, needs human review"

[ ] [Gemini Pro] n8n workflow: "AI Code Reporter"
    - Daily scan: new files, changes, quality metrics
    - Generate report → Telegram
    - Flag issues for human review

[ ] [Sonnet] Human-in-the-loop interface:
    - pages/admin/review.jsx (hoặc Telegram-based)
    - Xem code diff từ AI
    - Approve / Request changes / Reject
    - Approved → merge to main
```

### Day 10 — Pipeline Test Run

**🤖 Pipeline tự chạy**
**🤖 Gemini Pro:** Monitor + fix

```
[ ] Giao pipeline 5 tasks thực tế:
    - Tạo Footer component
    - Tạo /api/cv/delete route  
    - Tạo CV export to HTML function
    - Tạo error boundary component
    - Tạo SEO meta component

[ ] Monitor: pipeline có tự hoàn thành?
[ ] Review output quality
[ ] Fix pipeline bugs
[ ] Tune prompts nếu output kém

[ ] EXPERIMENTS.md: EXP-006 — AI Pipeline Productivity
```

### Day 11 — Polish + Quality

**🤖 Opus:** Tuần tra tổng (code review toàn bộ codebase)
**🤖 Gemini Pro:** Fix theo feedback Opus

```
[ ] [Opus] Full codebase review:
    - Architecture alignment
    - Security issues
    - Code consistency
    - Performance concerns
    - Danh sách fixes cần làm

[ ] [Gemini Pro] Execute fixes from Opus review

[ ] [Gemini Pro] UX polish:
    - Responsive check
    - Loading states
    - Error messages
    - Micro-animations (nếu kịp)

[ ] Lighthouse audit → fix critical issues
```

### Day 12 — Phase Gate + Close

**🤖 Opus:** Phase Gate review & approval

```
[ ] CV Quality Evaluation:
    - Tạo 10 CV mẫu, 3 ngôn ngữ
    - Chạy AI rewrite → evaluate
    - Target: ≥ 6/10 trung bình

[ ] Phase Gate Checklist:
    - [ ] App end-to-end on Vercel?
    - [ ] ≥ 2 AI models working?
    - [ ] Supabase RLS tested?
    - [ ] DECISIONS.md ≥ 15?
    - [ ] EXPERIMENTS.md ≥ 3?
    - [ ] CV score ≥ 6/10?
    - [ ] AI pipeline prototype working?
    - [ ] 0 critical security issues?

[ ] Governance update:
    - CURRENT_STATE.md
    - LEARNINGS.md compile
    - ROADMAP_PHASE2.md (draft)

[ ] git tag v1.0.0-phase1-complete
[ ] 🎉 Phase 1 Complete
```

---

## 📊 PHASE 1 KPIs (Adjusted)

| KPI | Target | Đo bằng |
|---|---|---|
| Duration | ≤ 14 ngày (thay vì 6 tuần) | Calendar |
| DECISIONS.md entries mới | ≥ 8 | Document count |
| EXPERIMENTS.md completed | ≥ 5 | Experiment count |
| Models integrated | ≥ 3 | Working API calls |
| CV quality score avg | ≥ 6/10 | evaluator.js |
| AI pipeline tasks completed | ≥ 5 | Pipeline output count |
| Antigravity Opus usage | ≤ 15% total work | Estimate |
| Gemini Pro usage | ≥ 60% total work | Estimate |
| Free AI contribution | ≥ 5 merged tasks | Git log |

---

## 🧠 NGUYÊN TẮC PHÂN TASK

```
TRƯỚC KHI DÙNG OPUS, HỎI:
  "Gemini Pro có thể làm việc này với hướng dẫn rõ ràng không?"
  Nếu CÓ → dùng Gemini Pro + viết hướng dẫn chi tiết
  Nếu KHÔNG → dùng Sonnet
  Chỉ dùng Opus khi: architecture, review tổng, Phase Gate decision

TRƯỚC KHI DÙNG ANTIGRAVITY, HỎI:
  "Free AI API có thể làm việc này với CODING_STANDARDS.md không?"
  Nếu CÓ → giao pipeline (Stage 3)
  Nếu KHÔNG → dùng Antigravity
  
GEMINI PRO VÀ CLAUDE KHÁC NHAU Ở ĐÂU:
  Gemini Pro tốt hơn: tra cứu docs, web search, generate code dài, 
                       follow patterns, broad knowledge
  Claude tốt hơn: reasoning phức tạp, architecture design, 
                   nuanced review, catch subtle bugs
  → Dùng đúng sở trường = tiết kiệm token + chất lượng cao
```

---

*Phase 1 Roadmap v2.0 — Adjusted for real pace + AI workforce model*
*Timing calibrated: Phase 0 done in 2 days, not 2 weeks*
*Previous version: see git history*
