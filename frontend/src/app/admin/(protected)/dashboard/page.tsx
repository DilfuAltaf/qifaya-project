"use client";

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { Package, Tags, Users } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
  });
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const [recentCategories, setRecentCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          api.get('/products'),
          api.get('/categories')
        ]);
        
        const productsData = productsRes.data || [];
        const categoriesData = categoriesRes.data || [];

        setStats({
          products: productsData.length,
          categories: categoriesData.length,
        });

        // Sort by createdAt descending and take top 5
        setRecentProducts([...productsData].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5));
        setRecentCategories([...categoriesData].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5));

      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
          <p className="mt-1 text-sm text-gray-500">
            Welcome to Qifaya Admin Panel. Here is what is happening today.
          </p>
        </div>
        <div className="flex space-x-3">
          <Link href="/admin/products" className="flex items-center space-x-2 bg-brand-primary text-white px-4 py-2 rounded-md hover:bg-brand-text transition-colors text-sm font-medium">
            <Package className="w-4 h-4" />
            <span>Manage Products</span>
          </Link>
          <Link href="/admin/categories" className="flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium">
            <Tags className="w-4 h-4" />
            <span>Manage Categories</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Products Stat */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-6 w-6 text-brand-primary" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Products</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {isLoading ? '...' : stats.products}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Stat */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Tags className="h-6 w-6 text-brand-primary" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Categories</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {isLoading ? '...' : stats.categories}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Recent Products */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Recent Products</h3>
          {isLoading ? (
            <p className="text-gray-500 text-sm">Loading...</p>
          ) : recentProducts.length === 0 ? (
            <p className="text-gray-500 text-sm">No products found.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {recentProducts.map((product) => (
                <li key={product.id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.category?.name}</p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(product.createdAt).toLocaleDateString('id-ID')}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Categories */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Recent Categories</h3>
          {isLoading ? (
            <p className="text-gray-500 text-sm">Loading...</p>
          ) : recentCategories.length === 0 ? (
            <p className="text-gray-500 text-sm">No categories found.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {recentCategories.map((category) => (
                <li key={category.id} className="py-3 flex justify-between items-center">
                  <p className="text-sm font-medium text-gray-900">{category.name}</p>
                  <span className="text-xs text-gray-400">
                    {new Date(category.createdAt).toLocaleDateString('id-ID')}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
