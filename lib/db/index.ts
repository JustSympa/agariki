import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const pool = new Pool({
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_KEY,
  database: process.env.DATABASE_NAME,
});

pool.on('connect', () => {
  console.log('Connected to the database');
});

export const db = drizzle(pool, { schema });