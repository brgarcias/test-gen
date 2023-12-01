import { Inject, Injectable } from '@nestjs/common';
import { PaginatedCategoriesInterface } from '@interfaces/paginatedEntity.interface';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import { ICategoryRepository } from './categories.interface';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FindAllCategoriesUseCase } from './use-cases/find-all-categories.use-case';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject('ICategoryRepository')
    private repository: ICategoryRepository,
    private findAllCategoriesUseCase: FindAllCategoriesUseCase,
  ) {}

  public create(createCategoryDto: CreateCategoryDto) {
    return this.repository.create(createCategoryDto);
  }

  public async findAll(
    options: PaginationParamsInterface,
  ): Promise<PaginatedCategoriesInterface> {
    return this.findAllCategoriesUseCase.execute(options);
  }

  public async findOne(id: number) {
    return this.repository.findOne(id);
  }

  public async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return this.repository.update(id, updateCategoryDto);
  }

  public remove(id: number) {
    return this.repository.remove(id);
  }
}
