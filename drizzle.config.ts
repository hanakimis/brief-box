import { defineConfig } from 'drizzle-kit';
import { config as loadEnv } from 'dotenv';

// Load DATABASE_URL for drizzle-kit CLI (prefers .env.local)
loadEnv({ path: '.env.local', override: false });
loadEnv();

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});

