/* eslint-disable max-classes-per-file */
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import { CategoryResponseEntity } from '@v1/categories/entities/category-response.entity';

export class ProductResponseEntity {
  id: number = 0;

  name: string = '';

  description: string = '';

  price: number = 0;

  category: CategoryResponseEntity;

  createdAt: Date = new Date();

  updatedAt: Date = new Date();
}

export class AllProductsResponseEntity {
  @ValidateNested({ each: true })
  @Type(() => ProductResponseEntity)
  data?: [] = [];

  collectionName?: string = '';

  options?: {
    location: string;
    paginationParams: PaginationParamsInterface;
    totalCount: number;
  };
}
