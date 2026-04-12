import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/layout/Header';

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Head>
        <title>CV Builder - AI-powered CV</title>
        <meta name="description" content="Tạo CV thông minh với AI" />
      </Head>

      <Header />

      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Hero Section */}
        <section className="text-center py-20">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
            Tạo CV chuyên nghiệp với <span className="text-blue-600">Sức mạnh AI</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Hệ thống hỗ trợ đa ngôn ngữ Vi/En/Zh. Tái tạo CV của bạn trở nên hấp dẫn hơn bằng trí tuệ nhân tạo Gemma 4.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/create" className="px-8 py-4 bg-primary text-primary-foreground text-lg font-semibold rounded-lg shadow-lg hover:bg-primary/90 transition">
              Tạo CV ngay
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 grid md:grid-cols-3 gap-8">
          <div className="p-6 border rounded-xl shadow-sm bg-card">
            <h3 className="text-xl font-bold mb-3">Đa Ngôn Ngữ</h3>
            <p className="text-muted-foreground">Hỗ trợ điền thông tin và xuất CV trực tiếp ra Tiếng Việt, Tiếng Anh, hoặc Tiếng Trung.</p>
          </div>
          <div className="p-6 border rounded-xl shadow-sm bg-card">
            <h3 className="text-xl font-bold mb-3">AI Rewrite CV</h3>
            <p className="text-muted-foreground">Bạn không giỏi viết content? AI của chúng tôi sẽ sửa lại câu chữ giúp bạn thu hút nhà tuyển dụng.</p>
          </div>
          <div className="p-6 border rounded-xl shadow-sm bg-card">
            <h3 className="text-xl font-bold mb-3">3 Templates Chuẩn Mực</h3>
            <p className="text-muted-foreground">Các mẫu CV được thiết kế tối giản, khoa học và nhắm trúng thị hiệu của HR đa quốc gia.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
