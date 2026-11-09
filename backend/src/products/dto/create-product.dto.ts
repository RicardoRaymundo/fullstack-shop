import { IsString, IsNotEmpty, IsOptional, IsNumber, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
    @ApiProperty({ description: 'Nome do produto', example: 'Pão de Alho' })
    @IsString({ message: 'O nome precisa ser uma string.' })
    @IsNotEmpty({ message: 'O nome não pode estar vazio.' })
    name: string;

    @ApiPropertyOptional({ description: 'Descrição detalhada do produto', example: 'Feito com amor e tempero caseiro' })
    @IsString({ message: 'A descrição precisa ser uma string.' })
    @IsOptional()
    description?: string;

    @ApiProperty({ description: 'Preço unitário do produto', example: 2.99 })
    @IsNumber({}, { message: 'O preço precisa ser um número.' })
    @Min(0, { message: 'O preço não pode ser negativo.' })
    price: number;
}