// ENTITIES
import { Product, Category, User } from '@prisma/client';

export interface PaginatedProductsInterface {
  readonly paginatedResult: Product[] | [];
  readonly totalCount: number;
}
export interface PaginatedCategoriesInterface {
  readonly paginatedResult: Category[] | [];
  readonly totalCount: number;
}
export interface PaginatedUsersInterface {
  readonly paginatedResult: User[] | [];
  readonly totalCount: number;
}
