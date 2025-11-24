import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  imports: [PrismaModule, NestjsFormDataModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule { }
