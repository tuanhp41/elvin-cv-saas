# Architecture & Project Summary — LLM Wiki
# Project: CV SaaS | Phase 1 (MVP)
# Last updated: 2026-04-12

## Cấu trúc thư mục hiện tại (Phase 1)
\`\`\`
src/
├── pages/
│   ├── index.jsx              ← Landing page
│   ├── create.jsx             ← Main CV Builder page (Form + Templates)
│   ├── _app.jsx               ← Global app wrapper
│   ├── _document.jsx          ← Custom document
│   ├── auth/
│   │   ├── login.jsx          ← Login page
│   │   └── register.jsx       ← Register page
│   ├── preview/
│   │   └── [id].jsx           ← CV Preview page
│   └── api/
│       ├── ai/
│       │   ├── rewrite.js     ← Multi-model AI rewrite endpoint
│       │   └── evaluate.js    ← AI output evaluation endpoint
│       ├── cv/
│       │   └── save.js        ← API to save CV to Supabase
│       └── payment/
│           ├── create.js      ← PayOS create payment link
│           └── webhook.js     ← PayOS webhook listener
├── components/
│   ├── ui/                    ← Basic shadcn UI components (Button, Input, etc.)
│   ├── features/
│   │   ├── CVForm.jsx         ← Modular form for CV inputs
│   │   ├── TemplatePicker.jsx ← Component to pick a template
│   │   └── templates/         ← CV Templates (Professional, Modern, Executive)
│   └── layout/
│       └── Header.jsx         ← Main Navigation Header
└── lib/
    ├── utils.js               ← Tailwind cn() utility
    ├── supabase.js            ← Supabase Client connection
    ├── gemma.js               ← Gemma / Generic AI API Client
    ├── payos.js               ← PayOS Client configuration
    ├── cv-schema.js           ← JSON Schema definitions for CV data
    └── ai/                    ← Multi-model AI configurations
        ├── router.js          ← Model Router decision tree
        ├── qwen-client.js     ← Qwen API integration
        ├── groq-client.js     ← Groq API integration
        ├── evaluator.js       ← Grading rubric logic
        └── prompts.js         ← Core CV rewrite prompts
\`\`\`

## Cơ Sở Dữ Liệu - Supabase Schema
- **users**: Quản lý bởi Supabase Auth (email/password).
- **cvs**: id (UUID), user_id, title, language, template_id, content (JSONB), is_paid, created_at, updated_at.
- **payments**: id, user_id, cv_id, amount, payos_order_id, status.

## Pipeline các API Endpoints
- \`/api/ai/rewrite\`: Chuyển đổi dữ liệu Form của người dùng thành CV theo chuẩn Vi/En/Zh. Route thông qua Gemma (mặc định), Qwen (nếu Zh), hoặc Groq.
- \`/api/payment/create\`: Khởi tạo session thanh toán để xoá Watermark.
- \`/api/payment/webhook\`: Listener nhận cập nhật trạng thái thanh toán từ PayOS, tự động cập nhật \`cvs.is_paid = true\`.
