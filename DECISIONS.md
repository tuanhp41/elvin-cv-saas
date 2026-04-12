# DECISIONS.md
# Mọi quyết định kỹ thuật quan trọng — KHÔNG xóa entries cũ

## Format
```
## [DATE] [ID] Chọn X thay vì Y
**Context:** Tại sao phải quyết định
**Học được:** Sự khác biệt thực sự giữa X và Y
**Quyết định:** Chọn X
**Rationale:** [lý do kỹ thuật cụ thể]
**Trade-off chấp nhận:** Mất gì, được gì
**Revisit khi:** Điều kiện nào thì xem xét lại
```

---

## [2026-04-10] [D001] Chọn Ubuntu Desktop thay vì Server
**Context:** Cần remote GUI để dùng Antigravity IDE
**Học được:** Desktop dễ debug hơn khi mới setup, có thể tắt GUI sau
**Quyết định:** Ubuntu 24.04 Desktop
**Rationale:** Antigravity cần GUI, Remote Desktop dễ hơn X11 forwarding
**Trade-off chấp nhận:** Tốn thêm ~400MB RAM cho GUI
**Revisit khi:** Khi SSH + headless đủ ổn định

## [2026-04-10] [D002] Dùng gemma4:latest thay vì gemma4:12b
**Context:** Ollama registry không có tag gemma4:12b
**Học được:** Ollama dùng tag :latest cho model mới, không có size qualifier
**Quyết định:** gemma4:latest (9.6GB)
**Rationale:** Đây là bản available duy nhất, likely là 12B variant
**Trade-off chấp nhận:** Không chắc chắn về size, cần verify
**Revisit khi:** Khi Ollama release tag gemma4:12b chính thức

## [2026-04-10] [D003] Chọn xrdp + TigerVNC cho Remote Desktop
**Context:** Cần remote GUI từ Windows qua Tailscale
**Học được:** GNOME không support concurrent local + remote session với xrdp/VNC backend
**Quyết định:** TigerVNC tạo independent session
**Rationale:** Không conflict với physical desktop session
**Trade-off chấp nhận:** Cần logout physical session khi dùng xrdp
**Revisit khi:** Nếu có giải pháp tốt hơn

## [2026-04-11] [D004] Chọn Samba/SMB thay vì SFTP/rsync cho Antigravity IDE
**Context:** Antigravity Language Server bị SIGILL crash trên i7-10900K (không có AVX-512)
**Học được:** SMB protocol cho phép Windows mount remote folder như local drive — Antigravity không phân biệt được local hay network drive. SFTP cần plugin riêng và có latency per-save.
**Quyết định:** Samba mount L:\ = ~/projects/ trên Ubuntu server
**Rationale:** Antigravity trên Windows → edit qua L:\ → file instantly available trên Ubuntu server. Zero extra tooling, native Windows protocol.
**Trade-off chấp nhận:** Phụ thuộc vào Tailscale connection. Nếu Tailscale drop → L:\ mất access
**Revisit khi:** Nếu Tailscale latency gây vấn đề khi save file lớn

## [2026-04-11] [D005] Reuse @Elvin_nyzbot thay vì tạo bot mới
**Context:** Cần Telegram bot cho n8n Dashchat — đã có bot cũ từ 3/2026
**Học được:** Telegram bot giữ nguyên token khi reuse, không cần tạo lại credentials
**Quyết định:** Reuse @Elvin_nyzbot (token: 836751xxxxx)
**Rationale:** Bot đã tồn tại, tiết kiệm setup time, token vẫn valid
**Trade-off chấp nhận:** Bot name không phản ánh CV SaaS project — acceptable vì đây là admin bot, không phải user-facing
**Revisit khi:** Khi muốn user-facing bot riêng (Phase 2+)

## [2026-04-11] [D006] Chọn LLM Wiki (Karpathy pattern) thay vì RAG
**Context:** Cần knowledge base cho AI coders không phải hỏi lại câu cơ bản mỗi session
**Học được:** RAG có retrieval error khi documents similar nhau. LLM Wiki = 1 file compiled duy nhất → AI đọc toàn bộ → không có retrieval ambiguity. Phù hợp codebase nhỏ (<50 files).
**Quyết định:** wiki/raw/*.md → compile_wiki.py → wiki/compiled/knowledge.md
**Rationale:** Simpler, no vector DB dependency, works with any AI that can read files
**Trade-off chấp nhận:** File lớn hơn → tốn context window. Acceptable vì Gemma 4 có 32k context.
**Revisit khi:** Khi wiki > 100 files hoặc > 500KB compiled size

## [2026-04-11] [D007] Fix NVIDIA driver mismatch: upgrade nvidia-utils-535 → nvidia-utils-580
**Context:** nvidia-smi báo "Driver/library version mismatch" — NVML library 535.x nhưng kernel module 580.x
**Học được:** Ubuntu có thể có 2 nvidia packages cùng lúc: kernel module (DKMS) và userspace utils. Khi kernel upgrade, DKMS rebuild module với driver mới hơn, nhưng nvidia-utils ở userspace không upgrade theo → mismatch → nvidia-smi fail → Ollama chạy CPU-only.
**Quyết định:** `apt install nvidia-utils-580` để sync userspace với kernel module
**Rationale:** nvidia-utils-580 bao gồm nvidia-smi, NVML library phiên bản 580 — match với kernel module
**Trade-off chấp nhận:** Giữ cả 535 và 580 packages song song — không sao, không conflict
**Kết quả:** nvidia-smi work, RTX3060 12GB visible, Ollama switch sang 100% GPU
**Benchmark trước fix:** gemma3:12b = 30s (CPU-only)
**Benchmark sau fix:** gemma3:12b = 11s (100% GPU) ✅ Phase Gate G.3: PASSED
**Revisit khi:** Sau kernel upgrade tiếp theo — kiểm tra nvidia-smi ngay sau reboot

## [2026-04-12] [D008] Restructure Roadmap v3 → v4: Quality-First Approach
**Context:** Master Plan v3 yêu cầu "5 paying users" ngay Phase 1 — mâu thuẫn với mục tiêu cốt lõi "học trước, revenue sau". Ngoài ra, có nhiều LLM API miễn phí (Qwen, Groq) chưa được tận dụng.
**Học được:**
- PMP Scope Alignment: Phase Gate phải align với Project Charter mục tiêu. Charter nói "học" thì Gate phải đo "learned what", không đo "earned what".
- PMP Quality Management (PMBOK Principle #8): Quality phải built-in từ quy trình, không phải inspect-in sau khi launch.
- Multi-model strategy giảm vendor lock-in risk (R01, R09) và tận dụng free resources tối đa.
**Quyết định:** Restructure Roadmap từ 4 phases sang 5 phases:
- Phase 1: Core App + AI Foundation (KHÔNG launch, KHÔNG thu tiền)
- Phase 2: Automation & Self-Learning  
- Phase 3: Multi-Agent & Quality Assurance
- Phase 4: Polish & Internal Beta (MỚI — 10 testers miễn phí)
- Phase 5: Controlled Market Launch (MỚI — ≥20 paying users)
**Rationale:** Launch khi chưa sẵn sàng = negative feedback loop. Dùng thời gian thêm để build evaluation system, multi-agent pipeline — learning value cao hơn nhiều so với "5 users trả 50k".
**Trade-off chấp nhận:** Thêm ~2 tháng trước khi có revenue. Acceptable vì mục tiêu chính là learning, không phải revenue.
**Impact:** CV_SAAS_MASTER_PLAN_v3.md → archived → v4.md. ROADMAP.md → ROADMAP_PHASE1.md. SPEC.md updated.
**Revisit khi:** Nếu free API quotas bị cắt đột ngột → có thể cần accelerate launch để có revenue
