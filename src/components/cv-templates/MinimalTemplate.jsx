import { cn } from '@/lib/utils';

/**
 * MinimalTemplate — 1 cột, typography-first, ATS-optimized
 * Style: Tối giản, đen-trắng, phù hợp ATS scanner, ngành kỹ thuật, finance
 * Không dùng màu sắc rườm rà — ATS đọc tốt nhất
 * @param {Object} data - CV data từ ChatPanel
 * @param {string} className
 */
export default function MinimalTemplate({ data = {}, className }) {
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

  const skillList = skills
    ? skills.split(/[,;|]/).map(s => s.trim()).filter(Boolean)
    : [];

  return (
    <div className={cn('w-full min-h-[1123px] bg-white font-sans text-[13px] text-gray-900', className)}>

      {/* HEADER — Pure black, no color */}
      <div className="border-b-2 border-gray-900 px-10 pt-10 pb-6">
        <h1 className="text-[28px] font-bold tracking-tight uppercase">{name}</h1>
        {contact && (
          <p className="text-gray-500 text-[12px] mt-1 tracking-wide">{contact}</p>
        )}
      </div>

      {/* BODY */}
      <div className="px-10 py-7 flex flex-col gap-6">

        {/* Objective */}
        {objective && (
          <MinSection title="Mục Tiêu">
            <p className="text-gray-700 leading-relaxed">{objective}</p>
          </MinSection>
        )}

        {/* Experience */}
        <MinSection title="Kinh Nghiệm Làm Việc">
          {experience
            ? <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{experience}</p>
            : <Placeholder />}
        </MinSection>

        {/* Education */}
        <MinSection title="Học Vấn">
          {education
            ? <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{education}</p>
            : <Placeholder />}
        </MinSection>

        {/* Skills — plain text list for ATS */}
        {skillList.length > 0 && (
          <MinSection title="Kỹ Năng">
            <p className="text-gray-700">{skillList.join(' • ')}</p>
          </MinSection>
        )}

        {/* Others */}
        {others && (
          <MinSection title="Thông Tin Khác">
            <p className="text-gray-600 leading-relaxed">{others}</p>
          </MinSection>
        )}

      </div>
    </div>
  );
}

function MinSection({ title, children }) {
  return (
    <div>
      <h2 className="text-[11px] uppercase tracking-[0.2em] font-bold text-gray-900 mb-2">
        {title}
      </h2>
      <div className="border-t border-gray-200 pt-3">{children}</div>
    </div>
  );
}

function Placeholder() {
  return <p className="text-gray-300 italic text-[12px]">Chưa có — hãy bổ sung qua khung chat bên trái.</p>;
}
