import { useState } from 'react';

export default function CVForm() {
  const [activeTab, setActiveTab] = useState('vi');

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-card border rounded-xl shadow-sm">
      <div className="mb-6 flex border-b">
        <button 
          onClick={() => setActiveTab('vi')}
          className={`py-2 px-4 font-medium border-b-2 transition-colors ${activeTab === 'vi' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          Tiếng Việt
        </button>
        <button 
          onClick={() => setActiveTab('en')}
          className={`py-2 px-4 font-medium border-b-2 transition-colors ${activeTab === 'en' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          Tiếng Anh
        </button>
        <button 
          onClick={() => setActiveTab('zh')}
          className={`py-2 px-4 font-medium border-b-2 transition-colors ${activeTab === 'zh' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          Tiếng Trung
        </button>
      </div>

      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Họ &amp; Tên</label>
            <input type="text" className="w-full p-2 border rounded-md" placeholder="Nguyễn Văn A" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <input type="email" className="w-full p-2 border rounded-md" placeholder="email@example.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Số điện thoại</label>
            <input type="tel" className="w-full p-2 border rounded-md" placeholder="0123 456 789" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Kinh nghiệm làm việc</label>
          <textarea className="w-full p-3 border rounded-md h-32" placeholder="Mô tả công việc và thành tựu..." />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Học vấn</label>
          <textarea className="w-full p-3 border rounded-md h-24" placeholder="Cử nhân trường Đại Học X..." />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Kỹ năng</label>
          <input type="text" className="w-full p-2 border rounded-md" placeholder="React, Node.js, Leadership..." />
        </div>

        <div className="pt-4 flex justify-end">
          <button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-md font-medium">
            Lưu &amp; Tiếp tục
          </button>
        </div>
      </form>
    </div>
  );
}
