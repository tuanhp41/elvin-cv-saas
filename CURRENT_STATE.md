# CURRENT_STATE.md
# ⚠️ OVERWRITE ONLY — không append — chỉ có 1 snapshot mới nhất

## Snapshot
- **Timestamp:** 2026-04-12 14:38 +07:00
- **Phase:** 1 — Core App + AI Foundation | **Session:** #12 (Gemini Pro)
- **Branch:** main
- **Master Plan:** v4.0

## Đang làm dở
- Việc: Phase 1 Stage 1 Bootstrapping (Hoàn tất) / Stage 2 Parallel Build (Bắt đầu)
- Trạng thái: 
  - [x] npm install & build verified
  - [x] wiki compile updated with architecture view
  - [x] Supabase connection & Auth (Login, Register, Dashboard)
  - [x] Day 2: CODING_STANDARDS.md (Opus đã thiết lập v1.0)
  - [x] Day 3: UI Component library (Button, Input, Textarea, Select, Card, Badge, Tabs, Dialog, Alert, Spinner)
  - [ ] Day 3: Vercel Deploy (User thực hiện tay)

## Lỗi chưa xử lý
- [ ] LAPTOP-COMPANY SSH method chưa confirm (non-blocking)

## Quyết định pending
- [ ] Chọn Qwen API endpoint (Dashscope vs Hugging Face) — quyết định tuần 3
- [ ] Đồng bộ 1 user duy nhất trên server (tuan vs elvin)

## Task đầu tiên session tới
→ [Human] Deploy dự án lên Vercel và config Supabase keys. Tag branch `v0.2.0-phase1-stage1`.
→ [Gemini Pro] Bắt đầu Stage 2 (Day 4): CV Form Full Layout (hỗ trợ nhiều ngôn ngữ, entries, tabs, validations) + Auto-save vào Supabase.

## Context cho AI
Phase 0 COMPLETE. Master Plan v4 approved: quality-first approach, 5 phases, multi-model (Gemma+Qwen+Groq). ROADMAP cũ archived tại docs/history/. Phase 1 roadmap chi tiết tại ROADMAP_PHASE1.md. Stack FROZEN: Next.js 14, Supabase, Gemma 4 + Qwen + Groq, PayOS (sandbox), Vercel, Tailwind, shadcn/ui. Scaffold đã có (pages, components, lib stubs). Cần npm install + verify build.

## Files đã thay đổi session #10
- [NEW] CV_SAAS_MASTER_PLAN_v4.md (thay thế v3)
- [NEW] ROADMAP_PHASE1.md (chi tiết Phase 1)
- [ARCHIVED] docs/history/CV_SAAS_MASTER_PLAN_v3_ARCHIVED_2026-04-12.md
- [UPDATED] DECISIONS.md (thêm D008)
- [UPDATED] SPEC.md
- [UPDATED] ROADMAP.md (thêm deprecation notice)