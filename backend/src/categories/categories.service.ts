import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(private readonly supabase: SupabaseService) {}

  async create(name: string): Promise<Category> {
    const { data, error } = await this.supabase.client
      .from('categories')
      .insert([{ name }])
      .select()
      .single();

    if (error) throw new Error(`Failed to create category: ${error.message}`);
    return data;
  }

  async findAll(query?: any): Promise<Category[]> {
    let request = this.supabase.client.from('categories').select('*');

    if (query && query.name) {
      request = request.ilike('name', `%${query.name}%`);
    }

    const { data, error } = await request;
    if (error) throw new Error(`Failed to fetch categories: ${error.message}`);
    return data || [];
  }

  async findOne(id: string): Promise<Category> {
    const { data, error } = await this.supabase.client
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return data;
  }

  async update(id: string, name: string): Promise<Category> {
    await this.findOne(id); // Ensure it exists

    const { data, error } = await this.supabase.client
      .from('categories')
      .update({ name, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update category: ${error.message}`);
    return data;
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id); // Ensure it exists

    const { error } = await this.supabase.client
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw new Error(`Failed to delete category: ${error.message}`);
  }
}
