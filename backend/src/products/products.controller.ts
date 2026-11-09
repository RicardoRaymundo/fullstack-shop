import { Body, Controller, Post, Get, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('products')
@ApiBearerAuth() // <-- Habilita o cadeado nas rotas deste controller no Swagger
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    create(@Body() createProductDto: CreateProductDto) {
        return this.productsService.create(createProductDto);
    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    findAll() {
        return this.productsService.findAll();
    }
}
