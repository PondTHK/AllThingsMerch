# AllThingsMerch System Architecture & Data Model

AllThingsMerch is built with a **Dual-Mode Architecture** designed to execute seamlessly in both standalone local environment (**Instant Demo Mode**) and live production cloud (**Supabase PostgreSQL Mode**).

## 1. High-Level Architecture Overview

```mermaid
graph TD
    Client[Next.js App Router Client / SSR]
    RepoLayer[Repository Factory getRepository]
    DemoRepo[DemoRepository In-Memory + Zustand LocalStorage]
    SupaRepo[SupabaseRepository Cloud PostgreSQL Engine]
    Storefront[Storefront / Catalog / Checkout / Verify]
    AdminPortal[Curator Admin Operations / Inventory / Orders]

    Client --> Storefront
    Client --> AdminPortal
    Storefront --> RepoLayer
    AdminPortal --> RepoLayer
    RepoLayer -->|No Supabase URL| DemoRepo
    RepoLayer -->|NEXT_PUBLIC_SUPABASE_URL Defined| SupaRepo
```

## 2. Entity-Relationship (ER) Schema Diagram

```mermaid
erDiagram
    BRANDS ||--o{ PRODUCTS : issues
    CATEGORIES ||--o{ PRODUCTS : groups
    PRODUCTS ||--|{ PRODUCT_VARIANTS : contains
    PRODUCTS ||--o{ PRODUCT_IMAGES : showcases
    ORDERS ||--|{ ORDER_ITEMS : contains
    ORDERS ||--|| SHIPPING_ADDRESSES : ships_to
    USER_PROFILES ||--o{ ORDERS : places
    USER_PROFILES ||--o{ SAVED_ADDRESSES : stores
    AUTHENTICITY_TAGS ||--|| PRODUCT_VARIANTS : verifies
    LICENSE_HOLDERS ||--o{ LICENSE_CONTRACTS : owns

    PRODUCTS {
        string id PK
        string brand_id FK
        string category_id FK
        string name
        string slug
        string status
        boolean is_preorder
    }
    PRODUCT_VARIANTS {
        string id PK
        string product_id FK
        string sku
        string size
        number price
        number stock_quantity
        number low_stock_threshold
    }
    ORDERS {
        string id PK
        string order_number UK
        string user_id FK
        number total_amount
        string status
    }
    AUTHENTICITY_TAGS {
        string tag_code PK
        string serial_number UK
        string product_id FK
        string status
    }
```

## 3. Core Architectural Principles

1. **Monochrome Editorial Visual System**: Pure high-contrast white and black aesthetic inspired by architectural editorial layouts.
2. **Deterministic & Non-Blocking Demo Execution**: All operations (auth, cart, checkout, admin inventory management, tag verification) execute instantly offline without mandatory external dependencies.
3. **Strict Row Level Security (RLS)**: When connected to Supabase, all database tables enforce fine-grained authentication and authorization policies.
