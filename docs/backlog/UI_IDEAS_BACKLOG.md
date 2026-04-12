# UI/UX Backlog — Ý tưởng chưa triển khai

> Ghi lại để không mất ý tưởng. Review lại ở Phase 2 hoặc khi có bandwidth.
> Links: [[CV_SAAS_MASTER_PLAN_v4]] | [[ROADMAP_PHASE1]] | [[DECISIONS]]

---

## [IDEA-001] Gen Z / TikTok Vibes — Giao diện hướng giới trẻ
**Ghi nhận:** 2026-04-12 | **Priority:** Medium | **Phase:** 2+

### Bối cảnh
Người dùng TikTok có nhu cầu việc làm lớn (nhân viên cấp thấp, part-time). Giao diện hiện tại hơi "corporate", chưa đủ trẻ trung để thu hút nhóm này.

### Ý tưởng cụ thể
- **Showcase CV trendy:** Dùng nhân vật giả lập nổi tiếng trong giới trẻ VN để demo
  - Ví dụ ứng viên: "Anh Bằng" (ám chỉ Đen Vâu thế hệ mới)
  - Thành tích: "Quán quân Rap Mùa 20" | "Ca khúc cá nhân vượt 100 triệu view"
  - ➡️ Câu chữ bẻ đi tránh bản quyền, nhưng hint rõ ràng để giới trẻ nhận ra → viral
- **Màu sắc Section riêng:** Gradient neon pastel (tím hồng, xanh mint) thay vì trắng xanh
- **Font chơi hơn:** Tăng font-weight, có thể mix serif + sans
- **Micro-copy Gen Z:** "CV cháy 🔥", "Điền là xong, AI lo hết", "HR nào cũng phải nhìn"
- **Animation:** Confetti khi tạo xong CV, celebration moment

### Acceptance Criteria
- [ ] Section showcase dùng nhân vật pop-culture VN (không vi phạm bản quyền)
- [ ] Tone copy trẻ trung trong Hero headline (có thể toggle B2C / B2B)
- [ ] Mobile-first vì TikTok users chủ yếu dùng mobile

### Notes
- Không làm toàn bộ trang thành Gen Z — chỉ 1 section showcase + micro-copy
- Phần còn lại giữ professional để không làm mất nhóm VP/senior

---

## [IDEA-002] "Một CV, 3 ngôn ngữ" — Animated Language Switcher
**Ghi nhận:** 2026-04-12 | **Priority:** High (đã có prototype) | **Phase:** 1 polish

### Hiện trạng
Đã có ShowcaseSection với language tabs cơ bản. Cần polish thêm:
- Slide animation khi chuyển ngôn ngữ (slide-in từ phải/trái tùy chiều)
- Preview snippet thay đổi với fade transition
- Có thể thêm flag icon lớn hơn

---

## [IDEA-003] CV Score Visualization
**Ghi nhận:** 2026-04-12 | **Priority:** Low | **Phase:** 2+

- Hiển thị "điểm CV" trực quan (gauge, progress ring)
- So sánh trước/sau AI rewrite: "6/10 → 9/10"
- Gamification element: unlock badge khi CV đạt 8+

---
