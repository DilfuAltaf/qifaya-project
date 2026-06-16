import { ArrowRight, Quote } from 'lucide-react';
import Link from 'next/link';

export default function About() {
  return (
    <div className="flex flex-col min-h-screen pt-24 pb-12 bg-white">
      {/* Header */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-20">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-brand-primary mb-6 animate-fade-in-up">Cerita Qifaya</h1>
        <p className="text-xl text-brand-text/70 leading-relaxed">
          Lebih dari sekadar pakaian. Qifaya adalah manifestasi dari keanggunan, profesionalitas, dan kenyamanan dalam busana muslim.
        </p>
      </section>

      {/* Brand Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
            <h2 className="font-serif text-3xl font-bold text-brand-primary mb-6">Awal Mula Perjalanan</h2>
            <p className="text-brand-text/80 leading-relaxed mb-6">
              Berawal dari sebuah keresahan akan sulitnya mencari busana muslim yang berkualitas premium namun tetap terjangkau. Kebanyakan pakaian muslim yang beredar hanya fokus pada fungsi penutup aurat tanpa mempertimbangkan aspek desain yang modern dan bahan yang nyaman untuk aktivitas sehari-hari.
            </p>
            <p className="text-brand-text/80 leading-relaxed mb-6">
              Dari situlah Qifaya hadir. Kami menggabungkan nilai-nilai syar'i dengan estetika modern, menghasilkan karya-karya busana yang tidak hanya cantik dipandang, tetapi juga sangat nyaman dikenakan sepanjang hari.
            </p>
            <div className="bg-brand-secondary/50 p-6 rounded-2xl border-l-4 border-brand-accent mt-8">
              <Quote className="w-8 h-8 text-brand-accent/50 mb-2" />
              <p className="font-serif italic text-brand-text text-lg">
                "Kecantikan sejati terpancar ketika kita merasa nyaman dengan apa yang kita kenakan, tanpa harus kehilangan identitas diri."
              </p>
            </div>
          </div>
          
          <div className="order-1 md:order-2 aspect-[4/5] bg-brand-secondary rounded-2xl relative overflow-hidden">
             {/* Image Placeholder */}
             <div className="absolute inset-0 bg-brand-primary/5" />
             <div className="w-full h-full flex flex-col items-center justify-center border border-brand-accent/20 rounded-2xl m-4" style={{width: 'calc(100% - 32px)', height: 'calc(100% - 32px)'}}>
                <span className="text-brand-text/30 font-serif text-xl">Brand Story Image</span>
             </div>
          </div>
        </div>
      </section>

      {/* Visi Misi */}
      <section className="bg-brand-primary text-brand-secondary py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                <span className="font-serif text-3xl text-brand-accent">V</span>
              </div>
              <h2 className="font-serif text-3xl font-bold mb-4">Visi Kami</h2>
              <p className="text-white/80 leading-relaxed text-lg">
                Menjadi *brand* fashion muslim terpercaya dan terkemuka di Indonesia yang menginspirasi gaya hidup elegan, modern, dan profesional untuk semua kalangan.
              </p>
            </div>
            
            <div>
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                <span className="font-serif text-3xl text-brand-accent">M</span>
              </div>
              <h2 className="font-serif text-3xl font-bold mb-4">Misi Kami</h2>
              <ul className="space-y-4 text-white/80 text-lg">
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 w-2 h-2 rounded-full bg-brand-accent flex-shrink-0" />
                  <p>Menghadirkan produk berkualitas premium dengan desain yang *timeless*.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 w-2 h-2 rounded-full bg-brand-accent flex-shrink-0" />
                  <p>Memberikan pengalaman berbelanja dan pelayanan pelanggan yang memuaskan.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 w-2 h-2 rounded-full bg-brand-accent flex-shrink-0" />
                  <p>Terus berinovasi dalam material dan desain tanpa meninggalkan batas syariat.</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 max-w-4xl mx-auto text-center px-4">
        <h2 className="font-serif text-3xl font-bold text-brand-primary mb-6">Jadilah Bagian dari Kami</h2>
        <p className="text-brand-text/70 mb-10 text-lg">
          Temukan pakaian yang tepat untuk menemani langkah Anda hari ini.
        </p>
        <Link 
          href="/catalog" 
          className="inline-flex items-center gap-2 bg-brand-primary text-brand-secondary px-8 py-4 rounded-full font-medium hover:bg-brand-primary/90 transition-transform hover:-translate-y-1"
        >
          Mulai Menjelajah
          <ArrowRight className="w-5 h-5" />
        </Link>
      </section>
    </div>
  );
}
