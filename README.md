# AllThingsMerch — Premium Editorial Merchandising & Provenance Platform

AllThingsMerch is a state-of-the-art e-commerce, licensing, and cryptographic provenance platform engineered for officially licensed merchandise drops (Formula 1 teams, artist tours, and limited-edition art collectibles).

Featuring an editorial **Monochrome White/Black design system** and a seamless **Dual-Mode Repository Architecture**, AllThingsMerch executes instantly offline in standalone **Demo Mode** or connects directly to **Supabase PostgreSQL** for enterprise production deployments.

---

## 1. Key Architectural Capabilities

- **Dual-Mode Execution Engine (`getRepository()`)**: Automatically switches between deterministic in-memory/Zustand storage (`DemoRepository`) and live cloud database queries (`SupabaseRepository`) based on `.env.local`.
- **Editorial Monochrome UI/UX**: Zero-clutter high-contrast typography and layout system.
- **1-to-1 Cryptographic Provenance Registry**: Every fulfilled merchandise piece is issued an exclusive public serial code (`/verify/[tagCode]`) verifying licensing authenticity.
- **Curator Admin Control Center (`/admin`)**: Operations portal for product releases, SKU stock replenishment, order status updates, and IP licensing contracts.

---

## 2. Completed Engineering Milestones

- **Milestone 1 — Project Foundation**: Next.js 16 App Router, TypeScript strict configuration, Tailwind CSS, ESLint, Vitest, and Conventional Commits workflow.
- **Milestone 2 — Design System & Storefront Shell**: Monochrome White/Black editorial aesthetic, responsive navigation (`Header`, `Footer`), and brand collections.
- **Milestone 3 — Product Catalog & Variant Selection**: Dynamic catalog filtering (`/products`), SKU variant selector, low-stock threshold badges, and accordion specifications.
- **Milestone 4 — Shopping Bag & Checkout Engine**: Persistent Zustand cart (`useCartStore`), discount coupon engine (`F1WELCOME`), THB money formatting, and simulated instant order fulfillment.
- **Milestone 5 — Supabase Schema & Security Architecture**: Complete 13-table PostgreSQL schema (`supabase/migrations/`), Row Level Security (RLS) policies, and seed data (`supabase/seed.sql`).
- **Milestone 6 — Customer Authentication & Account Management**: Instant 1-click Demo Collector / Admin login, protected account portal (`/account`), address book, and order history inspection.
- **Milestone 7 — Curator Admin Operations Portal**: Role-protected dashboard (`/admin`), product catalog release management, SKU inventory controller, and customer fulfillment tracking.
- **Milestone 8 — 1-to-1 Authenticity TAG Verification**: Cryptographic serial registry (`/verify`), public verification certificates (`/verify/[tagCode]`), and Admin TAG audit ledger.
- **Milestone 9 — Quality Assurance, E2E Tests & Architecture Documentation**: Vitest unit test suite (7 files, 22 tests), Playwright smoke journey (`tests/e2e/smoke.spec.ts`), GitHub Actions CI pipeline (`.github/workflows/ci.yml`), and architecture documentation (`docs/ARCHITECTURE.md`).

---

## 3. Quickstart Guide (Local Execution)

### Option A: Instant Offline Demo Mode (Default)
No external database or API keys required. All state persists across browser reloads via local storage.

```bash
# 1. Install Node.js dependencies
npm install

# 2. Run local development server
npm run dev
```

Visit `http://localhost:3000`. Use **Instant Demo Login** in the Account or Admin portal to switch between `customer` (`collector@allthingsmerch.demo`) and `admin` (`admin@allthingsmerch.demo`).

### Option B: Cloud Supabase Mode
Connects to live PostgreSQL database tables with Row Level Security.

1. Copy `.env.example` to `.env.local` and populate credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
2. Execute SQL migrations in Supabase SQL Editor:
   - `supabase/migrations/0001_initial_schema.sql`
   - `supabase/migrations/0002_rls_policies.sql`
3. Execute seed script:
   - `supabase/seed.sql`

---

## 4. Verification & Testing Commands

```bash
# Run ESLint check
npm run lint

# Run TypeScript type check
npm run typecheck

# Run Vitest unit test suite (22 tests across 7 suites)
npm run test

# Build production optimized bundle
npm run build
```

---

## 5. Directory Structure

```text
├── docs/
│   └── ARCHITECTURE.md          # Architecture overview & ER diagrams
├── src/
│   ├── app/                     # Next.js App Router routes (/products, /cart, /checkout, /account, /admin, /verify)
│   ├── components/              # Reusable UI components & navigation
│   ├── lib/                     # Core business logic, repositories, auth, cart, admin, and authenticity engines
│   └── types/                   # TypeScript interfaces & domain models
├── supabase/
│   ├── migrations/              # SQL schema definitions and RLS policies
│   └── seed.sql                 # Sample brand, category, product, and variant records
└── tests/
    ├── unit/                    # Vitest test suites (money, catalog, checkout, auth, admin, authenticity, repository)
    └── e2e/                     # Playwright user journey smoke test
```
