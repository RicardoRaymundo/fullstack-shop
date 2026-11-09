import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'E-mail de acesso', example: 'admin@admin.com' })
  @IsEmail({}, { message: 'E-mail inválido.' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Senha de acesso', example: '123456' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  pass: string;
}