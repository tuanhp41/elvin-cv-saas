/**
 * router.js — AI Model Router (v2.1 — EXP-005 Optimized)
 * Tự động chọn model theo task + language + fallback chain
 *
 * FALLBACK CHAIN (theo thứ tự ưu tiên):
 *   Groq → Gemma (Google) → OpenRouter (GPT-oss/Qwen) → Ollama (local RTX3060)
 *
 * ROUTING LOGIC (updated per EXP-005 2026-04-16):
 *   - extract (JSON): Groq trước (777ms, stable JSON) → Gemma → GPT-oss-20B → Ollama
 *   - rewrite (creative): Groq → GPT-oss-20B (tốt nhất cho structured output) → Gemma → Ollama
 *   - score (reasoning): Groq → Gemma → GPT-oss-120B → Ollama
 *   - tiếng Trung: Qwen/Gemma ưu tiên hơn Groq
 *   - Ollama: LUÔN là last resort — free unlimited nhưng latency cao hơn
 *   - Nemotron: LOẠI KHỎI chain (EXP-005: thinking mode, không tuân structured prompt)
 */

import { callGroq, checkGroqHealth } from '@/lib/ai/groq-client';
import { callGemma, checkGemmaHealth } from '@/lib/ai/gemma-client';
import { callOpenRouter, checkOpenRouterHealth } from '@/lib/ai/openrouter-client';
import { callOllama, checkOllamaHealth } from '@/lib/ai/ollama-client';

// ──────────────────────────────────────────────
// ROUTING TABLE — ưu tiên theo task + ngôn ngữ
// ──────────────────────────────────────────────

const ROUTING_TABLE = {
  // extract: cần JSON output ổn định → Groq Llama tốt nhất (777ms, EXP-005)
  extract: {
    vi: ['groq', 'gemma', 'gpt_small', 'ollama'],
    en: ['groq', 'gemma', 'gpt_small', 'ollama'],
    zh: ['qwen', 'gemma', 'groq', 'ollama'],      // Qwen giỏi tiếng Trung nhất
    default: ['groq', 'gemma', 'gpt_small', 'ollama'],
  },
  // rewrite: structured output → GPT-oss-20B tốt nhất theo EXP-005 (bullet points, số liệu)
  rewrite: {
    vi: ['groq', 'gpt_small', 'gemma', 'ollama'],
    en: ['groq', 'gpt_small', 'gemma', 'ollama'],
    zh: ['qwen', 'gemma', 'gpt_small', 'ollama'],
    default: ['groq', 'gpt_small', 'gemma', 'ollama'],
  },
  // score: cần reasoning + JSON → Groq → GPT-oss-120B (heavy reasoning)
  score: {
    vi: ['groq', 'gpt_large', 'gemma', 'ollama'],
    en: ['groq', 'gpt_large', 'gemma', 'ollama'],
    zh: ['qwen', 'groq', 'gpt_large', 'ollama'],
    default: ['groq', 'gpt_large', 'gemma', 'ollama'],
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
// MODEL_MAP updated per EXP-005: GPT-oss > Nemotron cho CV tasks
async function callOpenRouterWithSystem(modelKey, messages, options) {
  const { callOpenRouter } = await import('@/lib/ai/openrouter-client');
  const MODEL_MAP = {
    gpt_small: 'openai/gpt-oss-20b:free',          // EXP-005 ⭐⭐⭐⭐ tốt nhất cho structured output
    gpt_large: 'openai/gpt-oss-120b:free',          // Heavy reasoning (score task)
    qwen: 'qwen/qwen3-next-80b-a3b-instruct:free',  // Tiếng Trung
    // nemotron: REMOVED — thinking mode không phù hợp structured CV tasks (EXP-005)
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
