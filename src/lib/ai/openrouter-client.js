/**
 * openrouter-client.js — OpenRouter API Client
 * 1 key = truy cập Qwen, Mistral, Llama, DeepSeek... free models
 * Free models có suffix :free — VD: qwen/qwen3-235b-a22b:free
 * Docs: https://openrouter.ai/docs
 * Đăng ký key: https://openrouter.ai/keys (không cần credit card)
 */

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

/**
 * Free models ưu tiên theo use case — verified live 2026-04-16
 * Source: https://openrouter.ai/models?q=free
 */
const FREE_MODELS = {
  // Qwen — giỏi tiếng Trung + đa ngôn ngữ
  qwen_large: 'qwen/qwen3-next-80b-a3b-instruct:free',   // 80B, flagship
  qwen_coder: 'qwen/qwen3-coder:free',                   // 480B, code tasks

  // OpenAI OSS — GPT-level (free!)
  gpt_large: 'openai/gpt-oss-120b:free',  // 120B — dùng cho extract/score
  gpt_small: 'openai/gpt-oss-20b:free',   // 20B — nhanh hơn

  // Hermes 3 — từ Nous Research (cùng công ty với Hermes Agent)
  hermes: 'nousresearch/hermes-3-llama-3.1-405b:free',  // 405B — rất mạnh

  // Llama — đa năng
  llama: 'meta-llama/llama-3.3-70b-instruct:free',

  // NVIDIA Nemotron — reasoning tốt
  nemotron: 'nvidia/nemotron-3-super-120b-a12b:free',

  // MiniMax — tiếng Trung (đang free!)
  minimax: 'minimax/minimax-m2.5:free',
};

const DEFAULT_MODEL = FREE_MODELS.qwen_fast;

/**
 * Gọi OpenRouter API (OpenAI-compatible)
 * @param {Array} messages - Array of { role, content }
 * @param {Object} options - { model, temperature, max_tokens }
 * @returns {Promise<string>}
 */
export async function callOpenRouter(messages, options = {}) {
  const {
    model = DEFAULT_MODEL,
    temperature = 0.3,
    max_tokens = 1024,
  } = options;

  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY chưa được set trong .env.local');
  }

  const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_URL || 'http://localhost:3000',
      'X-Title': 'CV SaaS Builder',
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
    // Free model rate limit → thử model khác trong free tier
    if (response.status === 429) {
      if (model !== FREE_MODELS.qwen_large) {
        console.log('[OpenRouter] Rate limit, trying qwen_large...');
        return callOpenRouter(messages, { ...options, model: FREE_MODELS.qwen_large });
      }
    }
    throw new Error(`OpenRouter error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? '';
}

/**
 * Gọi Qwen cụ thể (shorthand)
 * @param {Array} messages
 * @param {Object} options
 * @returns {Promise<string>}
 */
export async function callQwen(messages, options = {}) {
  return callOpenRouter(messages, {
    ...options,
    model: options.large ? FREE_MODELS.qwen_large : FREE_MODELS.qwen_fast,
  });
}

/**
 * Gọi Mistral (tốt cho tiếng Anh)
 */
export async function callMistral(messages, options = {}) {
  return callOpenRouter(messages, { ...options, model: FREE_MODELS.mistral });
}

/**
 * Health check
 */
export async function checkOpenRouterHealth() {
  if (!process.env.OPENROUTER_API_KEY) return false;
  try {
    const response = await fetch(`${OPENROUTER_BASE_URL}/models`, {
      headers: { 'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}` },
    });
    return response.ok;
  } catch {
    return false;
  }
}
