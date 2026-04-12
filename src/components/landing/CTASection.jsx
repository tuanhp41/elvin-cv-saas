import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
          Bắt đầu ngay hôm nay.
          <br />
          <span className="text-gray-400 font-bold">Hoàn toàn miễn phí.</span>
        </h2>
        <p className="text-xl text-gray-500 mb-10 max-w-lg mx-auto">
          Không đăng ký rườm rà. Không cần thẻ tín dụng. Chỉ cần email và bắt đầu.
        </p>
        <Link
          href="/create"
          className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg text-white transition-all duration-300 shadow-[0_4px_24px_rgba(37,99,235,0.35)] hover:shadow-[0_8px_32px_rgba(37,99,235,0.45)] hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg, #2563EB 0%, #7c3aed 100%)' }}
        >
          Tạo CV của tôi
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
