---
# Obsidian Graph View settings — hiển thị link giữa các file
# Thêm file này vào .obsidian/graph.json nếu dùng Obsidian
---

# 🗺️ CV SaaS Knowledge Map

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
| [[wiki/compiled/knowledge]] | AI context dump | 🟢 |

## Wiki Raw Sources (compile → knowledge.md)
| File | Chủ đề |
|---|---|
| [[wiki/raw/nextjs]] | Next.js 14 patterns |
| [[wiki/raw/supabase]] | Supabase Auth + RLS |
| [[wiki/raw/gemma-api]] | Gemma 4 API usage |
| [[wiki/raw/payos]] | PayOS payment |
| [[wiki/raw/cv-patterns-vn]] | CV patterns VN |
| [[wiki/raw/project_architecture]] | System architecture |
| [[wiki/raw/split-screen-architecture]] | Split-screen data flow |

## Docs Phụ Trợ (Active)
| File | Chủ đề |
|---|---|
| [[docs/llm-wiki/husky-windows]] | Husky setup on Windows |
| [[docs/llm-wiki/n8n-v2-docker]] | n8n Docker setup |
| [[docs/llm-wiki/tailscale-funnel]] | Tailscale funnel config |
| [[docs/backlog/UI_IDEAS_BACKLOG]] | Ý tưởng UI chưa triển khai |

## ⚫ Archived (chỉ đọc khi cần lịch sử — KHÔNG dùng cho công việc hiện tại)
| File | Lý do archive |
|---|---|
| docs/history/CV_SAAS_MASTER_PLAN_v3.md | Thay bởi v4 |
| docs/history/ROADMAP_PHASE0.md | Phase 0 hoàn thành, thay bởi ROADMAP_PHASE1 |
| docs/history/PHASE0_STATUS_REPORT_v2.md | Phase 0 report cuối cùng |
| docs/history/CV_SAAS_MASTER_PLAN_v3_ARCHIVED_2026-04-12.md | Bản lưu trước khi v4 |
| docs/history/linux-mount-setup.md | Hướng dẫn cũ, nội dung đã vào ENVIRONMENT |

