# LESSONS_LOG — CV SaaS Domain
# Buffer bài học chưa consolidate vào wiki
# Format: theo [[LEARNING_RULES]] (L:\LEARNING_RULES.md)
# Consolidate khi: user nói "Consolidate" hoặc > 50 entries
# Graph: [[LEARNING_RULES]] | [[KNOWLEDGE_MAP_CV_SaaS]] | [[LEARNINGS]]

---

## Session #16-17 (2026-04-16)

- [2026-04-16] [env:personal] [NEW:google-ai-studio] Google AI Studio đổi key format từ `AIzaSy...` sang `AQ.xxx` (2026 Q2)
  → `?key=AQ.xxx` = INVALID. `Authorization: Bearer` = BLOCKED. **`x-goog-api-key` header = WORKS.**
  → Fix: gemma-client.js chuyển từ query param sang header
  → Liên quan: [[gemma-api]] | EXP-005

- [2026-04-16] [env:both] [NEW:model-selection-strategy] Model size KHÔNG quyết định quality. GPT-oss 20B > Llama 70B cho structured CV output.
  → Chọn model theo **task type** (extract/rewrite/score), không theo param count.
  → Reasoning models (Nemotron, DeepSeek R1) KHÔNG phù hợp cho structured output — lộ chain-of-thought.
  → Liên quan: [[EXPERIMENTS]] EXP-005

- [2026-04-16] [env:both] [NEW:ai-governance] Quy tắc AI phải có enforcement gate (output bắt buộc + user approve), không chỉ text rule.
  → 11/14 tasks sai pool vì AI nhảy code khi user nói "bắt đầu đi"
  → Fix: thêm `<pre_coding_gate>` vào .antigravity-rules — bắt buộc Task Allocation Table
  → PMP parallel: checklist > policy statement
  → Liên quan: [[DECISIONS]] D013

- [2026-04-16] [env:personal] [powershell] PowerShell + tiếng Việt = encoding hell.
  → `$OutputEncoding = [System.Text.Encoding]::UTF8` không đủ. Cần cả `[Console]::OutputEncoding`.
  → Output vẫn vỡ trong terminal nhưng Node.js xử lý đúng.
  → Test tiếng Việt qua Node.js/browser, KHÔNG qua PowerShell.
  → Liên quan: [[ENVIRONMENT]] Known Issues

- [2026-04-16] [env:both] [NEW:hermes-agent-pattern] Hermes Agent (Nous Research) dùng "Closed Learning Loop":
  → Task xong → tự tạo Skill Document (agentskills.io standard) → lưu library → load lại khi cần
  → 3 file cốt lõi: MEMORY.md (facts), SOUL.md (identity), SQLite FTS5 (search)
  → Hỗ trợ MCP, multi-platform gateway (Telegram/Discord/Slack)
  → Chạy trên Docker, SSH, local — model-agnostic (OpenRouter, Ollama, etc.)
  → Liên quan: [[ROADMAP_PHASE1]] BACKLOG-001

- [2026-04-16] [env:both] [NEW:llm-wiki-vs-rag] LLM Wiki pattern (2026 state-of-art) khác RAG ở chỗ:
  → RAG = retrieve chunks at query time, không tích lũy
  → LLM Wiki = AI chủ động compile, cross-reference, flag contradictions, rewrite for clarity
  → Memory tiering: Core (RAM) → Recall (disk cache) → Archival (cold storage)
  → Frameworks: Mem0, Cognee, LangChain memory modules
  → Agent perf tăng khi memory store lớn **nếu có pipeline quản lý consistency**
  → Liên quan: [[DECISIONS]] D006 | [[ROADMAP_PHASE1]] BACKLOG-002

- [2026-04-16] [env:both] [GENERAL] LESSONS_LOG.md phải tồn tại VÀ được enforce — viết LEARNING_RULES mà không tạo file = dead letter law.
  → Session #16 ghi 4 bài học vào LEARNINGS.md (format cũ, không tags, không searchable)
  → Fix: tạo LESSONS_LOG.md đúng format + thêm post_task_learning_gate

