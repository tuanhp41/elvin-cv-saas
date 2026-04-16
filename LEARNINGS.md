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
- [[GEMINI]], [[TROUBLESHOOTING]], [[RISK_LOG]] (13 risks)
- Build LLM Wiki: 5 raw files → compile_wiki.py → knowledge.md (22KB)
- Tạo 2 n8n workflow JSONs: dashchat-bot + daily-kickoff
- Phát hiện và fix NVIDIA driver/library version mismatch
- [[DECISIONS]] D004-D007 (4 entries mới)
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
- FortiVPN có block Tailscale không? ([[RISK_LOG]] R-NEW-001 — chưa test)
- gemma4:latest benchmark với GPU sẽ nhanh hơn gemma3:12b bao nhiêu? — xem [[EXPERIMENTS]] EXP-002
- n8n ExecuteCommand node có cần config permission gì không? — xem [[ENVIRONMENT]]

## [2026-04-12] — Session #9: DashChat Live Test + Phase 0 Complete
**Học:** n8n Telegram bot integration, Phase Gate verification
**Thực hành:**
- Test /status → n8n đọc CURRENT_STATE.md → gửi Telegram ✅
- Test /done → n8n chạy git log → format đẹp ✅
- Test /risk → n8n đọc RISK_LOG.md → highlight HIGH/CRITICAL ✅
**Kết quả:** DashChat hoạt động hoàn hảo. Response time <5 giây. Phase Gate CLEARED.
**Áp dụng được:** n8n Execute Command node cần NODE_FUNCTION_ALLOW_BUILTIN=fs,child_process trong docker-compose — xem [[ENVIRONMENT]]
**Câu hỏi mở:** /status đang trả [[CURRENT_STATE]] cũ (session #3) — cần update [[CURRENT_STATE]] cuối mỗi session đúng hơn

---

## [2026-04-16] — Session #16-17: AI Layer + EXP-005 + Process Fix

### L001 — Google AI Studio đổi API key format
**Học:** Google đã chuyển key format từ `AIzaSy...` sang `AQ.xxx` (2026 Q2)
**Thực hành:** Test 3 phương thức auth:
  - `?key=AQ.xxx` → `INVALID` (API coi AQ. là OAuth token)
  - `Authorization: Bearer AQ.xxx` → `API_KEY_SERVICE_BLOCKED`
  - **`x-goog-api-key: AQ.xxx` → WORKS ✅**
**Kết quả:** Fix `gemma-client.js` — chuyển từ query param sang header
**Áp dụng được:** Mọi Google AI API call phải dùng `x-goog-api-key` header. Không bao giờ dùng `?key=` nữa.
**Câu hỏi mở:** Quota `limit: 0` cho project mới — cần chờ bao lâu để free tier activate?

### L002 — Model size ≠ Quality (EXP-005)
**Học:** GPT-oss 20B (20 tỷ params) > Llama 70B (70 tỷ params) cho structured CV output
**Thực hành:** Cùng 1 prompt CV tiếng Việt → test 3 models → so sánh chất lượng + tốc độ
**Kết quả:**
  - GPT-oss 20B: ⭐⭐⭐⭐ — bullet points rõ, tự thêm metrics (4s)
  - Groq Llama 70B: ⭐⭐⭐ — đúng ý nhưng generic hơn (777ms)
  - Nemotron 120B: ⭐⭐ — lộ chain-of-thought, không tuân prompt (23s)
**Áp dụng được:** Chọn model theo **task type**, không theo param count. Reasoning models (Nemotron, DeepSeek R1) KHÔNG phù hợp cho structured output tasks.
**Câu hỏi mở:** GPT-oss kiến trúc gì mà 20B > 70B? Có phải fine-tuned cho instruction following?

### L003 — AI Resource Allocation phải có enforcement gate
**Học:** Quy tắc phân bổ nguồn lực AI viết trong `.antigravity-rules` nhưng bị bỏ qua khi user nói "bắt đầu đi" — vì chỉ là "biển báo" không phải "cửa chặn"
**Thực hành:** 11/14 tasks trong session bị chạy sai pool (Sonnet làm việc của Gemini)
**Kết quả:** Tạo `<pre_coding_gate>` — bắt buộc output Task Allocation Table trước khi viết code
**Áp dụng được:** Mọi enforcement cần **output format bắt buộc** + **user approval**, không chỉ là text rule. Tương tự PMP: checklist > policy statement.
**Câu hỏi mở:** Có tool nào tự động enforce model switching trong Antigravity không?

### L004 — PowerShell + Tiếng Việt = Encoding Hell
**Học:** PowerShell mặc định dùng Windows-1252, không phải UTF-8. Tiếng Việt từ API trả về bị vỡ encoding khi display.
**Thực hành:** `$OutputEncoding = [System.Text.Encoding]::UTF8` không đủ — cần cả `[Console]::OutputEncoding`
**Kết quả:** Output vẫn vỡ trong terminal nhưng Node.js xử lý đúng → problem chỉ ở PowerShell test, không ảnh hưởng app
**Áp dụng được:** Luôn test Vietnamese AI output qua Node.js hoặc browser, KHÔNG qua PowerShell. PowerShell chỉ dùng để test connection/latency.
