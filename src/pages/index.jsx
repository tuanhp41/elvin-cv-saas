import Head from 'next/head';
import Header from '@/components/layout/Header';
import HeroSection from '@/components/landing/HeroSection';
import ShowcaseSection from '@/components/landing/ShowcaseSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
      <Head>
        <title>CV Builder - Tạo CV chuyên nghiệp với AI</title>
        <meta name="description" content="Tạo CV thông minh với sức mạnh AI. Hỗ trợ đa ngôn ngữ, tự động viết lại nội dung chuyên nghiệp, xuất chuẩn định dạng HR." />
        <meta property="og:title" content="CV Builder - AI Resume Maker" />
        <meta property="og:description" content="Nền tảng tạo CV bằng AI thông minh nhất Việt Nam" />
        <meta property="og:type" content="website" />
      </Head>

      <Header />

      <main className="flex flex-col min-h-screen">
        <HeroSection />
        <ShowcaseSection />
        <FeaturesSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
