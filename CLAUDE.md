# CLAUDE.md – Project Spec for BriefBox 🐱📦

## Overview
BriefBox is a personal tool to **ingest newsletters and email subscriptions**, summarize them with LLMs, and present a clean **daily/weekly digest**.  
The goal is to save time by reducing inbox clutter and focusing only on key information.

Tagline:  
> “Digest your newsletters into simple summaries.”

Mascot:  
- Cat sitting in a cardboard box with scattered newsletters (playful branding).

---

## Tech Stack
- **Frontend:** Next.js (App Router, TypeScript, Tailwind, shadcn/ui)
- **Backend:** Serverless API routes in Next.js
- **Database:** Supabase Postgres + Drizzle ORM
- **LLMs:** Start with cloud APIs (OpenAI GPT-4o-mini, Claude Sonnet); later integrate Ollama
- **Deployment:** Vercel (serverless routes, Vercel Cron)
- **Future Enhancements:** Local embeddings with pgvector; clustering; offline mode

---

## Core Tables
| Table       | Purpose                                              |
|-------------|------------------------------------------------------|
| `source`    | Newsletter/RSS feed or sender metadata               |
| `item`      | Individual email/newsletter issue                    |
| `summary`   | Generated LLM summaries (added in Milestone 2)       |
| `digest`    | Daily/weekly digest metadata                        |
| `digest_item` | Join table for items in each digest               |

---

## Guiding Principles
- **Privacy-first:** Allow local-only processing for sensitive senders.
- **Clear JSON outputs:** LLMs must return strict schemas.
- **Low-friction setup:** Easy to run locally or deploy on Vercel.
- **Fun branding:** Cat mascot, playful empty/loading states.

---

## Roadmap Snapshot
See `MILESTONES.md` for detailed step-by-step goals.

Milestones in order:
1. Scaffold (DB + landing page)
2. Ingestion (Gmail + RSS)
3. Summarization
4. Today UI
5. Embeddings + de-dupe
6. Digest builder
7. Source controls + privacy
8. Metrics + evals
9. Export/share
10. Polish & mascot

---

## Coding Conventions
- TypeScript strict mode
- REST-style API routes in Next.js
- Tailwind for styling
- Drizzle for schema management
- pnpm as package manager

---

## Future Vision
BriefBox evolves into a **personal newsletter knowledge base**:
- Topic clustering
- Cross-digest search
- Offline summarization with local LLMs
- Obsidian/Notion integration