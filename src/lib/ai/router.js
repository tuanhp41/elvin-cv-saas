/**
 * router.js — AI Model Router (v2 — Full Multi-Model)
 * Tự động chọn model theo task + language + fallback chain
 *
 * FALLBACK CHAIN (theo thứ tự ưu tiên):
 *   Groq → Gemma (Google) → OpenRouter (Qwen/Mistral) → Ollama (local RTX3060)
 *
 * ROUTING LOGIC:
 *   - extract (JSON): Groq trước (stable JSON output) → Gemma → Qwen → Ollama
 *   - rewrite (creative): Gemma trước → Groq → Qwen → Ollama
 *   - tiếng Trung: Qwen/Gemma ưu tiên hơn Groq
 *   - Ollama: LUÔN là last resort — free unlimited nhưng latency cao hơn
 */

import { callGroq, checkGroqHealth } from '@/lib/ai/groq-client';
import { callGemma, checkGemmaHealth } from '@/lib/ai/gemma-client';
import { callOpenRouter, checkOpenRouterHealth } from '@/lib/ai/openrouter-client';
import { callOllama, checkOllamaHealth } from '@/lib/ai/ollama-client';

// ──────────────────────────────────────────────
// ROUTING TABLE — ưu tiên theo task + ngôn ngữ
// ──────────────────────────────────────────────

const ROUTING_TABLE = {
  // extract: cần JSON output ổn định → Groq Llama tốt nhất
  extract: {
    vi: ['groq', 'gemma', 'qwen', 'ollama'],
    en: ['groq', 'gemma', 'mistral', 'ollama'],
    zh: ['qwen', 'gemma', 'groq', 'ollama'],   // Qwen giỏi tiếng Trung nhất
    default: ['groq', 'gemma', 'qwen', 'ollama'],
  },
  // rewrite: cần ngôn ngữ hay, sáng tạo → Gemma tốt nhất
  rewrite: {
    vi: ['gemma', 'groq', 'qwen', 'ollama'],
    en: ['gemma', 'mistral', 'groq', 'ollama'],
    zh: ['qwen', 'gemma', 'groq', 'ollama'],
    default: ['gemma', 'groq', 'qwen', 'ollama'],
  },
  // score: cần reasoning + JSON → Groq
  score: {
    vi: ['groq', 'gemma', 'qwen', 'ollama'],
    en: ['groq', 'gemma', 'mistral', 'ollama'],
    zh: ['qwen', 'gemma', 'groq', 'ollama'],
    default: ['groq', 'gemma', 'qwen', 'ollama'],
  },
};

// ──────────────────────────────────────────────
// MAIN ROUTER
// ──────────────────────────────────────────────

/**
 * Gọi AI với auto-routing + fallback
 * @param {Array} messages - Chat messages [{ role, content }]
 * @param {Object} options - { task, language, systemPrompt, temperature, max_tokens }
 * @returns {Promise<{ text: string, model: string }>}
 */
export async function routeAI(messages, options = {}) {
  const {
    task = 'extract',
    language = 'vi',
    systemPrompt = null,
    temperature = 0.3,
    max_tokens = 1024,
  } = options;

  const taskRoutes = ROUTING_TABLE[task] || ROUTING_TABLE['extract'];
  const models = taskRoutes[language] || taskRoutes['default'];

  let lastError = null;

  for (const modelName of models) {
    try {
      const result = await callModel(modelName, messages, {
        systemPrompt,
        temperature,
        max_tokens,
      });

      console.log(`[Router] ${task}/${language} → ${modelName} ✓`);
      return { text: result, model: modelName };

    } catch (error) {
      console.error(`[Router] ${modelName} failed: ${error.message}`);
      lastError = error;
    }
  }

  throw new Error(
    `[Router] All models failed for task="${task}" lang="${language}". Last: ${lastError?.message}`
  );
}

// ──────────────────────────────────────────────
// INTERNAL: Dispatch theo model name
// ──────────────────────────────────────────────

async function callModel(modelName, messages, options) {
  const { systemPrompt, temperature, max_tokens } = options;

  const fullMessages = systemPrompt
    ? [{ role: 'system', content: systemPrompt }, ...messages]
    : messages;

  switch (modelName) {
    case 'groq':
      return callGroq(fullMessages, { temperature, max_tokens });

    case 'gemma':
      // Gemma dùng systemInstruction field riêng — không nhét vào messages
      return callGemma(messages, { temperature, max_tokens, systemPrompt });

    case 'qwen':
      return callOpenRouterWithSystem('qwen_fast', fullMessages, { temperature, max_tokens });

    case 'mistral':
      return callOpenRouterWithSystem('mistral', fullMessages, { temperature, max_tokens });

    case 'ollama':
      // Ollama: system prompt ghép vào messages[0] nếu có
      const ollamaMessages = systemPrompt
        ? [{ role: 'system', content: systemPrompt }, ...messages]
        : messages;
      return callOllama(ollamaMessages, { temperature, max_tokens });

    default:
      throw new Error(`Unknown model in router: ${modelName}`);
  }
}

// Helper: callOpenRouter với model cụ thể
async function callOpenRouterWithSystem(modelKey, messages, options) {
  const { callOpenRouter } = await import('@/lib/ai/openrouter-client');
  const MODEL_MAP = {
    qwen_fast: 'qwen/qwen3-30b-a3b:free',
    qwen_large: 'qwen/qwen3-235b-a22b:free',
    mistral: 'mistralai/mistral-7b-instruct:free',
  };
  return callOpenRouter(messages, { ...options, model: MODEL_MAP[modelKey] });
}

// ──────────────────────────────────────────────
// HEALTH CHECK
// ──────────────────────────────────────────────

/**
 * Kiểm tra tất cả models còn sống không
 * @returns {Promise<Object>}
 */
export async function checkAllModelsHealth() {
  const [groq, gemma, openrouter, ollama] = await Promise.allSettled([
    checkGroqHealth(),
    checkGemmaHealth(),
    checkOpenRouterHealth(),
    checkOllamaHealth(),
  ]);

  const result = {
    groq: groq.status === 'fulfilled' && groq.value === true,
    gemma: gemma.status === 'fulfilled' && gemma.value === true,
    openrouter: openrouter.status === 'fulfilled' && openrouter.value === true,
    ollama: ollama.status === 'fulfilled' && ollama.value === true,
  };

  const available = Object.entries(result).filter(([, v]) => v).map(([k]) => k);
  console.log(`[Router] Health check — Available: ${available.join(', ') || 'NONE'}`);

  return result;
}
