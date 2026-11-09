import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { ProductsService } from './products.service.js';

const mockProductsService = {
  create: vi.fn().mockImplementation((dto: CreateProductDto) => Promise.resolve({ id: '1-uuid', ...dto })),
  findAll: vi.fn().mockResolvedValue([{ id: '1-uuid', name: 'Croissant', price: 4.50 }]),
};

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        { provide: ProductsService, useValue: mockProductsService },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a product via controller', async () => {
      const dto: CreateProductDto = { name: 'Croissant', description: 'Manteiga', price: 4.50 };

      const result = await controller.create(dto);

      expect(result).toEqual({ id: '1-uuid', ...dto });
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of products via controller', async () => {
      const result = await controller.findAll();

      expect(result).toEqual([{ id: '1-uuid', name: 'Croissant', price: 4.50 }]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });
});
