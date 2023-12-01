import { UserRole } from '@prisma/client';

export interface DecodedUser {
  readonly id: number;

  readonly email: string;

  readonly fullName: string;

  readonly username: string;

  readonly password: string;

  readonly role: UserRole;

  readonly iat?: number;

  readonly exp?: number;
}
