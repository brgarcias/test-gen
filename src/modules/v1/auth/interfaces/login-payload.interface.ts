import { UserRole } from '@prisma/client';

export interface LoginPayload {
  readonly id: number;

  readonly email: string;

  readonly role?: UserRole;
}
