# EcoSphere — Phase 0

ESG Management Platform. Phase 0 = foundation: Docker services, full Prisma schema, seed data.

## Setup

1. Copy env file:
   ```
   cp .env.example .env
   ```

2. Start everything:
   ```
   docker compose up -d
   ```

3. Validate + apply schema (first time only, run on host or inside `app` container):
   ```
   npx prisma validate
   npx prisma migrate dev --name init
   ```

4. Seed historical data:
   ```
   npm run seed
   ```

5. App runs at http://localhost:3000

## What's in Phase 0

- `docker-compose.yml` — Postgres (pgvector) + Redis + Next.js app
- `prisma/schema.prisma` — full data model: ERP stubs (Purchase/Manufacturing/Expense/Fleet), master/config, transactional tables, pgvector embedding table for the RAG copilot
- `prisma/seed.ts` — seeds departments, categories, emission factors, one user per role, and ~6 months of historical carbon transactions (needed later for anomaly detection baselines)

## Next up (Phase 1)

Pure `score(records, weights)` function → Environmental/Social/Governance → Department Total → Overall, backed by `ScoreSnapshot` + Redis cache.
