# AllThingsMerch — Supabase Setup & Database Architecture Guide

AllThingsMerch is engineered with a **Dual-Mode Architecture**:
1. **Demo Mode (Zero-Config Default)**: Operates seamlessly in-memory and via `localStorage` out of the box so collectors, designers, and testers can test full shopping and verification flows without needing external database credentials.
2. **Supabase Mode (Live Production)**: Connects to PostgreSQL via Supabase with full Row Level Security (RLS) policies, relational licensing royalty snapshots, and cryptographic 1-to-1 serial TAG registration.

---

## 1. Creating Your Supabase Project

1. Visit [Supabase Dashboard](https://app.supabase.com/) and click **New Project**.
2. Select your Organization, enter project name (`AllThingsMerch`), and choose a secure database password.
3. Select a region close to your primary collectors (e.g., Southeast Asia — Singapore).
4. Wait for database provisioning (~2 minutes).

---

## 2. Configuring Environment Variables

Copy `.env.example` to `.env.local` and configure your credentials:

```bash
cp .env.example .env.local
```

In `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Once these variables are set, `getRepository()` (`src/lib/repositories/index.ts`) automatically switches from `demo` mode to `supabase` mode.

---

## 3. Running SQL Migrations & Seed Data

### Option A: Using Supabase CLI (Recommended)

Make sure you have installed [Supabase CLI](https://supabase.com/docs/guides/cli):

```bash
# Login to Supabase CLI
supabase login

# Link your local repo to your remote project
supabase link --project-ref your-project-id

# Push schema migrations (0001_initial_schema.sql, 0002_rls_policies.sql)
supabase db push

# Seed initial brands, categories, contracts, products, and variants
psql -h aws-0-ap-southeast-1.pooler.supabase.com -p 6543 -U postgres.your-project-id -d postgres -f supabase/seed.sql
```

### Option B: Using Supabase SQL Editor (Dashboard)

1. Open your project on the Supabase Dashboard -> **SQL Editor** -> **New Query**.
2. Copy the contents of `supabase/migrations/0001_initial_schema.sql` and click **Run**.
3. Open a New Query, copy the contents of `supabase/migrations/0002_rls_policies.sql` and click **Run**.
4. Open a New Query, copy the contents of `supabase/seed.sql` and click **Run**.

---

## 4. Database Schema Summary

| Table | Purpose | Key RLS Policy |
| :--- | :--- | :--- |
| `brands` | Official licensed partner brands (Red Bull, Ferrari, KAWS) | Public read (`is_active = true`) |
| `categories` | Hierarchical merchandise categories | Public read |
| `license_holders` | Legal corporate entities holding IP licenses | Admin only |
| `license_contracts` | Royalty percentages and contract periods | Admin only |
| `products` & `product_variants` | Apparel, collectibles, and SKU inventory | Public read (`status = active`) |
| `orders` & `order_items` | Customer order records and snapshot pricing | Customer read/write own orders |
| `authenticity_tags` | 1-to-1 unique serial code per fulfilled item | Public read for verification |
| `royalty_transactions` | Automated licensing royalty ledger entries | Admin / License Holder read |
