import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Product } from '@prisma/client';
import paginationUtils from '@utils/pagination.utils';
import { IProductRepository } from './products.interface';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import { ProductWithCategory } from './payloads/product.payload';

@Injectable()
export class ProductsRepository implements IProductRepository {
  constructor(private prisma: PrismaService) {}

  public create(createProductDto: CreateProductDto): Promise<Product> {
    return this.prisma.product.create({
      data: createProductDto,
    });
  }

  public findAll(options: PaginationParamsInterface): Promise<Product[]> {
    return this.prisma.product.findMany({
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
      skip: paginationUtils.getSkipCount(options.page, options.limit),
      take: paginationUtils.getLimitCount(options.limit),
    });
  }

  public countAll(): Promise<number> {
    return this.prisma.product.count();
  }

  public findOne(id: number): Promise<ProductWithCategory> {
    return this.prisma.product.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        category: true,
      },
    });
  }

  public update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.prisma.product.update({
      where: {
        id,
      },
      data: updateProductDto,
    });
  }

  public remove(id: number): Promise<Product | never> {
    return this.prisma.product.delete({
      where: {
        id,
      },
    });
  }
}
