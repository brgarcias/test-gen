import { Inject, Injectable } from '@nestjs/common';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import { ICategoryRepository } from '../categories.interface';

@Injectable()
export class FindAllCategoriesUseCase {
  constructor(
    @Inject('ICategoryRepository')
    private repository: ICategoryRepository,
  ) {}

  async execute(options: PaginationParamsInterface) {
    const categories = await this.repository.findAll(options);
    const totalCount = await this.repository.countAll();

    return { paginatedResult: categories, totalCount };
  }
}
