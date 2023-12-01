import { User } from '@prisma/client';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import SignUpDto from '@v1/auth/dto/sign-up.dto';

export interface IUserRepository {
  create(createUserDto: SignUpDto): Promise<User>;
  findOne(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(options: PaginationParamsInterface): Promise<User[]>;
  countAll(): Promise<number>;
}
