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
