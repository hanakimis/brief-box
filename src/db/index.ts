import { Pool } from 'pg';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';

declare global {
  var __briefbox_pool: Pool | undefined;
  var __briefbox_db: NodePgDatabase | undefined;
}

function getPool(): Pool {
  if (!globalThis.__briefbox_pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL is not set');
    }
    globalThis.__briefbox_pool = new Pool({ connectionString });
  }
  return globalThis.__briefbox_pool;
}

function getDb(): NodePgDatabase {
  if (!globalThis.__briefbox_db) {
    globalThis.__briefbox_db = drizzle(getPool());
  }
  return globalThis.__briefbox_db;
}

// Lazy proxies: safe to import without DATABASE_URL at build time
export const pool = new Proxy({} as Pool, {
  get(_, prop) { return (getPool() as never)[prop]; },
});

export const db = new Proxy({} as NodePgDatabase, {
  get(_, prop) { return (getDb() as never)[prop]; },
});
