/**
 * groq-client.js — Groq API Client
 * Dùng Groq free tier (Llama 3.3 70B / Gemma2 9B) — OpenAI-compatible
 * Docs: https://console.groq.com/docs/openai
 */

const GROQ_BASE_URL = 'https://api.groq.com/openai/v1';
const DEFAULT_MODEL = 'llama-3.3-70b-versatile'; // Free, fast, multilingual
const FALLBACK_MODEL = 'gemma2-9b-it';            // Backup nếu primary bị rate limit

/**
 * Gọi Groq Chat Completion API
 * @param {Array} messages - Array of { role, content }
 * @param {Object} options - { model, temperature, max_tokens, language }
 * @returns {Promise<string>} - Raw text response từ model
 */
export async function callGroq(messages, options = {}) {
  const {
    model = DEFAULT_MODEL,
    temperature = 0.3,
    max_tokens = 1024,
  } = options;

  const response = await fetch(`${GROQ_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    // Rate limit → thử fallback model
    if (response.status === 429 && model !== FALLBACK_MODEL) {
      console.log('[Groq] Rate limit hit, retrying with fallback model...');
      return callGroq(messages, { ...options, model: FALLBACK_MODEL });
    }
    throw new Error(`Groq API error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? '';
}

/**
 * Lấy danh sách models đang available (dùng để health check)
 * @returns {Promise<boolean>}
 */
export async function checkGroqHealth() {
  try {
    const response = await fetch(`${GROQ_BASE_URL}/models`, {
      headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` },
    });
    return response.ok;
  } catch {
    return false;
  }
}
