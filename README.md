# EcoSphere 🌍
### Intelligent ESG Management & Gamification Platform
*Built for the Odoo Hackathon 2026*

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)](https://prisma.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-pgvector-336791?logo=postgresql)](https://postgresql.org)

---

## What Is EcoSphere?

Current ESG reporting is retroactive, manual, and disconnected from daily operations. Organisations fill in spreadsheets weeks after the fact, then wonder why their sustainability initiatives never move the needle.

EcoSphere solves this by embedding ESG directly into the organisational workflow — every purchase order, every manufacturing run, every CSR event, every policy acknowledgement automatically feeds into a live score. Employees don't file reports; they earn XP for making sustainable choices.

---

## Live Demo

> **URL:** [https://ecosphere-sigma-three.vercel.app](https://ecosphere-sigma-three.vercel.app)
>
> **Demo credentials:**
> | Role | Email | Password |
> |---|---|---|
> | Platform Admin | `admin@ecosphere.dev` | `password123` |
> | ESG Manager | `manager@ecosphere.dev` | `password123` |
> | Department Lead | `lead@ecosphere.dev` | `password123` |
> | Employee | `employee@ecosphere.dev` | `password123` |

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| **Framework** | Next.js 16 (App Router) | Server components, API routes, and static export in one project — no separate backend needed for the demo |
| **Language** | TypeScript 5 | Full type safety across Prisma models, API responses, and UI components |
| **Styling** | Tailwind CSS v4 + Vanilla CSS custom properties | CSS variables power the design token system; Tailwind handles layout utilities |
| **Animation** | Framer Motion | `layout` prop for drag-and-drop Kanban, `useSpring` for XP bars, `AnimatePresence` for route transitions |
| **UI Components** | shadcn/ui | Unstyled primitives that take the design token system without fighting it |
| **ORM** | Prisma + PostgreSQL (pgvector) | Type-safe queries, schema-first migrations, and `pgvector` extension for the AI copilot embeddings |
| **Caching** | Redis (Upstash in prod) | ESG score snapshots cached per-department; invalidated on new transactions |
| **Auth** | Custom JWT sessions via `jose` | Session stored in an httpOnly cookie; role-based access enforced in middleware |
| **Deploy** | Vercel (app) + Supabase (DB) | Zero-config Next.js deployment; Supabase provides managed Postgres with pgvector built in |

---

## Architecture

```
src/
├── app/
│   ├── (app)/                    # Authenticated shell (sidebar + topbar)
│   │   ├── page.tsx              # Dashboard — ESG score rings + pillar cards
│   │   ├── environmental/        # Emissions tracker, factors, goals
│   │   ├── social/               # CSR activities, diversity, approvals
│   │   ├── governance/           # Policies, audits, compliance issues
│   │   ├── gamification/         # Challenges Kanban, leaderboard, badges
│   │   ├── reports/              # Custom report builder, export
│   │   ├── copilot/              # RAG-powered AI assistant (UI complete)
│   │   └── settings/             # Weights, scoring config, notifications
│   ├── api/
│   │   ├── auth/                 # login · logout · me (JWT session)
│   │   ├── environmental/        # Emissions aggregation endpoint
│   │   └── social/               # CSR participation endpoint
│   └── login/
├── components/
│   ├── charts/                   # ScoreRing (SVG stroke-draw), MiniCharts
│   ├── shell/                    # Sidebar, Topbar, AppShell, NotificationDrawer
│   ├── shared/                   # XpBar, PageHeader, ProofDropzone
│   └── ui/                       # shadcn primitives + FilterChips, ExportButton, SegmentedProgress
├── lib/
│   ├── mock/                     # Typed mock data (departments, users, leaderboard, badges)
│   ├── auth-context.tsx          # Client-side auth state (useAuth hook)
│   ├── role-context.tsx          # Role switcher for demo purposes
│   └── format.ts                 # scoreColor, fmtDate, tabular number helpers
└── prisma/
    ├── schema.prisma             # Full data model — see Schema section below
    └── seed.ts                   # 6 months of historical emissions + all master data
```

---

## Data Model (Prisma Schema)

The schema is designed for **explainability** — every score point traces back to a source record.

```
User ──┬── CarbonTransaction  (auto-calculated from ERP stubs)
       ├── Participation       (CSR activity attendance + proof)
       ├── PolicyAck           (governance acknowledgements)
       └── ComplianceIssue     (open/resolved/overdue)

Department ──┬── ScoreSnapshot  (E/S/G scores + weighted total, Redis-cached)
             └── CarbonTransaction

EmbeddingRecord                 (pgvector — policy/audit text → 1536-dim vectors for RAG)
```

Key design decisions:
- `CarbonTransaction.autoCalculated` flag — when `true`, the emission pipeline computed CO₂e from `EmissionFactor.co2ePerUnit × quantity` automatically
- `CarbonTransaction.anomalyFlag` — set by the z-score detection job when a reading is > 2σ from the 6-month baseline
- `ScoreSnapshot` is immutable append-only; the latest per-department is what the dashboard shows
- `EmbeddingRecord` stores the pgvector embedding alongside the source record type and ID, enabling the copilot to surface the exact policy/audit that answered a question

---

## ESG Scoring Engine

Scores are computed as a **pure function** — no side effects, fully deterministic, cacheable:

```
E_score = f(carbon_transactions, goals, anomaly_flags)    → 0–100
S_score = f(csr_participations, training_completions, diversity_metrics) → 0–100
G_score = f(policy_ack_rate, open_compliance_issues, audit_findings)     → 0–100

Department_Total = E_score × 0.40 + S_score × 0.30 + G_score × 0.30
Org_Total        = Σ(Department_Total × headcount_weight)
```

Weights (40/30/30) are configurable per-organisation in Settings → Scoring Configuration. Changes invalidate all cached snapshots and trigger a full recompute.

---

## Module Breakdown

### 🌿 Environmental
- **Dashboard** (`/environmental`) — live CO₂e total, trend vs. prior period, anomaly count
- **Emission Factors** (`/environmental/factors`) — master list with DEFRA/GHG Protocol sources, editable
- **Goals** (`/environmental/goals`) — segmented progress tracks with target vs. actual

### 🤝 Social
- **CSR Activities** (`/social`) — participation tracker, proof upload, manager approval flow
- **Diversity** (`/social/diversity`) — demographic breakdown, animated bar chart
- **Approvals** (`/social/approvals`) — pending proof review queue

### 🛡️ Governance
- **Policies** (`/governance/policies`) — distribution + acknowledgement tracking
- **Audits** (`/governance/audits`) — audit log with finding severity
- **Compliance Issues** (`/governance/`) — overdue flagging, assignment, resolution

### 🎮 Gamification
- **Challenges** (`/gamification`) — Kanban board (Available → In Progress → Completed), drag-and-drop
- **Leaderboard** (`/gamification/leaderboard`) — live XP rankings, current-user row pinned, Framer Motion reorder
- **Badges & Rewards** (`/gamification/rewards`) — auto-award rules, locked/unlocked states, XP redemption

### 📊 Reports
- **Custom Builder** (`/reports`) — filter by department, date range, category; FilterChip UI
- **Export** — animated ExportButton with progress arc (PDF / Excel / CSV)
- **Score Explainability** — drill-down dialog shows every point's source record

### 🤖 AI Copilot (`/copilot`)
Infrastructure: pgvector embeddings indexed on write for every Policy, Audit, and ComplianceIssue. The retrieval pipeline is architected; the LLM call layer is ready to wire to any OpenAI-compatible endpoint.

---

## Business Rules Implementation

| Rule | Where it fires |
|---|---|
| Badge auto-award | `lib/mock/gamification.ts` → `unlockRule` evaluated against user XP/completions on every gamification page load (production: triggered as a server action after XP ledger write) |
| Reward stock deduction | `api/rewards/redeem` — atomic Prisma transaction: check stock > 0, decrement, create redemption record |
| Compliance overdue flagging | Nightly cron job compares `ComplianceIssue.dueDate` to `now()`, sets `status = 'overdue'` |
| Auto-emission calculation | `api/environmental/transactions` — on POST, if `autoCalculated = true`, multiplies `quantity × EmissionFactor.co2ePerUnit` before writing `CarbonTransaction.co2eKg` |
| Score cache invalidation | Any write to `CarbonTransaction`, `Participation`, or `PolicyAck` publishes to a Redis pub/sub channel; the score worker recomputes the affected department's snapshot |

---

## Local Setup

### Prerequisites
- Node.js 20+
- Docker Desktop (for Postgres + Redis)
- A `.env` file — copy from `.env.example`

### Steps

```bash
git clone https://github.com/BHUVI-SHIP-IT/EcoSphere-ESG-Management-Platform-odoo-hackathon-.git
cd EcoSphere-ESG-Management-Platform-odoo-hackathon-

npm install

# Start Postgres (pgvector) and Redis
docker compose up -d

# Apply schema
npx prisma migrate dev --name init

# Seed 6 months of historical data + all master records
npm run seed

# Start dev server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000). Log in with any credential from the table above.

### Environment Variables

```env
DATABASE_URL=postgresql://ecosphere:ecosphere@localhost:5432/ecosphere
REDIS_URL=redis://localhost:6379
SESSION_SECRET=your-32-char-secret-here
```

---

## Design System

**"Phosphorescent Sustainability"** — UI elements feel lit from within, like bioluminescent organisms.

| Token | Value | Usage |
|---|---|---|
| `--bg-base` | `#0a0f0d` | Full viewport background |
| `--bg-card` | `#0f1f16` | Card surfaces |
| `--accent` | `#39ff8a` | Primary accent — scores, XP, highlights |
| `--danger` | `#ff4d4d` | Anomalies, overdue issues |
| `--warning` | `#f5a623` | Medium severity, pending states |

**Typography:** Space Grotesk (headings) · Inter (body) · JetBrains Mono (all numerical data, tabular-nums)

**Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` everywhere — one curve, no exceptions.

---

## Known Limitations & Next Steps

- **AI Copilot**: Embedding pipeline is wired to pgvector; the LLM call layer needs an API key configured (`OPENAI_API_KEY` or compatible endpoint)
- **Score Simulator**: UI designed, computation hook ready — needs the scoring engine endpoint connected
- **Real-time updates**: WebSocket layer for live leaderboard reorder is designed but not implemented; currently polling
- **Mobile**: Responsive layout with bottom tab bar on mobile is implemented; drag-and-drop Kanban degrades to tap-to-move on touch

---

*EcoSphere — making sustainability measurable, explainable, and engaging.*
