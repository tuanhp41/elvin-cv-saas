# Gemma API — LLM Wiki
# Project: CV SaaS | Stack position: AI Engine (primary)
# Last updated: 2026-04-11

## Models đang dùng
- **Primary (API):** Gemma 4 via Google AI Studio — free tier (1000 req/day)
- **Local fallback:** gemma4:latest (9.6GB, Ollama, RTX3060 12GB)
- **Backup local:** gemma3:12b (8.1GB, Ollama)

## Client Setup (lib/gemma.js — SACRED FILE)
```javascript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMMA_API_KEY);

// Primary: Gemma 4 API
export const gemmaAPI = genAI.getGenerativeModel({
  model: 'gemma-3-27b-it', // hoặc model ID mới nhất
});

// Local fallback: Ollama
export async function callLocal(prompt) {
  const response = await fetch('http://100.67.85.6:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gemma4:latest',
      prompt,
      stream: false,
    }),
  });
  const data = await response.json();
  return data.response;
}
```

## Intelligent Model Router (lib/gemma.js)
```javascript
export async function generateCV(prompt, context = {}) {
  const { tokenCount = 0, forceLocal = false } = context;

  // Decision tree từ ARCHITECTURE.md/Master Plan
  if (forceLocal || tokenCount > 8000) {
    // Long context → local (RTX3060 có thể handle)
    return await callLocal(prompt);
  }

  try {
    // Primary: Cloud API
    const result = await gemmaAPI.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    // Fallback: local nếu API fail
    console.error('Gemma API failed, falling back to local:', error);
    return await callLocal(prompt);
  }
}
```

## Prompt Engineering — CV Rewrite Task
```javascript
export function buildCVPrompt(cvData, language) {
  const langInstructions = {
    vi: 'Viết bằng tiếng Việt, văn phong chuyên nghiệp',
    en: 'Write in professional English, ATS-friendly format',
    zh: '用中文写，符合中国FDI企业简历格式标准',
  };

  return `Bạn là chuyên gia viết CV chuyên nghiệp.

Nhiệm vụ: Cải thiện CV sau để ${langInstructions[language]}.

Nguyên tắc:
1. Giữ nguyên facts (công ty, vị trí, thời gian) — không bịa
2. Dùng động từ mạnh (achieved, implemented, optimized)
3. Thêm số liệu nếu có thể suy ra hợp lý
4. Format nhất quán
5. Độ dài: tối đa 1 trang A4

CV hiện tại:
${JSON.stringify(cvData, null, 2)}

Trả về CHỈ nội dung CV đã cải thiện, không giải thích thêm.`;
}
```

## Prompt Injection Defense
```javascript
// Áp dụng trước khi đưa user input vào prompt
export function sanitizeInput(input) {
  return input
    .replace(/ignore.*instructions?/gi, '')
    .replace(/system\s*prompt/gi, '')
    .replace(/\[INST\]|\[\/INST\]/g, '')
    .slice(0, 3000); // Hard limit
}
```

## Quality Scoring (AI Output)
```javascript
// Rubric 10 điểm — ghi vào EXPERIMENTS.md khi test
// 1. Completeness (0-3): Đầy đủ mục cần thiết
// 2. Language quality (0-3): Tự nhiên, không robotic
// 3. ATS keywords (0-2): Keywords phù hợp ngành
// 4. Format compliance (0-2): Đúng format Vi/En/Zh
// Ngưỡng acceptable: >= 7/10
```

## Ollama API (local server)
```bash
# Endpoints (chạy tại 100.67.85.6:11434)
GET  /api/tags          # List available models
POST /api/generate      # Generate (non-streaming)
POST /api/chat          # Chat format
POST /api/embeddings    # Get embeddings

# Test từ Windows
curl http://100.67.85.6:11434/api/tags
```

## Rate Limit & Quota Management
```javascript
// Free tier: 1000 requests/day
// Monitor: check trước 8:00 mỗi ngày

// Simple rate limiter (Phase 1)
// Dùng Supabase để count requests per user per day
const today = new Date().toISOString().split('T')[0];
const { count } = await supabase
  .from('ai_requests')
  .select('*', { count: 'exact' })
  .eq('user_id', userId)
  .gte('created_at', today);

if (count >= 10) throw new Error('Daily limit reached');
```

## Environment Variables
```
GEMMA_API_KEY=          ← Google AI Studio → Get API Key
                          (free tier: 1000 req/day, 32k context)
```

## Liên quan đến dự án
- CV rewrite là use case chính — prompt engineering quan trọng nhất
- Fallback chain: Gemma API → Local gemma4 → Local gemma3:12b
- Ollama endpoint: http://100.67.85.6:11434 (accessible qua Tailscale)
- VRAM budget: gemma4 chiếm ~7.2GB / 12GB RTX3060
- Xem DECISIONS.md → D002: Chọn gemma4:latest
