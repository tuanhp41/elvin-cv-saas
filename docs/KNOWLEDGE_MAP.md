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

## Link nhanh
| File | Role | Priority |
|---|---|---|
| [[CURRENT_STATE]] | Snapshot session | 🔴 |
| [[ENVIRONMENT]] | Machine setup | 🔴 |
| [[DECISIONS]] | Kỹ thuật & rationale | 🟡 |
| [[ROADMAP_PHASE1]] | Chi tiết công việc | 🟡 |
| [[CODING_STANDARDS]] | Luật code | 🟡 |
| [[EXPERIMENTS]] | Kết quả test | 🟡 |
| [[RISK_LOG]] | Rủi ro | 🟡 |
| [[wiki/compiled/knowledge]] | AI context dump | 🟢 |
