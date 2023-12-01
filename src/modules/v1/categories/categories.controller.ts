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
  UseGuards,
  HttpStatus,
  Query,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
// NESTJS SWAGGER
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiExtraModels,
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
// UTILS
import responseUtils from '@utils/response.utils';
import paginationUtils from '@utils/pagination.utils';
// INTERFACES
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import { PaginatedCategoriesInterface } from '@interfaces/paginatedEntity.interface';
import { SuccessResponseInterface } from '@interfaces/success-response.interface';
// DECORATORS
import Serialize from '@decorators/serialization.decorator';
import { Roles } from '@decorators/roles.decorator';
// SERVICE
import { CategoriesService } from './categories.service';
// DTO'S
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
// ENTITIES
import {
  AllCategoriesResponseEntity,
  CategoryResponseEntity,
} from './entities/category-response.entity';

@ApiTags('Categories')
@ApiExtraModels(CategoryResponseEntity)
@Controller()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  /**
   * * Post Method for Category Creation
   * @api {post} /categories
   * @body Data to send in body - @see CreateCategoryDto
   * @description Create one Category
   * @returns Promise<SuccessResponseInterface>
   * @throws {BadRequestException}
   */
  @ApiBody({ type: CreateCategoryDto })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        data: {
          $ref: getSchemaPath(CategoryResponseEntity),
        },
      },
    },
    description: '201. Success. Returns a category',
  })
  @ApiBadRequestResponse({
    schema: {
      type: 'object',
      example: {
        message: [
          {
            target: {
              name: 'string',
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
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<SuccessResponseInterface> {
    await this.categoriesService.create(createCategoryDto);
    return responseUtils.success('categories', {
      message: 'success! category created.',
    });
  }

  /**
   * * Get Method for Category Retrieval
   * @api {get} /categories
   * @description Get all Category
   * @returns Promise<SuccessResponseInterface>
   * @throws {BadRequestException}
   */
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        data: {
          $ref: getSchemaPath(CategoryResponseEntity),
        },
      },
    },
    description: '200. Success. Returns all categories',
  })
  @ApiNotFoundResponse({
    description: '404. NotFoundException. Categories not found',
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
  @Serialize(AllCategoriesResponseEntity)
  @HttpCode(HttpStatus.FOUND)
  @Get()
  async findAll(@Query() query: any): Promise<SuccessResponseInterface> {
    const paginationParams: PaginationParamsInterface | false =
      paginationUtils.normalizeParams({ page: query.page, limit: query.limit });
    if (!paginationParams) {
      throw new BadRequestException('Invalid pagination parameters');
    }

    const paginatedCategories: PaginatedCategoriesInterface =
      await this.categoriesService.findAll(paginationParams);

    return responseUtils.success(
      'categories',
      paginatedCategories.paginatedResult,
      {
        location: 'categories',
        paginationParams,
        totalCount: paginatedCategories.totalCount,
      },
    );
  }

  /**
   * * Get Method for Category Retrieval by id
   * @api {get} /categories/:id
   * @param {id} id of the Category
   * @description Get one Category by id
   * @returns Promise<SuccessResponseInterface>
   * @throws {NotFoundException}
   */
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        data: {
          $ref: getSchemaPath(CategoryResponseEntity),
        },
      },
    },
    description: '200. Success. Returns a category',
  })
  @ApiNotFoundResponse({
    description: '404. NotFoundException. Category was not found',
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
  @Serialize(AllCategoriesResponseEntity)
  @HttpCode(HttpStatus.FOUND)
  @Get(':id')
  async findOne(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<SuccessResponseInterface> {
    const foundCategory = await this.categoriesService.findOne(id);

    if (!foundCategory) {
      throw new NotFoundException('The category does not exist');
    }

    return responseUtils.success('categories', foundCategory);
  }

  /**
   * * Update Method for Category by id
   * @api {update} /categories/:id
   * @param {id} id of the category
   * @body Data to send in body - @see UpdateCategoryDto
   * @description Update one Category by id
   * @returns Promise<SuccessResponseInterface>
   * @throws {BadRequestException}
   */
  @ApiBody({ type: UpdateCategoryDto })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        data: {
          $ref: getSchemaPath(CategoryResponseEntity),
        },
      },
    },
    description: '201. Success. Returns a category',
  })
  @ApiBadRequestResponse({
    schema: {
      type: 'object',
      example: {
        message: [
          {
            target: {
              name: 'string',
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
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<SuccessResponseInterface> {
    await this.categoriesService.update(id, updateCategoryDto);

    return responseUtils.success('categories', {
      message: 'success! category updated.',
    });
  }

  /**
   * * Delete Method for Category Deletion by id
   * @api {delete} /categories/:id
   * @param {id} id of the Category
   * @description Delete one Category by id
   * @returns Promise<{}>
   * @throws {NotFoundException}
   */
  @ApiNoContentResponse({
    description: 'no content',
  })
  @ApiNotFoundResponse({
    description: '404. NotFoundException. Category was not found',
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
  @Serialize(AllCategoriesResponseEntity)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<Record<string, never>> {
    const foundCategory = await this.categoriesService.findOne(id);

    if (!foundCategory) {
      throw new NotFoundException('The category does not exist');
    }

    const result = await this.categoriesService.remove(id);

    if (isEmpty(result)) {
      throw new NotFoundException();
    }

    return {};
  }
}
