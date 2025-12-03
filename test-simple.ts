// check-tables.ts
import { PrismaClient } from 'src/generated/prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import "dotenv/config"

async function checkDatabase() {
  const connectionString = process.env.DATABASE_URL2;
  
  if (!connectionString) {
    console.error('DATABASE_URL is not set');
    process.exit(1);
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    await prisma.$connect();
    
    console.log('Checking database...\n');
    
    // 1. Проверяем текущую схему
    const currentSchema = await prisma.$queryRaw`
      SELECT current_schema()
    `;
    console.log('Current schema:', currentSchema);
    
    // 2. Проверяем все таблицы в mynewschema
    const tables = await prisma.$queryRaw`
      SELECT 
        table_schema,
        table_name,
        table_type
      FROM information_schema.tables
      WHERE table_schema IN ('mynewschema', 'public')
      ORDER BY table_schema, table_name
    `;
    
    console.log('\nTables found:');
    console.log('=============');
    (tables as any[]).forEach(table => {
      console.log(`${table.table_schema}.${table.table_name} (${table.table_type})`);
    });
    
    // 3. Проверяем таблицу users
    const usersTableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'mynewschema' 
        AND table_name = 'users'
      ) as exists
    `;
    
    console.log('\nDoes users table exist in mynewschema?', usersTableExists);
    
    // 4. Создаем таблицу если её нет
    if (!(usersTableExists as any[])[0]?.exists) {
      console.log('\nCreating users table...');
      
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS mynewschema.users (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
          email TEXT UNIQUE NOT NULL,
          name TEXT,
          password TEXT NOT NULL,
          "createdAt" TIMESTAMP DEFAULT NOW(),
          "updatedAt" TIMESTAMP DEFAULT NOW()
        )
      `;
      
      console.log('✅ Users table created');
    }
    
    await prisma.$disconnect();
    
  } catch (error: any) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkDatabase();