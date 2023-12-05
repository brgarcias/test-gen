import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { ICategoryRepository } from './categories.interface';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FindAllCategoriesUseCase } from './use-cases/find-all-categories.use-case';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let repositoryMock: jest.Mocked<ICategoryRepository>;
  let findAllCategoriesUseCase: FindAllCategoriesUseCase;

  beforeEach(async () => {
    repositoryMock = {
      create: jest.fn(),
      findAll: jest.fn(),
      countAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: 'ICategoryRepository',
          useValue: repositoryMock,
        },
        FindAllCategoriesUseCase,
      ],
    }).compile();

    findAllCategoriesUseCase = module.get<FindAllCategoriesUseCase>(
      FindAllCategoriesUseCase,
    );

    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a category', async () => {
      const createCategoryDto: CreateCategoryDto = {
        name: 'Test Category',
        interest: 1.5,
      };

      await service.create(createCategoryDto);

      expect(repositoryMock.create).toHaveBeenCalledWith(createCategoryDto);
    });
  });

  describe('findAll', () => {
    it('should call findAllCategoriesUseCase.execute', async () => {
      const paginationOptions = { page: 1, limit: 10 };
      const executeResult = {
        paginatedResult: [
          {
            id: 1,
            name: 'Category 1',
            interest: 1.5,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 2,
            name: 'Category 2',
            interest: 0.5,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        totalCount: 2,
      };

      jest
        .spyOn(findAllCategoriesUseCase, 'execute')
        .mockResolvedValue(executeResult);

      const result = await service.findAll(paginationOptions);

      expect(findAllCategoriesUseCase.execute).toHaveBeenCalledWith(
        paginationOptions,
      );

      expect(result).toEqual(executeResult);
    });
  });

  describe('findOne', () => {
    it('should find a category by ID', async () => {
      const categoryId = 1;

      await service.findOne(categoryId);

      expect(repositoryMock.findOne).toHaveBeenCalledWith(categoryId);
    });
  });

  describe('update', () => {
    it('should update a category by ID', async () => {
      const categoryId = 1;
      const updateCategoryDto: UpdateCategoryDto = {
        name: 'Updated Category',
      };

      await service.update(categoryId, updateCategoryDto);

      expect(repositoryMock.update).toHaveBeenCalledWith(
        categoryId,
        updateCategoryDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove a category by ID', async () => {
      const categoryId = 1;

      await service.remove(categoryId);

      expect(repositoryMock.remove).toHaveBeenCalledWith(categoryId);
    });
  });
});
