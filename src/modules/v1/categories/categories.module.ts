import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { CategoriesRepository } from './categories.repository';
import { FindAllCategoriesUseCase } from './use-cases/find-all-categories.use-case';

@Module({
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    CategoriesRepository,
    FindAllCategoriesUseCase,
    {
      provide: 'ICategoryRepository',
      useExisting: CategoriesRepository,
    },
  ],
})
export default class CategoriesModule {}
