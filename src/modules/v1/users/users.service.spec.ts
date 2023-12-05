import * as bcrypt from 'bcryptjs';
import { Test, TestingModule } from '@nestjs/testing';
import UsersService from './users.service';
import { IUserRepository } from './users.interface';
import { User } from '@prisma/client';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import { PaginatedUsersInterface } from '@interfaces/paginatedEntity.interface';
import SignUpDto from '@v1/auth/dto/sign-up.dto';
import { FindAllUsersUseCase } from './use-cases/find-all-users.use-case';

jest.mock('bcryptjs');

describe('UsersService', () => {
  let service: UsersService;
  let repositoryMock: jest.Mocked<IUserRepository>;
  let findAllUsersUseCase: FindAllUsersUseCase;

  beforeEach(async () => {
    repositoryMock = {
      create: jest.fn(),
      findOne: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      countAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'IUserRepository',
          useValue: repositoryMock,
        },
        FindAllUsersUseCase,
      ],
    }).compile();

    findAllUsersUseCase = module.get<FindAllUsersUseCase>(FindAllUsersUseCase);

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user with hashed password', async () => {
      const signUpDto: SignUpDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        role: 'USER',
        fullName: 'Test User',
      };

      const hashedPassword = 'hashedPassword123';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const expectedResult: User = {
        id: 1,
        username: signUpDto.username,
        email: signUpDto.email,
        password: hashedPassword,
        fullName: signUpDto.fullName,
        role: signUpDto.role,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      repositoryMock.create.mockResolvedValue(expectedResult);

      const result = await service.create(signUpDto);

      expect(result).toEqual(expectedResult);
      expect(repositoryMock.create).toHaveBeenCalledWith({
        ...signUpDto,
        password: hashedPassword,
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(signUpDto.password, 10);
    });
  });

  describe('findOne', () => {
    it('should find a user by ID', async () => {
      const userId = 1;
      const expectedUser: User = {
        id: userId,
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedPassword123',
        fullName: '',
        role: 'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      repositoryMock.findOne.mockResolvedValue(expectedUser);

      const result = await service.findOne(userId);

      expect(result).toEqual(expectedUser);
      expect(repositoryMock.findOne).toHaveBeenCalledWith(userId);
    });
  });

  describe('findByEmail', () => {
    it('should find a user by EMAIL', async () => {
      const email = 'test@example.com';
      const expectedUser: User = {
        id: 1,
        username: 'testuser',
        email: email,
        password: 'hashedPassword123',
        fullName: 'Test User',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      repositoryMock.findByEmail.mockResolvedValue(expectedUser);

      const result = await service.findByEmail(email);

      expect(result).toEqual(expectedUser);
      expect(repositoryMock.findByEmail).toHaveBeenCalledWith(email);
    });
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      const options: PaginationParamsInterface = {
        page: 1,
        limit: 10,
      };

      const paginatedUsers: PaginatedUsersInterface = {
        paginatedResult: [
          {
            id: 1,
            username: 'user1',
            email: 'user1@example.com',
            password: 'hashedPassword1',
            fullName: 'Test User 1',
            role: 'USER',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 2,
            username: 'user2',
            email: 'user2@example.com',
            password: 'hashedPassword2',
            fullName: 'Test User 2',
            role: 'DEV',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        totalCount: 2,
      };

      jest
        .spyOn(findAllUsersUseCase, 'execute')
        .mockResolvedValue(paginatedUsers);

      const result = await service.findAll(options);

      expect(findAllUsersUseCase.execute).toHaveBeenCalledWith(options);

      expect(result).toEqual(paginatedUsers);
    });
  });
});
