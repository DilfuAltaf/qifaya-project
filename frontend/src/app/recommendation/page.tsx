"use client";

import { useState } from 'react';
import { ArrowRight, Sparkles, Package } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/api';

export default function Recommendation() {
  const [gender, setGender] = useState("");
  const [need, setNeed] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);

  const handleShowResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (gender && need) {
      setIsLoading(true);
      setShowResult(true);
      
      try {
        const mappedGender = gender === "Pria" ? "male" : "female";
        
        // We fetch a list of products by gender, and maybe try to filter them by the "need" keywords.
        const prodRes = await api.get('/products', { 
          params: { 
            gender: mappedGender,
            limit: 20 // Fetch a bit more so we can filter locally
          } 
        });
        
        let fetchedProducts = prodRes.data?.data || prodRes.data || [];
        
        // keywords mapping
        let keywords: string[] = [];
        if (need === 'Harian / Santai') keywords = ['harian', 'santai', 'casual', 'kaos'];
        else if (need === 'Formal / Pesta') keywords = ['formal', 'pesta', 'resmi', 'jas', 'batik'];
        else if (need === 'Kerja / Kuliah') keywords = ['kerja', 'kuliah', 'kemeja', 'rapi'];
        else if (need === 'Ibadah') keywords = ['ibadah', 'koko', 'gamis', 'muslim', 'shalat'];

        if (keywords.length > 0) {
          const scoredProducts = fetchedProducts.map((p: any) => {
            let score = 0;
            const text = `${p.name || ''} ${p.description || ''} ${p.category?.name || ''}`.toLowerCase();
            keywords.forEach(kw => {
              if (text.includes(kw)) score++;
            });
            return { ...p, _score: score };
          });
          
          // Sort by score descending
          scoredProducts.sort((a: any, b: any) => b._score - a._score);
          fetchedProducts = scoredProducts;
        }

        // Just take top 2 for recommendations
        setProducts(fetchedProducts.slice(0, 2));
      } catch (error) {
        console.error("Failed to fetch recommendations:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen pt-24 pb-12 bg-brand-secondary relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-primary/5 rounded-l-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-brand-accent/5 rounded-r-full blur-3xl -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 flex-grow flex flex-col justify-center">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-brand-primary/10 rounded-full mb-4 text-brand-primary">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-brand-primary mb-4">Rekomendasi Gaya</h1>
          <p className="text-brand-text/70 text-lg max-w-2xl mx-auto">Beri tahu kami kebutuhan Anda, dan kami akan mencarikan gaya yang paling pas untuk menemani aktivitas Anda.</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl p-6 md:p-8 lg:p-12 rounded-3xl shadow-xl border border-white/40">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            
            {/* Left Column: Form */}
            <div className="animate-fade-in-up">
              <form onSubmit={handleShowResult} className="space-y-8">
                {/* Gender Selection */}
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-brand-text mb-4">Siapa Anda?</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      type="button"
                      onClick={() => setGender("Pria")}
                      className={`p-4 md:p-6 border-2 rounded-2xl transition-all group ${gender === "Pria" ? 'border-brand-primary bg-brand-primary/5' : 'border-brand-secondary hover:border-brand-primary/30'}`}
                    >
                      <span className="block text-3xl md:text-4xl mb-2 md:mb-3">👨</span>
                      <span className={`font-medium ${gender === "Pria" ? 'text-brand-primary' : 'text-brand-text'}`}>Pria</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => setGender("Wanita")}
                      className={`p-4 md:p-6 border-2 rounded-2xl transition-all group ${gender === "Wanita" ? 'border-brand-primary bg-brand-primary/5' : 'border-brand-secondary hover:border-brand-primary/30'}`}
                    >
                      <span className="block text-3xl md:text-4xl mb-2 md:mb-3">👩</span>
                      <span className={`font-medium ${gender === "Wanita" ? 'text-brand-primary' : 'text-brand-text'}`}>Wanita</span>
                    </button>
                  </div>
                </div>

                {/* Need Selection */}
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-brand-text mb-4">Untuk acara apa?</h2>
                  <div className="space-y-3">
                    {['Harian / Santai', 'Formal / Pesta', 'Kerja / Kuliah', 'Ibadah'].map((opt) => (
                      <label key={opt} className={`flex items-center p-3 md:p-4 border-2 rounded-xl cursor-pointer transition-all ${need === opt ? 'border-brand-primary bg-brand-primary/5' : 'border-brand-secondary hover:border-brand-primary/30'}`}>
                        <input 
                          type="radio" 
                          name="need" 
                          value={opt}
                          checked={need === opt}
                          onChange={(e) => setNeed(e.target.value)}
                          className="text-brand-primary focus:ring-brand-primary"
                          required
                        />
                        <span className="ml-3 font-medium text-brand-text">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={!gender || !need || isLoading}
                  className="w-full flex items-center justify-center gap-2 bg-brand-primary text-white py-4 rounded-xl font-bold hover:bg-brand-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Mencari...' : 'Lihat Rekomendasi'}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            </div>

            {/* Right Column: Results */}
            <div className="lg:border-l lg:border-brand-secondary lg:pl-10 lg:ml-[-20px] flex flex-col justify-center">
              {!showResult ? (
                <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-8 bg-brand-secondary/30 rounded-2xl border-2 border-dashed border-brand-accent/30 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  <Sparkles className="w-12 h-12 text-brand-accent/50 mb-4" />
                  <h3 className="text-lg font-bold text-brand-text/70 mb-2">Belum ada rekomendasi</h3>
                  <p className="text-sm text-brand-text/50">Silakan lengkapi formulir di samping untuk melihat gaya terbaik yang kami siapkan khusus untuk Anda.</p>
                </div>
              ) : isLoading ? (
                <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-8 animate-fade-in-up">
                  <div className="w-10 h-10 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin mb-4"></div>
                  <p className="text-brand-text/70">Mencarikan gaya terbaik untuk Anda...</p>
                </div>
              ) : (
                <div className="animate-fade-in-up">
                  <div className="flex justify-between items-end mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-brand-primary mb-1">Pilihan Terbaik Untukmu!</h2>
                      <p className="text-brand-text/80 text-sm md:text-base">Gaya <span className="font-bold text-brand-accent">{gender}</span> untuk <span className="font-bold text-brand-accent">{need}</span></p>
                    </div>
                  </div>
                  
                  {products.length === 0 ? (
                    <div className="bg-brand-secondary/30 p-6 rounded-2xl text-center border border-brand-secondary">
                      <p className="text-brand-text/60">Maaf, kami belum memiliki produk yang sangat cocok untuk kriteria ini.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {products.map((product) => (
                        <Link href={`/catalog/${product.id}`} key={product.id} className="group border border-brand-secondary rounded-2xl p-4 hover:border-brand-primary/20 hover:shadow-lg transition-all bg-white flex flex-col">
                          <div className="aspect-[3/4] bg-brand-secondary/50 rounded-xl mb-4 relative overflow-hidden">
                            <div className="absolute inset-0 bg-brand-primary/5 z-10 transition-opacity opacity-0 group-hover:opacity-100" />
                            {(() => {
                              const mainImage = product.images?.find((img: any) => img.isPrimary) || product.images?.[0];
                              return mainImage ? (
                                <Image src={mainImage.imageUrl} alt={product.name} fill className="object-cover" unoptimized />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                  <Package className="w-8 h-8 text-gray-300" />
                                </div>
                              );
                            })()}
                          </div>
                          <h3 className="font-bold text-brand-text group-hover:text-brand-primary transition-colors text-sm md:text-base line-clamp-1">{product.name}</h3>
                          <p className="text-xs md:text-sm text-brand-text/60 mt-1 line-clamp-1">{product.category?.name}</p>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

