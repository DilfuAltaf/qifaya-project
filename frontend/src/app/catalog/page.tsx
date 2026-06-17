"use client";

import { useState, useEffect } from 'react';
import { Search, Filter, Package } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/api';

export default function Catalog() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination & Filters
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedGender, setSelectedGender] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Read search query from URL on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const q = params.get('search');
      if (q) setSearchQuery(q);
    }
  }, []);

  // Fetch categories once
  useEffect(() => {
    api.get('/categories')
      .then(res => setCategories(res.data || []))
      .catch(err => console.error('Failed to fetch categories:', err));
  }, []);

  // Fetch products when filters or page change
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const params: any = { page, limit: 12 };
        if (selectedCategory) params.categoryId = selectedCategory;
        if (selectedGender) params.gender = selectedGender;
        if (searchQuery) params.name = searchQuery;

        const prodRes = await api.get('/products', { params });
        setProducts(prodRes.data?.data || prodRes.data || []);
        setTotalPages(prodRes.data?.meta?.totalPages || 1);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchData();
    }, 300); // debounce search
    
    return () => clearTimeout(timer);
  }, [page, selectedCategory, selectedGender, searchQuery]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [selectedCategory, selectedGender, searchQuery]);

  return (
    <div className="flex flex-col min-h-screen pt-24 pb-12 bg-brand-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-brand-primary mb-4 animate-fade-in-up">Katalog Produk</h1>
          <p className="text-brand-text/80 max-w-2xl mx-auto">Temukan koleksi fashion muslim premium yang didesain khusus untuk melengkapi gaya Anda.</p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10 bg-white p-4 rounded-2xl shadow-sm">
          <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <div className="flex items-center gap-2 text-brand-text bg-brand-secondary px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap">
              <Filter className="w-4 h-4" />
              Kategori
            </div>
            <select 
              className="text-sm px-4 py-2 bg-brand-secondary border-none rounded-full font-medium focus:ring-2 focus:ring-brand-primary/50"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Semua Kategori</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            
            <div className="h-6 w-px bg-gray-300 mx-2"></div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => setSelectedGender('')}
                className={`text-sm px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${selectedGender === '' ? 'bg-brand-primary text-brand-secondary' : 'text-brand-text hover:bg-brand-secondary'}`}
              >
                Semua
              </button>
              <button 
                onClick={() => setSelectedGender('male')}
                className={`text-sm px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${selectedGender === 'male' ? 'bg-brand-primary text-brand-secondary' : 'text-brand-text hover:bg-brand-secondary'}`}
              >
                Pria
              </button>
              <button 
                onClick={() => setSelectedGender('female')}
                className={`text-sm px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${selectedGender === 'female' ? 'bg-brand-primary text-brand-secondary' : 'text-brand-text hover:bg-brand-secondary'}`}
              >
                Wanita
              </button>
              <button 
                onClick={() => setSelectedGender('unisex')}
                className={`text-sm px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${selectedGender === 'unisex' ? 'bg-brand-primary text-brand-secondary' : 'text-brand-text hover:bg-brand-secondary'}`}
              >
                Unisex
              </button>
            </div>
          </div>
          
          <div className="relative w-full md:w-72">
            <input 
              type="text" 
              placeholder="Cari produk..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-brand-secondary/50 border border-brand-accent/30 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text/50" />
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {isLoading ? (
            <p className="col-span-full text-center text-gray-500 py-10">Memuat katalog...</p>
          ) : products.length === 0 ? (
            <p className="col-span-full text-center text-gray-500 py-10">Tidak ada produk yang cocok dengan pencarian atau filter.</p>
          ) : (
            products.map((product) => (
              <Link href={`/catalog/${product.id}`} key={product.id} className="group cursor-pointer block">
                <div className="aspect-[3/4] bg-white rounded-xl mb-3 md:mb-4 relative overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                  <div className="absolute inset-0 bg-brand-primary/5 transition-opacity opacity-0 group-hover:opacity-100 z-10" />
                  {(() => {
                    const mainImage = product.images?.find((img: any) => img.isPrimary) || product.images?.[0];
                    return mainImage ? (
                      <Image src={mainImage.imageUrl} alt={product.name} fill className="object-cover" unoptimized />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <Package className="w-12 h-12 text-gray-300" />
                      </div>
                    );
                  })()}
                </div>
                <h3 className="font-medium text-brand-text mb-1 group-hover:text-brand-primary transition-colors line-clamp-1 text-sm md:text-base">{product.name}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">{product.category?.name}</span>
                  <span className="text-xs text-brand-text/50 capitalize">{product.gender}</span>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Pagination Controls */}
        {!isLoading && totalPages > 1 && (
          <div className="flex justify-center items-center mt-12 gap-2">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-700 disabled:opacity-50 hover:bg-gray-50"
            >
              Sebelumnya
            </button>
            <span className="text-sm text-gray-500 px-4">
              Halaman {page} dari {totalPages}
            </span>
            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-700 disabled:opacity-50 hover:bg-gray-50"
            >
              Selanjutnya
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
