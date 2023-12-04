// NESTJS COMMON
import {
  Body,
  Controller,
  HttpCode,
  Get,
  Post,
  Delete,
  Param,
  Request,
  UnauthorizedException,
  UseGuards,
  NotFoundException,
  ForbiddenException,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
// NESTJS SWAGGER
import {
  ApiTags,
  ApiBody,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNoContentResponse,
  ApiExtraModels,
  getSchemaPath,
  ApiCreatedResponse,
  ApiFoundResponse,
} from '@nestjs/swagger';
// NESTJS JWT
import { JwtService } from '@nestjs/jwt';
// EXPRESS
import { Request as ExpressRequest } from 'express';
// NESTJS CONFIG
import { ConfigService } from '@nestjs/config';
// PRISMA
import { User, UserRole } from '@prisma/client';
// INTERFACES
import { SuccessResponseInterface } from '@interfaces/success-response.interface';
// SERVICES
import UsersService from '@v1/users/users.service';
// GUARDS
import JwtAccessGuard from '@guards/jwt-access.guard';
// INTERCEPTORS
import WrapResponseInterceptor from '@interceptors/wrap-response.interceptor';
// DECORATORS
import AuthBearer from '@decorators/auth-bearer.decorator';
import { Roles } from '@decorators/roles.decorator';
// UTILS
import ResponseUtils from '@utils/response.utils';
// ENTITIES
import { UserResponseEntity } from '@v1/users/entities/user-response.entity';
// GUARDS
import RolesGuard from '@guards/roles.guard';
// LOCAL INTERFACE
import { DecodedUser } from './interfaces/decoded-user.interface';
// LOCAL GUARD
import LocalAuthGuard from './guards/local-auth.guard';
// LOCAL SERVICE
import AuthService from './auth.service';
// DTO`S
import RefreshTokenDto from './dto/refresh-token.dto';
import SignInDto from './dto/sign-in.dto';
import SignUpDto from './dto/sign-up.dto';
import JwtTokensDto from './dto/jwt-tokens.dto';

@ApiTags('Auth')
@UseInterceptors(WrapResponseInterceptor)
@ApiExtraModels(JwtTokensDto)
@Controller()
export default class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * * Post Method for User Login
   * @api {post} /auth/sign-in
   * @body Data to send in body - @see SignInDto
   * @description User Login in System
   * @returns Promise<SuccessResponseInterface | never>
   * @throws {BadRequestException}
   */
  @ApiBody({ type: SignInDto })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        data: {
          $ref: getSchemaPath(JwtTokensDto),
        },
      },
    },
    description: '200. Success! Returns jwt tokens',
  })
  @ApiBadRequestResponse({
    schema: {
      type: 'object',
      example: {
        message: [
          {
            target: {
              email: 'string',
              password: 'string',
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
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  async signIn(
    @Request() req: ExpressRequest,
  ): Promise<SuccessResponseInterface> {
    const { ...user } = req.user as User;

    return ResponseUtils.success('tokens', await this.authService.login(user));
  }

  /**
   * * Post Method for User Creation
   * @api {post} /auth/sign-up
   * @body Data to send in body - @see SignUpDto
   * @description Create one User
   * @returns Promise<SuccessResponseInterface | never>
   * @throws {BadRequestException}
   */
  @ApiBody({ type: SignUpDto })
  @ApiCreatedResponse({
    description: '201. Success! User created.',
  })
  @ApiBadRequestResponse({
    schema: {
      type: 'object',
      example: {
        message: [
          {
            target: {
              fullName: 'string',
              email: 'string',
              username: 'string',
              password: 'string',
              role: 'string',
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
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles([UserRole.ADMIN, UserRole.DEV])
  @Post('sign-up')
  async signUp(@Body() user: SignUpDto): Promise<any> {
    await this.usersService.create(user);

    return ResponseUtils.success('auth', {
      message: 'success! please verify your email',
    });
  }

  /**
   * * Post Method for Refresh Token
   * @api {post} /auth/refresh-token
   * @body No content data to send in body
   * @description Get a Refresh Token from User and login
   * @returns Promise<SuccessResponseInterface>
   * @throws {BadRequestException}
   */
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        data: {
          $ref: getSchemaPath(JwtTokensDto),
        },
      },
    },
    description: '200, returns new jwt tokens',
  })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      example: {
        message: 'string',
      },
    },
    description: '401. Token has been expired',
  })
  @ApiInternalServerErrorResponse({
    schema: {
      type: 'object',
      example: {
        message: 'string',
        details: {},
      },
    },
    description: '500. InternalServerError ',
  })
  @ApiBearerAuth()
  @Post('refresh-token')
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<SuccessResponseInterface> {
    const decodedUser: DecodedUser = this.jwtService.decode(
      refreshTokenDto.refreshToken,
    );

    if (!decodedUser) {
      throw new ForbiddenException('Incorrect token');
    }

    const oldRefreshToken: string | null =
      await this.authService.getRefreshTokenByEmail(decodedUser.email);

    // if the old refresh token is not equal to request refresh token then
    // this user is unauthorized
    if (!oldRefreshToken || oldRefreshToken !== refreshTokenDto.refreshToken) {
      throw new UnauthorizedException(
        'Authentication credentials were missing or incorrect',
      );
    }

    const payload = {
      id: decodedUser.id,
      email: decodedUser.email,
    };

    return ResponseUtils.success(
      'tokens',
      await this.authService.login(payload),
    );
  }

  /**
   * * Get Method for User Retrieval by token
   * @api {get} /auth/token
   * @description Get one User by token
   * @returns Promise<SuccessResponseInterface>
   * @throws {NotFoundException}
   */
  @ApiFoundResponse({
    type: UserResponseEntity,
    description: '302. Success! Returns a decoded user from access token',
  })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      example: {
        message: 'string',
      },
    },
    description: '403, says you Unauthorized',
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
  @HttpCode(HttpStatus.FOUND)
  @UseGuards(JwtAccessGuard)
  @Get('token')
  async getUserByAccessToken(
    @AuthBearer() token: string,
  ): Promise<SuccessResponseInterface> {
    const decodedUser: DecodedUser | null = await this.authService.verifyToken(
      token,
      this.configService.get<string>('ACCESS_TOKEN_USER'),
    );

    if (!decodedUser) {
      throw new ForbiddenException('Incorrect token');
    }

    return ResponseUtils.success('users', decodedUser);
  }

  /**
   * * Delete Method for Logout User by token
   * @api {update} /auth/logout/:token
   * @param {token} token of the user
   * @description Logout one User by token
   * @returns Promise<Record<string, never>r>
   * @throws {BadRequestException}
   */
  @ApiNoContentResponse({
    description: '204. Success! Logout.',
  })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      example: {
        message: 'string',
      },
    },
    description: 'Token has been expired',
  })
  @ApiInternalServerErrorResponse({
    schema: {
      type: 'object',
      example: {
        message: 'string',
        details: {},
      },
    },
    description: 'InternalServerError',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles([UserRole.ADMIN, UserRole.DEV])
  @Delete('logout/:token')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Param('token') token: string): Promise<Record<string, never>> {
    const decodedUser: DecodedUser | null = await this.authService.verifyToken(
      token,
      this.configService.get<string>('ACCESS_TOKEN_USER'),
    );

    if (!decodedUser) {
      throw new ForbiddenException('Incorrect token');
    }

    const deletedUsersCount = await this.authService.deleteTokenByEmail(
      decodedUser.email,
    );

    if (deletedUsersCount === 0) {
      throw new NotFoundException();
    }

    return {};
  }
}
