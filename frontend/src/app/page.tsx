"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShoppingBag, MessageCircle, Package } from 'lucide-react';
import api from '@/lib/api';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await api.get('/products');
        // Sort descending and take top 4
        const data = response.data || [];
        const top4 = data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4);
        setFeaturedProducts(top4);
      } catch (error) {
        console.error('Failed to fetch featured products', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-12 overflow-hidden px-4 md:px-6 lg:px-12">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-brand-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-brand-accent/10 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
            <div className="text-left animate-fade-in-up">
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-brand-primary mb-4 md:mb-6 leading-tight">
                Fashion Muslim <br />
                <span className="text-brand-accent">Premium untuk Semua</span>
              </h1>
              <p className="text-sm md:text-base lg:text-lg text-brand-text/80 mb-6 md:mb-10 leading-relaxed max-w-xl">
                Menghadirkan koleksi yang elegan, modern, dan nyaman. Tingkatkan gaya dan kepercayaan diri Anda dengan Qifaya.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Link 
                  href="/catalog" 
                  className="group flex items-center gap-2 bg-brand-primary text-brand-secondary px-6 md:px-8 py-3 md:py-4 rounded-full font-medium hover:bg-brand-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                  Lihat Koleksi
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            
            <div className="relative animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="aspect-[4/5] md:aspect-square lg:aspect-[4/5] bg-brand-primary/5 rounded-3xl overflow-hidden relative shadow-2xl">
                <div className="absolute inset-0 border-4 border-white rounded-3xl m-2 overflow-hidden flex items-center justify-center bg-brand-secondary">
                  <span className="text-brand-accent font-serif italic text-xl">Hero Image Placeholder</span>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-brand-accent/20 rounded-full blur-xl -z-10" />
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-brand-primary/20 rounded-full blur-xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Brand Introduction Section */}
      <section className="py-12 md:py-16 lg:py-24 px-4 md:px-6 lg:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="aspect-square bg-brand-secondary rounded-2xl p-6 lg:p-8 relative overflow-hidden group order-2 md:order-1">
              <div className="absolute inset-0 bg-brand-primary/5 transition-colors group-hover:bg-brand-primary/10" />
              <div className="w-full h-full border-2 border-dashed border-brand-accent/50 rounded-xl flex items-center justify-center relative z-10">
                <span className="text-brand-accent font-serif italic text-lg md:text-xl">Image Placeholder</span>
              </div>
            </div>
            
            <div className="order-1 md:order-2">
              <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-brand-primary mb-4 md:mb-6">Mengenal Qifaya</h2>
              <div className="text-sm md:text-base lg:text-lg text-brand-text/80 leading-relaxed space-y-4 md:space-y-6 mb-6 md:mb-8">
                <p>
                  Qifaya lahir dari keinginan untuk menyediakan busana muslim yang tidak hanya menutupi aurat, tetapi juga memberikan kesan elegan dan profesional. Kami percaya bahwa setiap individu berhak tampil menawan dengan kualitas premium tanpa harus mengorbankan kenyamanan.
                </p>
                <p>
                  Jelajahi berbagai pilihan mulai dari pakaian harian hingga busana formal yang didesain khusus untuk Anda.
                </p>
              </div>
              <Link 
                href="/about" 
                className="inline-block border-b-2 border-brand-accent text-brand-primary font-medium pb-1 hover:text-brand-accent transition-colors text-sm md:text-base"
              >
                Baca Cerita Kami
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 md:py-16 lg:py-24 px-4 md:px-6 lg:px-12 bg-brand-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-8 md:mb-12">
            <div>
              <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-brand-primary mb-2">Koleksi Pilihan</h2>
              <p className="text-sm md:text-base text-brand-text/70">Produk terbaru dari kami</p>
            </div>
            <Link href="/catalog" className="hidden md:flex items-center gap-2 text-brand-primary hover:text-brand-accent font-medium transition-colors">
              Lihat Semua
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {isLoading ? (
              <p className="col-span-full text-center text-gray-500">Memuat koleksi...</p>
            ) : featuredProducts.length === 0 ? (
              <p className="col-span-full text-center text-gray-500">Belum ada produk saat ini.</p>
            ) : (
              featuredProducts.map((item) => (
                <Link href={`/catalog/${item.id}`} key={item.id} className="group cursor-pointer block">
                  <div className="aspect-[3/4] bg-white rounded-xl mb-3 md:mb-4 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="absolute inset-0 bg-brand-primary/5 transition-opacity opacity-0 group-hover:opacity-100 z-10" />
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt={item.name} fill className="object-cover" unoptimized />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <Package className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <h3 className="font-medium text-brand-text text-sm md:text-base mb-1 group-hover:text-brand-primary transition-colors line-clamp-1">{item.name}</h3>
                  <p className="text-xs text-gray-500 mb-1">{item.category?.name}</p>
                </Link>
              ))
            )}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Link href="/catalog" className="inline-flex items-center gap-2 text-brand-primary hover:text-brand-accent font-medium transition-colors">
              Lihat Semua
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA WhatsApp Section */}
      <section className="py-12 md:py-16 lg:py-24 px-4 md:px-6 lg:px-12 bg-brand-primary relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent" />
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 md:mb-6">
            Punya Pertanyaan atau Ingin Pesan?
          </h2>
          <p className="text-brand-secondary/80 text-sm md:text-base lg:text-lg mb-8 md:mb-10 max-w-2xl mx-auto">
            Tim admin kami siap membantu Anda mencarikan produk yang paling tepat dan memproses pesanan Anda dengan cepat.
          </p>
          <a 
            href="https://wa.me/628212258309" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 md:gap-3 bg-[#25D366] text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-bold text-base md:text-lg hover:bg-[#1ebd5a] hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
            Hubungi Admin
          </a>
        </div>
      </section>
    </div>
  );
}
