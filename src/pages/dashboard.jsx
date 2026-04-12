import { useAuth } from '@/hooks/useAuth';
import Head from 'next/head';
import Link from 'next/link';

export default function Dashboard() {
  const { user, loading } = useAuth(true); // requireAuth = true

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Đang tải...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard | CV SaaS</title>
      </Head>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">{user?.email}</span>
              <Link href="/" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                Về trang chủ
              </Link>
            </div>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex flex-col items-center justify-center">
                <h2 className="text-xl text-gray-500 mb-4">Danh sách CV của bạn sẽ hiển thị ở đây</h2>
                <Link
                  href="/create"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  + Tạo CV Mới
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
