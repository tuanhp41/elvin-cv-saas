# GEMINI.md
# Rules cho Antigravity / Gemini CLI sessions — đọc TRƯỚC KHI làm bất cứ điều gì

## Stack đã chốt (KHÔNG thay đổi — xem [[SPEC]])
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
8. **KHI UPDATE BẤT KỲ FILE .md NÀO → phải dùng [[wikilink]] đúng chuẩn** (xem bên dưới)

## Folder rules (FROZEN — từ [[ARCHITECTURE]])
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
- `docs/KNOWLEDGE_MAP_CV_SaaS.md` ← CV SaaS domain index — KHÔNG xóa, KHÔNG rename

## 🔗 LLM Wiki Link Protocol (BẮt buộc cho mọi AI)

> **Mục đích:** Giữ Obsidian Graph View và LLM Wiki lên kết với nhau.
> **Rule:** Khi viết / update bất kỳ file .md nào, AI PHẢI dùng dạng `[[FILENAME]]` để link

### File link cần nhớ:
| File | Wikilink đúng | Sử dụng khi |
|---|---|---|
| `CURRENT_STATE.md` | `[[CURRENT_STATE]]` | Nhắc đến snapshot hiện tại |
| `ENVIRONMENT.md` | `[[ENVIRONMENT]]` | Nhắc đến môi trường |
| `DECISIONS.md` | `[[DECISIONS]]` | Reference quyết định kỹ thuật |
| `ROADMAP_PHASE1.md` | `[[ROADMAP_PHASE1]]` | Reference roadmap |
| `CODING_STANDARDS.md` | `[[CODING_STANDARDS]]` | Reference tiêu chuẩn code |
| `ARCHITECTURE.md` | `[[ARCHITECTURE]]` | Reference folder structure |
| `TROUBLESHOOTING.md` | `[[TROUBLESHOOTING]]` | Reference lỗi đã fix |
| `RISK_LOG.md` | `[[RISK_LOG]]` | Reference risk |
| `EXPERIMENTS.md` | `[[EXPERIMENTS]]` | Reference thử nghiệm |
| `LEARNINGS.md` | `[[LEARNINGS]]` | Reference bài học |
| `SPEC.md` | `[[SPEC]]` | Reference scope |
| `SESSION_HANDOFF.md` | `[[SESSION_HANDOFF]]` | Reference handoff |
| `docs/KNOWLEDGE_MAP.md` | `[[KNOWLEDGE_MAP_CV_SaaS]]` | Reference bản đồ tổng |
| `wiki/compiled/knowledge.md` | `[[wiki/compiled/knowledge]]` | Reference AI context |
| Wiki raw files | `[[wiki/raw/nextjs]]` etc. | Reference wiki source |

### Khi cập nhật wiki raw files:
```
→ Edit file trong wiki/raw/*.md (source of truth)
→ SAU KHI edit: chạy ssh ubuntu-server "cd /home/elvin/projects/cv-saas && python3 automation/scripts/compile_wiki.py"
→ wiki/compiled/knowledge.md sẽ được làm mới tự động
→ Commit CẢ 2 file: wiki/raw/* + wiki/compiled/knowledge.md
```

### KHÔNG được:
```
❌ Edit wiki/compiled/knowledge.md trực tiếp (bị ghi đè khi compile lại)
❌ Dùng path tuyệt đối [text](./DECISIONS.md) — dùng [[DECISIONS]] thay
❌ Tạo file .md mới mà không add vào [[KNOWLEDGE_MAP_CV_SaaS]] và [[CURRENT_STATE]]
```

## Session Handoff Protocol
1. **Đầu session:** Đọc [[CURRENT_STATE]] → lấy context, check blockers
2. **Trong session:** Check [[DECISIONS]] trước khi propose thứ đã quyết định
3. **Cuối session:** Overwrite [[CURRENT_STATE]] với timestamp mới

## Antigravity-specific notes
- i7-10900K KHÔNG có AVX-512 → Language Server bị SIGILL crash nếu chạy trên server
- **Fix đã áp dụng:** Chạy Antigravity trên Windows → edit files qua L:\ (Samba mount)
- Xem chi tiết: [[TROUBLESHOOTING]] → [TRB-001]

## Khi không chắc
→ Hỏi trước, không tự quyết định
→ Kiểm tra [[DECISIONS]] xem đã có entry chưa
→ Ghi [[DECISIONS]] nếu có quyết định kỹ thuật mới
→ Solo project, 1-2 tiếng/ngày — đừng đề xuất giải pháp cần full-time
