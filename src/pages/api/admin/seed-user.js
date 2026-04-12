import { createClient } from '@supabase/supabase-js';

// API route này chỉ dùng để seed dữ liệu test — không expose production
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Bảo vệ bằng secret key
  const { secret, email, password } = req.body;
  if (secret !== process.env.ADMIN_SEED_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Bỏ qua xác nhận email
    });

    if (error) throw new Error(error.message);

    return res.status(200).json({ success: true, data: { id: data.user.id, email: data.user.email } });
  } catch (error) {
    console.error('[API] /api/admin/seed-user error:', error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
}
