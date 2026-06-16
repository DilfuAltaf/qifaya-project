import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function Wishlist() {
  return (
    <div className="flex flex-col min-h-screen pt-24 pb-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Header Section */}
        <div className="flex items-center gap-4 mb-10 border-b border-brand-secondary pb-6">
          <div className="bg-brand-primary/10 p-3 rounded-full text-brand-primary">
            <Heart className="w-8 h-8 fill-brand-primary" />
          </div>
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-brand-primary">Wishlist Anda</h1>
            <p className="text-brand-text/70 mt-1">Produk favorit yang Anda simpan.</p>
          </div>
        </div>

        {/* Wishlist Items - Simulated */}
        <div className="space-y-6">
          {[1, 2].map((item) => (
            <div key={item} className="flex flex-col sm:flex-row items-center gap-6 p-4 border border-brand-secondary rounded-2xl hover:shadow-md transition-shadow group">
              <div className="w-full sm:w-32 h-40 sm:h-32 bg-brand-secondary/50 rounded-xl relative overflow-hidden flex-shrink-0">
                 <div className="w-full h-full flex items-center justify-center">
                    <span className="text-brand-text/30 font-serif text-xs">Image</span>
                 </div>
              </div>
              
              <div className="flex-grow text-center sm:text-left">
                <Link href={`/catalog/${item}`} className="hover:text-brand-primary transition-colors">
                  <h3 className="font-bold text-lg text-brand-text">Koleksi Eksklusif Qifaya {item}</h3>
                </Link>
                <p className="text-brand-accent font-bold mt-1">Rp 350.000</p>
                <p className="text-sm text-brand-text/60 mt-2 line-clamp-2">Busana muslim premium dengan bahan pilihan yang sangat nyaman digunakan seharian.</p>
              </div>
              
              <div className="flex sm:flex-col gap-3 w-full sm:w-auto mt-4 sm:mt-0">
                <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-brand-primary text-brand-secondary px-6 py-3 rounded-xl font-medium hover:bg-brand-primary/90 transition-colors">
                  <ShoppingBag className="w-4 h-4" />
                  <span className="hidden sm:inline">Pesan</span>
                </button>
                <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 border border-red-200 text-red-500 bg-red-50 hover:bg-red-100 px-6 py-3 rounded-xl font-medium transition-colors">
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Hapus</span>
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* If Empty State */}
        {/* <div className="text-center py-20">
          <Heart className="w-16 h-16 text-brand-secondary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-brand-text mb-2">Wishlist Masih Kosong</h2>
          <p className="text-brand-text/60 mb-8">Anda belum menambahkan produk apapun ke daftar favorit.</p>
          <Link href="/catalog" className="bg-brand-primary text-white px-8 py-3 rounded-full font-medium hover:bg-brand-primary/90 transition-colors">
            Mulai Belanja
          </Link>
        </div> */}

      </div>
    </div>
  );
}
