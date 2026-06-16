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

  async create(data: { name: string; description: string; gender: string; categoryId: string; image_url?: string; sizes: string[] }): Promise<Product> {
    // Check if category exists
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
        image_url: data.image_url,
        category_id: data.categoryId,
      }])
      .select()
      .single();

    if (prodError) throw new Error(`Failed to create product: ${prodError.message}`);

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

  async findAll(query?: any): Promise<Product[]> {
    let request = this.supabase.client
      .from('products')
      .select('*, category:categories(*), sizes:product_sizes(*)');

    if (query) {
      if (query.categoryId) {
        request = request.eq('category_id', query.categoryId);
      }
      if (query.gender) {
        request = request.eq('gender', query.gender);
      }
      if (query.name) {
        request = request.ilike('name', `%${query.name}%`);
      }
      if (query.slug) {
        request = request.eq('slug', query.slug);
      }
    }

    const { data, error } = await request;
    if (error) throw new Error(`Failed to fetch products: ${error.message}`);
    
    // Map Supabase response to expected object shape
    return data.map(this.mapProductData) as any;
  }

  async findOne(id: string): Promise<Product> {
    const { data, error } = await this.supabase.client
      .from('products')
      .select('*, category:categories(*), sizes:product_sizes(*)')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    
    return this.mapProductData(data) as any;
  }

  async update(id: string, data: Partial<{ name: string; description: string; gender: string; categoryId: string; image_url?: string; sizes?: string[] }>): Promise<Product> {
    await this.findOne(id); // Ensure product exists

    const updateData: any = { updated_at: new Date().toISOString() };

    if (data.categoryId) {
      const { data: category, error: catError } = await this.supabase.client
        .from('categories')
        .select('id')
        .eq('id', data.categoryId)
        .single();
      if (catError || !category) {
        throw new NotFoundException(`Category with ID ${data.categoryId} not found`);
      }
      updateData.category_id = data.categoryId;
    }

    if (data.name) {
      updateData.name = data.name;
      updateData.slug = this.generateSlug(data.name);
    }
    if (data.description !== undefined) updateData.description = data.description;
    if (data.gender) updateData.gender = data.gender;
    if (data.image_url !== undefined) updateData.image_url = data.image_url;

    if (Object.keys(updateData).length > 1) { // >1 because updated_at is always there
      const { error: updateError } = await this.supabase.client
        .from('products')
        .update(updateData)
        .eq('id', id);

      if (updateError) throw new Error(`Failed to update product: ${updateError.message}`);
    }

    if (data.sizes !== undefined) {
      // Delete old sizes
      await this.supabase.client.from('product_sizes').delete().eq('product_id', id);
      
      // Insert new sizes
      if (data.sizes.length > 0) {
        const sizesToInsert = data.sizes.map((size, index) => ({
          product_id: id,
          size,
          sort_order: index,
        }));
        const { error: sizeError } = await this.supabase.client.from('product_sizes').insert(sizesToInsert);
        if (sizeError) throw new Error(`Failed to insert sizes: ${sizeError.message}`);
      }
    }

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id); // Ensure exists
    
    const { error } = await this.supabase.client
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw new Error(`Failed to delete product: ${error.message}`);
  }

  private mapProductData(data: any): any {
    // Map snake_case to camelCase and handle related structures
    return {
      ...data,
      imageUrl: data.image_url,
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
