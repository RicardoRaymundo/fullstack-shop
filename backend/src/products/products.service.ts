import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Product } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto.js';

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateProductDto): Promise<Product> {
        return this.prisma.product.create({
            data,
        });
    }

    async findAll(): Promise<Product[]> {
        return this.prisma.product.findMany();
    }

    async remove(id: string): Promise<Product> {
        const product = await this.prisma.product.findUnique({
            where: { id },
        });

        if (!product) {
            throw new NotFoundException('Produto não encontrado');
        }

        return this.prisma.product.delete({
            where: { id },
        })
    }
}
