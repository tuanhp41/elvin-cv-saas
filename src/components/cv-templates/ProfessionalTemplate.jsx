import { cn } from '@/lib/utils';

/**
 * ProfessionalTemplate — 2 cột, sidebar navy bên trái
 * Style: Chuyên nghiệp, phù hợp ngành tài chính, kỹ thuật, quản lý
 * @param {Object} data - CV data từ ChatPanel (personalInfo, objective, experience, education, skills, others)
 * @param {string} className
 */
export default function ProfessionalTemplate({ data = {}, className }) {
  const {
    personalInfo = {},
    objective = '',
    experience = '',
    education = '',
    skills = '',
    others = '',
  } = data;

  const name = personalInfo.fullName || 'HỌ VÀ TÊN';
  const contact = personalInfo.contact || '';

  // Parse skills thành mảng
  const skillList = skills
    ? skills.split(/[,;|]/).map(s => s.trim()).filter(Boolean)
    : ['—'];

  return (
    <div className={cn('w-full min-h-[1123px] flex font-sans text-[13px]', className)}>

      {/* LEFT SIDEBAR — Navy */}
      <div className="w-[35%] bg-[#1B2A4A] text-white flex flex-col p-7 gap-8">

        {/* Avatar placeholder */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-24 h-24 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center text-4xl font-bold text-white/50">
            {name.charAt(0)}
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-white leading-tight">{name}</h1>
            {contact && <p className="text-xs text-blue-200 mt-1">{contact}</p>}
          </div>
        </div>

        <hr className="border-white/10" />

        {/* Skills sidebar */}
        <div>
          <h3 className="text-[11px] uppercase tracking-[0.15em] text-blue-300 font-semibold mb-3">Kỹ Năng</h3>
          <div className="flex flex-col gap-2">
            {skillList.map((skill, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                <span className="text-white/90 text-[12px]">{skill || '—'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Thông tin khác */}
        {others && (
          <>
            <hr className="border-white/10" />
            <div>
              <h3 className="text-[11px] uppercase tracking-[0.15em] text-blue-300 font-semibold mb-3">Thêm</h3>
              <p className="text-white/80 text-[12px] leading-relaxed">{others}</p>
            </div>
          </>
        )}
      </div>

      {/* RIGHT CONTENT */}
      <div className="flex-1 bg-white p-8 flex flex-col gap-7">

        {/* Mục tiêu */}
        <Section title="Mục Tiêu Nghề Nghiệp">
          <p className="text-gray-600 leading-relaxed">
            {objective || <Placeholder text="Chưa có mục tiêu nghề nghiệp" />}
          </p>
        </Section>

        {/* Kinh nghiệm */}
        <Section title="Kinh Nghiệm Làm Việc">
          {experience
            ? <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{experience}</p>
            : <Placeholder text="Chưa có kinh nghiệm" />}
        </Section>

        {/* Học vấn */}
        <Section title="Học Vấn">
          {education
            ? <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{education}</p>
            : <Placeholder text="Chưa có thông tin học vấn" />}
        </Section>

      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <h2 className="text-[11px] uppercase tracking-[0.15em] font-bold text-[#1B2A4A]">{title}</h2>
        <div className="flex-1 h-px bg-[#1B2A4A]/15" />
      </div>
      {children}
    </div>
  );
}

function Placeholder({ text }) {
  return (
    <p className="text-gray-300 italic text-[12px]">{text} — hãy bổ sung qua khung chat bên trái.</p>
  );
}
