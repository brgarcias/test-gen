import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '@decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Injectable()
export default class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return this.matchRoles(roles, user.role);
  }

  private matchRoles(expectedRoles: UserRole[], userRole: UserRole): boolean {
    if (!userRole) {
      return false;
    }

    return expectedRoles.includes(userRole);
  }
}
