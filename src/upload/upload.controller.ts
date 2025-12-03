import {
  Controller,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UploadService } from './upload.service';
import { AuthGuard } from '@nestjs/passport';
import type { Express } from 'express';

@Controller('upload')
@UseGuards(AuthGuard('jwt'))
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }

  @Post(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // убедись, что папка существует
        filename: (_, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, uniqueSuffix + extname(file.originalname));
          console.log("uploadSuccess");
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 }, // максимум 10 МБ
    }),
  )
  async uploadProductImage(
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
    @Param('id') id: string,
  ) {
    console.log('Uploaded file:', file); // для дебага

    return this.uploadService.uploadProductImage(file, req.user.role, parseInt(id));
  }
}