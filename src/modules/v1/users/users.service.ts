// BCRYPT
import * as bcrypt from 'bcryptjs';
// NESTJS
import { Inject, Injectable } from '@nestjs/common';
// PRISMA
import { User } from '@prisma/client';
// INTERFACES
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import { PaginatedUsersInterface } from '@interfaces/paginatedEntity.interface';
// EXTERNAL DTO`s
import SignUpDto from '@v1/auth/dto/sign-up.dto';
// USE CASES
import { FindAllUsersUseCase } from './use-cases/find-all-users.use-case';
// INTERFACE
import { IUserRepository } from './users.interface';

@Injectable()
export default class UsersService {
  constructor(
    @Inject('IUserRepository')
    private repository: IUserRepository,
    private findAllUsersUseCase: FindAllUsersUseCase,
  ) {}

  public async create(user: SignUpDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    return this.repository.create({
      ...user,
      password: hashedPassword,
    });
  }

  public async findOne(id: number): Promise<User | null> {
    return this.repository.findOne(id);
  }

  public async findAll(
    options: PaginationParamsInterface,
  ): Promise<PaginatedUsersInterface> {
    return this.findAllUsersUseCase.execute(options);
  }

  public async findByEmail(email: string): Promise<User | null> {
    return this.repository.findByEmail(email);
  }
}
