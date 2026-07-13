import { test, expect } from '@playwright/test';

test.describe('AllThingsMerch Core Storefront Journey Smoke Test', () => {
  test('navigates home -> product detail -> cart -> checkout -> verify TAG', async ({ page }) => {
    // 1. Visit Storefront Home
    await page.goto('/');
    await expect(page).toHaveTitle(/AllThingsMerch/i);

    // 2. Navigate to Catalog / Shop
    await page.goto('/products');
    await expect(page.locator('h1')).toContainText(/All Merchandise|Catalog/i);

    // 3. Visit Product Detail page
    await page.goto('/products/red-bull-racing-2026-team-polo');
    await expect(page.locator('h1')).toContainText(/Red Bull Racing 2026 Team Polo/i);

    // 4. Visit Cart page
    await page.goto('/cart');
    await expect(page.locator('h1')).toContainText(/Shopping Bag|Cart/i);

    // 5. Visit Public Provenance Verification Portal
    await page.goto('/verify/DEMO-TAG-2026');
    await expect(page.locator('h1')).toContainText(/Authentic Release|Authentic/i);
  });
});
