import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import UsersController from './users.controller';
import UsersService from './users.service';
import { UserResponseEntity } from '@v1/users/entities/user-response.entity';
import { PaginatedUsersInterface } from '@interfaces/paginatedEntity.interface';

const mockUsersService = {
  findOne: jest.fn(),
  findAll: jest.fn(),
};

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      const mockUser: UserResponseEntity = {
        id: 1,
        role: 'ADMIN',
        username: 'wsilva',
        email: 'washington.silva@gmail.com',
        fullName: 'Washington Silva',
        password: '123456',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockUsersService.findOne.mockReturnValueOnce(mockUser);

      await expect(controller.findOne(1)).resolves.toEqual(
        expect.objectContaining({ data: mockUser }),
      );
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockUsersService.findOne.mockReturnValueOnce(undefined);

      await expect(controller.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return a paginated list of users', async () => {
      const mockPaginatedUsers: PaginatedUsersInterface = {
        paginatedResult: [
          {
            id: 1,
            role: 'ADMIN',
            username: 'wsilva',
            email: 'washington.silva@gmail.com',
            fullName: 'Washington Silva',
            password: '123456',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 2,
            role: 'USER',
            username: 'msilva',
            email: 'malcom.silva@gmail.com',
            fullName: 'Malcom Silva',
            password: '78910',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        totalCount: 2,
      };
      mockUsersService.findAll.mockReturnValueOnce(mockPaginatedUsers);

      await expect(controller.findAll({ page: 1, limit: 10 })).resolves.toEqual(
        expect.objectContaining({ data: mockPaginatedUsers.paginatedResult }),
      );
    });

    it('should throw BadRequestException if pagination parameters are invalid', async () => {
      await expect(controller.findAll({ page: -1, limit: 10 })).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
