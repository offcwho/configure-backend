import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFeedbackDto, CreateFeedbackToUserDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FeedbacksService {
  constructor(private readonly prisma: PrismaService) { }
  async create(dto: CreateFeedbackDto, productId: number, userId: number) {
    const feedback = await this.prisma.feedback.create({
      data: { ...dto, userId: userId, productId: productId }
    });
    return feedback;
  }

  async createToUser(dto: CreateFeedbackToUserDto, userId: number, feedbackId: number) {
    const feedbackToUser = await this.prisma.feedbackToUser.create({
      data: { ...dto, userId: userId, feedbackId: feedbackId }
    });
    return feedbackToUser;
  }

  async findAll(productId: number) {
    const feedbacks = await this.prisma.feedback.findMany({
      where: { id: productId },
      include: {
        feedbackToUsers: true
      }
    })
    if (feedbacks.length < 0) throw new NotFoundException(`Ничего не найдено`)

    return feedbacks;
  }

  update(id: number, updateFeedbackDto: UpdateFeedbackDto) {
    return `This action updates a #${id} feedback`;
  }

  remove(id: number) {
    return `This action removes a #${id} feedback`;
  }
}
