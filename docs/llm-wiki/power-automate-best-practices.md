# 💡 BÀI HỌC KINH NGHIỆM: POWER AUTOMATE & ODATA FILTER QUERIES

## 1. Lỗi "The expression is not valid" (Dynamic Content trong OData)
Trong Power Automate, khi dùng action **Get items** (SharePoint), bạn LUÔN PHẢI cẩn thận với trường Filter Query. 
**❌ Sai lầm phổ biến:** Nhập trực tiếp code hàm (Ví dụ: ECN_Number eq 'concat('OAKFS', padLeft(...))') dạng chữ (Text) thẳng vào ô OData. OData sẽ báo lỗi vì nó không hiểu hàm của Power Automate nếu bạn viết gộp dưới dạng chuỗi thô.

**✅ Giải pháp (Best Practice cho chuỗi động):**
1. Mở một khối **Compose** (Soạn) đặt *TRƯỚC* khối Get items.
2. Trong ô Inputs của Compose, bấm nút Add Dynamic Content > chuyển sang tab **Expression** (Biểu thức).
3. Dán đoạn code concat('OAKFS', padLeft(string(items('Apply_to_each')?['ParentItemId']), 8, '0')) vào đây và bấm OK để nó hóa thành **Biểu tượng (Bubble) Fx màu hồng**.
4. Truy cập lại khối Get items, ở ô OData Filter Query, gõ: Title eq ' rồi chèn Output của khối Compose vào giữa, và đóng nháy đơn lại '. (Lưu ý: Tên cột mặc định đầu tiên của SharePoint lưu ý là Title dù hiển thị là ECN_Number).
