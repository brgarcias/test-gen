// NESTJS
import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// EXPRESS
import { Request, Response, NextFunction } from 'express';
// LODASH
import { isEmpty } from 'lodash';
// SERVICES
import AuthService from '@v1/auth/auth.service';
// INTERFACES
import { DecodedUser } from '@v1/auth/interfaces/decoded-user.interface';

@Injectable()
export default class ValidationUserPermissionMiddleware
  implements NestMiddleware
{
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  async use(req: Request, _res: Response, next: NextFunction) {
    const token = req.headers?.authorization?.replace('Bearer ', '') || '';

    const decodedUser: DecodedUser | null = await this.authService.verifyToken(
      token,
      this.configService.get('ACCESS_TOKEN_USER'),
    );

    if (isEmpty(token)) {
      next();
      return;
    }

    if (isEmpty(decodedUser)) {
      throw new UnauthorizedException('Unauthorized!');
    }

    next();
  }
}
