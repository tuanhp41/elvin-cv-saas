import { supabase } from '@/lib/supabase';

/**
 * TẠO MỚI CV
 * @param {Object} params - { user_id, title, data_json, language, template_id }
 */
export async function createCV({ user_id, title = "Bản Nháp CV", data_json = {}, language = "vi", template_id = "professional" }) {
  try {
    const { data, error } = await supabase
      .from('cvs')
      .insert({
        user_id,
        title,
        data_json,
        language,
        template_id,
        score: 0
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return { success: true, data };
  } catch (error) {
    console.error('[DB] createCV error:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * LẤY 1 CV BỞI ID
 * @param {string} id - CV ID
 * @param {string} user_id - Bắt buộc để xác thực chủ sở hữu
 */
export async function getCV(id, user_id) {
  try {
    const { data, error } = await supabase
      .from('cvs')
      .select('*')
      .eq('id', id)
      .eq('user_id', user_id) // RLS Backup
      .single();

    if (error) throw new Error(error.message);

    return { success: true, data };
  } catch (error) {
    console.error(`[DB] getCV error (id=${id}):`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * CẬP NHẬT CV
 * @param {string} id - CV ID
 * @param {string} user_id - User ID sở hữu
 * @param {Object} updates - Các trường cần cập nhật (ví dụ: { data_json: { ... }, score: 8 })
 */
export async function updateCV(id, user_id, updates) {
  try {
    const { data, error } = await supabase
      .from('cvs')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user_id) // Chỉ cập nhật CV của chính user
      .select()
      .single();

    if (error) throw new Error(error.message);

    return { success: true, data };
  } catch (error) {
    console.error(`[DB] updateCV error (id=${id}):`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * LẤY DANH SÁCH CV CỦA USER
 * @param {string} user_id - User ID
 */
export async function listCVs(user_id) {
  try {
    const { data, error } = await supabase
      .from('cvs')
      .select('*')
      .eq('user_id', user_id)
      .order('updated_at', { ascending: false });

    if (error) throw new Error(error.message);

    return { success: true, data };
  } catch (error) {
    console.error('[DB] listCVs error:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * XOÁ CV
 * @param {string} id - CV ID
 * @param {string} user_id - User ID
 */
export async function deleteCV(id, user_id) {
  try {
    const { error } = await supabase
      .from('cvs')
      .delete()
      .eq('id', id)
      .eq('user_id', user_id);

    if (error) throw new Error(error.message);

    return { success: true, data: true };
  } catch (error) {
    console.error(`[DB] deleteCV error (id=${id}):`, error.message);
    return { success: false, error: error.message };
  }
}
