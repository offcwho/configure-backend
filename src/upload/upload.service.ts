import { Injectable, NotAcceptableException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import type { Express } from 'express';
import { Role } from 'src/generated/prisma/enums';

@Injectable()
export class UploadService {
  constructor(private readonly prisma: PrismaService) { }

  async uploadProductImage(file: Express.Multer.File, role: Role, id: number) {
    console.log(file)
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
