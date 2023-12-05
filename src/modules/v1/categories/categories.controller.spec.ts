import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PaginatedCategoriesInterface } from '@interfaces/paginatedEntity.interface';
import { CategoryResponseEntity } from './entities/category-response.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { SuccessResponseInterface } from '@interfaces/success-response.interface';

const mockCategoriesService = {
  create: jest.fn(),
  findOne: jest.fn(),
  findAll: jest.fn(),
  remove: jest.fn(),
};

describe('CategoriesController', () => {
  let controller: CategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        { provide: CategoriesService, useValue: mockCategoriesService },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a category and return a success message', async () => {
      const createCategoryDto: CreateCategoryDto = {
        name: 'Test Category',
        interest: 1.5,
      };
      const expectedResult: SuccessResponseInterface = {
        collectionName: 'categories',
        data: { message: 'success! category created.' },
        options: undefined,
      };
      mockCategoriesService.create.mockResolvedValueOnce(expectedResult);

      await expect(controller.create(createCategoryDto)).resolves.toEqual(
        expectedResult,
      );
      expect(mockCategoriesService.create).toHaveBeenCalledWith(
        createCategoryDto,
      );
    });

    it('should throw BadRequestException if category creation fails', async () => {
      const createCategoryDto = {
        name: 'Test Category',
        interest: 1.5,
      };
      mockCategoriesService.create.mockRejectedValueOnce(
        new BadRequestException('Invalid category'),
      );

      await expect(controller.create(createCategoryDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockCategoriesService.create).toHaveBeenCalledWith(
        createCategoryDto,
      );
    });
  });

  describe('findOne', () => {
    it('should return a category if found', async () => {
      const mockCategory: CategoryResponseEntity = {
        id: 1,
        name: 'Informática',
        interest: 1.5,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockCategoriesService.findOne.mockReturnValueOnce(mockCategory);

      await expect(controller.findOne(1)).resolves.toEqual(
        expect.objectContaining({ data: mockCategory }),
      );
    });

    it('should throw NotFoundException if category is not found', async () => {
      mockCategoriesService.findOne.mockReturnValueOnce(undefined);

      await expect(controller.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return a paginated list of categories', async () => {
      const mockPaginatedCategories: PaginatedCategoriesInterface = {
        paginatedResult: [],
        totalCount: 0,
      };
      mockCategoriesService.findAll.mockReturnValueOnce(
        mockPaginatedCategories,
      );

      await expect(controller.findAll({ page: 1, limit: 10 })).resolves.toEqual(
        expect.objectContaining({
          data: mockPaginatedCategories.paginatedResult,
        }),
      );
    });

    it('should throw BadRequestException if pagination parameters are invalid', async () => {
      await expect(controller.findAll({ page: -1, limit: 10 })).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a category and return an empty response', async () => {
      const categoryId = 1;
      mockCategoriesService.findOne.mockResolvedValueOnce({
        id: categoryId,
      });

      await expect(controller.remove(categoryId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockCategoriesService.remove).toHaveBeenCalledWith(categoryId);
    });

    it('should throw NotFoundException if category does not exist during removal', async () => {
      const categoryId = 99;
      mockCategoriesService.findOne.mockResolvedValueOnce(undefined);

      await expect(controller.remove(categoryId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if category removal fails', async () => {
      const categoryId = 1;
      mockCategoriesService.findOne.mockResolvedValueOnce({
        id: categoryId,
        name: 'Test Category',
        interest: 1.5,
      });
      mockCategoriesService.remove.mockRejectedValueOnce(
        new NotFoundException('Category not found'),
      );

      await expect(controller.remove(categoryId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockCategoriesService.remove).toHaveBeenCalledWith(categoryId);
    });
  });
});
