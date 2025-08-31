# BriefBox

Milestone 0: Next.js (App Router, TypeScript, Tailwind) with Drizzle ORM on Supabase Postgres. Includes a health check, landing page, and DB schema.

## Prerequisites
- Node 18+ and pnpm
- Supabase Postgres project
- `.env.local` with `DATABASE_URL=postgresql://...` (Supabase connection string)

## Setup
1. Install deps: `pnpm install`
2. Database: `pnpm db:push` (runs Drizzle against `DATABASE_URL`)
3. Dev server: `pnpm dev`
4. Verify:
   - Health: open `/health` → `{ ok: true, db: "up" }`
   - Landing: title and tagline render

## Stack Notes
- ORM: Drizzle (`src/db/schema.ts`, `src/db/index.ts`)
- Config: `drizzle.config.ts` loads `.env.local` for CLI
- App Router: files under `src/app/*`
- UI: Tailwind ready; page includes a placeholder Button. Add shadcn/ui later with `npx shadcn@latest add button`.
