import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../users.interface';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';

@Injectable()
export class FindAllUsersUseCase {
  constructor(
    @Inject('IUserRepository')
    private repository: IUserRepository,
  ) {}

  async execute(options: PaginationParamsInterface) {
    const users = await this.repository.findAll(options);
    const totalCount = await this.repository.countAll();

    return { paginatedResult: users, totalCount };
  }
}
