# CV SaaS — LLM Knowledge Base (compiled)
# Tự động compile từ wiki/raw/ — KHÔNG edit file này trực tiếp
# Sửa ở: wiki/raw/[filename].md → chạy lại compile_wiki.py
# Last compiled: 2026-04-11 10:34:12
# Source files: 5 files

---

## HOW TO USE THIS FILE
Đây là knowledge base tổng hợp cho tất cả AI coders làm việc với dự án CV SaaS.
Khi được hỏi về stack, patterns, hoặc business logic của dự án này,
câu trả lời nằm trong file này — không cần search internet.

Stack (FROZEN): Next.js 14 | Supabase | Gemma 4 API | PayOS | Vercel | Tailwind + shadcn/ui
Server: Ubuntu 24.04 | Tailscale 100.67.85.6 | Ollama (gemma4:latest) | n8n Docker
IDE: Antigravity trên Windows | Code qua L:\ (Samba mount)

---

============================================================
## SOURCE: wiki/raw/nextjs.md
============================================================

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


============================================================
## SOURCE: wiki/raw/supabase.md
============================================================

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


============================================================
## SOURCE: wiki/raw/gemma-api.md
============================================================

# Gemma API — LLM Wiki
# Project: CV SaaS | Stack position: AI Engine (primary)
# Last updated: 2026-04-11

## Models đang dùng
- **Primary (API):** Gemma 4 via Google AI Studio — free tier (1000 req/day)
- **Local fallback:** gemma4:latest (9.6GB, Ollama, RTX3060 12GB)
- **Backup local:** gemma3:12b (8.1GB, Ollama)

## Client Setup (lib/gemma.js — SACRED FILE)
```javascript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMMA_API_KEY);

// Primary: Gemma 4 API
export const gemmaAPI = genAI.getGenerativeModel({
  model: 'gemma-3-27b-it', // hoặc model ID mới nhất
});

// Local fallback: Ollama
export async function callLocal(prompt) {
  const response = await fetch('http://100.67.85.6:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gemma4:latest',
      prompt,
      stream: false,
    }),
  });
  const data = await response.json();
  return data.response;
}
```

## Intelligent Model Router (lib/gemma.js)
```javascript
export async function generateCV(prompt, context = {}) {
  const { tokenCount = 0, forceLocal = false } = context;

  // Decision tree từ ARCHITECTURE.md/Master Plan
  if (forceLocal || tokenCount > 8000) {
    // Long context → local (RTX3060 có thể handle)
    return await callLocal(prompt);
  }

  try {
    // Primary: Cloud API
    const result = await gemmaAPI.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    // Fallback: local nếu API fail
    console.error('Gemma API failed, falling back to local:', error);
    return await callLocal(prompt);
  }
}
```

## Prompt Engineering — CV Rewrite Task
```javascript
export function buildCVPrompt(cvData, language) {
  const langInstructions = {
    vi: 'Viết bằng tiếng Việt, văn phong chuyên nghiệp',
    en: 'Write in professional English, ATS-friendly format',
    zh: '用中文写，符合中国FDI企业简历格式标准',
  };

  return `Bạn là chuyên gia viết CV chuyên nghiệp.

Nhiệm vụ: Cải thiện CV sau để ${langInstructions[language]}.

Nguyên tắc:
1. Giữ nguyên facts (công ty, vị trí, thời gian) — không bịa
2. Dùng động từ mạnh (achieved, implemented, optimized)
3. Thêm số liệu nếu có thể suy ra hợp lý
4. Format nhất quán
5. Độ dài: tối đa 1 trang A4

CV hiện tại:
${JSON.stringify(cvData, null, 2)}

Trả về CHỈ nội dung CV đã cải thiện, không giải thích thêm.`;
}
```

## Prompt Injection Defense
```javascript
// Áp dụng trước khi đưa user input vào prompt
export function sanitizeInput(input) {
  return input
    .replace(/ignore.*instructions?/gi, '')
    .replace(/system\s*prompt/gi, '')
    .replace(/\[INST\]|\[\/INST\]/g, '')
    .slice(0, 3000); // Hard limit
}
```

## Quality Scoring (AI Output)
```javascript
// Rubric 10 điểm — ghi vào EXPERIMENTS.md khi test
// 1. Completeness (0-3): Đầy đủ mục cần thiết
// 2. Language quality (0-3): Tự nhiên, không robotic
// 3. ATS keywords (0-2): Keywords phù hợp ngành
// 4. Format compliance (0-2): Đúng format Vi/En/Zh
// Ngưỡng acceptable: >= 7/10
```

## Ollama API (local server)
```bash
# Endpoints (chạy tại 100.67.85.6:11434)
GET  /api/tags          # List available models
POST /api/generate      # Generate (non-streaming)
POST /api/chat          # Chat format
POST /api/embeddings    # Get embeddings

# Test từ Windows
curl http://100.67.85.6:11434/api/tags
```

## Rate Limit & Quota Management
```javascript
// Free tier: 1000 requests/day
// Monitor: check trước 8:00 mỗi ngày

// Simple rate limiter (Phase 1)
// Dùng Supabase để count requests per user per day
const today = new Date().toISOString().split('T')[0];
const { count } = await supabase
  .from('ai_requests')
  .select('*', { count: 'exact' })
  .eq('user_id', userId)
  .gte('created_at', today);

if (count >= 10) throw new Error('Daily limit reached');
```

## Environment Variables
```
GEMMA_API_KEY=          ← Google AI Studio → Get API Key
                          (free tier: 1000 req/day, 32k context)
```

## Liên quan đến dự án
- CV rewrite là use case chính — prompt engineering quan trọng nhất
- Fallback chain: Gemma API → Local gemma4 → Local gemma3:12b
- Ollama endpoint: http://100.67.85.6:11434 (accessible qua Tailscale)
- VRAM budget: gemma4 chiếm ~7.2GB / 12GB RTX3060
- Xem DECISIONS.md → D002: Chọn gemma4:latest


============================================================
## SOURCE: wiki/raw/payos.md
============================================================

# PayOS — LLM Wiki
# Project: CV SaaS | Stack position: Payment Gateway (Vietnam)
# Last updated: 2026-04-11

## Giới thiệu
- PayOS: cổng thanh toán Việt Nam, hỗ trợ QR code banking
- Phù hợp cho cá nhân kinh doanh (không cần đăng ký doanh nghiệp lớn)
- API đơn giản, webhook-based
- Hỗ trợ: VietQR, chuyển khoản ngân hàng

## Client Setup (lib/payos.js — SACRED FILE)
```javascript
import PayOS from '@payos/node';

const payos = new PayOS(
  process.env.PAYOS_CLIENT_ID,
  process.env.PAYOS_API_KEY,
  process.env.PAYOS_CHECKSUM_KEY
);

export default payos;
```

## Pricing Model (từ SPEC.md)
```
Tạo CV lần đầu + tài khoản:  50,000 VNĐ
Thêm ngôn ngữ:                10,000 VNĐ
Chỉnh sửa:                     5,000 VNĐ/lần
```

## Tạo Payment Link
```javascript
// pages/api/payment/create.js
import payos from '@/lib/payos';

export default async function handler(req, res) {
  const { cvId, type } = req.body; // type: 'create' | 'add_lang' | 'edit'

  const amounts = { create: 50000, add_lang: 10000, edit: 5000 };

  const paymentData = {
    orderCode: Date.now(),          // Unique order ID (số nguyên)
    amount: amounts[type],
    description: `CV SaaS - ${type}`.substring(0, 25), // max 25 chars
    cancelUrl: `${process.env.NEXT_PUBLIC_URL}/payment/cancel`,
    returnUrl: `${process.env.NEXT_PUBLIC_URL}/payment/success`,
    // Optional: expiredAt (unix timestamp)
  };

  const response = await payos.createPaymentLink(paymentData);
  // response.checkoutUrl → redirect user đến đây
  res.json({ paymentUrl: response.checkoutUrl, orderId: paymentData.orderCode });
}
```

## Webhook Handler — Quan trọng nhất
```javascript
// pages/api/payment/webhook.js
import payos from '@/lib/payos';
import { supabaseAdmin } from '@/lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  // 1. Verify webhook signature
  const webhookData = payos.verifyPaymentWebhookData(req.body);

  if (!webhookData) {
    return res.status(400).json({ error: 'Invalid signature' });
  }

  // 2. Check payment status
  if (webhookData.code === '00') { // '00' = success
    const orderCode = webhookData.orderCode;

    // 3. Idempotency check — tránh xử lý 2 lần
    const { data: existing } = await supabaseAdmin
      .from('payments')
      .select('id')
      .eq('payos_order_id', orderCode.toString())
      .single();

    if (existing) {
      return res.status(200).json({ message: 'Already processed' });
    }

    // 4. Cập nhật DB — dùng supabaseAdmin (bypass RLS)
    const { data: payment } = await supabaseAdmin
      .from('payments')
      .update({ status: 'paid' })
      .eq('payos_order_id', orderCode.toString())
      .select('cv_id')
      .single();

    if (payment?.cv_id) {
      await supabaseAdmin
        .from('cvs')
        .update({ is_paid: true })
        .eq('id', payment.cv_id);
    }
  }

  // PayOS yêu cầu response 200 ngay lập tức
  res.status(200).json({ message: 'OK' });
}
```

## Idempotency Key — Tại sao quan trọng
PayOS có thể gửi webhook nhiều lần (retry khi không nhận được 200).
Nếu không check idempotency → unlock CV nhiều lần cho 1 payment → loss.
Solution: Check `payos_order_id` trong DB trước khi xử lý.

## Environment Variables
```
PAYOS_CLIENT_ID=        ← Từ PayOS dashboard
PAYOS_API_KEY=          ← Từ PayOS dashboard
PAYOS_CHECKSUM_KEY=     ← Từ PayOS dashboard
NEXT_PUBLIC_URL=        ← https://your-app.vercel.app (production)
```

## Sandbox Testing
```javascript
// PayOS có sandbox environment để test
// Dùng sandbox credentials từ PayOS dashboard
// Test webhook: dùng ngrok hoặc Vercel preview URL
ngrok http 3000  // tạo public URL cho localhost
// Sau đó config webhook URL trong PayOS dashboard → sandbox URL
```

## Lưu ý quan trọng
- `orderCode` phải là **số nguyên**, không phải string
- `description` tối đa **25 ký tự** (không được dài hơn)
- Webhook URL phải HTTPS (Vercel tự có, localhost cần ngrok)
- `verifyPaymentWebhookData()` PHẢI gọi trước khi xử lý — security critical
- Response 200 ngay lập tức, xử lý async nếu cần

## Liên quan đến dự án
- Flow: User click "Mua" → createPaymentLink → redirect PayOS → user thanh toán → webhook → unlock watermark
- Watermark logic: `cvs.is_paid = true` → CVPreview component remove watermark
- Manual reconcile: Check PayOS dashboard vs DB hàng tuần (xem RISK_LOG.md R04)


============================================================
## SOURCE: wiki/raw/cv-patterns-vn.md
============================================================

# CV Patterns Vietnam — LLM Wiki
# Project: CV SaaS | Domain: Vietnamese CV conventions + FDI Chinese format
# Last updated: 2026-04-11

## Tổng quan thị trường mục tiêu
- **Chính:** Lao động Việt Nam làm tại công ty FDI Trung Quốc
- **Phụ:** Người Việt xin việc công ty trong nước + quốc tế
- **Niche:** CV tiếng Trung cho thị trường FDI TQ — ít cạnh tranh

---

## TEMPLATE 1 — CV Tiếng Việt (thị trường trong nước)

### Cấu trúc chuẩn
```
1. THÔNG TIN CÁ NHÂN
   Họ và tên | Ngày sinh | Điện thoại | Email | Địa chỉ

2. MỤC TIÊU NGHỀ NGHIỆP (3-4 câu)
   - Vị trí muốn ứng tuyển
   - Kinh nghiệm nổi bật nhất
   - Giá trị mang lại cho công ty

3. HỌC VẤN
   Trường | Chuyên ngành | Năm tốt nghiệp | GPA (nếu > 3.2)

4. KINH NGHIỆM LÀM VIỆC (đảo ngược thời gian)
   Công ty | Vị trí | Thời gian
   - Thành tích cụ thể (có số liệu)
   - Trách nhiệm chính (3-5 bullet)

5. KỸ NĂNG
   Kỹ năng chuyên môn | Ngoại ngữ | Tin học

6. CHỨNG CHỈ / GIẢI THƯỞNG (nếu có)

7. HOẠT ĐỘNG NGOẠI KHÓA (optional, cho fresh grad)
```

### Nguyên tắc viết CV tiếng Việt
- Ảnh: **BẮT BUỘC** — ảnh thẻ 3x4, nền trắng/xanh, chuyên nghiệp
- Font: Times New Roman 12pt hoặc Arial 11pt
- Màu sắc: tối giản, tối đa 2 màu
- Dài: **1 trang A4** (trừ senior 10+ năm kinh nghiệm)
- Thông tin tuổi/giới tính: thường yêu cầu ở VN (khác Tây)

### Động từ mạnh (Việt)
```
Triển khai | Tối ưu hóa | Phát triển | Quản lý | Phối hợp
Tăng [X]% | Giảm [X] | Hoàn thành trước deadline | Đạt KPI [X]
```

---

## TEMPLATE 2 — CV Tiếng Anh (công ty quốc tế/FDI)

### Cấu trúc ATS-friendly
```
FULL NAME
Phone | Email | LinkedIn (optional) | Location

PROFESSIONAL SUMMARY (3-4 lines)

WORK EXPERIENCE
  Company Name — Job Title | Month YYYY – Month YYYY
  • Achievement with metric (increased X by Y%)
  • Key responsibility using action verb

EDUCATION
  Degree, Major — University Name | Year

SKILLS
  Technical | Languages | Tools

CERTIFICATIONS (if any)
```

### ATS Keywords (phổ biến cho tech/operations)
```
Management: managed, led, oversaw, coordinated, supervised
Achievement: achieved, delivered, improved, optimized, reduced
Technical: implemented, developed, configured, deployed, integrated
Collaboration: collaborated, partnered, worked cross-functionally
```

### Lưu ý ATS
- Không dùng table layout (ATS không đọc được)
- Không embed text trong image
- Dùng standard section headers: "Work Experience", "Education", "Skills"
- Keywords phải match với job description

---

## TEMPLATE 3 — CV Tiếng Trung (FDI Trung Quốc tại VN)

### Cấu trúc chuẩn (简历)
```
姓名: [Họ tên]               性别: [Nam/Nữ]
出生日期: [Ngày sinh]        国籍: 越南
联系电话: [SĐT]              电子邮件: [Email]
现居地址: [Địa chỉ]

求职意向: [Vị trí]

教育背景 (Học vấn)
  院校名称 | 专业 | 学历 | 毕业年份

工作经历 (Kinh nghiệm)
  公司名称 | 职位 | 在职时间
  • 主要职责和成就

语言能力 (Ngôn ngữ)
  越南语: 母语 | 中文: [HSK X级/流利] | 英语: [TOEIC X]

专业技能 (Kỹ năng)

自我评价 (Tự đánh giá — 3-4 câu tiếng Trung)
```

### Lưu ý quan trọng cho CV tiếng Trung
- **Ảnh:** Bắt buộc, kích thước chuẩn hơn CV Việt
- **Tuổi:** Ghi rõ, công ty TQ thường quan tâm
- **HSK level:** Nếu có chứng chỉ HSK → ghi rõ level (HSK 4, 5, 6)
- **Tự đánh giá:** Phần quan trọng — thể hiện tính cách phù hợp văn hóa TQ
  - Chăm chỉ (勤奋), Trung thực (诚实), Teamwork (团队合作)
- **Không đòi lương:** Không ghi salary expectation trong CV TQ

### Từ điển kỹ năng thường gặp (Việt → Trung)
```
Quản lý dự án → 项目管理
Phân tích dữ liệu → 数据分析
Giao tiếp → 沟通能力
Giải quyết vấn đề → 解决问题
Microsoft Office → 微软办公软件
Tiếng Anh → 英语 (TOEIC X分)
```

---

## Best Practices chung cho AI Prompt
```
Khi generate CV cho dự án này:
1. Hỏi user: ngôn ngữ? (vi/en/zh)
2. Xác định template phù hợp theo ngôn ngữ trên
3. Sanitize input trước (lib/gemma.js → sanitizeInput())
4. Áp dụng động từ mạnh tương ứng ngôn ngữ
5. Giữ nguyên 100% facts — không thêm kinh nghiệm không có
6. Output: tối đa 1 trang A4, format nhất quán
7. Score output: >= 7/10 mới trả về user
```

## Liên quan đến dự án
- Template picker: user chọn 1 trong 3 templates trên
- Template ID: `'vi-standard'`, `'en-ats'`, `'zh-fdi'`
- Watermark: overlay "CV SaaS — Mua để xóa watermark" trên preview
- AI rewrite dùng template structure làm context cố định trong prompt

