import { Inject, Injectable } from '@nestjs/common';
import { IProductRepository } from '../products.interface';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';

@Injectable()
export class FindAllProductsUseCase {
  constructor(
    @Inject('IProductRepository')
    private repository: IProductRepository,
  ) {}

  async execute(options: PaginationParamsInterface) {
    const products = await this.repository.findAll(options);
    const totalCount = await this.repository.countAll();

    return { paginatedResult: products, totalCount };
  }
}
