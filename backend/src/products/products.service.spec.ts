import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { NotFoundException } from '@nestjs/common/exceptions/index.js';

const mockPrismaService = {
  product: {
    create: vi.fn().mockImplementation((dto) => Promise.resolve({ id: '1-uuid', ...dto.data })),
    findMany: vi.fn().mockImplementation(() => Promise.resolve([{ id: '1-uuid', name: 'Pão de Alho', price: 2.99 }])),
    findUnique: vi.fn(),
    delete: vi.fn()
  },
};

describe('ProductsService', () => {
  let service: ProductsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    vi.clearAllMocks();

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

  describe('remove', () => {
    it('should remove a product', async () => {
      const existingProduct = { id: '1-uuid', name: 'Pão de Alho', price: 2.99 };
      vi.mocked(prisma.product.findUnique).mockResolvedValue(existingProduct as any);
      vi.mocked(prisma.product.delete).mockResolvedValue(existingProduct as any);

      const result = await service.remove('1-uuid');

      expect(result).toEqual(existingProduct);
      expect(prisma.product.findUnique).toHaveBeenCalledWith({ where: { id: '1-uuid' } });
      expect(prisma.product.delete).toHaveBeenCalledWith({ where: { id: '1-uuid' } });
    });

    it('should throw NotFoundException when product does not exist', async () => {
      vi.mocked(prisma.product.findUnique).mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(NotFoundException);
      expect(prisma.product.delete).not.toHaveBeenCalled();
    });
  });
});

