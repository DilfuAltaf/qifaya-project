"use client";

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Plus, Edit2, Trash2, X, Package } from 'lucide-react';
import Image from 'next/image';

interface Category {
  id: string;
  name: string;
}

interface ProductSize {
  id: string;
  size: string;
}

interface ProductImage {
  id: string;
  imageUrl: string;
  isPrimary: boolean;
  sortOrder: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  gender: string;
  images: ProductImage[];
  createdAt: string;
  category: Category;
  sizes: ProductSize[];
}

export default function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    gender: 'female',
    categoryId: '',
    sizes: ''
  });

  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string>('');
  
  const [detailImageFiles, setDetailImageFiles] = useState<File[]>([]);
  const [detailImagePreviews, setDetailImagePreviews] = useState<string[]>([]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [prodRes, catRes] = await Promise.all([
        api.get('/products', { params: { page, limit: 10 } }),
        api.get('/categories')
      ]);
      setProducts(prodRes.data?.data || prodRes.data || []);
      setTotalPages(prodRes.data?.meta?.totalPages || 1);
      setCategories(catRes.data);
      if (catRes.data.length > 0 && !formData.categoryId) {
        setFormData(prev => ({ ...prev, categoryId: catRes.data[0].id }));
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const openModal = (product?: Product) => {
    if (product) {
      setEditingId(product.id);
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        gender: product.gender,
        categoryId: product.category?.id || '',
        sizes: product.sizes?.map(s => s.size).join(', ') || ''
      });
      setMainImageFile(null);
      setMainImagePreview('');
      setDetailImageFiles([]);
      setDetailImagePreviews([]);
    } else {
      setEditingId(null);
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        gender: 'female',
        categoryId: categories.length > 0 ? categories[0].id : '',
        sizes: ''
      });
      setMainImageFile(null);
      setMainImagePreview('');
      setDetailImageFiles([]);
      setDetailImagePreviews([]);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setEditingProduct(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMainImageFile(file);
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDetailImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newFiles = [...detailImageFiles, ...filesArray].slice(0, 10);
      setDetailImageFiles(newFiles);
      setDetailImagePreviews(newFiles.map(f => URL.createObjectURL(f)));
    }
  };

  const removeDetailImageNew = (index: number) => {
    const newFiles = detailImageFiles.filter((_, i) => i !== index);
    setDetailImageFiles(newFiles);
    setDetailImagePreviews(newFiles.map(f => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Parse sizes
    const sizesArray = formData.sizes.split(',').map(s => s.trim().toUpperCase()).filter(s => s !== '');

    try {
      if (editingId) {
        // Edit mode
        await api.patch(`/products/${editingId}`, {
          ...formData,
          sizes: sizesArray
        });
      } else {
        // Create mode: Multipart Form Data
        if (!mainImageFile) {
          alert('Main Image is required!');
          setIsSubmitting(false);
          return;
        }

        const submitData = new FormData();
        submitData.append('name', formData.name);
        submitData.append('description', formData.description);
        submitData.append('gender', formData.gender);
        submitData.append('categoryId', formData.categoryId);
        submitData.append('sizes', JSON.stringify(sizesArray));
        
        submitData.append('mainImage', mainImageFile);
        detailImageFiles.forEach((file) => {
          submitData.append('detailImages', file);
        });

        await api.post('/products', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      await fetchData();
      closeModal();
    } catch (error) {
      console.error('Failed to save product:', error);
      alert('Gagal menyimpan produk');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Yakin ingin menghapus produk ini? Semua gambar juga akan terhapus.')) return;
    try {
      await api.delete(`/products/${id}`);
      await fetchData();
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert('Gagal menghapus produk');
    }
  };

  const deleteExistingImage = async (imageId: string) => {
    if (!window.confirm('Yakin hapus gambar ini?')) return;
    try {
      await api.delete(`/products/images/${imageId}`);
      await fetchData();
      if (editingProduct) {
        setEditingProduct(prev => prev ? {
          ...prev,
          images: prev.images.filter(img => img.id !== imageId)
        } : null);
      }
    } catch (e) {
      console.error(e);
      alert('Gagal hapus gambar');
    }
  };

  const setAsMainImage = async (imageId: string) => {
    try {
      await api.patch(`/products/${editingId}/main-image`, { imageId });
      await fetchData();
      if (editingProduct) {
        setEditingProduct(prev => prev ? {
          ...prev,
          images: prev.images.map(img => ({
            ...img,
            isPrimary: img.id === imageId
          }))
        } : null);
      }
    } catch (e) {
      console.error(e);
      alert('Gagal ubah gambar utama');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Products</h2>
        <button
          onClick={() => openModal()}
          className="flex items-center space-x-2 bg-brand-primary text-white px-4 py-2 rounded-md hover:bg-brand-text transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gender
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sizes
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">Loading...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No products found.</td>
                </tr>
              ) : (
                products.map((product) => {
                  const mainImage = product.images?.find(img => img.isPrimary);
                  return (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 relative rounded bg-gray-100 overflow-hidden">
                            {mainImage ? (
                              <Image src={mainImage.imageUrl} alt={product.name} fill className="object-cover" unoptimized />
                            ) : (
                              <Package className="h-5 w-5 absolute inset-0 m-auto text-gray-400" />
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">{product.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.category?.name || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                        {product.gender}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.sizes?.map(s => s.size).join(', ') || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => openModal(product)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {!isLoading && totalPages > 1 && (
          <div className="flex justify-between items-center px-6 py-3 border-t bg-gray-50">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 border border-gray-300 bg-white rounded text-sm disabled:opacity-50 hover:bg-gray-50 text-gray-700 font-medium"
            >
              Previous
            </button>
            <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 border border-gray-300 bg-white rounded text-sm disabled:opacity-50 hover:bg-gray-50 text-gray-700 font-medium"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
              <h3 className="text-lg font-medium text-gray-900">
                {editingId ? 'Edit Product' : 'Add Product'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    name="categoryId"
                    required
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                  >
                    <option value="" disabled>Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Gender</label>
                  <select
                    name="gender"
                    required
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                  >
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="unisex">Unisex</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Sizes (Comma separated)</label>
                  <input
                    type="text"
                    name="sizes"
                    value={formData.sizes}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                    placeholder="e.g. S, M, L, XL"
                  />
                </div>

                {/* Images Upload Section */}
                {!editingId && (
                  <>
                    <div className="md:col-span-2 pt-4 border-t">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Main Image (Required)</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleMainImageChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        required={!editingId}
                      />
                      {mainImagePreview && (
                        <div className="mt-2 relative h-32 w-32 rounded overflow-hidden border">
                          <Image src={mainImagePreview} alt="Main Preview" fill className="object-cover" unoptimized />
                        </div>
                      )}
                    </div>

                    <div className="md:col-span-2 pt-4 border-t">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Detail Images (Up to 10)</label>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleDetailImagesChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                      />
                      {detailImagePreviews.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {detailImagePreviews.map((url, i) => (
                            <div key={i} className="relative h-20 w-20 rounded overflow-hidden border group">
                              <Image src={url} alt={`Detail ${i}`} fill className="object-cover" unoptimized />
                              <button
                                type="button"
                                onClick={() => removeDetailImageNew(i)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Edit Mode Existing Images */}
                {editingId && editingProduct && (
                  <div className="md:col-span-2 pt-4 border-t">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Existing Images Gallery</label>
                    <div className="flex flex-wrap gap-4 mb-6">
                      {editingProduct.images.map((img) => (
                        <div key={img.id} className={`relative h-24 w-24 rounded border-2 ${img.isPrimary ? 'border-brand-primary shadow-lg' : 'border-gray-200'}`}>
                          <Image src={img.imageUrl} alt="Product Image" fill className="object-cover rounded" unoptimized />
                          {img.isPrimary && (
                            <span className="absolute bottom-0 left-0 right-0 bg-brand-primary text-white text-[10px] text-center py-0.5 z-10">Primary</span>
                          )}
                          <div className="absolute top-1 right-1 flex flex-col gap-1 z-10">
                            <button
                              type="button"
                              title="Delete Image"
                              onClick={() => deleteExistingImage(img.id)}
                              className="bg-white text-red-500 rounded-full p-1 shadow hover:bg-red-50"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                            {!img.isPrimary && (
                              <button
                                type="button"
                                title="Set as Main"
                                onClick={() => setAsMainImage(img.id)}
                                className="bg-white text-brand-primary rounded-full p-1 shadow hover:bg-brand-50"
                              >
                                <Package className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Upload New Images</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={async (e) => {
                            if (!e.target.files || e.target.files.length === 0) return;
                            const files = Array.from(e.target.files);
                            const formData = new FormData();
                            files.forEach(f => formData.append('detailImages', f));
                            
                            try {
                              setIsSubmitting(true);
                              await api.post(`/products/${editingId}/images`, formData, {
                                headers: { 'Content-Type': 'multipart/form-data' }
                              });
                              await fetchData();
                              // Update modal state
                              const res = await api.get(`/products/${editingId}`);
                              setEditingProduct(res.data);
                              e.target.value = ''; // Reset input
                            } catch (err) {
                              console.error(err);
                              alert('Gagal mengupload gambar tambahan');
                            } finally {
                              setIsSubmitting(false);
                            }
                          }}
                          disabled={isSubmitting}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 disabled:opacity-50"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Gambar akan otomatis terupload setelah dipilih.</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-brand-text disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
