import { Injectable } from '@nestjs/common';
import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDto } from './dto/update-component.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TypeComponent } from '@prisma/client';

@Injectable()
export class ComponentService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateComponentDto, role: string) {
    if (role === `ADMIN`) {
      const component = await this.prisma.component.create({
        data: { ...dto }
      });

      if (!component) throw new Error(`Не удалось создать компонент`)
    }
  }

  findAll() {
    return `This action returns all component`;
  }

  async findType(type: TypeComponent, socket?: string, ddr?: string) {
    if (type === "CPU" || type === "MOTHERBOARD") {
      const components = await this.prisma.component.findMany({
        where: { type, socket }
      });

      return components;
    }


    if (type === "MEMORY") {
      const components = await this.prisma.component.findMany({
        where: { type, ddr }
      });

      return components;
    }

    const components = await this.prisma.component.findMany({
      where: { type }
    });

    return components
  }

  findOne(id: number) {
    return `This action returns a #${id} component`;
  }

  update(id: number, updateComponentDto: UpdateComponentDto) {
    return `This action updates a #${id} component`;
  }

  remove(id: number) {
    return `This action removes a #${id} component`;
  }
}
