import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

const prisma = new PrismaClient();

async function setupTestDb() {
  console.log('Setting up test database environment...');
  
  try {
    // Make sure we're using the test database
    if (!process.env.DATABASE_URL || !process.env.DATABASE_URL.includes('test.db')) {
      throw new Error('Test database URL not properly configured in .env.test');
    }
    
    // Delete the test database file if it exists
    const dbPath = path.join(process.cwd(), 'prisma', 'test.db');
    if (fs.existsSync(dbPath)) {
      console.log('Removing existing test database...');
      fs.unlinkSync(dbPath);
    }
    
    // Run migrations on the test database
    console.log('Running migrations on test database...');
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    
    // Seed the test database
    console.log('Seeding test database...');
    await import('./prisma/seed.test.js');
    
    console.log('Test database setup completed successfully!');
  } catch (error) {
    console.error('Error setting up test database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

setupTestDb();
