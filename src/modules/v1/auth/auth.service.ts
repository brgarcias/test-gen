import * as bcrypt from 'bcryptjs';

import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import UsersService from '@v1/users/users.service';

import { DecodedUser } from '@v1/auth/interfaces/decoded-user.interface';
import JwtTokensDto from './dto/jwt-tokens.dto';

import { ValidateUserOutput } from './interfaces/validate-user-output.interface';
import { LoginPayload } from './interfaces/login-payload.interface';

import authConstants from './auth-constants';
import AuthRepository from './auth.repository';

@Injectable()
export default class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<null | ValidateUserOutput> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('The user does not exist');
    }

    const passwordCompared = await bcrypt.compare(password, user.password);

    if (!passwordCompared) return null;

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }

  public async login(data: LoginPayload): Promise<JwtTokensDto> {
    const payload: LoginPayload = {
      id: data.id,
      email: data.email,
      role: data.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: authConstants.jwt.expirationTime.accessToken,
      secret: this.configService.get<string>('ACCESS_TOKEN_USER'),
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: authConstants.jwt.expirationTime.refreshToken,
      secret: this.configService.get<string>('REFRESH_TOKEN_USER'),
    });

    await this.authRepository.addRefreshToken(payload.email, refreshToken);

    return {
      id: data.id,
      email: data.email,
      accessToken,
      refreshToken,
    };
  }

  public getRefreshTokenByEmail(email: string): Promise<string | null> {
    return this.authRepository.getToken(email);
  }

  public deleteTokenByEmail(email: string): Promise<number> {
    return this.authRepository.removeToken(email);
  }

  public createVerifyToken(id: number): string {
    return this.jwtService.sign(
      { id },
      {
        expiresIn: authConstants.jwt.expirationTime.accessToken,
        secret: this.configService.get<string>('ACCESS_TOKEN_USER'),
      },
    );
  }

  public async verifyToken(
    token: string,
    secret: string,
  ): Promise<DecodedUser | null> {
    try {
      const user: DecodedUser | null = await this.jwtService.verifyAsync(
        token,
        {
          secret,
        },
      );

      return user;
    } catch (error) {
      return null;
    }
  }
}
