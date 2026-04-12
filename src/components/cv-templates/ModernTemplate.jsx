import { cn } from '@/lib/utils';

/**
 * ModernTemplate — 1 cột, header gradient accent màu tím/xanh
 * Style: Sáng tạo, phù hợp ngành Marketing, Design, Tech startup
 * @param {Object} data - CV data từ ChatPanel
 * @param {string} className
 */
export default function ModernTemplate({ data = {}, className }) {
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
    <div className={cn('w-full min-h-[1123px] bg-white font-sans text-[13px]', className)}>

      {/* HEADER GRADIENT */}
      <div className="bg-gradient-to-r from-violet-600 to-blue-500 px-10 py-10 text-white">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{name}</h1>
            <div className="flex items-center gap-4 mt-2 text-white/80 text-[12px]">
              {contact.split(',').map((c, i) => (
                <span key={i} className="flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-white/60" />
                  {c.trim()}
                </span>
              ))}
            </div>
          </div>
          {/* Avatar circle */}
          <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-2xl font-bold">
            {name.charAt(0)}
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="px-10 py-8 flex flex-col gap-7">

        {/* Objective */}
        {objective && (
          <div className="bg-violet-50 border-l-4 border-violet-500 px-5 py-4 rounded-r-xl">
            <p className="text-gray-700 leading-relaxed italic">{objective}</p>
          </div>
        )}

        {/* Skills tags */}
        {skillList.length > 0 && (
          <Section title="Kỹ Năng" accent="violet">
            <div className="flex flex-wrap gap-2">
              {skillList.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-[12px] font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* Experience */}
        <Section title="Kinh Nghiệm" accent="blue">
          {experience
            ? <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{experience}</p>
            : <Placeholder />}
        </Section>

        {/* Education */}
        <Section title="Học Vấn" accent="blue">
          {education
            ? <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{education}</p>
            : <Placeholder />}
        </Section>

        {/* Others */}
        {others && (
          <Section title="Thêm" accent="violet">
            <p className="text-gray-600 leading-relaxed">{others}</p>
          </Section>
        )}

      </div>
    </div>
  );
}

function Section({ title, children, accent }) {
  const colors = {
    violet: 'text-violet-700',
    blue: 'text-blue-700',
  };
  return (
    <div>
      <h2 className={cn('text-[11px] uppercase tracking-[0.15em] font-bold mb-3', colors[accent])}>
        {title}
      </h2>
      <div className="border-t border-gray-100 pt-3">{children}</div>
    </div>
  );
}

function Placeholder() {
  return <p className="text-gray-300 italic text-[12px]">Chưa có — hãy bổ sung qua khung chat bên trái.</p>;
}
