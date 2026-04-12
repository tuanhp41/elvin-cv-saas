import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const TYPEWRITER_TEXTS = ['Thông minh hơn', 'Nhanh hơn', 'Chuyên nghiệp hơn'];

export default function HeroSection() {
  const [textIndex, setTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Typing animation
  useEffect(() => {
    const typeSpeed = isDeleting ? 60 : 110;
    const currentWord = TYPEWRITER_TEXTS[textIndex];
    const timer = setTimeout(() => {
      if (!isDeleting && currentText === currentWord) {
        setTimeout(() => setIsDeleting(true), 2000);
        return;
      }
      if (isDeleting && currentText === '') {
        setIsDeleting(false);
        setTextIndex((prev) => (prev + 1) % TYPEWRITER_TEXTS.length);
        return;
      }
      setCurrentText((prev) =>
        isDeleting ? prev.slice(0, -1) : currentWord.slice(0, prev.length + 1)
      );
    }, typeSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, textIndex]);

  // Subtle parallax for floating CV card
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-start pt-24 pb-0 overflow-hidden bg-white">
      {/* Very subtle gradient haze — Apple style, almost invisible */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[700px] rounded-full opacity-[0.35]"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 0%, #c7d7fd 0%, #e0e9ff 40%, transparent 80%)',
        }}
      />

      {/* === COPY BLOCK === */}
      <div className="relative z-10 text-center px-4 mt-8 max-w-5xl mx-auto">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-semibold mb-8 select-none">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse inline-block"></span>
          Hoàn toàn miễn phí · Không cần thẻ ngân hàng
        </div>

        {/* Hero headline — Apple size (72-96px feel) */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 leading-[1.08] mb-4">
          Tạo CV của bạn
          <br />
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(135deg, #2563EB 0%, #7c3aed 100%)',
            }}
          >
            {currentText}
            <span className="typing-cursor ml-0.5" aria-hidden="true" />
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
          Hệ thống CV hỗ trợ AI hàng đầu Việt Nam.&nbsp;
          <span className="text-gray-800">Bạn chỉ cần điền,</span> AI lo phần còn lại.
        </p>

        {/* CTA */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/create"
            className={cn(
              'group inline-flex items-center gap-2 px-7 py-4 rounded-2xl font-bold text-lg text-white transition-all duration-300',
              'shadow-[0_4px_24px_rgba(37,99,235,0.35)] hover:shadow-[0_8px_32px_rgba(37,99,235,0.45)]',
              'hover:-translate-y-0.5 active:translate-y-0'
            )}
            style={{ background: 'linear-gradient(135deg, #2563EB 0%, #7c3aed 100%)' }}
          >
            Tạo CV ngay
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl font-bold text-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all hover:-translate-y-0.5"
          >
            Xem bảng giá
          </Link>
        </div>

        {/* Social proof */}
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400 font-medium">
          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
          <span>
            <strong className="text-gray-600">500+</strong> CV chuyên nghiệp đã được tạo mỗi tuần
          </span>
        </div>
      </div>

      {/* === CV PREVIEW — Apple product shot style === */}
      <div
        className="relative z-10 mt-16 w-full max-w-5xl mx-auto px-4 pb-0"
        style={{
          transform: `translateY(${scrollY * 0.05}px)`,
          transition: 'transform 0.1s linear',
        }}
      >
        {/* Browser chrome mockup */}
        <div
          className="w-full rounded-t-2xl overflow-hidden"
          style={{
            boxShadow:
              '0 32px 80px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.10)',
          }}
        >
          {/* Browser bar */}
          <div className="bg-gray-100 px-4 py-2.5 flex items-center gap-2 border-b border-gray-200">
            <span className="w-3 h-3 rounded-full bg-red-400 flex-shrink-0" />
            <span className="w-3 h-3 rounded-full bg-yellow-400 flex-shrink-0" />
            <span className="w-3 h-3 rounded-full bg-green-400 flex-shrink-0" />
            <div className="mx-auto flex-1 max-w-sm">
              <div className="bg-white rounded-md px-3 py-1 text-xs text-gray-400 text-center border border-gray-200 truncate">
                cvbuilder.vn/preview/nguyen-van-tuan
              </div>
            </div>
          </div>

          {/* Actual iframe of real CV */}
          <div className="relative bg-white" style={{ height: '70vh', minHeight: '500px' }}>
            <iframe
              src="https://tuanhp41.github.io/my-cv/"
              title="CV Preview"
              className="w-full h-full border-0"
              style={{ pointerEvents: 'none' }}
              loading="lazy"
            />
            {/* Fade out at bottom so it bleeds into next section */}
            <div
              className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
              style={{
                background:
                  'linear-gradient(to bottom, transparent 0%, white 100%)',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
