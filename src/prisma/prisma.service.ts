// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from 'src/generated/prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import "dotenv/config";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private logger: Logger;

  constructor() {
    const connectionString = process.env.DATABASE_URL2;
    
    if (!connectionString) {
      throw new Error('DATABASE_URL is required');
    }

    // Убедитесь, что connectionString включает схему
    let finalConnectionString = connectionString;
    if (!connectionString.includes('schema=')) {
      finalConnectionString = `${connectionString}&schema=mynewschema`;
    }

    const pool = new Pool({
      connectionString: finalConnectionString,
      max: 10,
      ssl: { rejectUnauthorized: false },
    });

    const adapter = new PrismaPg(pool, {
      schema: 'mynewschema', // Указываем схему в адаптере
    });
    
    super({ adapter });
    
    this.logger = new Logger(PrismaService.name);
    this.logger.log('PrismaService initialized for schema: mynewschema');
  }

  async onModuleInit() {
    this.logger.log('Connecting to database...');
    
    try {
      await this.$connect();
      
      // Устанавливаем схему по умолчанию
      await this.$executeRaw`SET search_path TO mynewschema`;
      
      // Проверяем таблицы
      const tables = await this.$queryRaw`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'mynewschema'
      `;
      
      this.logger.log(`Tables in mynewschema: ${(tables as any[]).length}`);
      
      if ((tables as any[]).length === 0) {
        this.logger.warn('No tables found in mynewschema. Running setup...');
        await this.setupDatabase();
      }
      
      this.logger.log('✅ Database ready');
      
    } catch (error: any) {
      this.logger.error('Database connection failed:', error.message);
      throw error;
    }
  }

  private async setupDatabase() {
    try {
      this.logger.log('Creating database tables...');
      
      // Создаем таблицу users если её нет
      await this.$executeRaw`
        CREATE TABLE IF NOT EXISTS mynewschema.users (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
          email TEXT UNIQUE NOT NULL,
          name TEXT,
          password TEXT NOT NULL,
          "createdAt" TIMESTAMP DEFAULT NOW(),
          "updatedAt" TIMESTAMP DEFAULT NOW()
        )
      `;
      
      this.logger.log('✅ Users table created');
      
      // Можно добавить другие таблицы здесь
      
    } catch (error) {
      this.logger.error('Setup failed:', error.message);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Disconnected');
  }
}