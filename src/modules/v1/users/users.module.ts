import { Module } from '@nestjs/common';

import UsersController from './users.controller';
import UsersService from './users.service';
import UsersRepository from './users.repository';
import { FindAllUsersUseCase } from './use-cases/find-all-users.use-case';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    FindAllUsersUseCase,
    {
      provide: 'IUserRepository',
      useExisting: UsersRepository,
    },
  ],
  exports: [UsersService, UsersRepository],
})
export default class UsersModule {}
