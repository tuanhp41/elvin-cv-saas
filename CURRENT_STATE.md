# CURRENT_STATE.md
# ⚠️ OVERWRITE ONLY — không append — chỉ có 1 snapshot mới nhất

## Snapshot
- **Timestamp:** 2026-04-12 19:15 +07:00
- **Phase:** 1 — Core App + AI Foundation | **Stage:** 2 (bắt đầu)
- **Branch:** main
- **Master Plan:** v4.1 (D011 update)
- **Session:** #14 (Opus — Architecture + Roadmap update)

## Đang làm dở
- Việc: Stage 2 — AI Conversational Split-Screen Builder
- Trạng thái:
  **Stage 1 ✅ COMPLETED:**
  - [x] Scaffold, build, deploy Vercel
  - [x] Auth (login/register), Dashboard skeleton
  - [x] 10 UI components, CODING_STANDARDS.md
  - [x] Landing Page v2 — Apple-style (Hero, Showcase, Features, CTA, Footer)
  - [x] ShowcaseSection: 3D card flip + language carousel Vi/En/Zh
  
  **Stage 2 — STARTING (Day 4):**
  - [ ] Supabase schema (cvs, chat_sessions tables)
  - [ ] Split-screen layout (pages/create.jsx)
  - [ ] ChatPanel + CVPreview components
  - [ ] AI interview script (8-10 questions)
  - [ ] 3 CV templates
  - [ ] AI API integration (Gemma/Qwen/Groq)
  - [ ] Upload + Score flow (Luồng B)

## Quyết định mới
- [x] D011 — Core UX: AI chat split-screen thay CV form truyền thống
- [x] Landing Page FROZEN ❄️ — mọi ý tưởng UI mới → UI_IDEAS_BACKLOG.md
- [ ] Qwen API endpoint (Dashscope vs Hugging Face) — quyết định khi code Day 7

## Lỗi chưa xử lý
- [ ] ESLint warnings (unused imports) — non-blocking, cleanup later

## Task đầu tiên session tới
→ [Gemini Pro] Day 4: Supabase schema + RLS + CRUD helpers (lib/db/cv.js, lib/db/chat.js)
→ [Gemini Pro] Day 5: Split-screen layout (pages/create.jsx) + ChatPanel shell

## Context cho AI
**CRITICAL — ĐỌC TRƯỚC KHI CODE:**
- D011 thay đổi core UX: KHÔNG dùng CV form truyền thống. Dùng AI chat phỏng vấn bên trái + CV preview sống bên phải.
- 2 luồng: Luồng A (chat → CV mới) + Luồng B (upload CV cũ → AI score + rewrite)
- Landing page FROZEN — không sửa nữa. Backlog tại docs/backlog/UI_IDEAS_BACKLOG.md
- Competitive research: JobsGO (chat AI thụ động), Cake (AI scorer), TopCV (form cũ) — chưa ai kết hợp đủ 4 USP
- Roadmap chi tiết: ROADMAP_PHASE1.md v3.0
- Coding standards: CODING_STANDARDS.md v1.0

## Files đã thay đổi session #13-14
- [NEW] src/components/landing/ShowcaseSection.jsx (3D flip + language carousel)
- [UPDATED] src/components/landing/HeroSection.jsx (Apple-style redesign)
- [UPDATED] src/components/landing/FeaturesSection.jsx (clean white cards)
- [UPDATED] src/components/landing/CTASection.jsx (Apple-style CTA)
- [UPDATED] DECISIONS.md (D011 — Core UX Architecture)
- [UPDATED] ROADMAP_PHASE1.md (v3.0 — full rewrite for D011)
- [NEW] docs/backlog/UI_IDEAS_BACKLOG.md