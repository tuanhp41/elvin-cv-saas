# CURRENT_STATE.md
# ⚠️ OVERWRITE ONLY — không append — chỉ có 1 snapshot mới nhất

## Snapshot
- **Timestamp:** 2026-04-12 22:26 +07:00
- **Phase:** 1 — Core App + AI Foundation | **Stage:** 2 (đang chạy)
- **Branch:** main
- **Master Plan:** v4.1 (D011 update)
- **Session:** #15 (Sonnet — Day 4-5-6 implementation)

## Đang làm dở
- Việc: Stage 2 — AI Conversational Split-Screen Builder
- Trạng thái:
  **Stage 1 ✅ COMPLETED**

  **Stage 2 — IN PROGRESS:**
  - [x] Supabase schema (cvs, chat_sessions tables + RLS)
  - [x] lib/db/cv.js — CRUD helpers
  - [x] lib/db/chat.js — Chat session helpers
  - [x] lib/ai/interview-script.js — 8 câu hỏi kịch bản phỏng vấn
  - [x] Split-screen layout (pages/create.jsx)
  - [x] ChatPanel.jsx — iOS iMessage style, mock AI flow
  - [x] CVPreview.jsx — A4 canvas + language tabs + TemplatePicker
  - [x] 3 CV templates: ProfessionalTemplate / ModernTemplate / MinimalTemplate
  - [x] TemplatePicker.jsx — mini preview gallery
  - [ ] AI API integration (Gemma/Qwen/Groq) — Day 7
  - [ ] End-to-end flow A (Chat → CV auto-fill) — Day 8
  - [ ] Upload + Score flow (Luồng B) — Day 9

## Quyết định mới
- [x] D011 — Core UX: AI chat split-screen thay CV form truyền thống
- [x] D012 — Git remote SSH → HTTPS để push từ Windows
- [ ] Qwen API endpoint (Dashscope vs Hugging Face) — quyết định khi code Day 7

## Lỗi chưa xử lý
- [ ] ESLint warnings (unused imports) — non-blocking, cleanup later
- [ ] Next.js SWC binary missing trên Windows → `next dev` không chạy được local, chỉ xem qua Vercel

## Task đầu tiên session tới
→ [Sonnet/Gemini Pro] Day 7: AI API integration — lib/ai/groq-client.js + lib/ai/gemma-client.js + pages/api/ai/interview.js + lib/ai/router.js

## Context cho AI
**CRITICAL — ĐỌC TRƯỚC KHI CODE:**
- D011: AI chat phỏng vấn bên trái + CV preview sống bên phải
- ChatPanel hiện dùng mock (setTimeout 1.5s), chưa có AI thật
- CVPreview đã kết nối với 3 templates thật qua TemplatePicker
- Data flow: ChatPanel.onExtractData(fieldTarget, value) → cvData state → CVPreview.previewData
- Supabase keys đã có trong .env.local VÀ Vercel env vars
- Admin test account: elvin@admin.com / Tuan1235@

## Files đã thay đổi session #15
- [NEW] docs/supabase/migrations/001_cv_chat_schema.sql
- [NEW] src/lib/db/cv.js
- [NEW] src/lib/db/chat.js
- [NEW] src/lib/ai/interview-script.js
- [NEW] src/pages/create.jsx
- [NEW] src/components/features/ChatPanel.jsx
- [NEW] src/components/features/CVPreview.jsx (updated từ mock → templates thật)
- [NEW] src/components/cv-templates/ProfessionalTemplate.jsx
- [NEW] src/components/cv-templates/ModernTemplate.jsx
- [NEW] src/components/cv-templates/MinimalTemplate.jsx
- [NEW] src/components/features/TemplatePicker.jsx
- [NEW] src/pages/api/admin/seed-user.js
- [UPDATED] DECISIONS.md (D012 — git SSH→HTTPS fix)