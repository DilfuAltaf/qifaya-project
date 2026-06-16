import { MapPin, MessageCircle, Mail } from 'lucide-react';

export default function Contact() {
  return (
    <div className="flex flex-col min-h-screen pt-24 pb-12 bg-white">
      {/* Header Section */}
      <div className="bg-brand-primary text-white py-16 mb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up">Hubungi Kami</h1>
          <p className="text-white/80 max-w-2xl mx-auto text-lg">
            Tim layanan pelanggan kami siap membantu menjawab semua pertanyaan Anda seputar produk Qifaya.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div>
            <h2 className="font-serif text-3xl font-bold text-brand-primary mb-8">Informasi Kontak</h2>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="bg-brand-secondary p-4 rounded-2xl text-brand-primary">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-brand-text mb-1">WhatsApp</h3>
                  <p className="text-brand-text/70 mb-2">Respon cepat di jam kerja (09.00 - 17.00 WIB)</p>
                  <a href="https://wa.me/628212258309" target="_blank" rel="noopener noreferrer" className="text-brand-accent font-bold hover:underline">
                    +62 821-2258-309
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-brand-secondary p-4 rounded-2xl text-brand-primary">
                  <span className="w-6 h-6 flex items-center justify-center font-bold">IG</span>
                </div>
                <div>
                  <h3 className="font-bold text-xl text-brand-text mb-1">Instagram</h3>
                  <p className="text-brand-text/70 mb-2">Lihat update terbaru dan inspirasi gaya</p>
                  <a href="https://instagram.com/qifaya.official" target="_blank" rel="noopener noreferrer" className="text-brand-accent font-bold hover:underline">
                    @qifaya.official
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-brand-secondary p-4 rounded-2xl text-brand-primary">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-brand-text mb-1">Email</h3>
                  <p className="text-brand-text/70 mb-2">Untuk keperluan bisnis dan kerjasama</p>
                  <a href="mailto:hello@qifaya.com" className="text-brand-accent font-bold hover:underline">
                    hello@qifaya.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-brand-secondary p-4 rounded-2xl text-brand-primary">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-brand-text mb-1">Alamat Toko (Offline Store)</h3>
                  <p className="text-brand-text/70">
                    Jl. Fashion Muslim No.1, Kebayoran Baru<br />
                    Jakarta Selatan, DKI Jakarta 12110
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Map Simulation */}
          <div className="bg-brand-secondary rounded-3xl p-4 overflow-hidden relative min-h-[400px]">
            <div className="w-full h-full bg-gray-200 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center">
              <div className="absolute inset-0 bg-brand-primary/5" />
              <MapPin className="w-12 h-12 text-brand-accent mb-2" />
              <p className="font-bold text-brand-text">Peta Lokasi Qifaya</p>
              <p className="text-brand-text/60 text-sm mt-2 max-w-xs text-center">(Simulasi embed Google Maps)</p>
              
              <button className="mt-6 bg-white px-6 py-2 rounded-full shadow-sm text-sm font-medium hover:bg-brand-primary hover:text-white transition-colors">
                Buka di Google Maps
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
