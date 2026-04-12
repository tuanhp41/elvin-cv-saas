import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Download, FileText } from 'lucide-react';

import ProfessionalTemplate from '@/components/cv-templates/ProfessionalTemplate';
import ModernTemplate from '@/components/cv-templates/ModernTemplate';
import MinimalTemplate from '@/components/cv-templates/MinimalTemplate';
import TemplatePicker from '@/components/features/TemplatePicker';

/**
 * CVPreview — Hiển thị CV live theo template đã chọn
 * @param {Object} previewData - CV data từ ChatPanel (live)
 * @param {string} className
 */
export default function CVPreview({ className, previewData = {} }) {
  const [activeLang, setActiveLang] = useState('vi');
  const [selectedTemplate, setSelectedTemplate] = useState('professional');

  const languages = [
    { id: 'vi', label: 'Tiếng Việt' },
    { id: 'en', label: 'English' },
    { id: 'zh', label: '中文' },
  ];

  const TemplateComponent = {
    professional: ProfessionalTemplate,
    modern: ModernTemplate,
    minimal: MinimalTemplate,
  }[selectedTemplate] || ProfessionalTemplate;

  return (
    <div className={cn('flex flex-col h-full bg-[#f4f4f5]', className)}>

      {/* Topbar */}
      <div className="px-5 py-3 flex items-center justify-between border-b border-gray-200 bg-white/90 backdrop-blur-md shadow-sm z-10 flex-shrink-0 gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2 text-sm">
            <FileText size={16} className="text-blue-500" />
            Bản xem trước
          </h3>

          {/* Language Tabs */}
          <div className="flex bg-gray-100 p-0.5 rounded-lg">
            {languages.map(lang => (
              <button
                key={lang.id}
                onClick={() => setActiveLang(lang.id)}
                className={cn(
                  'px-3 py-1 rounded-md text-xs font-medium transition-all',
                  activeLang === lang.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                )}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        <button className="flex items-center gap-1.5 bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-800 transition-colors shadow-sm">
          <Download size={13} />
          Tải PDF
        </button>
      </div>

      {/* Template Picker Bar */}
      <div className="px-5 py-3 bg-white border-b border-gray-100 flex-shrink-0">
        <p className="text-[11px] text-gray-400 mb-2 font-medium uppercase tracking-wide">Chọn mẫu CV</p>
        <TemplatePicker
          selectedTemplate={selectedTemplate}
          onSelect={setSelectedTemplate}
        />
      </div>

      {/* A4 Canvas */}
      <div className="flex-1 overflow-y-auto p-6 flex justify-center">
        <div
          className="w-full max-w-[794px] shadow-lg shadow-gray-300/40 rounded-sm ring-1 ring-gray-900/5 overflow-hidden"
          style={{ minHeight: '1123px' }}
        >
          <TemplateComponent data={previewData} />
        </div>
      </div>
    </div>
  );
}
