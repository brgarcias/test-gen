import { Inject, Injectable } from '@nestjs/common';
import { IProductRepository } from './products.interface';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginatedProductsInterface } from '@interfaces/paginatedEntity.interface';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import { FindAllProductsUseCase } from './use-cases/find-all-products.use-case';
import { FindOneWithInstallmentsUseCase } from './use-cases/find-one-with-installments.use-case';

@Injectable()
export class ProductsService {
  constructor(
    @Inject('IProductRepository')
    private repository: IProductRepository,
    private findAllProductsUseCase: FindAllProductsUseCase,
    private findOneWithInstallmentsUseCase: FindOneWithInstallmentsUseCase,
  ) {}

  public create(createProductDto: CreateProductDto) {
    return this.repository.create(createProductDto);
  }

  public async findAll(
    options: PaginationParamsInterface,
  ): Promise<PaginatedProductsInterface> {
    return this.findAllProductsUseCase.execute(options);
  }

  public async findOne(id: number) {
    return this.repository.findOne(id);
  }

  public findOneWithInstallments(id: number, qty: number) {
    return this.findOneWithInstallmentsUseCase.execute(id, qty);
  }

  public async update(id: number, updateProductDto: UpdateProductDto) {
    return this.repository.update(id, updateProductDto);
  }

  public remove(id: number) {
    return this.repository.remove(id);
  }
}
