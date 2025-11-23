import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) { }

  async checkout(userId: number) {
    if (!userId) throw new NotAcceptableException('Вы не авторизованы');

    const cartItems = await this.prisma.cart.findMany({
      where: { userId },
    });

    if (cartItems.length === 0) {
      throw new NotFoundException('Корзина пуста');
    }

    const ordersData = cartItems.map((item) => ({
      userId,
      productId: item.productId,
      state: 'created',
    }));

    await this.prisma.order.createMany({
      data: ordersData,
    });

    await this.prisma.cart.deleteMany({
      where: { userId },
    });

    return {
      message: 'Заказ создан',
      count: ordersData.length,
    };
  }

  async findAll(userId: number) {
    if (!userId) {
      throw new NotAcceptableException('Вы не авторизованы!');
    }

    const orderItems = await this.prisma.order.findMany({
      where: { userId },
      include: { product: true }
    });

    if (orderItems.length === 0) {
      throw new NotFoundException('У вас пока нет заказов');
    }

    return orderItems.map(item => ({
      orderId: item.id,
      state: item.state,
      product: item.product
    }));
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
