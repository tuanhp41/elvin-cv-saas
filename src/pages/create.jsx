import { useState } from 'react';
import Head from 'next/head';
import { useAuth } from '@/hooks/useAuth';

import ChatPanel from '@/components/features/ChatPanel';
import CVPreview from '@/components/features/CVPreview';

export default function CreateCVPage() {
  // Yêu cầu user phải đăng nhập mới tạo được CV
  const { user, loading } = useAuth(true);

  // Lưu trữ dữ liệu CV nháp trên RAM để live preview
  // Sau này sẽ được đồng bộ với Supabase
  const [cvData, setCvData] = useState({
    personalInfo: {
      fullName: "",
      contact: ""
    },
    objective: "",
    experience: "",
    education: "",
    skills: "",
    others: ""
  });

  // Hàm nhận thông tin từ ChatPanel để hiển thị lên CVPreview
  const handleExtractData = (fieldTarget, value) => {
    // fieldTarget có dạng "personalInfo.fullName" hoặc "objective"
    setCvData(prevStatus => {
      const parts = fieldTarget.split('.');
      if (parts.length === 2) {
        return {
          ...prevStatus,
          [parts[0]]: {
            ...prevStatus[parts[0]],
            [parts[1]]: value
          }
        };
      } else {
        return {
          ...prevStatus,
          [fieldTarget]: value
        };
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Đang xác thực bảo mật...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Tạo CV mới | AI Phù Thuỷ CV</title>
        <meta name="description" content="Tạo CV xịn xò 3 ngôn ngữ bằng AI trong tích tắc" />
      </Head>

      {/* Main Split-Screen Layout */}
      {/* 
        md:flex-row: Chia 2 cột trên Desktop
        flex-col: Xếp dọc trên Mobile 
      */}
      <main className="h-screen w-full flex flex-col md:flex-row overflow-hidden bg-white">
        
        {/* Left Side: 40% - AI Chat Interview */}
        <section className="w-full md:w-[40%] h-[50vh] md:h-screen flex-shrink-0 relative z-20 shadow-xl md:shadow-none">
          <ChatPanel onExtractData={handleExtractData} />
        </section>

        {/* Right Side: 60% - Live CV Preview */}
        <section className="w-full md:flex-1 h-[50vh] md:h-screen bg-[#f4f4f5] relative z-0">
          <CVPreview previewData={cvData} />
        </section>
        
      </main>
    </>
  );
}
