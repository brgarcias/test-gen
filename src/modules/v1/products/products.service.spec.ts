import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { IProductRepository } from './products.interface';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FindAllProductsUseCase } from './use-cases/find-all-products.use-case';
import { FindOneWithInstallmentsUseCase } from './use-cases/find-one-with-installments.use-case';
import { PaginatedProductsInterface } from '@interfaces/paginatedEntity.interface';

describe('ProductsService', () => {
  let service: ProductsService;
  let repositoryMock: jest.Mocked<IProductRepository>;
  let findAllProductsUseCase: FindAllProductsUseCase;
  let findOneWithInstallmentsUseCase: FindOneWithInstallmentsUseCase;

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
        ProductsService,
        {
          provide: 'IProductRepository',
          useValue: repositoryMock,
        },
        FindAllProductsUseCase,
        FindOneWithInstallmentsUseCase,
      ],
    }).compile();

    findAllProductsUseCase = module.get<FindAllProductsUseCase>(
      FindAllProductsUseCase,
    );

    findOneWithInstallmentsUseCase = module.get<FindOneWithInstallmentsUseCase>(
      FindOneWithInstallmentsUseCase,
    );

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Product 1',
        description: 'Product 1 description',
        price: 100,
        categoryId: 1,
      };

      await service.create(createProductDto);

      expect(repositoryMock.create).toHaveBeenCalledWith(createProductDto);
    });
  });

  describe('findAll', () => {
    it('should call findAllProductsUseCase.execute', async () => {
      const paginationOptions = { page: 1, limit: 10 };
      const executeResult: PaginatedProductsInterface = {
        paginatedResult: [
          {
            id: 1,
            name: 'Product 1',
            description: 'Product 1 description',
            price: 100,
            categoryId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 2,
            name: 'Product 2',
            description: 'Product 2 description',
            price: 200,
            categoryId: 2,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        totalCount: 2,
      };

      jest
        .spyOn(findAllProductsUseCase, 'execute')
        .mockResolvedValue(executeResult);

      const result = await service.findAll(paginationOptions);

      expect(findAllProductsUseCase.execute).toHaveBeenCalledWith(
        paginationOptions,
      );

      expect(result).toEqual(executeResult);
    });
  });

  describe('findOneWithInstallments', () => {
    it('should call findOneWithInstallments.execute', async () => {
      const productId = 1;
      const quantity = 3;

      const executeResult = {
        id: 1,
        name: 'Product 1',
        description: 'Product 1 description',
        price: 100,
        categoryId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        category: {
          id: 1,
          name: 'Category 1',
          interest: 1.5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        installments: [
          {
            number: 1,
            value: '10',
          },
          {
            number: 2,
            value: '15',
          },
          {
            number: 3,
            value: '20',
          },
        ],
        totalAmount: '2000',
      };

      jest
        .spyOn(findOneWithInstallmentsUseCase, 'execute')
        .mockResolvedValue(executeResult);

      const result = await service.findOneWithInstallments(productId, quantity);

      expect(findOneWithInstallmentsUseCase.execute).toHaveBeenCalledWith(
        productId,
        quantity,
      );

      expect(result).toEqual(executeResult);
    });
  });

  describe('findOne', () => {
    it('should find a product by ID', async () => {
      const productId = 1;

      await service.findOne(productId);

      expect(repositoryMock.findOne).toHaveBeenCalledWith(productId);
    });
  });

  describe('update', () => {
    it('should update a product by ID', async () => {
      const productId = 1;
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product',
      };

      await service.update(productId, updateProductDto);

      expect(repositoryMock.update).toHaveBeenCalledWith(
        productId,
        updateProductDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove a product by ID', async () => {
      const productId = 1;

      await service.remove(productId);

      expect(repositoryMock.remove).toHaveBeenCalledWith(productId);
    });
  });
});
