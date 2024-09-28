import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use('payment/webhook', express.raw({ type: 'application/json' }));
  app.enableCors({
    origin: ['http:/localhost:3000']
  });

  const config = new DocumentBuilder()
    .setTitle('TestCase')
    .setDescription('Nestjs Test Case')
    .setVersion('1.0')
    .addTag('api')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000);

}
bootstrap();
