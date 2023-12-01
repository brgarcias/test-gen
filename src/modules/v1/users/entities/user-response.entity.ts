/* eslint-disable max-classes-per-file */
import { Exclude, Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import { UserRole } from '@prisma/client';

export class UserResponseEntity {
  id: number = 0;

  role: UserRole = UserRole.USER;

  username: string = '';

  email: string = '';

  @Expose({ name: 'fullName' })
  fullName: string = '';

  @Exclude()
  password: string = '';

  createdAt: Date = new Date();

  updatedAt: Date = new Date();
}

export class AllUsersResponseEntity {
  @ValidateNested({ each: true })
  @Type(() => UserResponseEntity)
  data?: [] = [];

  collectionName?: string = '';

  options?: {
    location: string;
    paginationParams: PaginationParamsInterface;
    totalCount: number;
  };
}
