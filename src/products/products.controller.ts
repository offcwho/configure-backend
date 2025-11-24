import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
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
  async adminUpdate(@Param('id') id: string, @Req() req, data: UpdateProductDto) {
    return this.productsService.adminUpdate(parseInt(id), req.user.role, data);
  }
}
