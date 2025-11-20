import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) { }

  async findAll() {
    const products = await this.prisma.product.findMany();

    return products;
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id }
    });

    if (!product) throw new NotFoundException(`Продукт не найден!`);

    return product;
  }
}
