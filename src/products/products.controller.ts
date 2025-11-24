import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { FormDataRequest } from 'nestjs-form-data';
import * as fs from "fs/promises";

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
  @UseInterceptors(
    FileInterceptor('images', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, uniqueSuffix + extname(file.originalname));
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async createAdmin(@Req() req, @Body() dto: any, @UploadedFile() file: Express.Multer.File) {
    return this.productsService.adminCreate(req.user.role, dto, file);
  }
  @Patch(':id')
  @FormDataRequest()
  async adminUpdate(@Param('id') id: string, @Req() req, @Body() dto: UpdateProductDto) {
    console.log(dto);
    return this.productsService.adminUpdate(parseInt(id), req.user.role, dto);
  }
}