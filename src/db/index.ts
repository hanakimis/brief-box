import { Pool } from 'pg';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';

declare global {
  // eslint-disable-next-line no-var
  var __briefbox_pool: Pool | undefined;
  // eslint-disable-next-line no-var
  var __briefbox_db: NodePgDatabase | undefined;
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

export const pool: Pool =
  globalThis.__briefbox_pool ?? new Pool({ connectionString });

export const db: NodePgDatabase = globalThis.__briefbox_db ?? drizzle(pool);

if (process.env.NODE_ENV !== 'production') {
  globalThis.__briefbox_pool = pool;
  globalThis.__briefbox_db = db;
}

