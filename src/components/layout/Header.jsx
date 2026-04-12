import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

export default function Header() {
  const { user } = useAuth(false); // Do not enforce auth redirect on Header

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="fixed top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="font-bold text-xl">
            CV Builder
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground">Trang chủ</Link>
            <Link href="/create" className="transition-colors hover:text-foreground/80 text-foreground/60">Tạo CV</Link>
            <Link href="/pricing" className="transition-colors hover:text-foreground/80 text-foreground/60">Giá</Link>
            {user && (
              <Link href="/dashboard" className="transition-colors hover:text-foreground/80 text-blue-600 font-semibold">Dashboard</Link>
            )}
          </nav>
        </div>
        <div className="flex items-center space-x-2">
          {/* Mobile menu stub */}
          <button className="md:hidden p-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          </button>
          <div className="hidden md:flex gap-2 items-center">
            {user ? (
              <button onClick={handleLogout} className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium text-red-500 hover:bg-gray-100 rounded-md">
                Đăng xuất
              </button>
            ) : (
              <>
                <Link href="/auth/login" className="text-sm font-medium px-4 py-2 hover:bg-gray-100 rounded-md">
                  Đăng nhập
                </Link>
                <Link href="/auth/register" className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium text-sm">
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
