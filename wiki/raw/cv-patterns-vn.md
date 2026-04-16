# CV Patterns Vietnam — LLM Wiki
# Project: CV SaaS | Domain: Vietnamese CV conventions + FDI Chinese format
# Last updated: 2026-04-11

## Tổng quan thị trường mục tiêu
- **Chính:** Lao động Việt Nam làm tại công ty FDI Trung Quốc
- **Phụ:** Người Việt xin việc công ty trong nước + quốc tế
- **Niche:** CV tiếng Trung cho thị trường FDI TQ — ít cạnh tranh

---

## TEMPLATE 1 — CV Tiếng Việt (thị trường trong nước)

### Cấu trúc chuẩn
```
1. THÔNG TIN CÁ NHÂN
   Họ và tên | Ngày sinh | Điện thoại | Email | Địa chỉ

2. MỤC TIÊU NGHỀ NGHIỆP (3-4 câu)
   - Vị trí muốn ứng tuyển
   - Kinh nghiệm nổi bật nhất
   - Giá trị mang lại cho công ty

3. HỌC VẤN
   Trường | Chuyên ngành | Năm tốt nghiệp | GPA (nếu > 3.2)

4. KINH NGHIỆM LÀM VIỆC (đảo ngược thời gian)
   Công ty | Vị trí | Thời gian
   - Thành tích cụ thể (có số liệu)
   - Trách nhiệm chính (3-5 bullet)

5. KỸ NĂNG
   Kỹ năng chuyên môn | Ngoại ngữ | Tin học

6. CHỨNG CHỈ / GIẢI THƯỞNG (nếu có)

7. HOẠT ĐỘNG NGOẠI KHÓA (optional, cho fresh grad)
```

### Nguyên tắc viết CV tiếng Việt
- Ảnh: **BẮT BUỘC** — ảnh thẻ 3x4, nền trắng/xanh, chuyên nghiệp
- Font: Times New Roman 12pt hoặc Arial 11pt
- Màu sắc: tối giản, tối đa 2 màu
- Dài: **1 trang A4** (trừ senior 10+ năm kinh nghiệm)
- Thông tin tuổi/giới tính: thường yêu cầu ở VN (khác Tây)

### Động từ mạnh (Việt)
```
Triển khai | Tối ưu hóa | Phát triển | Quản lý | Phối hợp
Tăng [X]% | Giảm [X] | Hoàn thành trước deadline | Đạt KPI [X]
```

---

## TEMPLATE 2 — CV Tiếng Anh (công ty quốc tế/FDI)

### Cấu trúc ATS-friendly
```
FULL NAME
Phone | Email | LinkedIn (optional) | Location

PROFESSIONAL SUMMARY (3-4 lines)

WORK EXPERIENCE
  Company Name — Job Title | Month YYYY – Month YYYY
  • Achievement with metric (increased X by Y%)
  • Key responsibility using action verb

EDUCATION
  Degree, Major — University Name | Year

SKILLS
  Technical | Languages | Tools

CERTIFICATIONS (if any)
```

### ATS Keywords (phổ biến cho tech/operations)
```
Management: managed, led, oversaw, coordinated, supervised
Achievement: achieved, delivered, improved, optimized, reduced
Technical: implemented, developed, configured, deployed, integrated
Collaboration: collaborated, partnered, worked cross-functionally
```

### Lưu ý ATS
- Không dùng table layout (ATS không đọc được)
- Không embed text trong image
- Dùng standard section headers: "Work Experience", "Education", "Skills"
- Keywords phải match với job description

---

## TEMPLATE 3 — CV Tiếng Trung (FDI Trung Quốc tại VN)

### Cấu trúc chuẩn (简历)
```
姓名: [Họ tên]               性别: [Nam/Nữ]
出生日期: [Ngày sinh]        国籍: 越南
联系电话: [SĐT]              电子邮件: [Email]
现居地址: [Địa chỉ]

求职意向: [Vị trí]

教育背景 (Học vấn)
  院校名称 | 专业 | 学历 | 毕业年份

工作经历 (Kinh nghiệm)
  公司名称 | 职位 | 在职时间
  • 主要职责和成就

语言能力 (Ngôn ngữ)
  越南语: 母语 | 中文: [HSK X级/流利] | 英语: [TOEIC X]

专业技能 (Kỹ năng)

自我评价 (Tự đánh giá — 3-4 câu tiếng Trung)
```

### Lưu ý quan trọng cho CV tiếng Trung
- **Ảnh:** Bắt buộc, kích thước chuẩn hơn CV Việt
- **Tuổi:** Ghi rõ, công ty TQ thường quan tâm
- **HSK level:** Nếu có chứng chỉ HSK → ghi rõ level (HSK 4, 5, 6)
- **Tự đánh giá:** Phần quan trọng — thể hiện tính cách phù hợp văn hóa TQ
  - Chăm chỉ (勤奋), Trung thực (诚实), Teamwork (团队合作)
- **Không đòi lương:** Không ghi salary expectation trong CV TQ

### Từ điển kỹ năng thường gặp (Việt → Trung)
```
Quản lý dự án → 项目管理
Phân tích dữ liệu → 数据分析
Giao tiếp → 沟通能力
Giải quyết vấn đề → 解决问题
Microsoft Office → 微软办公软件
Tiếng Anh → 英语 (TOEIC X分)
```

---

## Best Practices chung cho AI Prompt
```
Khi generate CV cho dự án này:
1. Hỏi user: ngôn ngữ? (vi/en/zh)
2. Xác định template phù hợp theo ngôn ngữ trên
3. Sanitize input trước (lib/gemma.js → sanitizeInput())
4. Áp dụng động từ mạnh tương ứng ngôn ngữ
5. Giữ nguyên 100% facts — không thêm kinh nghiệm không có
6. Output: tối đa 1 trang A4, format nhất quán
7. Score output: >= 7/10 mới trả về user
```

## Liên quan đến dự án
- Template picker: user chọn 1 trong 3 templates trên
- Template ID: `'vi-standard'`, `'en-ats'`, `'zh-fdi'`
- Watermark: overlay "CV SaaS — Mua để xóa watermark" trên preview
- AI rewrite dùng template structure làm context cố định trong prompt
