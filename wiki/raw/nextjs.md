# Next.js 14 — LLM Wiki
# Project: CV SaaS | Stack position: Frontend + API Routes
# Last updated: 2026-04-11

## Phiên bản đang dùng
- Next.js 14 (App Router hoặc Pages Router — dự án này dùng Pages Router)
- Node.js 20 LTS
- React 18

## Cấu trúc folder (theo ARCHITECTURE.md — FROZEN)
```
src/
├── pages/
│   ├── index.jsx        ← Landing page
│   ├── create.jsx       ← CV builder page
│   ├── _app.jsx         ← Global layout wrapper
│   └── api/
│       ├── cv/
│       │   ├── generate.js   ← POST: AI generate CV
│       │   └── save.js       ← POST: Save CV to Supabase
│       └── payment/
│           └── webhook.js    ← POST: PayOS webhook handler
├── components/
│   ├── ui/              ← shadcn base components
│   ├── features/        ← CVForm, CVPreview, PaymentModal
│   └── layout/          ← Header, Footer, PageWrapper
└── lib/
    ├── gemma.js          ← Gemma API client (SACRED)
    ├── supabase.js       ← Supabase client (SACRED)
    └── payos.js          ← PayOS client (SACRED)
```

## API Routes Pattern
```javascript
// pages/api/cv/generate.js — standard pattern
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    // business logic
    const result = await processCV(req.body);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

## Environment Variables
```
# .env.local (KHÔNG commit vào Git)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GEMMA_API_KEY=           ← Google AI Studio key
PAYOS_CLIENT_ID=
PAYOS_API_KEY=
PAYOS_CHECKSUM_KEY=
```

## Deployment
- Platform: Vercel (free tier)
- Auto-deploy: push to main → deploy tự động
- Preview: mỗi PR có preview URL riêng

## Data Flow (1 chiều — không reverse)
```
User Input (pages/)
  → lib/gemma.js      → AI CV output
  → lib/supabase.js   → Save to DB
  → lib/payos.js      → Payment processing
```

## Anti-patterns (KHÔNG làm)
- Không gọi Supabase trực tiếp từ client-side (dùng API route)
- Không lưu API keys trong code (dùng .env.local)
- Không tạo circular imports giữa lib/ files
- Không dùng `any` type nếu dùng TypeScript

## Lệnh thường dùng
```bash
npm run dev          # Start dev server (port 3000)
npm run build        # Production build
npm audit            # Security check — chạy trước mỗi deploy
npx next info        # Debug Next.js config
```

## Liên quan đến dự án này
- CV form hỗ trợ 3 ngôn ngữ: Vietnamese, English, Chinese (Zh)
- Template picker: 3 mẫu HTML (Vi format, En format, Zh/FDI format)
- Watermark logic: hiển thị watermark → unlock sau PayOS payment
- Rate limit: 10 AI requests/ngày/user (free tier protection)
