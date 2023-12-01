import { Product } from '@prisma/client';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import { ProductWithCategory } from './payloads/product.payload';

export interface IProductRepository {
  create(createProductDto: CreateProductDto): Promise<Product>;
  findAll(options: PaginationParamsInterface): Promise<Product[]>;
  countAll(): Promise<number>;
  findOne(id: number): Promise<ProductWithCategory>;
  update(id: number, updateProductDto: UpdateProductDto): Promise<Product>;
  remove(id: number): Promise<Product | never>;
}
