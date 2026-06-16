"use client";

import { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function Recommendation() {
  const [gender, setGender] = useState("");
  const [need, setNeed] = useState("");
  const [showResult, setShowResult] = useState(false);

  const handleShowResult = (e: React.FormEvent) => {
    e.preventDefault();
    if (gender && need) {
      setShowResult(true);
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
                  disabled={!gender || !need}
                  className="w-full flex items-center justify-center gap-2 bg-brand-primary text-white py-4 rounded-xl font-bold hover:bg-brand-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Lihat Rekomendasi
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
              ) : (
                <div className="animate-fade-in-up">
                  <div className="flex justify-between items-end mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-brand-primary mb-1">Pilihan Terbaik Untukmu!</h2>
                      <p className="text-brand-text/80 text-sm md:text-base">Gaya <span className="font-bold text-brand-accent">{gender}</span> untuk <span className="font-bold text-brand-accent">{need}</span></p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[1, 2].map((item) => (
                      <Link href="/catalog" key={item} className="group border border-brand-secondary rounded-2xl p-4 hover:border-brand-primary/20 hover:shadow-lg transition-all bg-white flex flex-col">
                        <div className="aspect-[3/4] bg-brand-secondary/50 rounded-xl mb-4 relative overflow-hidden">
                          <div className="absolute inset-0 bg-brand-primary/5" />
                          <div className="w-full h-full flex items-center justify-center">
                             <span className="text-brand-text/30 font-serif text-sm">Product Match {item}</span>
                          </div>
                        </div>
                        <h3 className="font-bold text-brand-text group-hover:text-brand-primary transition-colors text-sm md:text-base line-clamp-1">Perfect Match Set {item}</h3>
                        <p className="text-xs md:text-sm text-brand-text/60 mt-1">Sangat cocok untuk kebutuhan Anda.</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
