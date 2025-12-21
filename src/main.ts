import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import 'dotenv/config'
import * as express from 'express';
import { join } from 'path';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: [
      process.env.CLIENT_URL || 'https://configure-xucy.vercel.app',
      'http://localhost:3000',
    ],
    credentials: true,
  });

  const uploadDir = join(__dirname, '..', 'uploads', 'images');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }));
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 9000);
}
bootstrap();