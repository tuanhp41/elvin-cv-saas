/**
 * API Route: /api/ai/score
 * Nhận CV text/JSON → AI chấm điểm → trả về score breakdown
 * Dùng buildScorePrompt() từ prompts.js + router.js
 */

import { routeAI } from '@/lib/ai/router';
import { buildScorePrompt } from '@/lib/ai/prompts';

const VALID_LANGUAGES = ['vi', 'en', 'zh'];

export default async function handler(req, res) {
  // 1. Method check
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // 2. Input validation
    const { cvText, cvData, language } = req.body;

    // Chấp nhận cvText (raw string) hoặc cvData (JSON object)
    if (!cvText && !cvData) {
      return res.status(400).json({
        success: false,
        error: 'Cần cung cấp cvText (string) hoặc cvData (object)',
      });
    }

    const lang = VALID_LANGUAGES.includes(language) ? language : 'vi';

    // Chuẩn bị input cho AI
    const cvInput = cvText || JSON.stringify(cvData, null, 2);

    if (cvInput.length > 8000) {
      return res.status(400).json({
        success: false,
        error: 'CV quá dài (tối đa 8000 ký tự). Hãy rút gọn nội dung.',
      });
    }

    // 3. Build score prompt + gọi AI
    const systemPrompt = buildScorePrompt(cvInput, lang);

    const messages = [
      {
        role: 'user',
        content: `Hãy chấm điểm CV sau đây:\n\n${cvInput}`,
      },
    ];

    const { text: rawResponse, model } = await routeAI(messages, {
      task: 'score',
      language: lang,
      systemPrompt,
      temperature: 0.2,   // Thấp để output JSON ổn định
      max_tokens: 1024,
    });

    // 4. Parse JSON từ AI response
    let scoreData;
    try {
      const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
      scoreData = JSON.parse(jsonMatch ? jsonMatch[0] : rawResponse);
    } catch {
      console.error('[API] /api/ai/score JSON parse failed:', rawResponse.slice(0, 200));
      return res.status(500).json({
        success: false,
        error: 'AI trả về kết quả không đúng format. Thử lại.',
      });
    }

    // 5. Validate score data cơ bản
    if (typeof scoreData.total_score !== 'number') {
      return res.status(500).json({
        success: false,
        error: 'Kết quả chấm điểm thiếu total_score.',
      });
    }

    console.log(`[API] /api/ai/score lang=${lang} score=${scoreData.total_score} model=${model}`);

    // 6. Success response
    return res.status(200).json({
      success: true,
      data: {
        ...scoreData,
        model,
        language: lang,
      },
    });

  } catch (error) {
    console.error('[API] /api/ai/score error:', error.message);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
}
