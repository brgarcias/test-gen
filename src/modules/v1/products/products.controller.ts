// NESTJS COMMON
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
  NotFoundException,
  Query,
  BadRequestException,
} from '@nestjs/common';
// NESTJS SWAGGER
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiFoundResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
// LODASH
import { isEmpty } from 'lodash';
// PRISMA
import { UserRole } from '@prisma/client';
// GUARDS
import JwtAccessGuard from '@guards/jwt-access.guard';
import RolesGuard from '@guards/roles.guard';
// INTERFACES
import { SuccessResponseInterface } from '@interfaces/success-response.interface';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import { PaginatedProductsInterface } from '@interfaces/paginatedEntity.interface';
// UTILS
import responseUtils from '@utils/response.utils';
import paginationUtils from '@utils/pagination.utils';
// DECORATORS
import Serialize from '@decorators/serialization.decorator';
import { Roles } from '@decorators/roles.decorator';
// SERVICE
import { ProductsService } from './products.service';
// DTO's
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
// ENTITIES
import {
  AllProductsResponseEntity,
  ProductResponseEntity,
} from './entities/product-response.entity';

@ApiTags('Products')
@ApiExtraModels(ProductResponseEntity)
@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /**
   * * Post Method for Product Creation
   * @api {post} /products
   * @body Data to send in body - @see CreateProductDto
   * @description Create one Product
   * @returns Promise<SuccessResponseInterface>
   * @throws {BadRequestException}
   */
  @ApiBody({ type: CreateProductDto })
  @ApiCreatedResponse({
    schema: {
      type: 'object',
      properties: {
        data: {
          $ref: getSchemaPath(ProductResponseEntity),
        },
      },
    },
    description: '201. Success. Create product',
  })
  @ApiBadRequestResponse({
    schema: {
      type: 'object',
      example: {
        message: [
          {
            target: {
              name: 'string',
              description: 'string',
              price: 'number',
              createdAt: 'object',
              updatedAt: 'object',
            },
            value: 'string',
            property: 'string',
            children: [],
            constraints: {},
          },
        ],
        error: 'Bad Request',
      },
    },
    description: '400. ValidationException',
  })
  @ApiConflictResponse({
    schema: {
      type: 'object',
      example: {
        message: 'string',
      },
    },
    description: '409. ConflictResponse',
  })
  @ApiInternalServerErrorResponse({
    schema: {
      type: 'object',
      example: {
        message: 'string',
        details: {},
      },
    },
    description: '500. InternalServerError',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAccessGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<SuccessResponseInterface> {
    await this.productsService.create(createProductDto);
    return responseUtils.success('products', {
      message: 'success! product created.',
    });
  }

  /**
   * * Get Method for Product Retrieval
   * @api {get} /products
   * @description Get all Products
   * @returns Promise<SuccessResponseInterface>
   * @throws {BadRequestException}
   */
  @ApiFoundResponse({
    schema: {
      type: 'object',
      properties: {
        data: {
          $ref: getSchemaPath(ProductResponseEntity),
        },
      },
    },
    description: '302. Success. Returns all products',
  })
  @ApiNotFoundResponse({
    description: '404. NotFoundException. Products not found',
  })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      example: {
        message: 'string',
      },
    },
    description: '401. UnauthorizedException.',
  })
  @UseGuards(JwtAccessGuard)
  @Serialize(AllProductsResponseEntity)
  @HttpCode(HttpStatus.FOUND)
  @Get()
  async findAll(@Query() query: any) {
    const paginationParams: PaginationParamsInterface | false =
      paginationUtils.normalizeParams({ page: query.page, limit: query.limit });
    if (isEmpty(paginationParams) || !paginationParams) {
      throw new BadRequestException('Invalid pagination parameters');
    }

    const paginatedProducts: PaginatedProductsInterface =
      await this.productsService.findAll(paginationParams);

    return responseUtils.success(
      'products',
      paginatedProducts.paginatedResult,
      {
        location: 'product',
        paginationParams,
        totalCount: paginatedProducts.totalCount,
      },
    );
  }

  /**
   * * Get Method for Product Retrieval by id
   * @api {get} /products/:id
   * @param {id} id of the product
   * @description Get one Product by id
   * @returns Promise<SuccessResponseInterface>
   * @throws {NotFoundException}
   */
  @ApiFoundResponse({
    schema: {
      type: 'object',
      properties: {
        data: {
          $ref: getSchemaPath(ProductResponseEntity),
        },
      },
    },
    description: '302. Success. Returns a product',
  })
  @ApiNotFoundResponse({
    description: '404. NotFoundException. Product was not found',
  })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      example: {
        message: 'string',
      },
    },
    description: '401. UnauthorizedException.',
  })
  @ApiParam({ name: 'id', type: Number })
  @UseGuards(JwtAccessGuard)
  @Serialize(AllProductsResponseEntity)
  @HttpCode(HttpStatus.FOUND)
  @Get(':id')
  async findOne(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<SuccessResponseInterface> {
    const foundProduct = await this.productsService.findOne(id);

    if (isEmpty(foundProduct) || !foundProduct) {
      throw new NotFoundException('The product does not exist');
    }

    return responseUtils.success('products', foundProduct);
  }

  /**
   * * Get Method for Product Installments Retrieval by id
   * @api {get} /products/:id/installments/:qty
   * @param {id} id of the product
   * @param {qty} qty of installments
   * @description Get one Product Installments by id
   * @returns Promise<SuccessResponseInterface>
   * @throws {NotFoundException}
   */
  @ApiFoundResponse({
    schema: {
      type: 'object',
      properties: {
        data: {
          $ref: getSchemaPath(ProductResponseEntity),
        },
      },
    },
    description: '302. Success. Returns a product',
  })
  @ApiNotFoundResponse({
    description: '404. NotFoundException. Product was not found',
  })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      example: {
        message: 'string',
      },
    },
    description: '401. UnauthorizedException.',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiParam({ name: 'qty', type: Number })
  @Serialize(AllProductsResponseEntity)
  @HttpCode(HttpStatus.FOUND)
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles([UserRole.ADMIN, UserRole.DEV])
  @Get(':id/installments/:qty')
  async findOneWithInstallments(
    @Param('id', new ParseIntPipe()) id: number,
    @Param('qty', new ParseIntPipe()) qty: number,
  ): Promise<SuccessResponseInterface> {
    const foundProduct = await this.productsService.findOneWithInstallments(
      id,
      qty,
    );

    if (isEmpty(foundProduct) || !foundProduct) {
      throw new NotFoundException('The product does not exist');
    }

    return responseUtils.success('products', foundProduct);
  }

  /**
   * * Update Method for Product by id
   * @api {update} /products/:id
   * @param {id} id of the product
   * @body Data to send in body - @see UpdateProductDto
   * @description Update one Product by id
   * @returns Promise<SuccessResponseInterface>
   * @throws {BadRequestException}
   */
  @ApiBody({ type: UpdateProductDto })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        data: {
          $ref: getSchemaPath(ProductResponseEntity),
        },
      },
    },
    description: '200. Success! Product updated.',
  })
  @ApiBadRequestResponse({
    schema: {
      type: 'object',
      example: {
        message: [
          {
            target: {
              name: 'string',
              description: 'string',
              price: 'number',
            },
            value: 'string',
            property: 'string',
            children: [],
            constraints: {},
          },
        ],
        error: 'Bad Request',
      },
    },
    description: '400. ValidationException',
  })
  @ApiConflictResponse({
    schema: {
      type: 'object',
      example: {
        message: 'string',
      },
    },
    description: '409. ConflictResponse',
  })
  @ApiInternalServerErrorResponse({
    schema: {
      type: 'object',
      example: {
        message: 'string',
        details: {},
      },
    },
    description: '500. InternalServerError',
  })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: Number })
  @UseGuards(JwtAccessGuard)
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<SuccessResponseInterface> {
    await this.productsService.update(id, updateProductDto);

    return responseUtils.success('products', {
      message: 'success! product updated.',
    });
  }

  /**
   * * Delete Method for Product Deletion by id
   * @api {delete} /products/:id
   * @param {id} id of the product
   * @description Delete one Product by id
   * @returns Promise<Record<string, never>>
   * @throws {NotFoundException}
   */
  @ApiNoContentResponse({
    description: '204. Success! Product removed.',
  })
  @ApiNotFoundResponse({
    description: '404. NotFoundException. Product was not found',
  })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      example: {
        message: 'string',
      },
    },
    description: '401. UnauthorizedException.',
  })
  @ApiParam({ name: 'id', type: Number })
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles([UserRole.ADMIN, UserRole.DEV])
  @Serialize(AllProductsResponseEntity)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<Record<string, never>> {
    const foundProduct = await this.productsService.findOne(id);

    if (isEmpty(foundProduct) || !foundProduct) {
      throw new NotFoundException('The product does not exist');
    }

    const result = await this.productsService.remove(id);

    if (isEmpty(result)) {
      throw new NotFoundException();
    }

    return {};
  }
}
