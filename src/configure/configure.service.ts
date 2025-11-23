import { ConflictException, Injectable, NotAcceptableException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateConfigureDto } from './dto/create-configure.dto';
import { UpdateConfigureDto } from './dto/update-configure.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddComponentsToConfigureDto, AddComponentToConfigureDto } from './dto/add-component-to-configure.dto';

@Injectable()
export class ConfigureService {
  constructor(private readonly prisma: PrismaService) { }

  async create(userId: number, dto: CreateConfigureDto) {
    if (!userId) return new NotAcceptableException(`Вы не авторизованны!`);

    const configure = await this.prisma.configure.create({
      data: {
        name: dto.name,
        userId: userId,
        components: dto.components ? {
          create: dto.components.map(comp => ({
            componentId: comp.componentId,
            quantity: comp.quantity || 1,
          }))
        } : undefined,
      },
      include: {
        components: {
          include: {
            component: true,
          },
        },
      },
    });

    if (!configure) new Error('Не удалось создать конфигурацию!');

    return configure;
  }

  async update(userId: number, configureId: number, dto: AddComponentsToConfigureDto) {

    await this.prisma.configure.update({
      where: { id: configureId, userId },
      data: {
        components: {
          deleteMany: {}
        }
      }
    });

    const updated = await this.prisma.configure.update({
      where: { id: configureId, userId },
      data: {

        components: {
          create: dto.components.map(c => ({ componentId: c.componentId }))
        }
      },
      include: { components: { include: { component: true } } }
    });

    const socketSource = updated.components.find(
      c =>
        c.component.type === "CPU" ||
        c.component.type === "MOTHERBOARD"
    )?.component.socket ?? null;

    const formFactorSource = updated.components.find(
      c =>
        c.component.type === "MOTHERBOARD"
    )?.component.formFactor ?? null;

    const ddrSource = updated.components.find(
      c => c.component.type === "MEMORY"
    )?.component.ddr ?? null;

    const totalWatt = updated.components.reduce(
      (sum, c) => sum + (c.component.watt ?? 0),
      0
    );

    const totalPrice = updated.components.reduce(
      (sum, c) => sum + (c.component.price ?? 0),
      0
    );

    await this.prisma.configure.update({
      where: { id: configureId, userId },
      data: {
        socket: socketSource,
        ddr: ddrSource,
        watt: totalWatt,
        formFactor: formFactorSource,
        price: totalPrice,
      }
    });
    return updated;
  }

  findUserConfigurations(userId: number) {
    const configurations = this.prisma.configure.findMany({
      where: { userId },
      include: {
        components: {
          include: { component: true }
        }
      }
    });

    return configurations;
  }

  async removeComponent(userId: number, configureId: number, componentId: number) {
    const configure = await this.prisma.configure.findUnique({
      where: {
        id: configureId,
        userId: userId
      }
    })

    if (!configure) throw new UnauthorizedException('Нет доступа');

    await this.prisma.componentOnConfigure.deleteMany({
      where: {
        componentId,
        configureId
      }
    })
  }

  createFindOne(configureName: string, userId: number) {
    const configure = this.prisma.configure.findFirst({
      where: {
        name: configureName,
        userId: userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return configure
  }

  findAll() {
    return `This action returns all configure`;
  }

  async findOne(configureId: number) {
    const configure = await this.prisma.configure.findUnique({
      where: {
        id: configureId
      },
      include: {
        components: {
          include: {
            component: true
          }
        }
      }
    });

    if (!configure) return new NotFoundException(`Конфигурация не найдена!`);

    const components = await this.prisma.componentOnConfigure.findFirst({
      where: {
        configureId
      },
    });

    const config = {
      components,
      configure
    }

    return config;
  }

  async remove({ id, userId }: { id: number, userId: number }) {
    if (!userId) return new NotAcceptableException(`Вы не авторизованны!`);
    const configure = await this.prisma.configure.findUnique({
      where: { id }
    });

    if (!configure) throw new NotFoundException(`Конфигурация которую вы собираетесь удалить не найдена!`);

    return this.prisma.configure.delete({ where: { id } });
  }
}
