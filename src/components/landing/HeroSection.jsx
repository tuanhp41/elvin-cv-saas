import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { CheckCircle2 } from 'lucide-react';

const TYPEWRITER_TEXTS = [
  "Trí tuệ nhân tạo",
  "Tốc độ ánh sáng",
  "Chuẩn mực HR",
  "Đa ngôn ngữ"
];

export default function HeroSection() {
  const [textIndex, setTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const typeSpeed = isDeleting ? 50 : 100;
    const currentWord = TYPEWRITER_TEXTS[textIndex];

    const timer = setTimeout(() => {
      if (!isDeleting && currentText === currentWord) {
        setTimeout(() => setIsDeleting(true), 1500); // Pause at end of word
        return;
      }

      if (isDeleting && currentText === '') {
        setIsDeleting(false);
        setTextIndex((prev) => (prev + 1) % TYPEWRITER_TEXTS.length);
        return;
      }

      setCurrentText((prev) => 
        isDeleting 
          ? prev.slice(0, -1) 
          : currentWord.slice(0, prev.length + 1)
      );
    }, typeSpeed);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, textIndex]);

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Background Blobs (Aurora Effect) */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="container relative z-10 mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-foreground animate-fade-in-up">
          Tạo CV chuyên nghiệp với <br className="hidden md:block"/>
          <span className="text-primary typing-cursor pr-1">
            {currentText}
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          Hệ thống hỗ trợ Đa ngôn ngữ Vi/En/Zh. Tái tạo CV của bạn trở nên hấp dẫn hơn bằng cách để AI làm thay bạn.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <Link href="/create">
            <Button size="lg" className="text-lg px-8 py-6 rounded-xl shadow-xl hover:shadow-primary/25 hover:-translate-y-1 transition-all duration-300">
              🚀 Tạo CV miễn phí trong 5 phút
            </Button>
          </Link>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4 font-medium">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span>500+ CV đã được tạo tuần này</span>
          </div>
        </div>

        {/* Mockup CV Preview Card */}
        <div className="mt-20 mx-auto max-w-3xl perspective-[1000px] animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="w-full h-80 md:h-[500px] rounded-xl bg-white border border-gray-200 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rotate-x-[5deg] rotate-y-[-5deg] scale-95 hover:rotate-0 hover:scale-100 transition-all duration-700 ease-out overflow-hidden flex flex-col animate-float">
            <div className="w-full h-8 bg-gray-50 flex items-center px-4 border-b border-gray-100 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            {/* Mock CV Content */}
            <div className="flex-1 p-8 text-left bg-white">
              <div className="flex gap-6 mb-8">
                <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse"></div>
                <div className="flex-1 space-y-3 pt-2">
                  <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-1/4 bg-gray-100 rounded animate-pulse"></div>
                  <div className="h-4 w-1/2 bg-gray-100 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 w-full bg-gray-100 rounded animate-pulse"></div>
                <div className="h-3 w-5/6 bg-gray-100 rounded animate-pulse"></div>
                <div className="h-3 w-4/6 bg-gray-100 rounded animate-pulse"></div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 w-full bg-gray-100 rounded animate-pulse"></div>
                <div className="h-3 w-5/6 bg-gray-100 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
