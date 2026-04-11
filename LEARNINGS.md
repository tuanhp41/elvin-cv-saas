# LEARNINGS.md
# Daily learning journal — append only, không xóa

## Format
```
## [YYYY-MM-DD]
**Học:** [concept/skill]
**Thực hành:** [đã làm gì]
**Kết quả:** [hoạt động như thế nào]
**Áp dụng được:** [dùng vào đâu]
**Câu hỏi mở:** [còn thắc mắc gì]
```

---

## [2026-04-10] — Phase 0 Setup Day
**Học:** Ubuntu server setup + AI development environment
**Thực hành:** Cài Ubuntu 24.04, Tailscale, Docker, Ollama, n8n, Claude Code
**Kết quả:**
- Tailscale IP: 100.67.85.6 — SSH remote hoạt động
- Docker 29.4.0 + n8n running tại :5678
- gemma4:latest (9.6GB) + gemma3:12b (8.1GB) pulled
- GitHub repo: tuanhp41/elvin-cv-saas — governance files pushed
**Áp dụng được:** Biết cách setup production AI server từ zero
**Câu hỏi mở:**
- gemma4:latest có thực sự là 12B không?
- xrdp session conflict giải quyết triệt để thế nào?

---

## [2026-04-11] — Session 2: Governance + LLM Wiki + GPU Fix
**Học:** LLM Wiki pattern, SMB/Samba mount, n8n workflow JSON, NVIDIA DKMS/userspace split
**Thực hành:**
- Setup Samba → mount ~/projects/ là L:\ trên Windows
- Tạo GEMINI.md, TROUBLESHOOTING.md, RISK_LOG.md (13 risks)
- Build LLM Wiki: 5 raw files → compile_wiki.py → knowledge.md (22KB)
- Tạo 2 n8n workflow JSONs: dashchat-bot + daily-kickoff
- Phát hiện và fix NVIDIA driver/library version mismatch
- DECISIONS.md: D004-D007 (4 entries mới)
**Kết quả:**
- L:\ mount thành công + persistent
- wiki/compiled/knowledge.md: 22,955 bytes ✅
- Governance files Phase 0: 10/10 ✅
- **GPU fix:** RTX3060 từ 0% utilization → 100% GPU (Ollama)
- **Benchmark:** gemma3:12b: 30s (CPU) → 11s (GPU) ✅ Phase Gate G.3 PASSED
- Phase 0 overall: 57% → ~75%
**Áp dụng được:**
- NVIDIA troubleshooting: kernel module vs userspace library là 2 thứ khác nhau
- Sau mỗi kernel upgrade → check nvidia-smi ngay
- LLM Wiki: compile_wiki.py --watch để auto-recompile khi edit raw files
- n8n workflows: lưu JSON trong automation/n8n/ → import khi cần
**Câu hỏi mở:**
- FortiVPN có block Tailscale không? (R-NEW-001 — chưa test)
- gemma4:latest benchmark với GPU sẽ nhanh hơn gemma3:12b bao nhiêu?
- n8n ExecuteCommand node có cần config permission gì không?
