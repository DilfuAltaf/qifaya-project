import { Product } from './product.entity';

export class ProductSize {
  id: string;
  size: string;
  sortOrder: number;
  product?: Product;
  createdAt?: Date;
}
