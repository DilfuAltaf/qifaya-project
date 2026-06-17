"use client";

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Heart, Share2, MessageCircle, Package } from 'lucide-react';
import api from '@/lib/api';

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  // Extract id from params
  const { id } = use(params);
  
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
        if (response.data?.sizes && response.data.sizes.length > 0) {
          setSelectedSize(response.data.sizes[0].size);
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white pt-24 pb-12">
        <p className="text-gray-500">Memuat detail produk...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-white pt-24 pb-12">
        <p className="text-gray-500 mb-4">Produk tidak ditemukan.</p>
        <Link href="/catalog" className="text-brand-primary underline">Kembali ke Katalog</Link>
      </div>
    );
  }

  // Generate WA Message
  const waText = `Halo Admin Qifaya,

Saya tertarik dengan produk berikut:

Nama Produk: ${product.name}
Kategori: ${product.category?.name || '-'}
Ukuran Pilihan: ${selectedSize || '-'}

Mohon informasi mengenai ketersediaan dan cara pemesanan. Terima kasih.`;

  const waLink = `https://wa.me/628212258309?text=${encodeURIComponent(waText)}`;

  return (
    <div className="flex flex-col min-h-screen pt-24 pb-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <Link href="/catalog" className="inline-flex items-center gap-2 text-brand-text/60 hover:text-brand-primary mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Katalog
        </Link>

        {/* Product Layout: 1 col on mobile, 2 cols on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          
          {/* Photo Section (Left/Top) */}
          <div className="animate-fade-in-up flex flex-col gap-4">
            <div className="aspect-[3/4] bg-gray-50 rounded-3xl overflow-hidden relative shadow-sm border border-gray-100">
              {product.images && product.images.length > 0 ? (
                <Image src={product.images[activeImageIndex]?.imageUrl} alt={product.name} fill className="object-cover transition-all duration-300" unoptimized />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-24 h-24 text-gray-300" />
                </div>
              )}
              {/* Arrows for sliding */}
              {product.images && product.images.length > 1 && (
                <>
                  <button 
                    onClick={() => setActiveImageIndex(prev => (prev === 0 ? product.images.length - 1 : prev - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-brand-primary" />
                  </button>
                  <button 
                    onClick={() => setActiveImageIndex(prev => (prev === product.images.length - 1 ? 0 : prev + 1))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-colors rotate-180"
                  >
                    <ArrowLeft className="w-5 h-5 text-brand-primary" />
                  </button>
                </>
              )}
            </div>
            
            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {product.images.map((img: any, idx: number) => (
                  <button 
                    key={img.id}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${activeImageIndex === idx ? 'border-brand-primary opacity-100 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <Image src={img.imageUrl} alt={`${product.name} ${idx + 1}`} fill className="object-cover" unoptimized />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info Section (Right/Bottom) */}
          <div className="flex flex-col animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex justify-between items-start mb-2">
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-brand-primary leading-tight">
                {product.name}
              </h1>
              <button className="text-brand-text/40 hover:text-red-500 transition-colors p-2">
                <Heart className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex items-center gap-3 mb-6">
              <span className="text-sm px-3 py-1 bg-brand-secondary text-brand-primary rounded-full">{product.category?.name}</span>
              <span className="text-sm px-3 py-1 bg-gray-100 text-gray-600 rounded-full capitalize">{product.gender}</span>
            </div>
            
            <div className="prose text-brand-text/80 mb-8 max-w-none text-sm md:text-base">
              <p className="whitespace-pre-line">{product.description}</p>
            </div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-brand-text text-sm md:text-base">Pilih Ukuran</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((s: any) => (
                    <button 
                      key={s.id} 
                      onClick={() => setSelectedSize(s.size)}
                      className={`w-12 h-12 md:w-14 md:h-14 rounded-full border-2 flex items-center justify-center font-medium transition-all text-sm md:text-base
                        ${selectedSize === s.size 
                          ? 'border-brand-primary bg-brand-primary text-brand-secondary shadow-md' 
                          : 'border-brand-secondary text-brand-text hover:border-brand-primary hover:bg-brand-primary/5'}`}
                    >
                      {s.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <a 
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[#25D366] text-white py-4 px-6 rounded-xl font-bold hover:bg-[#1ebd5a] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl text-sm md:text-base"
              >
                <MessageCircle className="w-5 h-5" />
                Pesan via WhatsApp
              </a>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link produk berhasil disalin!');
                }}
                className="sm:w-auto bg-white border-2 border-brand-primary text-brand-primary py-4 px-6 rounded-xl font-bold hover:bg-brand-primary hover:text-white transition-all flex items-center justify-center gap-2 text-sm md:text-base"
              >
                <Share2 className="w-5 h-5" />
                Bagikan
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
