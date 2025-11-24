import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MemoryStoredFile } from 'nestjs-form-data';
import { extname, join } from 'path';
import * as fs from 'fs/promises';

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

  async adminCreate(role: string, dto: any, file: Express.Multer.File) {
    if (role !== "ADMIN") return new NotAcceptableException("У вас нет доступа");

    const normalizedPath = file.path.replace(/\\/g, '/');

    const product = await this.prisma.product.create({
      data: { name: dto.name, description: dto.description, content: dto.content, price: dto.price, images: normalizedPath }
    });

    return product;
  }

  async adminUpdate(id: number, role: string, dto: UpdateProductDto) {
    if (role !== "ADMIN") return new NotAcceptableException("У вас нет доступа");

    const product = await this.prisma.product.findUnique({
      where: { id }
    });

    if (!product) return new NotFoundException(`Данного продукта не существует`);

    let imagePath: string | undefined;

    if (dto.images) {
      const file = dto.images as MemoryStoredFile;
      const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalName)}`;
      imagePath = join(__dirname, '../../uploads', fileName);

      await fs.writeFile(imagePath, file.buffer);
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        content: dto.content,
        price: dto.price,
        images: imagePath, // только путь к файлу
      },
    });
  }
}
