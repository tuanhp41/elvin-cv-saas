# RISK_LOG.md
# Risk Register — Living Document | PMP Knowledge Area: Risk Management
# Format: ID | Risk | P | I | Level | Owner | Strategy | Status | Last Updated
# Mức độ: 🔴 Critical | 🟠 High | 🟡 Medium | 🟢 Low
# Append-only — không xóa entries, chỉ update Status

---

## RISK REGISTER

| ID | Rủi ro | Xác suất | Tác động | Mức độ | Owner | Chiến lược | Status |
|---|---|---|---|---|---|---|---|
| R01 | Gemma API free tier bị cắt | Trung bình | Cao | 🟠 | Tuấn | Mitigate | 🟡 Active |
| R02 | PC nhà mất điện/offline | Trung bình | Trung bình | 🟡 | Tuấn | Accept | 🟡 Active |
| R03 | User data leak | Thấp | Rất cao | 🟠 | Tuấn | Mitigate | 🟡 Active |
| R04 | PayOS webhook fail | Thấp | Cao | 🟡 | Tuấn | Mitigate | 🟡 Active |
| R05 | Scope creep / feature bloat | Cao | Trung bình | 🟠 | Tuấn | Avoid | 🔴 Triggered |
| R06 | Burnout / mất động lực | Trung bình | Rất cao | 🔴 | Tuấn | Mitigate | 🟡 Active |
| R07 | Học công nghệ lỗi thời | Thấp | Cao | 🟡 | Tuấn | Monitor | 🟡 Active |
| R08 | RTX3060 hỏng | Rất thấp | Cao | 🟡 | Tuấn | Accept | 🟡 Active |
| R09 | Google AI ToS thay đổi | Thấp | Cao | 🟡 | Tuấn | Monitor | 🟡 Active |
| R10 | Tailscale outage | Rất thấp | Cao | 🟢 | Tuấn | Accept | 🟡 Active |
| R-NEW-001 | FortiVPN block Tailscale ở Shanghai | Cao | Rất cao | 🔴 | Tuấn | Mitigate | ⏸ Pending Test |
| R-NEW-002 | Antigravity server outage | Cao | Trung bình | 🟡 | Tuấn | Accept | 🟡 Active |
| R-NEW-003 | Antigravity quota hết giữa session | Trung bình | Trung bình | 🟡 | Tuấn | Mitigate | 🟡 Active |

---

## CHI TIẾT TỪNG RISK

### R01 — Gemma API Free Tier Bị Cắt
- **Trigger:** Quota < 20% hoặc Google thay đổi ToS
- **Response:** n8n tự switch sang local gemma4 (RTX3060), alert Telegram
- **Action ngay:** Kiểm tra Google AI Studio release notes hàng tuần
- **Fallback:** Local inference luôn sẵn sàng, test fallback hàng tuần
- **Last updated:** 2026-04-10

### R02 — PC Nhà Mất Điện/Offline
- **Trigger:** Health check fail 3 lần liên tiếp
- **Response:** Alert Telegram "PC offline" → Vercel frontend vẫn serve (static)
- **Impact khi xảy ra:** Mất local AI inference, mất n8n automation
- **Mitigation:** Cloud API backup luôn active
- **Last updated:** 2026-04-10

### R03 — User Data Leak
- **Trigger:** Unusual query pattern trong Supabase logs
- **Response:** Audit ngay, tạm disable nếu cần
- **Status note:** Supabase RLS chưa setup (Phase 0) — phải setup trước launch Phase 1
- **Action:** RLS policy là Phase Gate 1 requirement
- **Last updated:** 2026-04-10

### R04 — PayOS Webhook Fail
- **Trigger:** Webhook failure rate > 5%
- **Response:** Idempotency key + retry + manual reconcile
- **Implementation:** Phase 1 task — webhook + unlock logic
- **Last updated:** 2026-04-10

### R05 — Scope Creep ⚠️ TRIGGERED
- **Status:** Đã xảy ra ngày 10/04 — nhiều ý tưởng phát sinh trong 1 ngày
- **Response đã thực hiện:** Ghi vào backlog, áp dụng Change Control Process
- **Monitoring:** Nếu [[DECISIONS]] có >3 "unapproved changes" trong 1 tuần → review
- **Last updated:** 2026-04-10

### R06 — Burnout
- **Prevention:** Revenue metric làm gamification, celebrate small wins
- **Early warning:** Không có [[LEARNINGS]] entry 3 ngày liên tiếp
- **Response:** Đơn giản hóa task, giảm scope tạm thời
- **Last updated:** 2026-04-10

### R07 — Học Công Nghệ Lỗi Thời
- **Monitoring:** Follow Karpathy posts + GitHub Trending hàng tuần
- **Tech radar:** Tier 4 trong [[ARCHITECTURE]] — update hàng tuần
- **Last updated:** 2026-04-10

### R08 — RTX3060 Hỏng
- **Strategy:** Accept — cloud API backup sẵn
- **Mitigation:** Không phụ thuộc local 100%, Gemma API là primary option
- **Last updated:** 2026-04-10

### R09 — Google AI ToS Thay Đổi
- **Monitoring:** Theo dõi release notes Google AI Studio
- **Fallback:** Local RTX3060 inference luôn available
- **Last updated:** 2026-04-10

### R10 — Tailscale Outage
- **Strategy:** Accept — Tailscale uptime >99.9% lịch sử
- **Fallback:** WireGuard raw config backup đã lưu
- **Last updated:** 2026-04-10

### R-NEW-001 — FortiVPN Block Tailscale khi ở Shanghai ⚠️ CRITICAL
- **Status:** ⏸ Chưa test — PHẢI test trước khi sang Shanghai
- **Xác suất:** Cao — FortiVPN thường block non-standard VPN traffic
- **Tác động:** Rất cao — mất hoàn toàn remote access từ Shanghai
- **Test procedure:**
  ```
  1. Bật FortiVPN công ty
  2. ping 100.67.85.6
  3. Test-NetConnection -ComputerName 100.67.85.6 -Port 22
  4. Test-NetConnection -ComputerName 100.67.85.6 -Port 445
  ```
- **Nếu fail — workarounds:**
  1. Tailscale userspace mode (bypass kernel routing)
  2. Tailscale trên port 443 (HTTPS — thường không bị block)
  3. SSH qua Tailscale Web (browser-based)
  4. Nhờ người nhà reset Tailscale khi cần
- **Nếu pass:** Ghi [[DECISIONS]] "FortiVPN + Tailscale compatible — tested [date]"
- **Last updated:** 2026-04-10

### R-NEW-002 — Antigravity Server Outage
- **Context:** Có báo cáo 4094 outages/24h (giai đoạn 10/04)
- **Impact:** Mất IDE session, phải restart
- **Response:** Dùng Claude Code làm backup IDE khi Antigravity down
- **Monitoring:** Check status trước khi bắt đầu session dài
- **Last updated:** 2026-04-10

### R-NEW-003 — Antigravity Quota Hết Giữa Session
- **Trigger:** Token count gần limit trong session dài
- **Response:** Switch sang model Flash (cheaper) khi sắp hết quota
- **Prevention:** Break session thành chunks nhỏ, commit thường xuyên
- **Last updated:** 2026-04-10

---

## RISK RESPONSE TRIGGERS (n8n Automation — Phase 2)

| Risk | Trigger | n8n Action |
|---|---|---|
| R01 | Gemma API quota < 20% | Switch local, Telegram alert |
| R02 | Health check fail × 3 | Telegram alert "PC offline" |
| R05 | DECISIONS.md > 3 unapproved/tuần | Weekly review reminder |
| R06 | LEARNINGS.md không có entry × 3 ngày | Simplified task suggestion |

---

*RISK_LOG.md — Living Document*
*Cập nhật khi: Risk mới phát sinh | Risk status thay đổi | Response thực hiện*
*Reference: [[CV_SAAS_MASTER_PLAN_v3]] Phần F*
