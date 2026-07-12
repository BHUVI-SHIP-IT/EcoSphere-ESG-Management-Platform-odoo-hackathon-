# EcoSphere 🌍

> **An Intelligent ESG Management & Gamification Platform**
> Built for the Odoo Hackathon

EcoSphere is a comprehensive, data-driven ESG (Environmental, Social, and Governance) management platform designed to transform how organizations track, improve, and report their sustainability metrics. Going beyond static dashboards, EcoSphere natively integrates with ERP data, gamifies employee participation, and leverages AI to provide actionable insights.

---

## 🚀 The Proposed Solution

Current ESG reporting is often retroactive, manual, and disconnected from daily operations. EcoSphere solves this by embedding ESG directly into the organizational workflow:

### 1. The Core Scoring Engine
At the heart of EcoSphere is a deterministic, pure scoring function that takes raw records and weights them into E, S, and G pillar scores. These roll up into Department Totals and an Overall Company Score. Because it is a pure function over snapshots (cached via Redis), scores are inherently **explainable and drillable**.

### 2. The Three Pillars
- **Environmental**: Automatically calculates CO₂e emissions by pulling directly from ERP modules (Purchasing, Manufacturing, Expense, Fleet) and applying real-time emission factors.
- **Social**: Tracks and manages Corporate Social Responsibility (CSR) initiatives. Employees can participate in activities, upload proof, and get manager approvals natively in the app.
- **Governance**: A centralized board for policy distribution, mandatory acknowledgements, audit trails, and compliance issue tracking.

### 3. Gamification Engine
Sustainability requires cultural buy-in. EcoSphere introduces an XP-based gamification system:
- **Challenges**: Employees complete eco-challenges (e.g., "Bike to Work Week").
- **Rewards & Badges**: Automatic badge awards and a redeemable XP ledger system.
- **Leaderboards**: Department vs. Department score comparisons to foster healthy competition.

---

## ✨ Novelty & Uniqueness

EcoSphere stands out by bringing enterprise-grade intelligence to sustainability tracking.

### 🧠 Real-Time RAG Copilot
Instead of generic AI chatbots or batch-synced data, EcoSphere features an AI Copilot that **indexes on write**. Every Policy, Audit, and Compliance Issue is instantly embedded into `pgvector` upon creation. The Copilot stays grounded in live, highly specific organizational data, answering questions like *"What is our policy on fleet vehicle emissions?"* with pinpoint accuracy.

### 🔮 Score Simulator
Because the scoring engine is a pure function, EcoSphere enables a "Score Simulator." Managers and executives can preview the exact ESG score impact of a hypothetical change (e.g., *"If we transition 20% of our fleet to EVs, how does that impact our Environmental score next quarter?"*). 

### 🚨 AI Anomaly Detection
Using historical carbon data, the system automatically calculates z-scores to flag anomalies. If a manufacturing plant suddenly reports a 300% spike in energy usage, the anomaly detection engine instantly surfaces this to ESG managers for immediate mitigation.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS v4, Shadcn UI
- **Backend**: Node.js, Prisma ORM
- **Database**: PostgreSQL (with `pgvector` for AI embeddings)
- **Caching**: Redis (Score snapshot caching)
- **AI**: Embeddings & RAG orchestration for the Copilot
- **Infrastructure**: Docker Compose (for seamless local orchestration of PG+pgvector, Node, Next, Redis)

## 📦 Running Locally (Phase 0)

Ensure you have Docker and Docker Compose installed.

```bash
# Clone the repository
git clone https://github.com/BHUVI-SHIP-IT/EcoSphere-ESG-Management-Platform-odoo-hackathon-.git
cd ecosphere

# Install dependencies
npm install

# Start the Docker Compose stack (Postgres + Redis)
docker-compose up -d

# Run Prisma migrations & seed the database with mock historical data
npx prisma migrate dev
npx prisma db seed

# Start the development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to access the platform.
