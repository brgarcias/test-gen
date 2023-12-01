import { UserRole } from '@prisma/client';

export interface ValidateUserOutput {
  id: number;
  email: string;
  role: UserRole;
}
