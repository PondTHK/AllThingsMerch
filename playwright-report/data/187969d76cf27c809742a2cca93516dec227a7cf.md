# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: smoke.spec.ts >> AllThingsMerch Core Storefront Journey Smoke Test >> navigates home -> product detail -> cart -> checkout -> verify TAG
- Location: tests/e2e/smoke.spec.ts:4:7

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('h1')
Expected pattern: /Curated Catalog|Catalog/i
Received string:  "All Merchandise"
Timeout: 5000ms

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('h1')
    14 × locator resolved to <h1 class="text-3xl sm:text-5xl font-black text-black">All Merchandise</h1>
       - unexpected value "All Merchandise"

```

```yaml
- heading "All Merchandise" [level=1]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('AllThingsMerch Core Storefront Journey Smoke Test', () => {
  4  |   test('navigates home -> product detail -> cart -> checkout -> verify TAG', async ({ page }) => {
  5  |     // 1. Visit Storefront Home
  6  |     await page.goto('/');
  7  |     await expect(page).toHaveTitle(/AllThingsMerch/i);
  8  | 
  9  |     // 2. Navigate to Catalog / Shop
  10 |     await page.goto('/products');
> 11 |     await expect(page.locator('h1')).toContainText(/Curated Catalog|Catalog/i);
     |                                      ^ Error: expect(locator).toContainText(expected) failed
  12 | 
  13 |     // 3. Visit Product Detail page
  14 |     await page.goto('/products/red-bull-racing-2026-team-polo');
  15 |     await expect(page.locator('h1')).toContainText(/Red Bull Racing 2026 Team Polo/i);
  16 | 
  17 |     // 4. Visit Cart page
  18 |     await page.goto('/cart');
  19 |     await expect(page.locator('h1')).toContainText(/Shopping Bag|Cart/i);
  20 | 
  21 |     // 5. Visit Public Provenance Verification Portal
  22 |     await page.goto('/verify/DEMO-TAG-2026');
  23 |     await expect(page.locator('h1')).toContainText(/Authentic Release|Authentic/i);
  24 |   });
  25 | });
  26 | 
```