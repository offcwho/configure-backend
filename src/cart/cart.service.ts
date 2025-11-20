import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) { }

  async create(productId: number, userId: number) {
    if (!userId) return new NotAcceptableException(`Вы не авторизованны!`);

    const product = await this.prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return new NotFoundException(`Товар который вы собираетесь добавить в корзину не существует`);
    } else {
      const cartItem = await this.prisma.cart.create({
        data: { productId, userId }
      });

      if (!cartItem) return new Error(`Не удалось добавить в корзину`);

      return cartItem;
    }
  }

  async findAll(userId: number) {
    if (!userId) return new NotAcceptableException(`Вы не авторизованны!`);

    const cart = await this.prisma.cart.findMany({
      where: {
        userId
      }
    });

    if (!cart) throw new NotFoundException(`Корзина пуста`);

    return cart;

  }

  async remove(userId: number, id: number) {
    if (!userId) return new NotAcceptableException(`Вы не авторизованны!`);

    const cartItem = await this.prisma.cart.findUnique({
      where: {
        userId,
        id
      }
    });

    if (!cartItem) throw new NotFoundException(`Товар не найден или уже удален`);

    return this.prisma.cart.delete({ where: { userId, id } })
  }
}
