# CURRENT_STATE.md
# ⚠️ OVERWRITE ONLY — không append — chỉ có 1 snapshot mới nhất

## Snapshot
- **Timestamp:** 2026-04-16 23:20 +07:00
- **Phase:** 1 — Core App + AI Foundation | **Stage:** 2 (đang chạy, gần đóng)
- **Branch:** main — up to date với origin
- **Master Plan:** v4.1 (D011 update)
- **Session:** #17 (Gemini — Xử lý AI API Auth & Browser Test E2E, LLM Wiki Update)
- **Links:** [[ROADMAP_PHASE1]] | [[DECISIONS]] | [[ENVIRONMENT]] | [[CODING_STANDARDS]] | [[EXPERIMENTS]] | [[LESSONS_LOG]]

## Trạng thái Stage 2
  - [x] Day 7: AI API integration (Groq/OpenRouter/Gemma) -> DONE
  - [x] Day 8: End-to-end flow A (Chat → CV auto-fill) -> DONE (Tested in browser, fix object React error)
  - [x] Day 9: Upload + Score (Luồng B) -> DONE (Code xong, score.js + ScoreCard.jsx ok)
  - [x] Day 10: AI Stability + ErrorBoundary + Router EXP-005 -> DONE

### Phase Gate Checklist (Stage 2)
  - [x] Chat → CV flow works E2E? (Tested Luồng A pass trên browser)
  - [ ] Upload + Score flow works? (🟡 Code done, cần test browser)
  - [x] ≥ 2 AI models working? (Groq + GPT-oss)
  - [x] ≥ 3 CV templates?
  - [ ] Supabase CRUD + RLS tested? (🔴 Database chưa có tables - CẦN CHẠY MIGRATIONS)
  - [x] DECISIONS.md ≥ 12? (D013, D014, D015 đã update)
  - [x] EXPERIMENTS.md ≥ 5? (EXP-005 hoàn tất)
  - [ ] CV score ≥ 6/10? (🟡 Cần test thực tế)
  - [x] AI pipeline prototype working?
  - [x] 0 critical security issues?

## Lỗi & Vấn đề hiện tại
- **Supabase DB:** Project chưa có database tables. API hiện gọi qua `create.jsx` chỉ lưu state trên React. Phải setup Postgres DB if saving to Supabase.
- **Gemini Auth:** Key dạng `AQ.xxx` phải dùng `x-goog-api-key`. Dùng qua free-tier quota hiện tại có thể báo `limit: 0` khi server Google chưa activate xong dự án.

## Tài khoản test
- **Admin:** elvin@admin.com / Tuan1235@ (Lưu ý Supabase này chưa có tables)
- **Server ảo chạy test dev:** `http://100.67.85.6:3000`

## Task phiên tiếp theo
→ [Sonnet/Gemini/Opus] Database Migrations + Clear Gate Stage 2.
  - Setup script di trú các files từ `docs/supabase/migrations/` vào Supabase (chạy SQL query để tạo tables trên `dwchfofjnnlgfpwearfu`).
  - Test Luồng B (upload PDF) trên Browser.
  - Sau đó gọi Opus đóng Phase Gate.