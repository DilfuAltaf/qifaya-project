import { Category } from '../../categories/entities/category.entity';
import { ProductSize } from './product-size.entity';

export enum ProductGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  UNISEX = 'UNISEX',
}

export class Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  gender: ProductGender;
  imageUrl?: string;
  category?: Category;
  sizes?: ProductSize[];
  createdAt?: Date;
  updatedAt?: Date;
}
