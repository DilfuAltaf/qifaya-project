import { Injectable, ConflictException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly supabase: SupabaseService) {}

  async create(email: string, pass: string): Promise<User> {
    const { data: existingUser } = await this.supabase.client
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    
    const hashedPassword = await bcrypt.hash(pass, 10);
    
    const { data, error } = await this.supabase.client
      .from('users')
      .insert([
        {
          email,
          password: hashedPassword,
        }
      ])
      .select()
      .single();

    if (error) {
      throw new InternalServerErrorException(`Failed to create user: ${error.message}`);
    }
    
    return data;
  }

  async findOne(email: string): Promise<User | null> {
    const { data, error } = await this.supabase.client
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw new Error(`Failed to find user: ${error.message}`);
    }

    return data || null;
  }
}
