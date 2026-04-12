import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Download, FileText, Globe } from 'lucide-react';

/**
 * CVPreview - Hiển thị bản nháp CV theo thời gian thực (Luồng A)
 * Giả lập layout giấy A4
 */
export default function CVPreview({ className, previewData = {} }) {
  const [activeLang, setActiveLang] = useState('vi');

  // Ngôn ngữ giả sinh
  const languages = [
    { id: 'vi', label: 'Tiếng Việt' },
    { id: 'en', label: 'English' },
    { id: 'zh', label: '中文' }
  ];

  return (
    <div className={cn('flex flex-col h-full bg-[#f4f4f5]', className)}>
      
      {/* Top Bar */}
      <div className="h-14 px-6 flex items-center justify-between border-b border-gray-200 bg-white/80 backdrop-blur-md shadow-sm z-10 flex-shrink-0">
        <div className="flex items-center gap-4">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <FileText size={18} className="text-blue-500" />
            Bản xem trước CV
          </h3>
          
          <div className="flex bg-gray-100 p-1 rounded-lg">
            {languages.map(lang => (
              <button
                key={lang.id}
                onClick={() => setActiveLang(lang.id)}
                className={cn(
                  "px-3 py-1 rounded-md text-sm font-medium transition-all",
                  activeLang === lang.id 
                    ? "bg-white text-gray-900 shadow-sm" 
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        <button className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm">
          <Download size={16} />
          Tải PDF
        </button>
      </div>

      {/* A4 Canvas Area */}
      <div className="flex-1 overflow-y-auto p-8 flex justify-center">
        
        {/* A4 Paper Container (Ratio 1:1.414) */}
        <div className="w-full max-w-[794px] bg-white shadow-lg shadow-gray-200/50 rounded-sm ring-1 ring-gray-900/5 min-h-[1123px] p-10 flex flex-col gap-6 scale-95 origin-top md:scale-100 transition-all">
          
          <div className="border-b-2 border-gray-900 pb-6">
            <h1 className="text-4xl font-bold text-gray-900 uppercase tracking-tight">
              {previewData?.personalInfo?.fullName || "HỌ VÀ TÊN"}
            </h1>
            <p className="text-gray-500 mt-2 font-medium flex gap-4 text-sm">
              <span>{previewData?.personalInfo?.contact?.includes('@') ? previewData.personalInfo.contact : 'email@didau.com'}</span>
              <span>•</span>
              <span>{previewData?.personalInfo?.contact?.replace(/[^0-9]/g, '') || '0123 456 789'}</span>
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider mb-2">Mục Tiêu Nghề Nghiệp</h2>
            <div className="text-gray-700 leading-relaxed min-h-[60px]">
              {previewData?.objective ? (
                <p>{previewData.objective}</p>
              ) : (
                <div className="text-gray-300 italic">Trao đổi với AI để hoàn thiện phần này...</div>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider mb-2">Kinh Nghiệm Làm Việc</h2>
            <div className="text-gray-700 min-h-[100px]">
              {previewData?.experience ? (
                <div className="mb-4">
                   <h3 className="font-semibold text-gray-900">Vị trí tương đương</h3>
                   <p className="text-sm text-gray-500">Thời gian làm việc</p>
                   <ul className="list-disc pl-5 mt-2 space-y-1">
                     <li>{previewData.experience}</li>
                   </ul>
                </div>
              ) : (
                <div className="text-gray-300 italic">Vui lòng cung cấp kinh nghiệm của bạn ở khung Chat bên trái.</div>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider mb-2">Học Vấn & Bằng Cấp</h2>
             <div className="text-gray-700 min-h-[60px]">
              {previewData?.education ? (
                <p>{previewData.education}</p>
              ) : (
                <div className="h-4 bg-gray-100 rounded w-1/3 mb-2 animate-pulse"></div>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider mb-2">Kỹ Năng</h2>
             <div className="flex flex-wrap gap-2 min-h-[40px]">
              {previewData?.skills ? (
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">{previewData.skills}</span>
              ) : (
                <div className="h-6 w-24 bg-gray-100 rounded-full animate-pulse border border-gray-200"></div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
