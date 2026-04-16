/**
 * gemma-client.js — Google AI Studio (Gemma / Gemini Flash) Client
 * Dùng Google AI Studio free tier
 * Docs: https://ai.google.dev/api/generate-content
 *
 * NOTE (2026-04-16): Google AI Studio đã đổi key format từ AIzaSy... sang AQ.
 * Key AQ. KHONG work với ?key= query param, phải dùng x-goog-api-key header.
 * Confirmed via EXP-005.
 */

const GOOGLE_AI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';
const DEFAULT_MODEL = 'gemini-2.0-flash';   // Fast, multilingual, free
const FALLBACK_MODEL = 'gemini-1.5-flash';  // Backup

/**
 * Gọi Google AI Studio (Gemini) Chat API
 * @param {Array} messages - Array of { role: 'user'|'model', content: string }
 * @param {Object} options - { model, temperature, max_tokens, systemPrompt }
 * @returns {Promise<string>} - Raw text response
 */
export async function callGemma(messages, options = {}) {
  const {
    model = DEFAULT_MODEL,
    temperature = 0.3,
    max_tokens = 1024,
    systemPrompt = null,
  } = options;

  // Convert messages sang Gemini format
  const contents = messages.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));

  const body = {
    contents,
    generationConfig: {
      temperature,
      maxOutputTokens: max_tokens,
    },
  };

  // System instruction (Gemini dùng systemInstruction field riêng)
  if (systemPrompt) {
    body.systemInstruction = {
      parts: [{ text: systemPrompt }],
    };
  }

  // Dùng x-goog-api-key header (bắt buộc cho key format AQ.xxx mới)
  const response = await fetch(
    `${GOOGLE_AI_BASE_URL}/models/${model}:generateContent`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': process.env.GEMMA_API_KEY,
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    // Quota exceeded → thử fallback
    if (response.status === 429 && model !== FALLBACK_MODEL) {
      console.log('[Gemma] Quota exceeded, retrying with fallback model...');
      return callGemma(messages, { ...options, model: FALLBACK_MODEL });
    }
    throw new Error(`Google AI error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

/**
 * Health check — ping Google AI
 * @returns {Promise<boolean>}
 */
export async function checkGemmaHealth() {
  try {
    const response = await fetch(
      `${GOOGLE_AI_BASE_URL}/models`,
      {
        headers: { 'x-goog-api-key': process.env.GEMMA_API_KEY },
      }
    );
    return response.ok;
  } catch {
    return false;
  }
}
