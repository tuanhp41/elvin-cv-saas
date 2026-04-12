# PHASE 1 — Core App + AI Foundation
# CV SaaS Project | Bắt đầu: 2026-04-12 | Dự kiến: 10–14 ngày

> **Trạng thái:** ACTIVE
> **Tốc độ thực tế:** Phase 0 dự kiến 2 tuần → xong trong 2 ngày. Timing đã điều chỉnh.
> **Mục tiêu:** AI Conversational Split-Screen CV Builder + multi-model AI + AI dev pipeline
> **Core UX (D011):** AI chat phỏng vấn → CV preview sống (thay đổi từ form truyền thống)
> **KHÔNG có:** Revenue. Không thu tiền. Không launch công khai.
> **Phase Gate:** Split-screen flow E2E + Upload+Score MVP + ≥2 models + CV score ≥6/10

---

## 🏗️ CHIẾN LƯỢC: Progressive AI Workforce

*(Xây dần bộ máy AI — không dựa 100% vào Antigravity)*

```
STAGE 1 (Day 1–3): BOOTSTRAPPING ✅ COMPLETED
  Opus thiết kế architecture + standards
  Gemini Pro build skeleton + Landing Page Apple-style
  Output: App on Vercel + CODING_STANDARDS.md + Landing redesign

STAGE 2 (Day 4–10): PARALLEL BUILD ← ACTIVE (D011 thay đổi scope)
  Gemini Pro: Split-screen layout, Chat UI, CV templates, Supabase
  Sonnet: AI router, interview API, rewrite prompts, scorer
  Opus: review architecture decisions
  Output: Luồng A (chat→CV) E2E + Luồng B (upload+score) MVP

STAGE 3 (Day 11–14): PIPELINE BUILD + GATE
  Free AIs (Gemma/Qwen API): code tasks theo standards
  Gemini Pro: review + fix + polish
  n8n: orchestrate pipeline tự động
  Opus: tuần tra tổng + Phase Gate approve
  Output: AI development pipeline + Phase Gate pass
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

## 📅 STAGE 1: BOOTSTRAPPING (Day 1–3) ✅ COMPLETED

> **Hoàn thành:** 2026-04-12 | **Kết quả:** Vượt mong đợi

```
[x] Scaffold src/ structure, Next.js pages, Tailwind, shadcn tokens
[x] lib/supabase.js, lib/utils.js + Supabase env vars
[x] 10 UI components (Button, Input, Card, Badge, Tabs, Dialog, etc.)
[x] Auth: login + register + useAuth hook + Dashboard skeleton
[x] CODING_STANDARDS.md v1.0 + jsconfig.json (@/ alias)
[x] Deploy to Vercel (elvin-cv-saas.vercel.app) + CI/CD
[x] Landing Page v2 — Apple-style redesign:
    - HeroSection: typing animation, gradient CTA, real CV iframe
    - ShowcaseSection: 3D card flip before/after, language carousel Vi/En/Zh
    - FeaturesSection: Bento Box clean cards
    - CTASection + Footer + Be Vietnam Pro font
```

**✅ Stage 1 Checkpoint: ALL PASS**

---

## 📅 STAGE 2: PARALLEL BUILD (Day 4–10) ← ACTIVE

> ⚠️ **D011 CHANGE:** Core UX từ "CV Form" → "AI Conversational Split-Screen"
> Tham khảo: DECISIONS.md → D011

### Day 4 — Supabase Schema + CV Data Model

**🤖 Gemini Pro:** DB schema + CRUD helpers

```
[ ] Supabase schema:
    - cvs: id, user_id, data_json, template_id, language, score, timestamps
    - chat_sessions: id, user_id, cv_id, messages_json, status, timestamps
    - RLS policies: user_id = auth.uid()

[ ] lib/db/cv.js — CRUD helpers (createCV, updateCV, getCV, listCVs)
[ ] lib/db/chat.js — Chat session helpers
```

### Day 5 — Split-Screen Layout + AI Chat Shell

**🤖 Gemini Pro:** Layout + Chat UI
**🤖 Sonnet:** AI prompt engineering

```
[ ] pages/create.jsx — Split-Screen:
    Left (40%): AI Chat Panel | Right (60%): CV Live Preview
    Mobile: stack vertically with toggle

[ ] components/features/ChatPanel.jsx:
    - Message bubbles (AI/User), typing indicator
    - Quick actions ("Bỏ qua", "Sửa lại")

[ ] components/features/CVPreview.jsx:
    - A4 container, template renderer, language tabs (Vi/En/Zh)

[ ] lib/ai/interview-script.js:
    - 8-10 câu hỏi cố định (tên, KN, học vấn, kỹ năng...)
    - field_mapping + validation per question
```

### Day 6 — CV Templates + Preview Renderer

**🤖 Gemini Pro:** 3 templates

```
[ ] cv-templates/ProfessionalTemplate.jsx (2 cột navy sidebar — user's CV style)
[ ] cv-templates/ModernTemplate.jsx (1 cột, accent header)
[ ] cv-templates/MinimalTemplate.jsx (1 cột, ATS-optimized)
[ ] Template Picker component
[ ] AI-generated avatars for demos
```

### Day 7 — AI API Integration (Luồng A — Tạo mới)

**🤖 Sonnet:** Router + rewrite (complex)
**🤖 Gemini Pro:** API clients

```
[ ] lib/ai/gemma-client.js, qwen-client.js, groq-client.js
[ ] pages/api/ai/interview.js — extract structured data from chat
[ ] pages/api/ai/rewrite.js — professional CV language rewrite
[ ] lib/ai/router.js — language routing + fallback chain
[ ] lib/ai/prompts.js — CV-specific prompt templates
```

### Day 8 — End-to-End Flow A (Chat → CV)

**🤖 Gemini Pro:** Wire everything

```
[ ] ChatPanel ↔ Interview API ↔ CVPreview connected
[ ] "✨ AI Viết lại" per section with Accept/Reject
[ ] Auto-save to Supabase after each answer
[ ] Full test: Register → Chat → CV fills → Template → Preview
```

### Day 9 — Luồng B MVP (Upload CV + Score)

**🤖 Sonnet:** Scoring logic
**🤖 Gemini Pro:** Upload UI

```
[ ] Upload PDF → parse → fill structured data → preview
[ ] pages/api/ai/score.js — evaluate completeness, language, ATS
[ ] Score display: gauge + per-section breakdown + "Cải thiện" buttons
[ ] EXPERIMENTS.md: EXP-001 to EXP-003 (model comparison)
```

### Day 10 — Polish + EXP-005

**🤖 Gemini Pro + Opus**

```
[ ] Mobile responsive, loading states, error boundaries
[ ] EXP-005: Free AI Code Generation Test (Gemma vs Qwen)
[ ] git tag v0.3.0-phase1-stage2
```

**✅ STAGE 2 CHECKPOINT:**
- [ ] Split-screen chat → CV flow working E2E (Luồng A)
- [ ] Upload + Score MVP (Luồng B)
- [ ] ≥ 2 AI models integrated
- [ ] ≥ 3 CV templates
- [ ] Real-time preview from chat
- [ ] Auto-save to Supabase
- [ ] EXP-005 completed

---

## 📅 STAGE 3: PIPELINE BUILD + GATE (Day 11–14)

### Day 11–12 — AI Development Pipeline

```
[ ] Pipeline: Task Queue → AI Worker → AI Reviewer → Human Approve
[ ] n8n workflow "AI Code Worker"
[ ] Test: 5 real tasks through pipeline
[ ] EXP-006: AI Pipeline Productivity
```

### Day 13 — Quality Tuần Tra

```
[ ] [Opus] Full codebase review (architecture, security, consistency)
[ ] [Gemini] Execute all fixes
[ ] Lighthouse audit
```

### Day 14 — Phase Gate

```
[ ] 10 CV mẫu qua chat flow, 3 ngôn ngữ → target ≥ 6/10
[ ] Phase Gate Checklist:
    - [ ] Split-screen chat → CV flow works E2E?
    - [ ] Upload + Score flow works?
    - [ ] ≥ 2 AI models working?
    - [ ] ≥ 3 CV templates?
    - [ ] Supabase CRUD + RLS tested?
    - [ ] DECISIONS.md ≥ 15?
    - [ ] EXPERIMENTS.md ≥ 5?
    - [ ] CV score ≥ 6/10?
    - [ ] AI pipeline prototype working?
    - [ ] 0 critical security issues?

[ ] git tag v1.0.0-phase1-complete
[ ] 🎉 Phase 1 Complete
```

---

## 📊 PHASE 1 KPIs (Updated per D011)

| KPI | Target | Đo bằng |
|---|---|---|
| Duration | ≤ 14 ngày | Calendar |
| Core UX (chat → CV) | Working E2E | Manual test |
| Upload + Score | Working MVP | Manual test |
| CV templates | ≥ 3 | Template count |
| Models integrated | ≥ 2 | Working API calls |
| CV quality score avg | ≥ 6/10 | AI scorer |
| DECISIONS.md entries | ≥ 15 | Count |
| EXPERIMENTS.md | ≥ 5 | Count |

---

*Phase 1 Roadmap v3.0 — Updated per D011 (AI Conversational Split-Screen)*
*Core UX: form-based → AI chat interview + live preview*
*Previous version: see git history*

