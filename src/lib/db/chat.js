import { supabase } from '@/lib/supabase';

/**
 * KHỞI TẠO CHAT SESSION
 * @param {Object} params - { user_id, cv_id (optional) }
 */
export async function initSession({ user_id, cv_id = null }) {
  try {
    const { data, error } = await supabase
      .from('chat_sessions')
      .insert({
        user_id,
        cv_id,
        messages_json: [],
        status: 'active'
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return { success: true, data };
  } catch (error) {
    console.error('[DB] initSession error:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * LẤY SESSION HIỆN TẠI
 * @param {string} id - Session ID
 * @param {string} user_id - User ID sở hữu
 */
export async function getSession(id, user_id) {
  try {
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('id', id)
      .eq('user_id', user_id)
      .single();

    if (error) throw new Error(error.message);

    return { success: true, data };
  } catch (error) {
    console.error(`[DB] getSession error (id=${id}):`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * CẬP NHẬT MESSAGES CỦA AI VÀ USER
 * @param {string} id - Session ID
 * @param {string} user_id - User ID sở hữu
 * @param {Array} messages_json - Mảng chứa toàn bộ dữ liệu chat [{ role: "ai", content: "..." }, ...]
 */
export async function updateSessionMessages(id, user_id, messages_json) {
  try {
    const { data, error } = await supabase
      .from('chat_sessions')
      .update({ messages_json })
      .eq('id', id)
      .eq('user_id', user_id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return { success: true, data };
  } catch (error) {
    console.error(`[DB] updateSessionMessages error (id=${id}):`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * ĐỔI TRẠNG THÁI CHAT SESSION (Ví dụ: hoàn thành, hoặc bỏ cuộc)
 * @param {string} id - Session ID
 * @param {string} user_id - User ID sở hữu
 * @param {string} status - 'active', 'completed', 'abandoned'
 */
export async function updateSessionStatus(id, user_id, status) {
  try {
    const { data, error } = await supabase
      .from('chat_sessions')
      .update({ status })
      .eq('id', id)
      .eq('user_id', user_id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return { success: true, data };
  } catch (error) {
    console.error(`[DB] updateSessionStatus error (id=${id}):`, error.message);
    return { success: false, error: error.message };
  }
}
