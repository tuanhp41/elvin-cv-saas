import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 dark:to-primary/10"></div>
      
      <div className="container relative z-10 mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto glass-card rounded-3xl p-10 md:p-16 border border-primary/20 shadow-2xl">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6">
            Bắt đầu tạo CV ngay hôm nay
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            Không cần thẻ tín dụng. Hoàn toàn miễn phí để bắt đầu với hệ thống AI của chúng tôi.
          </p>
          <Link href="/create">
            <Button size="lg" className="text-lg px-10 py-6 rounded-xl shadow-lg hover:shadow-primary/30 transition-all hover:scale-105">
              Bắt đầu hành trình
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
