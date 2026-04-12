import { useState, useEffect, useCallback } from 'react';
import { ArrowRight, RefreshCw } from 'lucide-react';

/* ────────────────────────────────────────────
   MOCK CV DATA — 3 ngôn ngữ
   ──────────────────────────────────────────── */
const cvVariants = [
  {
    lang: '🇻🇳 Tiếng Việt',
    name: 'Nguyễn Văn Tuấn',
    title: 'Chuyên viên quản trị hệ thống',
    exp: [
      'Quản lý hạ tầng IT cho 300+ nhân viên tại công ty sản xuất quốc tế',
      'Triển khai hệ thống ERP Mendix, giảm 40% thời gian xử lý phê duyệt',
      'Tích hợp API chấm công Hikvision tự động hóa dữ liệu HR',
    ],
    skills: ['Linux', 'Networking', 'Mendix', 'N8N', 'Python'],
    edu: 'Đại học Bách Khoa — Công nghệ thông tin',
  },
  {
    lang: '🇬🇧 English',
    name: 'Nguyen Van Tuan',
    title: 'IT Systems Administrator',
    exp: [
      'Managed IT infrastructure for 300+ employees at an international manufacturing company',
      'Deployed Mendix ERP system, reducing approval processing time by 40%',
      'Integrated Hikvision access-control API for automated HR attendance',
    ],
    skills: ['Linux', 'Networking', 'Mendix', 'N8N', 'Python'],
    edu: 'Bach Khoa University — Information Technology',
  },
  {
    lang: '🇨🇳 中文',
    name: '阮文俊',
    title: 'IT系统管理员',
    exp: [
      '为国际制造公司300多名员工管理IT基础设施',
      '部署Mendix ERP系统，审批处理时间减少40%',
      '集成海康威视门禁API，实现人力资源考勤自动化',
    ],
    skills: ['Linux', 'Networking', 'Mendix', 'N8N', 'Python'],
    edu: '百科大学 — 信息技术专业',
  },
];

/* ────────────────────────────────────────────
   Mini CV Card renderer
   ──────────────────────────────────────────── */
function CVCard({ data, variant = 'after' }) {
  const isAfter = variant === 'after';

  if (!isAfter) {
    // "Before" — ugly plain text CV
    return (
      <div className="w-full h-full bg-white p-6 text-left font-mono text-xs leading-relaxed text-gray-700 overflow-hidden">
        <p className="font-bold text-sm mb-1">Nguyen Van Tuan</p>
        <p className="text-gray-400 mb-3">email: tuan@gmail.com | sdt: 0901234567</p>
        <p className="font-bold text-xs text-gray-500 uppercase mb-1 border-b border-gray-200 pb-1">Kinh nghiệm làm việc</p>
        <p className="mb-1">- Làm IT ở công ty sản xuất</p>
        <p className="mb-1">- Cài đặt máy tính, sửa mạng</p>
        <p className="mb-1">- Làm ERP cho công ty</p>
        <p className="mb-1">- Quản lý server</p>
        <p className="font-bold text-xs text-gray-500 uppercase mt-3 mb-1 border-b border-gray-200 pb-1">Học vấn</p>
        <p>Đại học Bách Khoa</p>
        <p className="font-bold text-xs text-gray-500 uppercase mt-3 mb-1 border-b border-gray-200 pb-1">Kỹ năng</p>
        <p>Word, Excel, PowerPoint, sửa máy tính</p>
      </div>
    );
  }

  // "After" — professional styled CV
  return (
    <div className="w-full h-full bg-white flex overflow-hidden text-left">
      {/* Sidebar navy */}
      <div className="w-[35%] bg-slate-800 text-white p-5 flex flex-col gap-4">
        {/* Avatar placeholder */}
        <div className="w-16 h-16 bg-slate-600 rounded-full mx-auto flex items-center justify-center text-xl font-bold text-white/60">
          {data.name.charAt(0)}
        </div>
        <div className="text-center">
          <p className="font-bold text-sm leading-tight">{data.name}</p>
          <p className="text-[10px] text-slate-300 mt-0.5">{data.title}</p>
        </div>

        {/* Skills */}
        <div>
          <p className="text-[9px] uppercase tracking-widest text-slate-400 mb-1.5 font-semibold">Skills</p>
          <div className="flex flex-wrap gap-1">
            {data.skills.map((s) => (
              <span key={s} className="text-[9px] bg-slate-700 text-slate-200 px-1.5 py-0.5 rounded">
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Education */}
        <div>
          <p className="text-[9px] uppercase tracking-widest text-slate-400 mb-1 font-semibold">Education</p>
          <p className="text-[10px] text-slate-300 leading-snug">{data.edu}</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-5">
        <h3 className="text-sm font-bold text-gray-900 mb-0.5">{data.name}</h3>
        <p className="text-[10px] text-blue-600 font-medium mb-3">{data.title}</p>

        <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-1.5 font-semibold">Experience</p>
        <ul className="space-y-1.5 mb-4">
          {data.exp.map((e, i) => (
            <li key={i} className="text-[10px] text-gray-600 leading-snug flex gap-1.5">
              <span className="text-blue-500 mt-0.5 flex-shrink-0">▸</span>
              <span>{e}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   Main Section
   ──────────────────────────────────────────── */
export default function ShowcaseSection() {
  const [activeTab, setActiveTab] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);

  // Auto-rotate languages every 3s
  const nextTab = useCallback(() => {
    setActiveTab((prev) => (prev + 1) % cvVariants.length);
  }, []);

  useEffect(() => {
    if (!autoPlay || isFlipped === false) return;
    const timer = setInterval(nextTab, 4000);
    return () => clearInterval(timer);
  }, [autoPlay, isFlipped, nextTab]);

  // Auto-flip after 2s on mount
  useEffect(() => {
    const t = setTimeout(() => setIsFlipped(true), 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-4">
            Lột xác CV của bạn
          </h2>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto">
            Từ CV nhạt nhẽo đến CV chuyên nghiệp.<br className="hidden md:block" />
            <strong className="text-gray-800">Một CV, 3 lựa chọn ngôn ngữ.</strong>
          </p>
        </div>

        {/* 2-column layout */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          {/* LEFT — Before / After flip */}
          <div className="flex flex-col items-center">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
              {isFlipped ? '✨ Sau khi dùng AI' : '😐 CV hiện tại của bạn'}
            </p>

            {/* Flip container */}
            <div
              className="relative w-full max-w-xs mx-auto cursor-pointer select-none"
              style={{ aspectRatio: '210 / 297', perspective: '1200px' }}
              onClick={() => {
                setIsFlipped(!isFlipped);
                setAutoPlay(false);
              }}
            >
              <div
                className="relative w-full h-full transition-transform duration-700 ease-in-out"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                {/* Front — Before */}
                <div
                  className="absolute inset-0 rounded-xl border border-gray-200 shadow-lg overflow-hidden"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <CVCard variant="before" data={cvVariants[0]} />
                </div>

                {/* Back — After (current language) */}
                <div
                  className="absolute inset-0 rounded-xl border border-gray-200 shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  <CVCard variant="after" data={cvVariants[activeTab]} />
                </div>
              </div>
            </div>

            {/* Flip hint */}
            <button
              onClick={() => {
                setIsFlipped(!isFlipped);
                setAutoPlay(false);
              }}
              className="mt-4 inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Bấm để {isFlipped ? 'xem trước' : 'xem sau'}
            </button>
          </div>

          {/* RIGHT — Language switcher + text */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Một CV, 3 lựa chọn ngôn ngữ
            </h3>
            <p className="text-gray-500 mb-8 max-w-md leading-relaxed">
              Điền thông tin bằng tiếng Việt — Hệ thống AI sẽ tạo ra bản 
              <strong className="text-gray-700"> Tiếng Anh chuyên nghiệp</strong> và 
              <strong className="text-gray-700"> Tiếng Trung chuẩn xác</strong> cho bạn ngay lập tức.
            </p>

            {/* Language tabs */}
            <div className="flex gap-2 mb-6">
              {cvVariants.map((v, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setActiveTab(i);
                    setIsFlipped(true);
                    setAutoPlay(false);
                  }}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    activeTab === i
                      ? 'bg-gray-900 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {v.lang}
                </button>
              ))}
            </div>

            {/* Preview snippet */}
            <div className="w-full bg-gray-50 rounded-2xl p-5 border border-gray-100">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-semibold">
                Preview — {cvVariants[activeTab].lang}
              </p>
              <p className="text-sm font-bold text-gray-900">{cvVariants[activeTab].name}</p>
              <p className="text-xs text-blue-600 mb-2">{cvVariants[activeTab].title}</p>
              <ul className="space-y-1">
                {cvVariants[activeTab].exp.slice(0, 2).map((e, i) => (
                  <li key={i} className="text-xs text-gray-500 flex gap-1.5">
                    <span className="text-blue-400 flex-shrink-0">▸</span>
                    <span>{e}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Micro CTA */}
            <a
              href="/create"
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors group"
            >
              Lột xác CV ngay
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
