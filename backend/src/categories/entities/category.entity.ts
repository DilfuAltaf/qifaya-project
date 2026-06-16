import { Product } from '../../products/entities/product.entity';

export class Category {
  id: string;
  name: string;
  products?: Product[];
  createdAt?: Date;
  updatedAt?: Date;
}
