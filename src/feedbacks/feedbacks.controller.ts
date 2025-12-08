import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { CreateFeedbackDto, CreateFeedbackToUserDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('feedbacks')
@UseGuards(AuthGuard('jwt'))
export class FeedbacksController {
  constructor(private readonly feedbacksService: FeedbacksService) { }

  @Post(':id')
  async create(@Param('id') id: string, @Req() req, @Body() dto: CreateFeedbackDto) {
    return this.feedbacksService.create(dto, parseInt(id), req.user.userId);
  }

  @Post('/toUser/:id')
  async createToUser(@Param('id') id: string, @Req() req, @Body() dto: CreateFeedbackToUserDto) {
    return this.feedbacksService.createToUser(dto, req.user.userId, parseInt(id))
  }

  @Get(':id')
  findAll(@Param('id') id: string) {
    return this.feedbacksService.findAll(parseInt(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFeedbackDto: UpdateFeedbackDto) {
    return this.feedbacksService.update(+id, updateFeedbackDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.feedbacksService.remove(+id);
  }
}
