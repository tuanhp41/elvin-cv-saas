# Hermes Agent — LLM Wiki
# Domain: CV SaaS / Infra
# Last updated: 2026-04-16
# Gotchas: 0
# Related projects: CV SaaS (BACKLOG-001), n8n automation
# Graph: [[KNOWLEDGE_MAP_CV_SaaS]] | [[ENVIRONMENT]] | [[ROADMAP_PHASE1]]

## Quick Reference

**Hermes Agent** là framework autonomous agent của Nous Research. Key insight: nó không chỉ chạy tasks mà **tự tích lũy kiến thức** qua "Closed Learning Loop."

Tương thích: OpenRouter (free), Ollama (local), MCP protocol.

## Deep Dive

### Kiến trúc Hermes Agent

```
┌─────────────────────────────────────────────────┐
│                 HERMES AGENT                     │
│                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ SOUL.md  │  │MEMORY.md │  │ Skills   │       │
│  │ Identity │  │ Facts    │  │ Library  │       │
│  │ Rules    │  │ Lessons  │  │ .md docs │       │
│  └──────────┘  └──────────┘  └──────────┘       │
│        ↕              ↕             ↕            │
│  ┌───────────────────────────────────────┐       │
│  │         Closed Learning Loop          │       │
│  │  Task → Execute → Skill Doc → Store   │       │
│  │        → Load next time needed        │       │
│  └───────────────────────────────────────┘       │
│        ↕                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ Telegram │  │ Discord  │  │  CLI     │       │
│  │ Gateway  │  │ Gateway  │  │ Gateway  │       │
│  └──────────┘  └──────────┘  └──────────┘       │
└─────────────────────────────────────────────────┘
```

### 3 File Cốt Lõi

| File | Tương đương trong dự án ta | Vai trò |
|---|---|---|
| `SOUL.md` | `.antigravity-rules` | Identity, constraints, personality |
| `MEMORY.md` | `LESSONS_LOG.md` + `ENVIRONMENT.md` | Facts, lessons, env state |
| `Skills Library` | `wiki/raw/*.md` + `wiki/compiled/` | Reusable knowledge |

### Closed Learning Loop — Chi tiết

```
1. Agent nhận task
2. Tìm trong Skills Library: có skill liên quan?
   ├── CÓ → Load skill vào context → Execute
   └── KHÔNG → Execute từ đầu
3. Task hoàn thành
4. Tự hỏi: "Cần tạo Skill Document không?"
   ├── CÓ → Tạo skill.md (agentskills.io format)
   │         → Lưu vào Skills Library
   │         → Update MEMORY.md
   └── KHÔNG → Chỉ update MEMORY.md
5. Loop lại bước 1
```

### So sánh với hệ thống hiện tại

| Aspect | Hermes Agent | Hệ thống ta hiện tại | Gap |
|---|---|---|---|
| Identity | SOUL.md | .antigravity-rules ✅ | Covered |
| Memory | MEMORY.md (structured) | LESSONS_LOG.md (mới tạo) | ⚠️ Mới enforce |
| Skills | Auto-gen Skill Docs | wiki/raw/*.md (manual) | ❌ Chưa auto |
| Search | SQLite FTS5 | compile_wiki.py → 1 file | ⚠️ Khác approach |
| Loop | Automatic (agent tự ghi) | Manual (AI phải nhớ) | ❌ Cần gate |
| Gateway | Multi-platform | DashChat (Telegram only) | ⚠️ Đủ cho Phase 1 |

### Áp dụng cho CV SaaS — Roadmap

**Phase 1 (hiện tại):**
- ✅ SOUL = `.antigravity-rules`
- ✅ MEMORY = `LESSONS_LOG.md` + `LEARNINGS.md`
- ✅ Skills = `wiki/raw/` + `compile_wiki.py`
- 🔧 Thêm: `<post_task_learning_gate>` (manual enforcement)

**Phase 2 (BACKLOG-001):**
- Deploy Hermes trên RTX3060 server
- Kết nối MCP → Supabase, GitHub
- Auto-gen wiki entries từ coding sessions
- Qua DashChat: "AI ơi, viết entry wiki về cách fix bug XYZ"

**Phase 3+:**
- Hermes tự tạo CV templates dựa trên feedback
- Hermes tự update job-trends wiki entries
- SQLite FTS5 search thay thế compile_wiki.py

## ❌ KHÔNG LÀM

- KHÔNG deploy Hermes trong Phase 1 — chưa đủ infra
- KHÔNG thay thế LLM Wiki bằng RAG vector DB — D006 vẫn valid cho codebase < 50 files
- KHÔNG cho Hermes tự sửa `.antigravity-rules` — chỉ Opus mới có quyền

## ⚠️ Gotchas đã gặp

*(Chưa có — sẽ ghi khi bắt đầu triển khai Phase 2)*

## Liên quan

- [[ROADMAP_PHASE1]] BACKLOG-001 — Hermes Agent Integration
- [[ROADMAP_PHASE1]] BACKLOG-002 — RAG cho Score API
- [[DECISIONS]] D006 — Chọn LLM Wiki thay vì RAG
- [[EXPERIMENTS]] EXP-005 — Model benchmark
- [[gemma-api]] — Google AI integration
- [[LEARNING_RULES]] — Quy tắc tích lũy kiến thức
