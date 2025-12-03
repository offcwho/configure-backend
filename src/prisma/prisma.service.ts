
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'src/generated/prisma/client';
import 'dotenv/config'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const adapter = new PrismaPg({
      url: "postgresql://postgres:NHCkcSIdgmtWqhRMbbvCTWTrMDrTkIQL@crossover.proxy.rlwy.net:11966/railway?sslmode=require"
    });
    super({ adapter });
  }

  async onModuleInit() {
    console.log('Connecting to database...');
    await this.$connect();
    console.log('Database connected');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}