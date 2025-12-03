
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'src/generated/prisma/client';
import 'dotenv/config'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    console.log('Connecting to database...');
    await this.$connect();
    console.log('✅ Prisma connected to:',
      process.env.DATABASE_URL2?.replace(/:[^:]*@/, ':****@'));
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}