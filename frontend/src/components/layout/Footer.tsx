"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Jangan tampilkan Footer publik di halaman admin
  if (mounted && pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-brand-primary text-brand-secondary py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="mb-6">
              <Image src="/images/logo.png" alt="Qifaya Logo" width={216} height={140} className="h-16 w-auto object-contain" unoptimized />
            </div>
            <p className="text-sm opacity-80 max-w-sm leading-relaxed">
              Fashion Muslim Premium untuk Semua. Menghadirkan koleksi yang elegan, modern, dan nyaman untuk aktivitas sehari-hari Anda.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold mb-4 text-brand-accent tracking-wide">Links</h3>
            <ul className="space-y-2 text-sm opacity-80">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/catalog" className="hover:text-white transition-colors">Catalog</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4 text-brand-accent tracking-wide">Contact</h3>
            <ul className="space-y-2 text-sm opacity-80">
              <li>WhatsApp: +62 812-3456-7890</li>
              <li>Instagram: @qifaya.official</li>
              <li>Jl. Fashion Muslim No.1, Jakarta</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-12 pt-8 text-center text-xs opacity-60">
          <p>&copy; {new Date().getFullYear()} Qifaya. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
