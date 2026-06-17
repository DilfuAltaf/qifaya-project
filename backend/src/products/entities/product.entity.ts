import { Category } from '../../categories/entities/category.entity';
import { ProductSize } from './product-size.entity';

export enum ProductGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  UNISEX = 'UNISEX',
}

export class ProductImage {
  id: string;
  imageUrl: string;
  isPrimary: boolean;
  sortOrder: number;
}

export class Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  gender: ProductGender;
  images?: ProductImage[];
  category?: Category;
  sizes?: ProductSize[];
  createdAt?: Date;
  updatedAt?: Date;
}
