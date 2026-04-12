import { Sparkles, FileText, Zap } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    iconColor: 'text-purple-500',
    iconBg: 'bg-purple-50',
    title: 'AI Viết Lại Thay Bạn',
    desc: 'Chỉ cần gạch đầu dòng thô, AI sẽ biến chúng thành câu văn chuyên nghiệp thu hút nhà tuyển dụng.',
  },
  {
    icon: Zap,
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-50',
    title: 'Xong Trong 5 Phút',
    desc: 'Điền form đơn giản như điền thông tin zalo. Không cần biết thiết kế, không cần kéo thả, không mất thời gian.',
  },
  {
    icon: FileText,
    iconColor: 'text-green-500',
    iconBg: 'bg-green-50',
    title: 'Template Chuẩn HR Việt',
    desc: 'Bố cục tối giản 1 trang, đúng chuẩn nhà tuyển dụng Việt Nam đọc trong 6 giây là nắm được bạn là ai.',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Tại sao chọn chúng tôi?
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Được thiết kế cho người Việt, bởi người Việt — không rườm rà, không mất thời gian.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="group bg-white border border-gray-100 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default"
              >
                <div className={`w-12 h-12 rounded-2xl ${f.iconBg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${f.iconColor}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
