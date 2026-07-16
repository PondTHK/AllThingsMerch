# Project: AllThingsMerch Class Diagram Update

## Architecture
This project aligns the Class Diagram in `README.md` (section 7.5) with the actual TypeScript types/interfaces and Zustand stores in the codebase.
The diagram references the following components:
1. `Repository`, `DemoRepository`, `SupabaseRepository` implementing `DataRepository` interface in `src/repositories/index.ts`
2. `useCartStore` implementing `CartState` in `src/stores/useCartStore.ts`
3. `useAdminStore` implementing `AdminState` in `src/stores/useAdminStore.ts`
4. Model classes: `Product`, `ProductVariant`, `Order`, `OrderItem`, `StockMovement`, `AuthenticityTag`, `Coupon` defined in `src/types/index.ts` and `src/types/stock.ts`

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|---|---|-------------|--------|
| 1 | Exploration & Analysis | Scan source code and compare with the class diagram to find all mismatches | None | DONE |
| 2 | Diagram Update | Edit the Class Diagram in README.md to fix function names, parameters, types, and fields | 1 | DONE |
| 3 | Verification & Review | Verify diagram alignment and run forensic integrity audit | 2 | DONE |

## Interface Contracts
- `README.md` Section 7.5 contains a Mermaid class diagram. The syntax must be valid Mermaid.
- The diagram must reflect the exact fields, methods, parameters, and types from the source code, but using UML type names (e.g. `string`, `number` rather than TS-specific types).
