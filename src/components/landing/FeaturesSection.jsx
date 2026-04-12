import React from 'react';
import { Sparkles, FileText, Globe } from 'lucide-react';

export default function FeaturesSection() {
  return (
    <section className="py-24 relative bg-slate-50/50 dark:bg-black/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Chỉ cần điền, AI lo phần còn lại</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Hệ thống sinh ra để loại bỏ những rắc rối khi viết CV truyền thống.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Bento Card 1 */}
          <div className="glass-card glow-border p-8 rounded-2xl flex flex-col items-start text-left group transition-all duration-300 hover:-translate-y-2">
            <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6 max-h-12 max-w-12 group-hover:scale-110 transition-transform">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Đa Ngôn Ngữ (Vi/En/Zh)</h3>
            <p className="text-muted-foreground leading-relaxed">
              Nhập bằng tiếng Việt, ứng tuyển công ty nước ngoài dễ dàng. Khả năng dịch thuật chuẩn xác và giữ nguyên format tờ CV của bạn.
            </p>
          </div>

          {/* Bento Card 2 */}
          <div className="glass-card glow-border p-8 rounded-2xl flex flex-col items-start text-left group transition-all duration-300 hover:-translate-y-2">
            <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-6 max-h-12 max-w-12 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">AI Viết Lại (Rewrite)</h3>
            <p className="text-muted-foreground leading-relaxed">
              Văn phong lủng củng? AI sẽ biến các gạch đầu dòng tẻ nhạt của bạn thành những lời mô tả thu hút nhà tuyển dụng ngay lập tức.
            </p>
          </div>

          {/* Bento Card 3 */}
          <div className="glass-card glow-border p-8 rounded-2xl flex flex-col items-start text-left group transition-all duration-300 hover:-translate-y-2">
            <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 flex items-center justify-center mb-6 max-h-12 max-w-12 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Template Chuẩn HR</h3>
            <p className="text-muted-foreground leading-relaxed">
              Tạm biệt các template rườm rà. Các mẫu của chúng tôi tối giản, tối ưu cho mắt của nhà tuyển dụng và phần mềm lọc hồ sơ (ATS).
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
