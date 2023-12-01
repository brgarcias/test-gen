import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductsRepository } from './products.repository';
import { FindAllProductsUseCase } from './use-cases/find-all-products.use-case';
import { FindOneWithInstallmentsUseCase } from './use-cases/find-one-with-installments.use-case';

@Module({
  controllers: [ProductsController],
  providers: [
    ProductsService,
    ProductsRepository,
    FindAllProductsUseCase,
    FindOneWithInstallmentsUseCase,
    {
      provide: 'IProductRepository',
      useExisting: ProductsRepository,
    },
  ],
})
export default class ProductsModule {}
