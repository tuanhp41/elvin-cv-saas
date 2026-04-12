# GEMINI.md
# Rules cho Antigravity / Gemini CLI sessions — đọc TRƯỚC KHI làm bất cứ điều gì

## Stack đã chốt (KHÔNG thay đổi — xem SPEC.md)
- Frontend: Next.js 14
- Database + Auth: Supabase
- AI Local: gemma4:latest (Ollama, RTX3060 12GB)
- AI API: Gemma 4 (Google AI Studio — free tier)
- Payment: PayOS
- Hosting: Vercel
- UI: Tailwind CSS + shadcn/ui
- Automation: n8n (self-hosted Docker tại 100.67.85.6:5678)
- Remote: Tailscale (IP: 100.67.85.6), mount L:\ qua Samba

## Môi trường làm việc
- **Server:** Ubuntu 24.04 Desktop, i7-10900K, 16GB RAM, RTX3060 12GB
- **IDE:** Antigravity chạy trên Windows, edit code qua L:\ (Samba mount)
- **SSH:** elvin@100.67.85.6 (qua Tailscale)
- **Projects dir:** ~/projects/cv-saas/ trên server = L:\cv-saas\ trên Windows
- **n8n:** http://100.67.85.6:5678
- **Telegram Bot:** @Elvin_nyzbot

## Nguyên tắc bất biến
1. Đọc ARCHITECTURE.md TRƯỚC khi tạo bất kỳ file/folder nào
2. Đọc CURRENT_STATE.md đầu mỗi session để lấy context
3. Ghi đè CURRENT_STATE.md cuối mỗi session (OVERWRITE, không append)
4. KHÔNG tạo file mới nếu có thể sửa file cũ
5. KHÔNG thay đổi UI khi chỉ được yêu cầu fix logic
6. KHÔNG đổi stack mà không có DECISIONS.md entry
7. KHÔNG đề xuất thay thế stack Tier 1

## Folder rules (FROZEN — từ ARCHITECTURE.md)
```
src/components/ui/        ← shadcn + base components
src/components/features/  ← CV form, preview, payment modal
src/components/layout/    ← Header, Footer, PageWrapper
src/pages/                ← Next.js routes
src/lib/                  ← gemma.js | supabase.js | payos.js (KHÔNG đổi tên)
automation/n8n/           ← n8n workflow JSON exports
automation/scripts/       ← Python scripts
wiki/raw/                 ← LLM Wiki source files (edit ở đây)
wiki/compiled/            ← knowledge.md (1 file, tự động compile)
```

## Sacred Files (KHÔNG xóa, KHÔNG rename)
- `src/lib/gemma.js`, `src/lib/supabase.js`, `src/lib/payos.js`
- `SPEC.md`, `CLAUDE.md`, `GEMINI.md`, `DECISIONS.md`, `.antigravity-rules`
- `wiki/compiled/knowledge.md`

## Session Handoff Protocol
1. **Đầu session:** Đọc CURRENT_STATE.md → lấy context, check blockers
2. **Trong session:** Check DECISIONS.md trước khi propose thứ đã quyết định
3. **Cuối session:** Overwrite CURRENT_STATE.md với timestamp mới

## Antigravity-specific notes
- i7-10900K KHÔNG có AVX-512 → Language Server bị SIGILL crash nếu chạy trên server
- **Fix đã áp dụng:** Chạy Antigravity trên Windows → edit files qua L:\ (Samba mount)
- Xem chi tiết: TROUBLESHOOTING.md → [TRB-001]

## Khi không chắc
→ Hỏi trước, không tự quyết định
→ Kiểm tra DECISIONS.md xem đã có entry chưa
→ Ghi DECISIONS.md nếu có quyết định kỹ thuật mới
→ Solo project, 1-2 tiếng/ngày — đừng đề xuất giải pháp cần full-time
