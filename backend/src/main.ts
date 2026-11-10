import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Remove propriedades que não estão no DTO
    forbidNonWhitelisted: true, // Retorna erro se enviarem propriedades indesejadas
    transform: true, // Converte os tipos automaticamente (ex: string para número)
  }));

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('API de Produtos - Destrava Full Stack')
    .setDescription('Documentação da API do backend com NestJS e Prisma')
    .setVersion('1.0')
    .addTag('products')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // A documentação ficará em http://localhost:3000/api

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://fullstack-shop-nu.vercel.app',
    ].filter(Boolean),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
