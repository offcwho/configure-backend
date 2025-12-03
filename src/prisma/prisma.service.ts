
import { Injectable, NotFoundException, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'src/generated/prisma/client';
import 'dotenv/config'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const adapter123 = new PrismaBetterSqlite3({
      url: process.env.DATABASE_URL
    });

    const connectionString = process.env.DATABASE_URL2;

    if (!connectionString) throw new NotFoundException("Не удалось нихуя")

    const dbUrl = new URL(connectionString);

    const adapter = new PrismaMariaDb({
      host: dbUrl.hostname,
      port: parseInt(dbUrl.port),
      user: dbUrl.username,
      password: dbUrl.password,
      database: dbUrl.pathname.replace('/', ''),
      connectionLimit: 5,
      connectTimeout: 15000,
      ssl: {
        rejectUnauthorized: false
      }
    })
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