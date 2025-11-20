import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('cart')
@UseGuards(AuthGuard('jwt'))
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @Post(':id')
  async create(@Req() req, @Param('id') id: string) {
    return this.cartService.create(req.user.userId, parseInt(id));
  }

  @Get()
  findAll(@Req() req) {
    return this.cartService.findAll(req.user.userId);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.cartService.remove(req.user.userId, parseInt(id));
  }
}
