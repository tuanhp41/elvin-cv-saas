import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Ghi chú: Environment variables cho Supabase chưa được thiết lập.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
