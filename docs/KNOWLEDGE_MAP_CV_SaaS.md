---
# Obsidian Graph View settings — hiển thị link giữa các file
# Thêm file này vào .obsidian/graph.json nếu dùng Obsidian
---

# 🗺️ CV SaaS Knowledge Map
# Domain-specific — chỉ chứa entries của CV SaaS
# MS Office entries: xem [[KNOWLEDGE_MAP_MS_Office]]
# Master router: [[AGENTS]] | Shared env: [[ENVIRONMENT]] | Learning: [[LEARNING_RULES]]

## Cách đọc bản đồ này
Mỗi node là 1 file. Arrow (→) là "cần đọc trước". 

```
CURRENT_STATE.md
    ↓ trỏ đến
    ├── ROADMAP_PHASE1.md   (chi tiết công việc)
    ├── ENVIRONMENT.md       (setup máy)
    ├── DECISIONS.md         (tại sao lại làm vậy)
    └── wiki/compiled/knowledge.md  (context cho AI)

DECISIONS.md
    ↓ referenced by
    ├── CODING_STANDARDS.md (D010)
    ├── ROADMAP_PHASE1.md   (D008, D011)
    └── ENVIRONMENT.md      (D012)

ROADMAP_PHASE1.md
    ↓ governs
    ├── src/pages/create.jsx
    ├── src/components/features/ChatPanel.jsx
    ├── src/components/features/CVPreview.jsx
    └── src/components/cv-templates/*.jsx

EXPERIMENTS.md
    ↓ validates
    └── ROADMAP_PHASE1.md (Phase Gate conditions)
```

## Node Legend
- 🔴 CRITICAL — phải đọc đầu session
- 🟡 REFERENCE — tra cứu khi cần
- 🟢 ACTIVE — đang code
- ⚫ ARCHIVED — lưu lại, không cần đọc thường xuyên

| File | Role | Priority |
|---|---|---|
| [[CURRENT_STATE]] | Snapshot session | 🔴 |
| [[ENVIRONMENT]] | Machine setup | 🔴 |
| [[DECISIONS]] | Kỹ thuật & rationale | 🟡 |
| [[ROADMAP_PHASE1]] | Chi tiết công việc | 🟡 |
| [[CODING_STANDARDS]] | Luật code | 🟡 |
| [[EXPERIMENTS]] | Kết quả test | 🟡 |
| [[RISK_LOG]] | Rủi ro | 🟡 |
| [[CV_SAAS_MASTER_PLAN_v4]] | Vision tổng 5 phases | 🟡 |
| [[SPEC]] | Scope baseline | 🟡 |
| [[ARCHITECTURE]] | Folder structure | 🟡 |
| [[CLAUDE]] | Rules cho Claude | 🟡 |
| [[GEMINI]] | Rules cho Antigravity | 🟡 |
| [[SESSION_HANDOFF]] | Bàn giao session | 🟡 |
| [[TROUBLESHOOTING]] | Lỗi đã fix | 🟡 |
| [[LEARNINGS]] | Bài học hàng ngày | 🟡 |
| [[knowledge]] | AI context dump | 🟢 |

## Wiki Raw Sources (compile → knowledge.md)
| File | Chủ đề |
|---|---|
| [[nextjs]] | Next.js 14 patterns |
| [[supabase]] | Supabase Auth + RLS |
| [[gemma-api]] | Gemma 4 API usage |
| [[payos]] | PayOS payment |
| [[cv-patterns-vn]] | CV patterns VN |
| [[project_architecture]] | System architecture |
| [[split-screen-architecture]] | Split-screen data flow |

## Docs Phụ Trợ (Active)
| File | Chủ đề |
|---|---|
| [[husky-windows]] | Husky setup on Windows |
| [[n8n-v2-docker]] | n8n Docker setup |
| [[tailscale-funnel]] | Tailscale funnel config |
| [[UI_IDEAS_BACKLOG]] | Ý tưởng UI chưa triển khai |

## ⚫ Archived (chỉ đọc khi cần lịch sử — KHÔNG dùng cho công việc hiện tại)
| File | Lý do archive |
|---|---|
| docs/history/CV_SAAS_MASTER_PLAN_v3.md | Thay bởi v4 |
| docs/history/ROADMAP_PHASE0.md | Phase 0 hoàn thành, thay bởi ROADMAP_PHASE1 |
| docs/history/PHASE0_STATUS_REPORT_v2.md | Phase 0 report cuối cùng |
| docs/history/CV_SAAS_MASTER_PLAN_v3_ARCHIVED_2026-04-12.md | Bản lưu trước khi v4 |
| docs/history/linux-mount-setup.md | Hướng dẫn cũ, nội dung đã vào ENVIRONMENT |

---

## 🤖 AI Link Protocol — BẮT BUỘC

> **Mọi AI (Antigravity, Claude, Gemini CLI, Codex) khi update file .md PHẢI:**

### 1. Dùng `[[wikilink]]` — KHÔNG dùng path tuyệt đối
```
✅ Đúng:  Xem [[DECISIONS]] entry D012
❌ Sai:   Xem [DECISIONS](./DECISIONS.md)
```

### 2. Khi tạo file .md MỚI — phải làm 3 việc:
```
a) Tạo file theo đúng folder trong [[ARCHITECTURE]]
b) Thêm entry vào bảng trong file này ([[KNOWLEDGE_MAP_CV_SaaS]])
c) Thêm link vào [[CURRENT_STATE]] hoặc [[SESSION_HANDOFF]] nếu relevant
```

### 3. Khi update wiki/raw/*.md:
```
→ Edit wiki/raw/TEN_FILE.md
→ Chạy: ssh ubuntu-server "cd /home/elvin/projects/cv-saas && python3 automation/scripts/compile_wiki.py"
→ Commit CẢ HAI: wiki/raw/* VÀ wiki/compiled/knowledge.md
→ KHÔNG edit wiki/compiled/knowledge.md trực tiếp
```

### 4. File KHÔNG được rename/xóa (Sacred):
```
docs/KNOWLEDGE_MAP_CV_SaaS.md  ← file này — CV SaaS domain index
wiki/compiled/knowledge.md ← AI context dump
SPEC.md, DECISIONS.md, ARCHITECTURE.md ← frozen baselines
```

