# SPEC.md
# Nguồn sự thật duy nhất — AI không được sửa file này

## Dự án
CV SaaS — AI-powered CV builder cho thị trường VN/FDI Trung Quốc

## Mục tiêu cốt lõi
Học AI Engineering toàn diện. Revenue là thứ yếu.

## Stack đã chốt (FROZEN)
- Frontend: Next.js 14
- Database + Auth: Supabase
- AI Local: gemma4:latest (Ollama, RTX3060 12GB)
- AI API Primary: Gemma 4 (Google AI Studio — free tier)
- AI API Secondary: Qwen 3 (Alibaba — free tier, mạnh tiếng Trung)
- AI API Fast: Groq (free tier, inference cực nhanh)
- Payment: PayOS (sandbox until Phase 5)
- Hosting: Vercel
- UI: Tailwind CSS + shadcn/ui
- Automation: n8n (self-hosted Docker)
- Remote: Tailscale (IP: 100.67.85.6)

## Master Plan: [[CV_SAAS_MASTER_PLAN_v4]] (quality-first, 5 phases)
## Phase hiện tại: Phase 1 — Core App + AI Foundation
## Chi tiết Phase 1: xem [[ROADMAP_PHASE1]]

## Tính năng Phase 1 (KHÔNG launch công khai)
- Landing page
- CV form (Vi/En/Zh fields)
- Template picker (3 mẫu HTML)
- AI rewrite CV — multi-model (Gemma + Qwen + Groq + local fallback)
- Model Router — tự chọn model tốt nhất theo ngôn ngữ
- CV Quality Evaluator — tự chấm điểm AI output
- Preview với watermark
- Auth (Supabase)
- Payment stub (PayOS sandbox — KHÔNG bật live)

## Out of Scope (KHÔNG làm)
- PDF export
- Mobile app native
- Job board integration
- Multilingual UI phức tạp
- Bất kỳ thứ gì cần >2 tiếng/ngày để maintain

## Pricing
- Tạo CV lần đầu + tài khoản: 50k VNĐ
- Thêm ngôn ngữ: 10k VNĐ
- Chỉnh sửa: 5k VNĐ/lần

## Repo
https://github.com/tuanhp41/elvin-cv-saas
