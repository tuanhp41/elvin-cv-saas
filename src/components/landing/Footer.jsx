import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t py-12 bg-background/50">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start">
          <Link href="/" className="font-bold text-2xl flex items-center gap-2 mb-2">
            CV Builder <span className="text-xl">✨</span>
          </Link>
          <p className="text-sm text-muted-foreground">© 2026 CV Builder. All rights reserved.</p>
        </div>
        
        <div className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <span className="flex items-center gap-1"><span className="text-green-500">🔒</span> Bảo mật 100%</span>
          <span className="flex items-center gap-1"><span className="text-blue-500">🛡️</span> Không Spam</span>
        </div>

        <div className="flex gap-4 text-sm font-medium">
          <Link href="/privacy" className="hover:text-primary transition-colors">Bảo mật</Link>
          <Link href="/terms" className="hover:text-primary transition-colors">Điều khoản</Link>
          <a href="mailto:support@cvbuilder.com" className="hover:text-primary transition-colors">Liên hệ</a>
        </div>
      </div>
    </footer>
  );
}
