import { Injectable, NotAcceptableException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import type { Express } from 'express';

@Injectable()
export class UploadService {
  constructor(private readonly prisma: PrismaService) { }

  async uploadProductImage(file: Express.Multer.File, role: Role, id: number) {
    if (role !== 'ADMIN') {
      throw new NotAcceptableException('У вас нет доступа!');
    }

    const normalizedPath = file.path.replace(/\\/g, '/');

    const product = await this.prisma.product.update({
      where: { id },
      data: { images: normalizedPath },
    });

    return {
      product,
      filename: file.filename,
      path: normalizedPath,
      size: file.size,
    };
  }
}
