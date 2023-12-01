/* eslint-disable max-classes-per-file */
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';

export class CategoryResponseEntity {
  id: number = 0;

  name: string = '';

  createdAt: Date = new Date();

  updatedAt: Date = new Date();
}

export class AllCategoriesResponseEntity {
  @ValidateNested({ each: true })
  @Type(() => CategoryResponseEntity)
  data?: [] = [];

  collectionName?: string = '';

  options?: {
    location: string;
    paginationParams: PaginationParamsInterface;
    totalCount: number;
  };
}
