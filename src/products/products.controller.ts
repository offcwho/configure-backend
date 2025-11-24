import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('products')
@UseGuards(AuthGuard('jwt'))
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Get()
  async findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(parseInt(id));
  }
  @Post()
  async createAdmin(@Req() req) {
    return
  }
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('images', {
      storage: diskStorage({
        destination: './uploads', // убедись, что папка существует
        filename: (_, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, uniqueSuffix + extname(file.originalname));
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 }, // максимум 10 МБ
    }),
  )
  async adminUpdate(@Param('id') id: string, @Req() req, @Body() dto: UpdateProductDto, @UploadedFile() file: Express.Multer.File,) {
    return this.productsService.adminUpdate(parseInt(id), req.user.role, dto, file);
  }
}
