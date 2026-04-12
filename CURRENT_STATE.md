# CURRENT_STATE.md
# ⚠️ OVERWRITE ONLY — không append — chỉ có 1 snapshot mới nhất

## Snapshot
- **Timestamp:** 2026-04-12 22:34 +07:00
- **Phase:** 1 — Core App + AI Foundation | **Stage:** 2 (đang chạy)
- **Branch:** main — up to date với origin
- **Master Plan:** v4.1 (D011 update)
- **Session:** #15 (Sonnet — Day 4-5-6 HOÀN THÀNH)

## Trạng thái Stage 2
  - [x] Supabase schema (cvs, chat_sessions + RLS) — `docs/supabase/migrations/001_cv_chat_schema.sql`
  - [x] lib/db/cv.js + lib/db/chat.js — CRUD helpers
  - [x] lib/ai/interview-script.js — 8 câu hỏi kịch bản phỏng vấn
  - [x] pages/create.jsx — Split-screen layout
  - [x] ChatPanel.jsx — iOS iMessage style (mock AI, chưa kết nối AI thật)
  - [x] CVPreview.jsx — A4 canvas + language tabs + TemplatePicker
  - [x] 3 CV templates: Professional / Modern / Minimal
  - [x] TemplatePicker.jsx — gallery chọn mẫu với mini preview
  - [ ] **Day 7: AI API integration** ← VIỆC TIẾP THEO
  - [ ] Day 8: End-to-end flow A (Chat → CV auto-fill)
  - [ ] Day 9: Upload + Score (Luồng B)

## ⚠️ PHIÊN SÁNG MAI — LAPTOP CÔNG TY

**Laptop cá nhân (hôm nay):** Đã setup xong, mọi thứ đang chạy.
**Laptop công ty (sáng mai):** Môi trường CHƯA setup → phải kiểm tra và cài trước.

### Checklist setup laptop công ty:
```
[ ] Git clone repo: git clone https://github.com/tuanhp41/elvin-cv-saas.git
[ ] Node.js installed? (cần >= 18.x) → node --version
[ ] npm install (cài dependencies)
[ ] Tạo .env.local (copy từ .env.example rồi điền giá trị bên dưới)
[ ] Kiểm tra Antigravity IDE có đang mount L:\ qua Samba/Rclone không
[ ] Test: git push hoạt động qua HTTPS (D012 — không dùng SSH)
```

### Giá trị .env.local cần điền tay trên máy mới:
```
NEXT_PUBLIC_SUPABASE_URL=https://dwchfofjnnlgfpwearfu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3Y2hmb2Zqbm5sZ2Zwd2VhcmZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5Nzk2ODAsImV4cCI6MjA5MTU1NTY4MH0.GwAXMBWK1ovxTKNkVy7T4xahtUnoJDwUB-S3fFDhu_4
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3Y2hmb2Zqbm5sZ2Zwd2VhcmZ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTk3OTY4MCwiZXhwIjoyMDkxNTU1NjgwfQ.gtCLllaAY2ovA2HXCTIY96aOaJ4eFfyVc1KgF2vABk4
ADMIN_SEED_SECRET=seed_elvin_2026
NEXT_PUBLIC_URL=http://localhost:3000
```

### Hạn chế có thể gặp ở laptop công ty:
- Firewall công ty có thể chặn một số port → ưu tiên test trên Vercel thay vì local
- Có thể không cài được software tự do → dùng Vercel làm môi trường chính
- next dev không chạy được do SWC binary → đây là vấn đề đã biết từ Windows (xem DECISIONS.md D012)

## Tài khoản test
- **Admin:** elvin@admin.com / Tuan1235@
- **App URL:** https://elvin-cv-saas.vercel.app

## Task đầu tiên SAU KHI setup xong laptop công ty
→ [Sonnet/Gemini Pro] Day 7: AI API integration
  - lib/ai/groq-client.js (Groq API — miễn phí, nhanh, dễ test nhất)
  - lib/ai/gemma-client.js (Google AI Studio)
  - lib/ai/router.js (Router chọn model theo ngôn ngữ + fallback)
  - pages/api/ai/interview.js (API route nhận chat → trích xuất JSON → trả về)

## Quyết định đang pending
- [ ] Qwen API: Dashscope vs Hugging Face — quyết định khi code Day 7