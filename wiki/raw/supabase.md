# Supabase — LLM Wiki
# Project: CV SaaS | Stack position: Database + Auth
# Last updated: 2026-04-11

## Phiên bản đang dùng
- Supabase (cloud managed — free tier)
- PostgreSQL (underlying DB)
- @supabase/supabase-js v2

## Client Setup (lib/supabase.js — SACRED FILE)
```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Service role client (server-side only — KHÔNG expose ra client)
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
```

## Database Schema (Phase 1)
```sql
-- Users table (managed by Supabase Auth — không tạo thủ công)

-- CVs table
CREATE TABLE cvs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  language TEXT CHECK (language IN ('vi', 'en', 'zh')),
  template_id TEXT NOT NULL,
  content JSONB NOT NULL,        -- CV content structure
  ai_generated BOOLEAN DEFAULT false,
  is_paid BOOLEAN DEFAULT false, -- watermark unlock status
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  cv_id UUID REFERENCES cvs(id),
  amount INTEGER NOT NULL,       -- VNĐ
  payos_order_id TEXT UNIQUE,
  status TEXT CHECK (status IN ('pending', 'paid', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Row Level Security (RLS) — BẮT BUỘC trước launch
```sql
-- Enable RLS
ALTER TABLE cvs ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Users chỉ xem CV của mình
CREATE POLICY "Users see own CVs" ON cvs
  FOR ALL USING (auth.uid() = user_id);

-- Users chỉ xem payment của mình
CREATE POLICY "Users see own payments" ON payments
  FOR ALL USING (auth.uid() = user_id);
```
**⚠️ RLS là Phase Gate 1 requirement — không deploy production nếu chưa có**

## Auth Pattern (email/password)
```javascript
// Đăng ký
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password',
});

// Đăng nhập
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password',
});

// Lấy user hiện tại (client-side)
const { data: { user } } = await supabase.auth.getUser();

// Trong API route (server-side) — dùng cookie
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
const supabase = createServerSupabaseClient({ req, res });
const { data: { user } } = await supabase.auth.getUser();
```

## CRUD Pattern
```javascript
// INSERT
const { data, error } = await supabase
  .from('cvs')
  .insert({ user_id: user.id, title: 'My CV', ... })
  .select()
  .single();

// SELECT
const { data: cvs } = await supabase
  .from('cvs')
  .select('*')
  .eq('user_id', user.id)
  .order('created_at', { ascending: false });

// UPDATE
const { data } = await supabase
  .from('cvs')
  .update({ is_paid: true })
  .eq('id', cvId)
  .eq('user_id', user.id); // double-check ownership

// DELETE
await supabase.from('cvs').delete().eq('id', cvId);
```

## Free Tier Limits
- Database: 500MB
- Rows: 50,000
- Auth users: unlimited
- Storage: 1GB
- **Monitor:** Khi DB > 400MB hoặc rows > 40k → plan upgrade (xem RISK_LOG.md R02)

## Lệnh thường dùng
```bash
# Supabase CLI (nếu cần local dev)
npx supabase init
npx supabase start        # Local Supabase instance
npx supabase db diff      # Diff schema
npx supabase db push      # Push migrations
```

## Liên quan đến dự án
- Auth: email/password (Phase 1) — không dùng OAuth để đơn giản
- Storage: không dùng (CV là HTML text, không có file upload)
- Functions: không dùng (dùng Next.js API routes thay)
- Realtime: không dùng (không cần live updates trong Phase 1)
