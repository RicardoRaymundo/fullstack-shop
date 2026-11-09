import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

const mockPrismaService = {
  product: {
    create: vi.fn().mockImplementation((dto) => Promise.resolve({ id: '1-uuid', ...dto.data })),
    findMany: vi.fn().mockImplementation(() => Promise.resolve([{ id: '1-uuid', name: 'Pão de Alho', price: 2.99 }])),
  },
};

describe('ProductsService', () => {
  let service: ProductsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: PrismaService, useValue: mockPrismaService }
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      const productDto = { name: 'Pão de alho', price: 2.99 };

      const result = await service.create(productDto);

      expect(result).toEqual({ id: '1-uuid', ...productDto });
      expect(prisma.product.create).toHaveBeenCalledWith({ data: productDto })
    })
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const result = await service.findAll();

      expect(result).toEqual([{ id: '1-uuid', name: 'Pão de Alho', price: 2.99 }]);
      expect(prisma.product.findMany).toHaveBeenCalled();
    });
  });
});
