"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/catalog?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Jangan tampilkan Navbar publik di halaman admin
  if (mounted && pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <nav className="fixed w-full z-50 glass transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <Link href="/" className="flex items-center py-2">
                <Image src="/images/logo.png" alt="Qifaya Logo" width={216} height={140} className="h-16 w-auto object-contain" priority unoptimized />
              </Link>
            </div>
            
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-brand-text hover:text-brand-primary transition-colors">Home</Link>
              <Link href="/catalog" className="text-brand-text hover:text-brand-primary transition-colors">Catalog</Link>
              <Link href="/recommendation" className="text-brand-text hover:text-brand-primary transition-colors">Recommendation</Link>
              <Link href="/about" className="text-brand-text hover:text-brand-primary transition-colors">About</Link>
            </div>

            <div className="flex items-center space-x-5">
              {isSearchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center">
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari produk..."
                    className="border-b border-brand-primary bg-transparent focus:outline-none text-sm px-2 py-1 w-32 md:w-48 text-brand-text"
                    autoFocus
                  />
                  <button type="button" onClick={() => setIsSearchOpen(false)} className="text-gray-400 hover:text-gray-600 ml-2">
                    <X className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <button aria-label="Search" onClick={() => setIsSearchOpen(true)} className="text-brand-text hover:text-brand-primary transition-colors">
                  <Search className="w-5 h-5" />
                </button>
              )}
              <button 
                aria-label="Menu" 
                className="md:hidden text-brand-text hover:text-brand-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay & Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] flex md:hidden">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          
          {/* Drawer */}
          <div className="relative ml-auto w-64 max-w-sm bg-brand-secondary h-full shadow-2xl flex flex-col pt-20 px-6 animate-slide-in-right">
            <button 
              className="absolute top-6 right-6 text-brand-text hover:text-brand-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="flex flex-col space-y-6">
              <Link href="/" className="text-lg font-medium text-brand-text hover:text-brand-primary" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
              <Link href="/catalog" className="text-lg font-medium text-brand-text hover:text-brand-primary" onClick={() => setIsMobileMenuOpen(false)}>Catalog</Link>
              <Link href="/recommendation" className="text-lg font-medium text-brand-text hover:text-brand-primary" onClick={() => setIsMobileMenuOpen(false)}>Recommendation</Link>
              <Link href="/about" className="text-lg font-medium text-brand-text hover:text-brand-primary" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
              <div className="h-px bg-brand-accent/20 w-full my-4"></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
