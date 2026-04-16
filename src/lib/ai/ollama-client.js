/**
 * ollama-client.js — Ollama Local Inference Client
 * Server: http://100.67.85.6:11434 (RTX3060, elvin server)
 * Model hiện có: gemma3:12b (đã load sẵn)
 * FREE UNLIMITED — không cần API key, không rate limit
 * OpenAI-compatible endpoint: /api/chat
 */

const OLLAMA_BASE_URL = process.env.OLLAMA_URL || 'http://100.67.85.6:11434';
const DEFAULT_MODEL = 'gemma3:12b'; // Model đang chạy trên server

/**
 * Gọi Ollama local inference
 * @param {Array} messages - Array of { role, content }
 * @param {Object} options - { model, temperature, max_tokens }
 * @returns {Promise<string>}
 */
export async function callOllama(messages, options = {}) {
  const {
    model = DEFAULT_MODEL,
    temperature = 0.3,
    max_tokens = 1024,
  } = options;

  const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages,
      stream: false,
      options: {
        temperature,
        num_predict: max_tokens,
      },
    }),
    // Timeout 30s — local inference chậm hơn cloud
    signal: AbortSignal.timeout(30000),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Ollama error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  return data.message?.content ?? '';
}

/**
 * Lấy danh sách models đang có trên Ollama server
 * @returns {Promise<string[]>}
 */
export async function listOllamaModels() {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
    if (!response.ok) return [];
    const data = await response.json();
    return (data.models || []).map(m => m.name);
  } catch {
    return [];
  }
}

/**
 * Health check — ping Ollama server
 * @returns {Promise<boolean>}
 */
export async function checkOllamaHealth() {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      signal: AbortSignal.timeout(5000),
    });
    return response.ok;
  } catch {
    return false;
  }
}
