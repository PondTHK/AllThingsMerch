# AllThingsMerch

**AllThingsMerch** is a full-stack e-commerce web application for licensed merchandise and collectibles (Formula 1 apparel, music artists, football clubs, and collectibles), inspired by modern collector marketplaces.

Built as a digital platform portfolio project demonstrating full-stack development, authenticity verification tags (Authenticity TAG), and royalty calculations.

---

## 1. Problem Statement & Key Features

- **Licensed Merchandise Storefront**: E-commerce storefront with product variants, search, filtering, and responsive design.
- **Authenticity TAG Verification**: 1-to-1 item verification system issuing unique public codes and serial numbers for fulfilled merchandise.
- **Royalty Tracking & Reporting**: Snapshot calculation of licensing royalties per order item and royalty contract reporting.
- **Demo Mode**: Fully operable in local demo mode even without an external Supabase database connection.

---

## 2. Tech Stack

- **Core**: Next.js (App Router), React 19, TypeScript (Strict)
- **Styling**: Tailwind CSS
- **Database & Auth**: Supabase PostgreSQL, Row Level Security (RLS), Supabase Auth
- **State & Forms**: Zustand, React Hook Form, Zod
- **Testing & Quality**: Vitest, ESLint

---

## 3. Getting Started

### Prerequisites
- Node.js >= 18.x
- npm >= 9.x

### Installation

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Copy environment template:
   ```bash
   cp .env.example .env.local
   ```
   *(Demo mode works out of the box even if Supabase variables are left blank)*

3. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 4. Database & Supabase Setup

For detailed instructions on provisioning your Supabase project, executing PostgreSQL schema migrations (`0001_initial_schema.sql`, `0002_rls_policies.sql`), seeding data (`seed.sql`), and configuring live database mode, please refer to:
👉 **[SUPABASE_SETUP.md](file:///Users/thanakron/Documents/GitHub/AllThingsMerch/SUPABASE_SETUP.md)**

---

## 5. Available Scripts

- `npm run dev` — Run development server
- `npm run build` — Create production build
- `npm run start` — Run production server
- `npm run lint` — Run ESLint check
- `npm run typecheck` — Run TypeScript type checking (`tsc --noEmit`)
- `npm run test` — Run Vitest unit tests

---

## 6. Development Milestones

- **Milestone 1**: Project Foundation (Next.js, TypeScript, Tailwind, ESLint, Scripts, Unit Testing setup)
- **Milestone 2**: Design System & Storefront Shell
- **Milestone 3**: Product Catalog & Variant Selection
- **Milestone 4**: Shopping Cart & Mock Checkout
- **Milestone 5**: Supabase Schema & Seed Data
- **Milestone 6**: Customer Authentication & Account Management
- **Milestone 7**: Admin Dashboard & Inventory Management
- **Milestone 8**: Authenticity TAG Verification & Royalty Reporting
- **Milestone 9**: Quality Assurance, End-to-End Tests & Documentation
