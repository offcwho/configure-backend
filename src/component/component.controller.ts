import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ComponentService } from './component.service';
import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDto } from './dto/update-component.dto';
import { AuthGuard } from '@nestjs/passport';
import { TypeComponent } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('component')
@UseGuards(AuthGuard('jwt'))
export class ComponentController {
  constructor(private readonly componentService: ComponentService) { }

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
  async create(@Req() req, @Body() createComponentDto: CreateComponentDto, @UploadedFile() file: Express.Multer.File) {
    return this.componentService.create(createComponentDto, req.user.role, file);
  }

  @Get()
  findType(@Query('type') type: TypeComponent, @Query('socket') socket?: string, @Query('ddrType') ddr?: string) {
    return this.componentService.findType(type, socket, ddr);
  }

  @Get()
  findAll() {
    return this.componentService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateComponentDto: UpdateComponentDto) {
    return this.componentService.update(+id, updateComponentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.componentService.remove(+id);
  }
}
