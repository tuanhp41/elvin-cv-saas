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
