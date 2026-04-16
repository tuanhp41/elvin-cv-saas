# CLAUDE.md
# Rules cho AI coding sessions — đọc TRƯỚC KHI làm bất cứ điều gì

## Stack đã chốt (KHÔNG thay đổi — xem [[SPEC]])
- Frontend: Next.js 14
- Database: Supabase
- AI Local: gemma4:latest (Ollama, RTX3060)
- AI API: Gemma 4 (Google AI Studio free)
- Payment: PayOS
- Hosting: Vercel
- UI: Tailwind CSS + shadcn/ui

## Nguyên tắc bất biến
1. KHÔNG tạo file mới nếu có thể sửa file cũ
2. KHÔNG thay đổi UI khi chỉ được yêu cầu fix logic
3. KHÔNG đổi stack mà không có [[DECISIONS]] entry
4. Luôn đọc [[ARCHITECTURE]] trước khi tạo file/folder
5. Luôn đọc [[CURRENT_STATE]] đầu mỗi session
6. Ghi [[CURRENT_STATE]] cuối mỗi session (overwrite)

## Mục tiêu cốt lõi
- Học AI Engineering — revenue là thứ yếu
- Mỗi feature build = 1 kỹ năng AI mới
- Document quyết định vào [[DECISIONS]]

## Out of scope (KHÔNG làm trừ khi được yêu cầu rõ)
- PDF export
- Mobile app
- Job board integration
- Multilingual UI phức tạp (chỉ Việt trước)

## 🔗 Wiki Link Protocol
Khi update bất kỳ file .md nào → **PHẢI dùng `[[wikilink]]`** thay vì path tuyệt đối.
Đọc [[GEMINI]] section "LLM Wiki Link Protocol" để xem bảng đầy đủ.
Tạo file .md mới → phải add vào [[KNOWLEDGE_MAP_CV_SaaS]] và [[CURRENT_STATE]].

## Khi không chắc
→ Hỏi trước, không tự quyết định
→ Ghi vào [[DECISIONS]] nếu có quyết định quan trọng
