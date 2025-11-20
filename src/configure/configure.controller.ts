import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Query } from '@nestjs/common';
import { ConfigureService } from './configure.service';
import { CreateConfigureDto } from './dto/create-configure.dto';
import { UpdateConfigureDto } from './dto/update-configure.dto';
import { AuthGuard } from '@nestjs/passport';
import { AddComponentsToConfigureDto, AddComponentToConfigureDto } from './dto/add-component-to-configure.dto';

@Controller('configure')
@UseGuards(AuthGuard('jwt'))
export class ConfigureController {
  constructor(private readonly configureService: ConfigureService) { }

  @Post()
  async create(@Req() req, @Body() dto: CreateConfigureDto) {
    return await this.configureService.create(req.user.userId, dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.configureService.findOne(parseInt(id));
  }

  @Get('find/:name')
  createFindOne(@Param('name') name: string, @Req() req) {
    return this.configureService.createFindOne(name, req.user.userId)
  }

  @Get('user/configure')
  findUserConfigurations(@Req() req) {
    return this.configureService.findUserConfigurations(req.user.userId);
  }

  @Patch()
  addComponent(@Query('configureId') configureId: string, @Req() req, @Body() dto: AddComponentsToConfigureDto) {
    return this.configureService.update(req.user.userId, parseInt(configureId), dto);
  }

  @Delete('component')
  removeComponent(@Query('configureId') configureId: string, @Query('componentId') componentId: string, @Req() req) {
    return this.configureService.removeComponent(req.user.userId, parseInt(configureId), parseInt(componentId));
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.configureService.remove(parseInt(id), req.user.userId);
  }
}
