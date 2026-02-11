# MILESTONES.md – BriefBox Roadmap

This document breaks down all milestones for BriefBox, step by step.

---

## Milestone 0 – Scaffold
**Goal:**  
Set up the project foundation:
- Next.js App Router project
- Supabase Postgres + Drizzle ORM schema
- Health check route
- Landing page branding

**Deliverables:**
- `drizzle.config.ts`, `src/db/schema.ts`, `src/db/index.ts`
- `/health` API route
- Basic landing page (🐱📦 branding)

---

## Milestone 1 – Ingestion
**Goal:**  
Pull newsletters into the database.
- Gmail API polling by label `Newsletters`
- Optional RSS ingestion
- Normalize MIME/HTML → clean text
- Deduplicate by `Message-Id`

**Deliverables:**  
- `/api/ingest/gmail` and `/api/ingest/rss` routes
- Raw newsletter content stored in `item` table

---

## Milestone 2 – Summarization
**Goal:**
Summarize newsletters via OpenRouter API.
- OpenRouter integration (OpenAI-compatible SDK with base URL override)
- JSON schema prompt: `{ bullets: [], change_note: "" }`
- Store in `summary` table
- Validate/retry logic

---

## Milestone 3 – Today UI
**Goal:**  
A triage screen for curating newsletters.
- `/today` route
- List view + right-side summary preview
- “Include in digest” toggle

---

## Milestone 4 – Digest Builder
**Goal:**  
Auto-generate daily/weekly digest pages.
- Cron job triggers `/api/digest/build`
- `/digest/daily/:date`, `/digest/weekly/:week`
- Simple clustering by topic

---

## Milestone 5 – Source Controls & Privacy
**Goal:**  
Give user control over sources.
- Pin/mute sources
- Local-only processing toggle
- Redaction rules for sensitive senders

---

## Milestone 6 – Metrics & Evals
**Goal:**  
Measure app performance and accuracy.
- `/metrics` page
- Small gold set of labeled data
- Token cost and duplicate-avoidance stats

---

## Milestone 7 – Export & Share
**Goal:**  
Make digests portable.
- Export digest to Markdown
- Copy-to-clipboard or email to self
- Optional Obsidian/Notion sync

---

## Milestone 8 – Polish & Mascot
**Goal:**  
Add personality and finishing touches.
- Cat-in-box mascot in UI
- Fun empty states (sleeping cat)
- Loading animation (paw batting envelope)