# CODING_STANDARDS.md — CV SaaS Project
# Tài liệu này là LUẬT — mọi AI coder và con người PHẢI tuân thủ
# Ref: [[DECISIONS]] D010 | Created by: Opus | Phase: 1
# Links: [[ARCHITECTURE]] | [[SPEC]] | [[ROADMAP_PHASE1]]
# Last updated: 2026-04-12

---

## MỤC ĐÍCH

File này quy định cách viết code cho **mọi contributor** — bao gồm:
- Con người (bạn - project owner)
- Antigravity (Opus, Sonnet, Gemini Pro)
- Free AI APIs (Gemma, Qwen, Groq) khi chạy qua pipeline

**Nếu code không tuân thủ file này → sẽ bị reject khi review.**

---

## 1. CẤU TRÚC THƯ MỤC (FROZEN)

```
src/
├── pages/              ← Route = file name (Next.js Pages Router)
│   ├── index.jsx       ← Landing page
│   ├── dashboard.jsx   ← User dashboard (protected)
│   ├── create.jsx      ← CV builder
│   ├── auth/
│   │   ├── login.jsx
│   │   └── register.jsx
│   ├── preview/
│   │   └── [id].jsx    ← Dynamic route
│   ├── admin/          ← Admin-only pages
│   └── api/            ← API routes (server-side)
│       ├── ai/
│       ├── cv/
│       └── payment/
├── components/
│   ├── ui/             ← Reusable primitives (Button, Input, Card...)
│   ├── features/       ← Business components (CVForm, TemplatePicker...)
│   └── layout/         ← Structural (Header, Footer, PageWrapper...)
├── hooks/              ← Custom React hooks
│   └── useAuth.js
├── lib/                ← External service clients & utilities
│   ├── supabase.js     ← Supabase client (SACRED)
│   ├── gemma.js        ← AI client (SACRED)
│   ├── payos.js        ← Payment client (SACRED)
│   ├── utils.js        ← cn() helper
│   └── ai/             ← Multi-model AI router & clients
└── styles/
    └── globals.css     ← Design tokens (shadcn)
```

**Quy tắc:**
- KHÔNG tạo folder mới ngoài cấu trúc trên mà chưa có approval
- Files trong `lib/` đánh dấu SACRED = chỉ sửa khi có Decision (DECISIONS.md)
- Mỗi page = 1 file `.jsx` trong `pages/`
- Mỗi API route = 1 file `.js` trong `pages/api/`

---

## 2. NAMING CONVENTIONS

### 2.1 Files & Folders

| Loại | Convention | Ví dụ |
|---|---|---|
| Pages | `kebab-case.jsx` | `dashboard.jsx`, `create.jsx` |
| Components | `PascalCase.jsx` | `CVForm.jsx`, `Header.jsx`, `Button.jsx` |
| Hooks | `camelCase.js`, prefix `use` | `useAuth.js`, `useCV.js` |
| Lib/Utils | `kebab-case.js` | `supabase.js`, `cv-schema.js` |
| API routes | `kebab-case.js` | `rewrite.js`, `webhook.js` |
| CSS | `kebab-case.css` | `globals.css` |

### 2.2 Variables & Functions

```javascript
// ✅ ĐÚNG
const userName = 'Tuan';              // camelCase variables
const isActive = true;                // boolean prefix: is/has/can/should
const MAX_RETRIES = 3;                // UPPER_SNAKE_CASE constants
function handleSubmit() {}            // camelCase functions, prefix: handle/on/get/set/fetch
export default function CVForm() {}   // PascalCase components

// ❌ SAI
const user_name = 'Tuan';            // snake_case
const active = true;                  // boolean không có prefix
function submit() {}                  // function tên quá chung
export default function cvform() {}   // component không PascalCase
```

### 2.3 Event Handlers

```javascript
// Pattern: handle + Action
const handleSubmit = () => {};
const handleInputChange = () => {};
const handleDeleteCV = () => {};

// Khi truyền props → dùng prefix on
<CVForm onSubmit={handleSubmit} onChange={handleInputChange} />
```

---

## 3. IMPORT ORDER (Bắt buộc)

Mỗi file phải import theo thứ tự sau, ngăn cách bằng dòng trống:

```javascript
// 1. React / Next.js built-ins
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

// 2. External libraries (npm packages)
import { clsx } from 'clsx';

// 3. Internal: lib/ (service clients, utils)
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

// 4. Internal: hooks/
import { useAuth } from '@/hooks/useAuth';

// 5. Internal: components/ (UI trước, features sau, layout cuối)
import Button from '@/components/ui/Button';
import CVForm from '@/components/features/CVForm';
import Header from '@/components/layout/Header';

// 6. Styles (chỉ dùng khi cần CSS Modules — hiếm)
import styles from './Component.module.css';
```

**Luôn dùng `@/` alias** — không dùng relative paths như `../../lib/supabase`.

---

## 4. COMPONENT PATTERNS

### 4.1 Component Structure (Template)

```jsx
// PascalCase file: src/components/features/ExampleCard.jsx

import { useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * ExampleCard — Hiển thị 1 card ví dụ
 * @param {string} title - Tiêu đề card
 * @param {string} className - CSS classes bổ sung
 * @param {function} onAction - Callback khi user click action
 */
export default function ExampleCard({ title, className, onAction }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async () => {
    setIsLoading(true);
    try {
      await onAction();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('p-6 border rounded-xl shadow-sm bg-card', className)}>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <button
        onClick={handleAction}
        disabled={isLoading}
        className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium text-sm disabled:opacity-50"
      >
        {isLoading ? 'Đang xử lý...' : 'Thực hiện'}
      </button>
    </div>
  );
}
```

**Quy tắc component:**
1. `export default function` — không dùng arrow function cho component export
2. JSDoc comment trước component — mô tả props
3. `className` prop luôn merge bằng `cn()` helper
4. Loading states → dùng `isLoading` state + `disabled:opacity-50`
5. Destructure props trực tiếp trong function signature
6. KHÔNG dùng `React.FC` hoặc TypeScript (chưa migrate)

### 4.2 Page Component Pattern

```jsx
// src/pages/example.jsx

import { useState } from 'react';
import Head from 'next/head';

import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/layout/Header';

export default function ExamplePage() {
  const { user, loading } = useAuth(true); // true = protected page

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Đang tải...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Tên trang | CV SaaS</title>
        <meta name="description" content="Mô tả trang" />
      </Head>
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Page content */}
      </main>
    </>
  );
}
```

**Quy tắc page:**
1. Mỗi page PHẢI có `<Head>` với `<title>` và `<meta description>`
2. Title format: `Tên trang | CV SaaS`
3. Protected pages → `useAuth(true)` + loading spinner
4. Public pages → `useAuth(false)` hoặc không gọi
5. Layout: `<Header />` + `<main className="container mx-auto px-4 pt-24 pb-16">`
6. `pt-24` bù cho fixed header (h-14 + padding)

---

## 5. API ROUTE PATTERNS

### 5.1 Standard API Route

```javascript
// src/pages/api/cv/save.js

export default async function handler(req, res) {
  // 1. Method check
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 2. Input validation
    const { title, content, language } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Thiếu trường bắt buộc: title, content' });
    }

    // 3. Auth check (nếu cần)
    // const user = await getUser(req, res);
    // if (!user) return res.status(401).json({ error: 'Unauthorized' });

    // 4. Business logic
    const result = await saveToDatabase({ title, content, language });

    // 5. Success response
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    // 6. Error response
    console.error('[API] /api/cv/save error:', error.message);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
}
```

### 5.2 Response Shape (BẮT BUỘC)

```javascript
// ✅ Success response — LUÔN có success + data
{ "success": true, "data": { ... } }

// ✅ Error response — LUÔN có error string
{ "success": false, "error": "Mô tả lỗi rõ ràng" }

// ❌ SAI — không nhất quán
{ "result": { ... } }
{ "message": "OK" }
{ "err": "something" }
```

### 5.3 Logging

```javascript
// Prefix log lines bằng [API] + route path
console.error('[API] /api/cv/save error:', error.message);
console.log('[API] /api/ai/rewrite called for lang:', language);

// KHÔNG dùng:
console.log(error);                // Không có context
console.log('Error happened');     // Không có detail
```

---

## 6. SUPABASE PATTERNS

### 6.1 Client Usage

```javascript
// Client-side (browser): dùng supabase từ lib/supabase.js
import { supabase } from '@/lib/supabase';

// Service role (API routes only, bypass RLS): tạo riêng
import { createClient } from '@supabase/supabase-js';
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
```

### 6.2 Query Pattern

```javascript
// INSERT — luôn .select().single() để lấy kết quả
const { data, error } = await supabase
  .from('cvs')
  .insert({ user_id: user.id, title, content, language })
  .select()
  .single();

if (error) throw new Error(error.message);

// SELECT — luôn filter by user_id (RLS backup)
const { data: cvs, error } = await supabase
  .from('cvs')
  .select('*')
  .eq('user_id', user.id)
  .order('created_at', { ascending: false });

// UPDATE — double-check ownership
const { data, error } = await supabase
  .from('cvs')
  .update({ is_paid: true })
  .eq('id', cvId)
  .eq('user_id', user.id)   // ← BẮT BUỘC: verify ownership
  .select()
  .single();

// DELETE
const { error } = await supabase
  .from('cvs')
  .delete()
  .eq('id', cvId)
  .eq('user_id', user.id);   // ← BẮT BUỘC
```

**Quy tắc:**
- LUÔN filter bằng `user_id` — RLS là safety net, không phải thay thế
- LUÔN check `error` — throw hoặc return error response
- KHÔNG gọi Supabase trực tiếp từ component — qua hook hoặc API route

---

## 7. STATE MANAGEMENT

### 7.1 Client State (React hooks only — NO Redux)

```javascript
// Simple state
const [email, setEmail] = useState('');
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);

// Form with multiple fields → dùng 1 object
const [formData, setFormData] = useState({
  fullName: '',
  email: '',
  phone: '',
  experience: '',
  education: '',
  skills: '',
});

// Update 1 field
const handleFieldChange = (field, value) => {
  setFormData(prev => ({ ...prev, [field]: value }));
};
```

### 7.2 Async Operations Pattern

```javascript
// Standard async pattern cho mọi API calls
const [data, setData] = useState(null);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);

const fetchData = async () => {
  setIsLoading(true);
  setError(null);
  try {
    const response = await fetch('/api/cv/list');
    const json = await response.json();
    if (!json.success) throw new Error(json.error);
    setData(json.data);
  } catch (err) {
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
};
```

**Quy tắc:**
- KHÔNG dùng Redux, Zustand, Jotai, hoặc bất kỳ state library nào
- Auth state → `useAuth()` hook duy nhất
- Form state → `useState` trong component
- Server state → `useState` + `useEffect` (hoặc SWR nếu complexity tăng — Phase 2+)

---

## 8. STYLING (Tailwind CSS + shadcn Design Tokens)

### 8.1 Design Tokens — ĐÃ ĐỊNH NGHĨA trong globals.css

```
Dùng semantic tokens thay vì hardcode màu:

✅ ĐÚNG (semantic):
  bg-background, text-foreground
  bg-primary, text-primary-foreground
  bg-card, text-card-foreground
  bg-muted, text-muted-foreground
  bg-destructive, text-destructive-foreground
  border-border, border-input

❌ SAI (hardcode):
  bg-white, text-black
  bg-blue-600 (dùng bg-primary thay thế)
  bg-gray-100 (dùng bg-muted thay thế)
```

**Ngoại lệ:** Có thể dùng gray-50/100/200 cho subtle backgrounds khi semantic tokens không khớp (VD: auth pages hiện tại dùng `bg-gray-50`).

### 8.2 Common Utility Patterns

```jsx
// Container: sử dụng container preset
<div className="container mx-auto px-4">

// Card pattern:
<div className="p-6 border rounded-xl shadow-sm bg-card">

// Form input pattern:
<input className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />

// Button primary:
<button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium text-sm disabled:opacity-50">

// Button destructive:
<button className="bg-destructive text-destructive-foreground hover:bg-destructive/90 px-4 py-2 rounded-md font-medium text-sm">

// Button ghost:
<button className="hover:bg-accent hover:text-accent-foreground px-4 py-2 rounded-md text-sm">

// Error alert:
<div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded">

// Success alert:
<div className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded">
```

### 8.3 cn() Utility — Merge Classes

```jsx
import { cn } from '@/lib/utils';

// Dùng cn() khi component nhận className prop
<div className={cn('p-6 border rounded-xl', className)}>

// Dùng cn() cho conditional classes
<button className={cn(
  'px-4 py-2 rounded-md font-medium text-sm',
  isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
)}>
```

---

## 9. ERROR HANDLING

### 9.1 Client-Side

```jsx
// Mọi component có async operation phải hiển thị 3 states:
// 1. Loading state
{isLoading && <p className="text-gray-500">Đang tải...</p>}

// 2. Error state
{error && (
  <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded">
    {error}
  </div>
)}

// 3. Success/data state
{data && <div>...</div>}
```

### 9.2 Server-Side (API Routes)

```javascript
// try-catch BẮT BUỘC trong mọi API route
try {
  // logic
  return res.status(200).json({ success: true, data: result });
} catch (error) {
  console.error('[API] /api/path error:', error.message);
  return res.status(500).json({ success: false, error: error.message });
}
```

---

## 10. SECURITY RULES (Phase 1)

1. **Không hardcode secrets** — dùng `.env.local` + `process.env`
2. **Validate input** trong API routes trước khi xử lý
3. **RLS trên Supabase** — mọi table phải có RLS enabled
4. **Double-check ownership** — `user_id` filter trong mọi query
5. **Sanitize AI input** — `sanitizeInput()` trước khi gửi lên model
6. **Webhook verify** — `verifyPaymentWebhookData()` trước khi xử lý payment
7. **Service role key** — ONLY in API routes, NEVER expose to client

---

## 11. GIT CONVENTIONS

### 11.1 Commit Messages

```
type(scope): mô tả ngắn gọn

Types:
  feat     — tính năng mới
  fix      — sửa bug
  docs     — thay đổi documentation
  style    — format code (không thay đổi logic)
  refactor — restructure code (không thay đổi behavior)
  test     — thêm/sửa tests
  chore    — config, dependencies, CI

Scopes (ví dụ):
  auth, cv, ai, payment, ui, docs, config

Ví dụ:
  feat(auth): setup login/register with Supabase
  fix(ai): handle Gemma API timeout gracefully
  docs(roadmap): update Phase 1 timing
  chore(deps): add @google/generative-ai package
```

### 11.2 Branch Strategy (Phase 1)

- Hiện tại: commit thẳng `main` (solo dev + AI coder)
- Khi pipeline chạy (Stage 3): AI tạo branch `ai/task-name` → human merge

---

## 12. AI-SPECIFIC RULES

### 12.1 Dành cho mọi AI coder (Antigravity + Free APIs)

1. **ĐỌC FILE NÀY TRƯỚC KHI CODE** — không có ngoại lệ
2. **ĐỌC `wiki/compiled/knowledge.md`** — hiểu architecture + business logic
3. **KHÔNG tạo file ngoài cấu trúc Section 1** — nếu cần, ghi vào comment
4. **KHÔNG cài package mới** mà không có approval
5. **KHÔNG sửa file SACRED** (lib/supabase.js, lib/gemma.js, lib/payos.js)
6. **COPY pattern từ Section 4-5** — không sáng tạo pattern mới
7. **Response shape theo Section 5.2** — không tự nghĩ format mới
8. **Import order theo Section 3** — ESLint sẽ catch

### 12.2 Checklist trước khi submit code

```
[ ] Import order đúng (Section 3)?
[ ] Component đặt tên PascalCase?
[ ] Page có <Head> với title + meta?
[ ] Protected page có useAuth(true)?
[ ] API route có try-catch + response shape chuẩn?
[ ] Supabase query có filter user_id?
[ ] Loading state hiển thị?
[ ] Error state hiển thị?
[ ] Dùng semantic tokens (không hardcode màu)?
[ ] cn() cho className prop merge?
[ ] Commit message đúng format?
```

### 12.3 Khi Free AI tạo code qua pipeline

Code phải đi qua review trước khi merge:
1. Free AI generate code → save to branch `ai/task-xxx`
2. Reviewer AI (hoặc Gemini Pro) check theo checklist 12.2
3. Nếu fail → reject + feedback → retry
4. Nếu pass → human review → merge to main

---

## 13. ANTI-PATTERNS (KHÔNG BAO GIỜ LÀM)

```javascript
// ❌ 1. Fetch data in component body (ngoài useEffect)
export default function Page() {
  const data = fetch('/api/data'); // SAI — gọi mỗi render
}

// ❌ 2. Expose secrets
const apiKey = 'sk-abc123'; // NEVER

// ❌ 3. Supabase without user filter
const { data } = await supabase.from('cvs').select('*'); // SAI — lấy hết

// ❌ 4. Inline styles
<div style={{ color: 'red' }}>  // SAI — dùng Tailwind

// ❌ 5. console.log in production code
console.log('debug here'); // SAI — dùng trong dev only, cleanup trước commit

// ❌ 6. Nested ternary
{a ? (b ? <X/> : <Y/>) : <Z/>}  // SAI — dùng if/else hoặc early return

// ❌ 7. God component (>200 lines)
// Tách thành sub-components nếu vượt 200 lines

// ❌ 8. Circular imports
// lib/supabase.js import lib/gemma.js → gemma.js import supabase.js = ĐỔ

// ❌ 9. Any external API call from client-side
// LUÔN gọi qua /api/ routes — không gọi Gemma/PayOS trực tiếp từ browser
```

---

## 14. FILE SIZE LIMITS

| Loại | Max lines | Hành động khi vượt |
|---|---|---|
| Component (ui/) | 100 | Tách thành sub-components |
| Component (features/) | 200 | Tách logic vào hooks |
| Page | 150 | Tách sections thành components |
| API route | 100 | Tách logic vào lib/ helpers |
| Hook | 80 | Tách thành smaller hooks |
| Lib file | 150 | Tách thành modules |

---

## 15. ENVIRONMENT VARIABLES

```bash
# .env.local — KHÔNG commit, mỗi máy tự tạo
# Copy .env.example rồi điền giá trị thật

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# AI Models
GEMMA_API_KEY=AIzaSyxxx...              # Google AI Studio
QWEN_API_KEY=sk-xxx...                  # Alibaba DashScope (Phase 1+)
GROQ_API_KEY=gsk_xxx...                 # Groq (Phase 1+)

# Payment
PAYOS_CLIENT_ID=xxx
PAYOS_API_KEY=xxx
PAYOS_CHECKSUM_KEY=xxx

# App
NEXT_PUBLIC_URL=http://localhost:3000    # hoặc Vercel URL
```

---

*CODING_STANDARDS.md v1.0 — Created by Opus (Phase 1, Stage 1)*
*Revision control: Chỉ Opus được sửa file này. Đề xuất thay đổi → ghi vào DECISIONS.md.*
