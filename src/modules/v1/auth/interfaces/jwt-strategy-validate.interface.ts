import { UserRole } from '@prisma/client';

export interface JwtStrategyValidate {
  id: number;
  email: string;
  role: UserRole;
}
