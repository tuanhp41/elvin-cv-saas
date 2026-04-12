# ARCHITECTURE.md
# Source of truth cho folder structure — AI không được tạo ngoài đây

## Folder Structure (FROZEN)
```
src/
├── components/
│   ├── ui/          # shadcn + base: Button, Input, Badge
│   ├── features/    # CV form, CV preview, payment modal
│   └── layout/      # Header, Footer, PageWrapper
├── pages/           # Next.js routes
│   ├── index.jsx    # Landing
│   ├── create.jsx   # Tạo CV
│   └── api/         # API routes
├── lib/             # Clients — KHÔNG đổi tên file này
│   ├── gemma.js     # Gemma API client
│   ├── supabase.js  # Supabase client
│   └── payos.js     # PayOS client
└── wiki/            # LLM Wiki markdown

automation/
├── n8n/             # n8n workflow JSON exports
└── scripts/         # Python scripts
```

## Data Flow (1 chiều — không reverse)
```
User Input → pages/ → lib/gemma.js → CV Output
                   → lib/supabase.js → Database
                   → lib/payos.js → Payment
```

## Naming Conventions
- Components: PascalCase (CVForm.jsx)
- Files: kebab-case
- API routes: /api/[resource]/[action]
- Wiki files: kebab-case.md

## Sacred Files (AI không được xóa hoặc rename)
- lib/gemma.js
- lib/supabase.js
- lib/payos.js
- [[SPEC]]
- [[CLAUDE]]
- [[DECISIONS]]
- .antigravity-rules
