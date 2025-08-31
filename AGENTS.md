# AGENTS.md – AI Agent Collaboration Guide

This file defines how Claude Code, Codex, Gemini, and other coding agents collaborate to build BriefBox.

---

## Roles

### Claude Code
- Primary assistant for architecture decisions, refactors, and TypeScript correctness
- Reads `CLAUDE.md` at the start of every session
- Outputs clean, production-ready code with context

### Codex
- Secondary assistant for **fast scaffolding and boilerplate**
- Best for generating repetitive code (config files, schema, migration scripts)

### Gemini (Optional)
- UI/UX experiments
- Tailwind component design and layout prototyping

---

## Prompting Style
- Always load project context from `CLAUDE.md`
- Summarize the plan before coding
- Output code **file-by-file** with headers: `### path/to/file.ts`
- Validate JSON and code syntax before responding
- Include setup commands when necessary

---

## Commands & Slash Aliases
| Command             | Purpose                                        |
|---------------------|------------------------------------------------|
| `/briefbox:setup`   | Scaffold Milestone 0 project structure         |
| `/briefbox:db`      | Edit schema, migrations, or Drizzle config     |
| `/briefbox:ingest`  | Work on Gmail/RSS ingestion pipeline           |
| `/briefbox:summary` | Work on summarization routes + prompts         |
| `/briefbox:ui`      | Design UI screens in Tailwind/shadcn/ui        |
| `/briefbox:deploy`  | Prep for Vercel deployment                     |

---

## Environment Assumptions
- Node.js v20+
- pnpm as package manager
- Supabase Postgres with connection pooling
- Vercel for serverless deployment
- Tailwind/shadcn installed

---

## Collaboration Rules
- Agents communicate through concise commits and diffs
- Avoid regenerating boilerplate; focus on diffs or custom code
- Claude Code drives architecture; Codex fills repetitive code gaps
- Every milestone change should update `MILESTONES.md`

---

## Long-Term Workflow
1. Start every session with: “Load CLAUDE.md + MILESTONES.md”
2. Pick a milestone or feature
3. Plan steps in bullet points
4. Generate code in structured, reusable format
5. Confirm with tests or `/health` endpoints

# Repository Guidelines

## Project Structure & Module Organization
- `src/`: Application code (packages or modules by domain).
- `tests/`: Unit/integration tests mirroring `src/` paths.
- `scripts/`: Developer utilities (setup, lint, release).
- `docs/`: Architecture notes, ADRs, and how‑tos.
- `assets/`: Static files (images, fixtures, sample data).
- `.github/`: CI workflows and PR templates.

Example: `src/feature_x/service.ts` → `tests/feature_x/service.test.ts` (or `src/feature_x/service.py` → `tests/feature_x/test_service.py`).

## Build, Test, and Development Commands
- Install deps: `make setup` (fallback: `npm ci` or `pip install -r requirements.txt`).
- Run locally: `make dev` (fallback: `npm run dev` or run your app entrypoint).
- Test: `make test` (fallback: `npm test` or `pytest -q`).
- Lint & format: `make lint` / `make fmt` (fallback: `npm run lint && npm run fmt` or `ruff check && black .`).
- Type check: `make typecheck` (fallback: `tsc --noEmit` or `pyright`).

Keep commands idempotent; print clear errors and non‑zero exits.

## Coding Style & Naming Conventions
- Modules/packages: `kebab-case` for folders, `snake_case.py` or `camelCase.ts` by language norms.
- Public APIs: prefer explicit exports and clear docstrings/JSDoc.
- Indentation: 2 spaces (JS/TS), 4 spaces (Python).
- Tools: JS/TS → ESLint + Prettier; Python → Ruff + Black. Configure to run in CI.

## Testing Guidelines
- Frameworks: JS/TS → Jest/Vitest; Python → Pytest.
- Structure: mirror `src/`; name tests `*.test.ts` or `test_*.py`.
- Coverage: target ≥ 85% statements/branches for changed code. Fail CI on regressions.
- Fast tests default; mark slow/integration for opt‑in runs.

## Commit & Pull Request Guidelines
- Commits: Conventional Commits (e.g., `feat: add brief card grid`, `fix(ui): prevent overflow on mobile`).
- Scope small, message imperative; include rationale when non‑obvious.
- PRs: clear description, linked issue, screenshots for UI, notes on risk/rollout. Add checklist for tests, docs, and migration steps.
- Require passing CI and at least one review.

## Security & Configuration Tips
- Secrets: never commit. Use `.env` and provide `.env.example`.
- Reviews: scrutinize dependency additions and network access.
- Data: sanitize inputs; log minimally; avoid PII in test fixtures.
