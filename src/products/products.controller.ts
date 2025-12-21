import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, memoryStorage } from 'multer';
import { extname } from 'path';
import { YandexS3Service } from 'src/yandex-s3/yandex-s3.service';

@Controller('products')
@UseGuards(AuthGuard('jwt'))
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly yandexS3Service: YandexS3Service,
  ) { }

  @Get()
  async findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(parseInt(id));
  }
  @UseInterceptors(
    FileInterceptor('images', {
      storage: memoryStorage(), // Используем memoryStorage вместо diskStorage
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async createAdmin(
    @Req() req,
    @Body() dto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    let imageUrl = '';
    // Если есть файл - загружаем в Яндекс S3
    if (file) {
      try {
        const uploadResult = await this.yandexS3Service.uploadFile(
          file,
        );

        imageUrl = uploadResult.url;
        console.log('✅ Изображение загружено в Яндекс S3:', imageUrl);
      } catch (error) {
        console.error('❌ Ошибка загрузки в S3:', error);
        // Можно либо прервать операцию, либо продолжить без изображения
        throw new BadRequestException('Не удалось загрузить изображение');
      }
    }

    // Вызываем сервис с URL изображения из S3
    return this.productsService.adminCreate(req.user.role, dto, imageUrl);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('images', {
      storage: memoryStorage(), // Используем memoryStorage вместо diskStorage
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async updateProduct(
    @Param('id') id: string,
    @Req() req,
    @Body() dto: UpdateProductDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    let imageUrl = '';

    // Если есть файл - загружаем в Яндекс S3
    if (file) {
      try {
        const uploadResult = await this.yandexS3Service.uploadFile(
          file,
        );

        imageUrl = uploadResult.url;
        console.log('✅ Изображение загружено в Яндекс S3:', imageUrl);

        // Удаляем старое изображение из S3, если нужно
        // await this.deleteOldProductImage(id);

      } catch (error) {
        console.error('❌ Ошибка загрузки в S3:', error);
        throw new BadRequestException('Не удалось обновить изображение');
      }
    }

    // Вызываем сервис с URL изображения из S3
    return this.productsService.adminUpdate(parseInt(id), req.user.role, dto, imageUrl);
  }
  @Delete()
  async remove(@Param('id') id: string, @Req() req) {
    return this.productsService.remove(parseInt(id), req.user.role);
  }
}