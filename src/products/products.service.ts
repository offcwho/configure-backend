import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
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

  async adminCreate(role: string, dto: CreateProductDto, file: Express.Multer.File) {
    if (role !== "ADMIN") return new NotAcceptableException("У вас нет доступа");

    const normalizedPath = file.path.replace(/\\/g, '/');

    const product = await this.prisma.product.create({
      data: { ...dto, images: normalizedPath }
    });

    return product;
  }

  async adminUpdate(id: number, role: string, dto: UpdateProductDto, file: Express.Multer.File) {
    if (role !== "ADMIN") return new NotAcceptableException("У вас нет доступа");

    const product = await this.prisma.product.findUnique({
      where: { id }
    });

    if (!product) return new NotFoundException(`Данного продукта не существует`);

    const normalizedPath = file.path.replace(/\\/g, '/');

    return this.prisma.product.update({
      where: { id },
      data: { ...dto, images: normalizedPath }
    });
  }
}
