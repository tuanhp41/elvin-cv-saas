/**
 * API Route: /api/ai/interview
 * Nhận chat message từ user → AI extract structured CV data
 * Trả về: extracted data + câu hỏi tiếp theo
 */

import { routeAI } from '@/lib/ai/router';
import { buildExtractionPrompt } from '@/lib/ai/prompts';
import { INTERVIEW_SCRIPT, getNextQuestion } from '@/lib/ai/interview-script';

export default async function handler(req, res) {
  // 1. Method check
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // 2. Input validation
    const { message, currentStep, cvData, language } = req.body;

    if (typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ success: false, error: 'Thiếu message' });
    }
    if (typeof currentStep !== 'number') {
      return res.status(400).json({ success: false, error: 'Thiếu currentStep' });
    }

    const lang = language || 'vi';
    const stepInfo = INTERVIEW_SCRIPT.find(s => s.step === currentStep);

    if (!stepInfo) {
      // Đã qua hết script → interview hoàn tất
      return res.status(200).json({
        success: true,
        data: {
          isComplete: true,
          extracted: null,
          nextQuestion: null,
          nextStep: null,
        },
      });
    }

    // 3. Build extraction prompt + gọi AI
    const systemPrompt = buildExtractionPrompt(stepInfo.field_target, stepInfo.system_instruction);

    const messages = [
      { role: 'user', content: message },
    ];

    const { text: rawResponse, model } = await routeAI(messages, {
      task: 'extract',
      language: lang,
      systemPrompt,
      temperature: 0.2,   // Thấp → output JSON ổn định hơn
      max_tokens: 512,
    });

    // 4. Parse JSON từ AI response
    let parsed;
    try {
      // Trích xuất JSON block nếu AI bao bọc bằng markdown
      const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : rawResponse);
    } catch {
      console.error('[API] /api/ai/interview JSON parse failed:', rawResponse);
      // Fallback: treat như low confidence
      parsed = {
        extracted: null,
        confidence: 'low',
        follow_up: 'Mình chưa rõ lắm, bạn có thể nói rõ hơn được không?',
      };
    }

    // 5. Lấy câu hỏi tiếp theo
    const shouldAdvance = parsed.confidence === 'high' && parsed.follow_up === null;
    const nextStep = shouldAdvance ? currentStep + 1 : currentStep;
    const nextQuestion = shouldAdvance
      ? getNextQuestion(currentStep, cvData)
      : { prompt: parsed.follow_up, step: currentStep };

    console.log(`[API] /api/ai/interview step=${currentStep} model=${model} confidence=${parsed.confidence}`);

    // 6. Success response
    return res.status(200).json({
      success: true,
      data: {
        isComplete: false,
        extracted: parsed.extracted,
        confidence: parsed.confidence,
        nextQuestion: nextQuestion?.prompt || null,
        nextStep: nextQuestion?.step ?? null,
        model, // để debug
      },
    });

  } catch (error) {
    console.error('[API] /api/ai/interview error:', error.message);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
}
