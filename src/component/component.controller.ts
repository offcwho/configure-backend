import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Query } from '@nestjs/common';
import { ComponentService } from './component.service';
import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDto } from './dto/update-component.dto';
import { AuthGuard } from '@nestjs/passport';
import { TypeComponent } from '@prisma/client';

@Controller('component')
@UseGuards(AuthGuard('jwt'))
export class ComponentController {
  constructor(private readonly componentService: ComponentService) { }

  @Post()
  create(@Req() req, @Body() createComponentDto: CreateComponentDto) {
    return this.componentService.create(createComponentDto, req.user.role);
  }

  @Get()
  findType(@Query('type') type: TypeComponent, @Query('socket') socket?: string, @Query('ddrType') ddr?: string) {
    return this.componentService.findType(type, socket, ddr);
  }

  @Get()
  findAll(){
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
