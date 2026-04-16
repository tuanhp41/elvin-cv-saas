/**
 * API Route: /api/ai/rewrite
 * Nhận raw CV section text → AI viết lại chuyên nghiệp
 * Dùng cho button "✨ AI Viết lại" trong CVPreview
 */

import { routeAI } from '@/lib/ai/router';
import { buildRewritePrompt } from '@/lib/ai/prompts';

const VALID_SECTIONS = ['experience', 'education', 'skills', 'objective', 'certifications', 'others'];
const VALID_LANGUAGES = ['vi', 'en', 'zh'];

export default async function handler(req, res) {
  // 1. Method check
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // 2. Input validation
    const { section, rawContent, language } = req.body;

    if (!VALID_SECTIONS.includes(section)) {
      return res.status(400).json({
        success: false,
        error: `section không hợp lệ. Phải là một trong: ${VALID_SECTIONS.join(', ')}`,
      });
    }
    if (!rawContent || typeof rawContent !== 'string' || !rawContent.trim()) {
      return res.status(400).json({ success: false, error: 'rawContent không được để trống' });
    }
    if (rawContent.length > 3000) {
      return res.status(400).json({ success: false, error: 'rawContent quá dài (tối đa 3000 ký tự)' });
    }

    const lang = VALID_LANGUAGES.includes(language) ? language : 'vi';

    // 3. Build rewrite prompt + gọi AI
    const systemPrompt = buildRewritePrompt(section, lang, rawContent);

    // Gửi rawContent như là "yêu cầu" của user
    const messages = [
      {
        role: 'user',
        content: `Hãy viết lại phần "${section}" sau đây cho CV của tôi:\n\n${rawContent}`,
      },
    ];

    const { text: rewrittenText, model } = await routeAI(messages, {
      task: 'rewrite',
      language: lang,
      systemPrompt,
      temperature: 0.5,   // Cao hơn chút để creative
      max_tokens: 800,
    });

    console.log(`[API] /api/ai/rewrite section=${section} lang=${lang} model=${model}`);

    // 4. Success response
    return res.status(200).json({
      success: true,
      data: {
        section,
        language: lang,
        original: rawContent,
        rewritten: rewrittenText.trim(),
        model,
      },
    });

  } catch (error) {
    console.error('[API] /api/ai/rewrite error:', error.message);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
}
