import { cn } from '@/lib/utils';

/**
 * TemplatePicker — Cho phép user chọn template CV trong trang /create
 * @param {string} selectedTemplate - Template đang active: 'professional' | 'modern' | 'minimal'
 * @param {function} onSelect - Callback khi user chọn template
 * @param {string} className
 */
export default function TemplatePicker({ selectedTemplate = 'professional', onSelect, className }) {
  const templates = [
    {
      id: 'professional',
      label: 'Chuyên Nghiệp',
      description: '2 cột, sidebar Navy',
      badge: 'Phổ biến nhất',
      badgeClass: 'bg-blue-100 text-blue-700',
      preview: (
        <div className="w-full h-full flex">
          <div className="w-[35%] bg-[#1B2A4A] rounded-l" />
          <div className="flex-1 p-2 flex flex-col gap-1">
            <div className="h-2 bg-gray-200 rounded w-3/4" />
            <div className="h-1.5 bg-gray-100 rounded w-full" />
            <div className="h-1.5 bg-gray-100 rounded w-5/6" />
            <div className="mt-1 h-2 bg-gray-200 rounded w-2/3" />
            <div className="h-1.5 bg-gray-100 rounded w-full" />
          </div>
        </div>
      ),
    },
    {
      id: 'modern',
      label: 'Hiện Đại',
      description: '1 cột, gradient tím',
      badge: 'Sáng tạo',
      badgeClass: 'bg-violet-100 text-violet-700',
      preview: (
        <div className="w-full h-full flex flex-col">
          <div className="h-[35%] bg-gradient-to-r from-violet-500 to-blue-400 rounded-t" />
          <div className="flex-1 p-2 flex flex-col gap-1">
            <div className="h-1.5 bg-gray-200 rounded w-3/4" />
            <div className="h-1.5 bg-gray-100 rounded w-full" />
            <div className="h-1.5 bg-gray-100 rounded w-5/6" />
            <div className="flex gap-1 mt-1">
              <div className="h-4 w-10 bg-violet-100 rounded-full" />
              <div className="h-4 w-12 bg-violet-100 rounded-full" />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'minimal',
      label: 'Tối Giản',
      description: '1 cột, đen trắng, ATS',
      badge: 'ATS-Ready',
      badgeClass: 'bg-gray-100 text-gray-700',
      preview: (
        <div className="w-full h-full flex flex-col p-2">
          <div className="border-b-2 border-gray-800 pb-1.5 mb-1.5">
            <div className="h-2 bg-gray-800 rounded w-2/3" />
            <div className="h-1.5 bg-gray-300 rounded w-1/2 mt-1" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="h-1.5 bg-gray-700 rounded w-1/3" />
            <div className="h-1.5 bg-gray-100 rounded w-full" />
            <div className="h-1.5 bg-gray-100 rounded w-5/6" />
            <div className="h-1.5 bg-gray-700 rounded w-1/3 mt-1" />
            <div className="h-1.5 bg-gray-100 rounded w-full" />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className={cn('flex gap-3', className)}>
      {templates.map((t) => {
        const isSelected = selectedTemplate === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onSelect?.(t.id)}
            className={cn(
              'flex-1 min-w-[80px] border-2 rounded-xl overflow-hidden transition-all duration-200 text-left group',
              isSelected
                ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md scale-[1.02]'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
            )}
          >
            {/* Template mini preview */}
            <div className="h-20 bg-gray-50 overflow-hidden">{t.preview}</div>

            {/* Label */}
            <div className="px-2.5 py-2 bg-white">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[12px] font-semibold text-gray-800 truncate">{t.label}</span>
                <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-medium flex-shrink-0', t.badgeClass)}>
                  {t.badge}
                </span>
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5">{t.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
