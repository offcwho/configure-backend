import { Module } from '@nestjs/common';
import { ConfigureService } from './configure.service';
import { ConfigureController } from './configure.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ConfigureController],
  providers: [ConfigureService],
})
export class ConfigureModule { }
