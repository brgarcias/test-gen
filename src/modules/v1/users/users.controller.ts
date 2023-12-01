// NESTJS COMMON
import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  BadRequestException,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
// NESTJS SWAGGER
import {
  ApiTags,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiParam,
  getSchemaPath,
  ApiExtraModels,
} from '@nestjs/swagger';
// GUARDS
import JwtAccessGuard from '@guards/jwt-access.guard';
// INTERCEPTORS
import WrapResponseInterceptor from '@interceptors/wrap-response.interceptor';
// DECORATORS
import Serialize from '@decorators/serialization.decorator';
// ENTITIES
import {
  AllUsersResponseEntity,
  UserResponseEntity,
} from '@v1/users/entities/user-response.entity';
// INTERFACES
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import { PaginatedUsersInterface } from '@interfaces/paginatedEntity.interface';
import { SuccessResponseInterface } from '@interfaces/success-response.interface';
// UTILS
import responseUtils from '@utils/response.utils';
import paginationUtils from '@utils/pagination.utils';
// SERVICE
import UsersService from './users.service';

@ApiTags('Users')
@ApiBearerAuth()
@ApiExtraModels(UserResponseEntity)
@UseInterceptors(WrapResponseInterceptor)
@Controller()
export default class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * * Get Method for User Retrieval by id
   * @api {get} /users/:id
   * @param {id} id of the user
   * @description Get one User by id
   * @returns Promise<SuccessResponseInterface>
   * @throws {NotFoundException}
   */
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        data: {
          $ref: getSchemaPath(UserResponseEntity),
        },
      },
    },
    description: '200. Success. Returns a user',
  })
  @ApiNotFoundResponse({
    description: '404. NotFoundException. User was not found',
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
  @ApiParam({ name: 'id', type: String })
  @Get(':id')
  @UseGuards(JwtAccessGuard)
  @Serialize(AllUsersResponseEntity)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessResponseInterface> {
    const foundUser = await this.usersService.findOne(id);

    if (!foundUser) {
      throw new NotFoundException('The user does not exist');
    }

    return responseUtils.success('users', foundUser);
  }

  /**
   * * Get Method for User Retrieval
   * @api {get} /users
   * @description Get all Users
   * @returns Promise<SuccessResponseInterface>
   * @throws {BadRequestException}
   */
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        data: {
          $ref: getSchemaPath(UserResponseEntity),
        },
      },
    },
    description: '200. Success. Returns all users',
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
  @Serialize(AllUsersResponseEntity)
  @HttpCode(HttpStatus.FOUND)
  @Get()
  async findAll(@Query() query: any): Promise<SuccessResponseInterface> {
    const paginationParams: PaginationParamsInterface | false =
      paginationUtils.normalizeParams({ page: query.page, limit: query.limit });
    if (!paginationParams) {
      throw new BadRequestException('Invalid pagination parameters');
    }

    const paginatedUsers: PaginatedUsersInterface =
      await this.usersService.findAll(paginationParams);

    return responseUtils.success('users', paginatedUsers.paginatedResult, {
      location: 'users',
      paginationParams,
      totalCount: paginatedUsers.totalCount,
    });
  }
}
