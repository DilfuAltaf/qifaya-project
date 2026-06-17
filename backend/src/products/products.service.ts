import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Product, ProductGender } from './entities/product.entity';
import { ProductSize } from './entities/product-size.entity';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class ProductsService {
  constructor(private readonly supabase: SupabaseService) {}

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  private async uploadImage(file: Express.Multer.File, productId: string, filenamePrefix: string): Promise<string> {
    const fileExt = file.originalname.split('.').pop();
    const fileName = `products/${productId}/${filenamePrefix}-${Date.now()}.${fileExt}`;
    const { data, error } = await this.supabase.client
      .storage
      .from('product-images')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });
    
    if (error) {
      throw new Error(`Failed to upload image: ${error.message}`);
    }

    const { data: publicUrlData } = this.supabase.client.storage.from('product-images').getPublicUrl(fileName);
    return publicUrlData.publicUrl;
  }

  async create(data: { name: string; description: string; gender: string; categoryId: string; sizes: string[] }, mainImage?: Express.Multer.File, detailImages?: Express.Multer.File[]): Promise<Product> {
    const { data: category, error: catError } = await this.supabase.client
      .from('categories')
      .select('id')
      .eq('id', data.categoryId)
      .single();

    if (catError || !category) {
      throw new NotFoundException(`Category with ID ${data.categoryId} not found`);
    }

    const slug = this.generateSlug(data.name);

    // Insert Product
    const { data: savedProduct, error: prodError } = await this.supabase.client
      .from('products')
      .insert([{
        name: data.name,
        slug,
        description: data.description,
        gender: data.gender,
        category_id: data.categoryId,
      }])
      .select()
      .single();

    if (prodError) throw new Error(`Failed to create product: ${prodError.message}`);

    // Upload & Insert Main Image
    if (mainImage) {
      const url = await this.uploadImage(mainImage, savedProduct.id, 'main');
      await this.supabase.client.from('product_images').insert([{
        product_id: savedProduct.id,
        image_url: url,
        is_primary: true,
        sort_order: 0
      }]);
    }

    // Upload & Insert Detail Images
    if (detailImages && detailImages.length > 0) {
      const detailInsertions = [];
      for (let i = 0; i < detailImages.length; i++) {
        const url = await this.uploadImage(detailImages[i], savedProduct.id, `detail-${i+1}`);
        detailInsertions.push({
          product_id: savedProduct.id,
          image_url: url,
          is_primary: false,
          sort_order: i + 1
        });
      }
      await this.supabase.client.from('product_images').insert(detailInsertions);
    }

    // Insert Sizes
    if (data.sizes && data.sizes.length > 0) {
      const sizesToInsert = data.sizes.map((size, index) => ({
        product_id: savedProduct.id,
        size,
        sort_order: index,
      }));

      const { error: sizeError } = await this.supabase.client
        .from('product_sizes')
        .insert(sizesToInsert);

      if (sizeError) throw new Error(`Failed to insert sizes: ${sizeError.message}`);
    }

    return this.findOne(savedProduct.id);
  }

  async findAll(query?: any): Promise<{ data: Product[], meta: any }> {
    let request = this.supabase.client
      .from('products')
      .select('*, category:categories(*), sizes:product_sizes(*), images:product_images(*)', { count: 'exact' });

    if (query) {
      if (query.categoryId) request = request.eq('category_id', query.categoryId);
      if (query.gender) request = request.eq('gender', query.gender);
      if (query.name) request = request.ilike('name', `%${query.name}%`);
      if (query.slug) request = request.eq('slug', query.slug);
    }

    const page = query?.page ? parseInt(query.page, 10) : 1;
    const limit = query?.limit ? parseInt(query.limit, 10) : 12;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    request = request.range(from, to).order('created_at', { ascending: false });

    const { data, error, count } = await request;
    if (error) throw new Error(`Failed to fetch products: ${error.message}`);
    
    return {
      data: data.map(p => this.mapProductData(p)) as any,
      meta: {
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit)
      }
    };
  }

  async findOne(id: string): Promise<Product> {
    const { data, error } = await this.supabase.client
      .from('products')
      .select('*, category:categories(*), sizes:product_sizes(*), images:product_images(*)')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    
    return this.mapProductData(data) as any;
  }

  async update(id: string, data: Partial<{ name: string; description: string; gender: string; categoryId: string; sizes?: string[] }>): Promise<Product> {
    await this.findOne(id);

    const updateData: any = { updated_at: new Date().toISOString() };

    if (data.categoryId) {
      const { data: category, error: catError } = await this.supabase.client
        .from('categories')
        .select('id')
        .eq('id', data.categoryId)
        .single();
      if (catError || !category) throw new NotFoundException(`Category with ID ${data.categoryId} not found`);
      updateData.category_id = data.categoryId;
    }

    if (data.name) {
      updateData.name = data.name;
      updateData.slug = this.generateSlug(data.name);
    }
    if (data.description !== undefined) updateData.description = data.description;
    if (data.gender) updateData.gender = data.gender;

    if (Object.keys(updateData).length > 1) {
      const { error: updateError } = await this.supabase.client.from('products').update(updateData).eq('id', id);
      if (updateError) throw new Error(`Failed to update product: ${updateError.message}`);
    }

    if (data.sizes !== undefined) {
      await this.supabase.client.from('product_sizes').delete().eq('product_id', id);
      if (data.sizes.length > 0) {
        const sizesToInsert = data.sizes.map((size, index) => ({
          product_id: id,
          size,
          sort_order: index,
        }));
        await this.supabase.client.from('product_sizes').insert(sizesToInsert);
      }
    }

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    
    // Product Images in storage need to be deleted
    // They are in folder `products/${id}/`
    const { data: files } = await this.supabase.client.storage.from('product-images').list(`products/${id}`);
    if (files && files.length > 0) {
      await this.supabase.client.storage.from('product-images').remove(files.map(f => `products/${id}/${f.name}`));
    }

    const { error } = await this.supabase.client.from('products').delete().eq('id', id);
    if (error) throw new Error(`Failed to delete product: ${error.message}`);
  }

  async addImages(productId: string, detailImages?: Express.Multer.File[]) {
    if (!detailImages || detailImages.length === 0) return this.findOne(productId);
    
    const { data: currentImages } = await this.supabase.client.from('product_images').select('*').eq('product_id', productId);
    const maxOrder = currentImages && currentImages.length > 0 ? Math.max(...currentImages.map(img => img.sort_order || 0)) : 0;

    const detailInsertions = [];
    for (let i = 0; i < detailImages.length; i++) {
      const url = await this.uploadImage(detailImages[i], productId, `detail-new-${i+1}`);
      detailInsertions.push({
        product_id: productId,
        image_url: url,
        is_primary: false,
        sort_order: maxOrder + i + 1
      });
    }
    await this.supabase.client.from('product_images').insert(detailInsertions);
    return this.findOne(productId);
  }

  async removeImage(imageId: string) {
    const { data: imgData } = await this.supabase.client.from('product_images').select('*').eq('id', imageId).single();
    if (!imgData) throw new NotFoundException('Image not found');

    // Remove from storage if possible
    try {
      const urlParts = imgData.image_url.split('/');
      const fileName = urlParts.slice(urlParts.length - 3).join('/'); // products/id/file
      await this.supabase.client.storage.from('product-images').remove([fileName]);
    } catch (e) {
      console.warn('Failed to delete from storage, deleting from DB anyway', e);
    }

    await this.supabase.client.from('product_images').delete().eq('id', imageId);
    return { success: true };
  }

  async updateMainImage(productId: string, imageId: string) {
    // Set all to false
    await this.supabase.client.from('product_images').update({ is_primary: false }).eq('product_id', productId);
    // Set target to true
    await this.supabase.client.from('product_images').update({ is_primary: true }).eq('id', imageId);
    
    return this.findOne(productId);
  }

  private mapProductData(data: any): any {
    const images = data.images ? data.images.map((img: any) => ({
      id: img.id,
      imageUrl: img.image_url,
      isPrimary: img.is_primary,
      sortOrder: img.sort_order
    })).sort((a: any, b: any) => a.sortOrder - b.sortOrder) : [];

    return {
      ...data,
      images,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      categoryId: undefined,
      category_id: undefined,
      image_url: undefined,
      created_at: undefined,
      updated_at: undefined,
    };
  }
}
