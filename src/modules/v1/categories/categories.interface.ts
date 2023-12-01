import { Category } from '@prisma/client';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';

export interface ICategoryRepository {
  create(createCategoryDto: CreateCategoryDto): Promise<Category>;
  findAll(options: PaginationParamsInterface): Promise<Category[]>;
  countAll(): Promise<number>;
  findOne(id: number): Promise<Category>;
  update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category>;
  remove(id: number): Promise<Category | never>;
}
