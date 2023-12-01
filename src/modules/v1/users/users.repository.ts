import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import SignUpDto from '@v1/auth/dto/sign-up.dto';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import PaginationUtils from '@utils/pagination.utils';
import { IUserRepository } from './users.interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export default class UsersRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  public create(user: SignUpDto): Promise<User> {
    return this.prisma.user.create({
      data: user,
    });
  }

  public async findOne(id: number): Promise<User | null> {
    return this.prisma.user.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  public async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findFirstOrThrow({
      where: {
        email,
      },
    });
  }

  public async findAll(options: PaginationParamsInterface): Promise<User[]> {
    return this.prisma.user.findMany({
      skip: PaginationUtils.getSkipCount(options.page, options.limit),
      take: PaginationUtils.getLimitCount(options.limit),
    });
  }

  public countAll(): Promise<number> {
    return this.prisma.user.count();
  }
}
