import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Category } from '@prisma/client';
import paginationUtils from '@utils/pagination.utils';
import { ICategoryRepository } from './categories.interface';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';

@Injectable()
export class CategoriesRepository implements ICategoryRepository {
  constructor(private prisma: PrismaService) {}

  public create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.prisma.category.create({
      data: createCategoryDto,
    });
  }

  public findAll(options: PaginationParamsInterface): Promise<Category[]> {
    return this.prisma.category.findMany({
      skip: paginationUtils.getSkipCount(options.page, options.limit),
      take: paginationUtils.getLimitCount(options.limit),
    });
  }

  public countAll(): Promise<number> {
    return this.prisma.category.count();
  }

  public findOne(id: number): Promise<Category> {
    return this.prisma.category.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        Product: {
          select: {
            name: true,
            description: true,
            price: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
  }

  public update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.prisma.category.update({
      where: {
        id,
      },
      data: updateCategoryDto,
    });
  }

  public remove(id: number): Promise<Category | never> {
    return this.prisma.category.delete({
      where: {
        id,
      },
    });
  }
}
