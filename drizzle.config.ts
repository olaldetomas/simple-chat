import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';

config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in .env.local');
}

const connectionString = process.env.DATABASE_URL.includes('sslmode=require')
  ? process.env.DATABASE_URL
  : `${process.env.DATABASE_URL}?sslmode=require`;

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './lib/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: connectionString,
  },
});
