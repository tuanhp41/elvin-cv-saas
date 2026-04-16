# SESSION_HANDOFF.md
# ⚠️ OVERWRITE ONLY — File dùng để bàn giao cho AI ở session tiếp theo

## Bàn giao từ: Session #17 (Gemini)
- **Hoàn thành lúc:** 2026-04-16 23:22 +07:00
- **Trạng thái Codebase:** An toàn, không lỗi syntax, build Next.js thành công. Dev server chạy ở `http://100.67.85.6:3000`.

## Việc ĐÃ LÀM trong session này:
1. **Gemini Auth Fix (L001)**: Đổi từ `?key=` thành header `x-goog-api-key` cho model Gemma/Gemini 2.0 Flash. Tuy nhiên quota API Key hiện mới tạo có thể bị limit.
2. **AI Task Selection (EXP-005):** Thử nghiệm và đánh giá Groq > GPT-oss > Gemma ở router logic cho việc parse JSON. Rút Nemotron khỏi pipe.
3. **Pre/Post Gates**: Bổ sung `<pre_coding_gate>` (Task Allocation bắt buộc) và `<post_task_learning_gate>` vào `.antigravity-rules` để áp PMP rules. 
4. **LLM Wiki / Second Brain (L005-L006)**: Sinh file `LESSONS_LOG.md` (chứa 7 bài học hôm nay) và `wiki/raw/hermes-agent.md` mô phỏng framework Hermes. Cập nhật KNOWLEDGE_MAP.
5. **E2E Browser Test (Luồng A)**: Chạy test Bot UI Chat tại `/create`. Phát hiện và fix bug Crash React Component (do LLM đẩy Object lồng qua prompt sai). Chỉnh sửa Prompt Schema để trả string `extracted`. Test passed mỹ mãn.
6. **Supabase Discovery**: Check Database qua REST API, phát hiện Database HOÀN TOÀN TRỐNG (0 Tables) dù Authentication đã tạo acc `elvin@admin.com`.

## ⚠️ CẢNH BÁO / GOTCHAS CHO AI NEXT SESSION
1. **Supabase Database is Empty!** Đừng tin việc check API User có là tables có. Phase Gate chưa clear do tables không có. Hãy tạo file Migration và execute SQL lên Supabase REST Server.
2. **LLM Outputs**: AI có thể vỡ JSON format nếu prompt bị phức tạp (bài học L002 - Model Size != Quality). Luôn parse JSON dùng RegEx trong `api/ai/*.js`. Code hiện tại ở `interview.js` đang check RegEx chuẩn.
3. **PowerShell Windows Encoding**: Khi Write-Host tiếng Việt từ Node APIs, PS 5.1 hay bị lỗi font (`?`). Bug font này là do Shell cục bộ, app NextJS vẫn xử lý UTF-8 đúng. Đừng cố fix code JS vì lỗi hiển thị Windows bash.

## 🎯 Task cho AI khởi động phiên tới:
👉 **[TÊN TASK] P1S2 - Supabase Schema Migration & UI Fix Database** 

**Chi tiết cần làm ngay:**
- Đọc `ROADMAP_PHASE1.md` / `CURRENT_STATE.md`.
- Tìm schema SQL (ví dụ: `docs/supabase/migrations/`) và chạy thẳng trên project Supabase (`dwchfofjnnlgfpwearfu`). (Có thể phải xài REST API `/rest/v1/rpc` or `/pg` tuỳ config Supabase, hoặc nhờ User access qua Web UI để dán SQL Query).
- Test CRUD trên app.
- Chạy thử Luồng B (upload PDF - `/upload`) trên `browser_subagent`.

---
*Ký tên: Gemini (Đã kiểm tra PMP principles)*
