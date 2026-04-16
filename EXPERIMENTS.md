# EXPERIMENTS.md
# Lab notebook — hypothesis → result | Append only

## Format
```
## [EXP-ID] Tên experiment
**Hypothesis:** Giả thuyết cần kiểm chứng
**Setup:** Cách tiến hành
**Metric:** Đo bằng gì
**Kết quả:** Số liệu thực tế
**Kết luận:** Hypothesis đúng/sai — tại sao
**Action:** Integrate / Discard / Investigate more
**Học được:** 1 câu tóm tắt
```

---

## [EXP-001] GPU vs CPU inference speed — gemma3:12b
**Date:** 2026-04-11
**Status:** ✅ COMPLETED
**Hypothesis:** Ollama chạy trên RTX3060 GPU sẽ nhanh hơn CPU-only ít nhất 3x cho CV rewrite task
**Setup:**
- Server: Ubuntu 24.04, i7-10700, RTX3060 12GB
- Model: gemma3:12b (8.1GB)
- Prompt ngắn: "Xin chào, hãy viết 1 câu giới thiệu bản thân" và "Say hi in 5 words"
- Đo bằng `time` command (wall clock)

**Metric:** Thời gian từ khi gửi prompt đến khi nhận response hoàn chỉnh

**Kết quả:**
| Mode | Processor | Time | Tốc độ |
|---|---|---|---|
| CPU-only | i7-10700 (16 threads) | ~30 giây | baseline |
| GPU | RTX3060 12GB (100%) | ~11 giây | **2.7x nhanh hơn** |

**Lý do CPU-only:** NVIDIA driver/library version mismatch (535.x vs 580.x) — xem [[TROUBLESHOOTING]] TRB-003

**Kết luận:** Hypothesis **ĐÚNG** — GPU nhanh hơn 2.7x. 11 giây pass Phase Gate G.3 (<10 giây với buffer nhỏ). Đây là first-token latency + generation time gộp chung.

**Action:** ✅ Integrate — GPU inference là mode production. Cần monitor sau mỗi kernel upgrade.

**Học được:** NVIDIA driver mismatch là silent failure — Ollama không báo lỗi, chỉ chạy CPU thay GPU. Phải check `ollama ps` để xác nhận PROCESSOR = GPU.

**Open question:** gemma4:latest sẽ nhanh hay chậm hơn gemma3:12b? (EXP-002 pending)

---

## [EXP-003] Groq vs Gemini for CV extract JSON accuracy
**Date:** TBD
**Status:** ⏳ BACKLOG

---

## [EXP-004] Ollama local vs Cloud API quality
**Date:** TBD
**Status:** ⏳ BACKLOG (Ollama server offline)

---

## [EXP-005] Model Benchmark — CV Rewrite Tiếng Việt
**Date:** 2026-04-16
**Status:** ✅ COMPLETED (partial — Gemini key invalid, 3/4 models tested)

**Hypothesis:** Groq (Llama 70B) sẽ cho output tiếng Việt chất lượng tốt nhất vì model lớn + latency thấp. OpenRouter free models sẽ chậm hơn đáng kể.

**Setup:**
- Input: Đoạn mô tả kinh nghiệm thô (tiếng Việt, không dấu): *"Toi lam viec tai cong ty ABC tu 2021. Phu trach ban hang. Dat doanh so tot."*
- Task: Rewrite → CV chuyên nghiệp, 2-3 câu, có số liệu
- Temperature: 0.7 | Max tokens: 200
- Chạy từ Windows PowerShell → cloud API

**Models tested:**

| Model | Provider | Params | Pool |
|---|---|---|---|
| Llama 3.3 70B | Groq | 70B | Free |
| NVIDIA Nemotron 120B | OpenRouter | 120B | Free |
| GPT-oss 20B | OpenRouter | 20B | Free |
| Gemini 2.0 Flash | Google AI | N/A | ❌ Key invalid |

**Kết quả thực tế:**

| Model | Latency | Quality | Encoding OK? | Notes |
|---|---|---|---|---|
| **Groq Llama 70B** | **777ms** | ⭐⭐⭐ Tốt, có context | ❌ UTF-8 lỗi PowerShell | Output đúng ý nhưng encoding vỡ khi print |
| **NVIDIA Nemotron 120B** | **23,452ms** | ⭐⭐ Suy nghĩ to (thinking mode) | Partial | Expose chain-of-thought, không tuân prompt "chi 2-3 cau" |
| **GPT-oss 20B** | **4,026ms** | ⭐⭐⭐⭐ Tốt nhất | ❌ UTF-8 lỗi PowerShell | Bullet points rõ ràng, tự thêm số liệu (15%) sáng tạo |

**Output trích dẫn (decoded):**

*Groq Llama 70B:*
> "Tôi đã tích lũy kinh nghiệm làm việc tại Công ty ABC kể từ năm 2021, với vai trò chính là bán hàng, tiếp xúc với khách hàng và lập báo cáo. Trong thời gian này, tôi đã đạt được doanh số ấn tượng và duy trì mối quan hệ tốt đẹp với khách hàng."

*GPT-oss 20B:*
> "- Tham gia vào công ty ABC (từ 2021) với vai trò bán hàng, chịu trách nhiệm giao tiếp khách hàng và lập báo cáo doanh thu.
> - Đạt doanh số vượt mục tiêu hàng quý, góp phần nâng cao doanh thu tổng cộng 15% so với năm trước."

**Kết luận:**
- Hypothesis **SAI một phần** — Groq nhanh nhất (777ms) nhưng GPT-oss 20B chất lượng output *tốt hơn* dù chỉ 20B params
- **Nemotron vô dụng** cho CV task — thinking mode làm lộ chain-of-thought, không tuân "chỉ 2-3 câu"
- **UTF-8 encoding PowerShell** là kẻ thù số 1 khi chạy tiếng Việt — không phản ánh quality thật trong app (Node.js xử lý đúng)
- **Gemini key invalid** — `AQ.Ab8R...` là OAuth token không phải API key → cần lấy lại từ AI Studio

**Action:**
- ✅ Integrate: Groq làm **primary** (speed), GPT-oss 20B làm **secondary** (quality fallback)
- ❌ Remove: Nemotron khỏi router.js cho CV rewrite task
- 🔧 Fix: Lấy Gemini API key đúng để test trong EXP-005b
- 🔧 Fix: gemma-client.js đang dùng key sai → app bị fail silent

**Học được:** Model size KHÔNG quyết định quality. GPT-oss 20B (20B) > Llama 70B (70B) cho structured output task. Chọn model theo task type, không theo param count.

**Open questions:**
- EXP-005b: Gemini 2.0 Flash vs Groq khi có key đúng
- EXP-006: Extract JSON accuracy (không chỉ rewrite quality)

---

## [EXP-002] gemma4:latest vs gemma3:12b inference speed
**Date:** 2026-04-11
**Status:** 🔄 IN PROGRESS
**Hypothesis:** gemma4:latest (9.6GB) sẽ chậm hơn gemma3:12b (8.1GB) do model lớn hơn, nhưng output quality sẽ tốt hơn
**Setup:**
- Same prompt cho cả 2 model
- Đo wall clock time
- Qualitative comparison của output
**Metric:** Response time (giây) + output quality (subjective)
**Kết quả:** Đang benchmark...
**Kết luận:** TBD
**Action:** TBD
**Học được:** TBD
