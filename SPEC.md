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
- AI API: Gemma 4 (Google AI Studio — free tier)
- Payment: PayOS
- Hosting: Vercel
- UI: Tailwind CSS + shadcn/ui
- Automation: n8n (self-hosted Docker)
- Remote: Tailscale (IP: 100.67.85.6)

## Phase hiện tại: Phase 1 — MVP

## Tính năng Phase 1
- Landing page
- CV form (Vi/En/Zh fields)
- Template picker (3 mẫu HTML)
- AI rewrite CV (Gemma 4 API)
- Preview với watermark
- Auth (Supabase)
- Payment (PayOS) → unlock watermark

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
