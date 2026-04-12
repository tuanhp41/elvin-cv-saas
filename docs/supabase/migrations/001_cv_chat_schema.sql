-- ==============================================================================
-- BẢN QUYỀN: CV SaaS Core - Phase 1
-- DESCRIPTION: Schema database cho tính năng CV form và Chat Flow Split-screen
-- ==============================================================================

-- 1. BẢNG `cvs`
-- Mục đích: Lưu trữ toàn bộ dữ liệu metadata và schema của CV
CREATE TABLE IF NOT EXISTS public.cvs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL DEFAULT 'Bản Nháp CV',
    template_id TEXT NOT NULL DEFAULT 'professional',
    language TEXT NOT NULL DEFAULT 'vi',
    data_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    score INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Trigger cho updated_at tự động
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_cv_updated_at
BEFORE UPDATE ON public.cvs
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- 2. BẢNG `chat_sessions`
-- Mục đích: Lưu trữ các đoạn nội dung phỏng vấn AI (Luồng A)
CREATE TABLE IF NOT EXISTS public.chat_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    cv_id UUID REFERENCES public.cvs(id) ON DELETE CASCADE, -- Có thể bind với 1 CV tạo sẵn
    messages_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'active', -- 'active', 'completed', 'abandoned'
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER trigger_update_chat_updated_at
BEFORE UPDATE ON public.chat_sessions
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- 3. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.cvs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;

-- Policy cho CVs: User nào tạo thì người đó được Xem, Sửa, Xoá
CREATE POLICY "Users can fully manage their own CVs."
ON public.cvs
FOR ALL
USING (auth.uid() = user_id);

-- Policy cho Chat Sessions: User nào tạo thì người đó được Xem, Sửa, Xoá
CREATE POLICY "Users can fully manage their own chat sessions."
ON public.chat_sessions
FOR ALL
USING (auth.uid() = user_id);
