import { test, expect } from '@playwright/test';

test.describe('AllThingsMerch E2E Address & Checkout Journey', () => {
  test('registers, adds address, adds item to cart, selects address at checkout', async ({ page }) => {
    // 1. Generate unique details
    const randomNum = Math.floor(Math.random() * 100000);
    const email = `collector-${randomNum}@allthingsmerch.demo`;
    const password = 'Password123!';
    const fullName = `Thanakhon Collector ${randomNum}`;

    // 2. Register
    await page.goto('/register');
    await page.fill('input[placeholder="Full Name"]', fullName);
    await page.fill('input[placeholder="your@email.com"]', email);
    await page.fill('input[placeholder="0XX-XXX-XXXX"]', '089-123-4567');
    await page.fill('input[placeholder="••••••••"] >> nth=0', password);
    await page.fill('input[placeholder="••••••••"] >> nth=1', password);
    await page.click('button[type="submit"]');

    // 3. Verify redirected to Account and then go to Addresses
    await expect(page).toHaveURL(/.*account/);
    await page.goto('/account/addresses');

    // 4. Add Address
    await page.click('button:has-text("Add New Address")');
    await page.fill('input[placeholder="e.g. Home, Office"]', 'My Office');
    await page.fill('label:has-text("Recipient Name") + input', fullName);
    await page.fill('label:has-text("Email") + input', email);
    await page.fill('label:has-text("Phone Number") + input', '089-765-4321');
    await page.fill('label:has-text("Street Address") + input', '123 Rama IX Road');
    await page.fill('label:has-text("City / Province") + input', 'Bangkok');
    await page.fill('label:has-text("Postal Code") + input', '10310');
    await page.click('button:has-text("Save Address")');

    // Wait for the address to appear in the list
    await expect(page.locator('text=My Office')).toBeVisible();

    // 5. Navigate to Product Detail and Add to Cart
    await page.goto('/products/red-bull-racing-2026-team-polo');
    
    // Select variant 'M'
    await page.click('button:has-text("M")');
    
    // Add to Cart
    await page.click('button:has-text("Add to Cart")');
    await expect(page.locator('text=Added to Shopping Cart')).toBeVisible();

    // 6. Go to Checkout
    await page.goto('/checkout');
    await expect(page).toHaveURL(/.*checkout/);

    // Verify Address Dropdown is present and prefilled
    const selectDropdown = page.locator('select');
    await expect(selectDropdown).toBeVisible();
    
    // Confirm the input fields have the populated values
    await expect(page.locator('label:has-text("Full Name") + input')).toHaveValue(fullName);
    await expect(page.locator('label:has-text("Street Address") + input')).toHaveValue('123 Rama IX Road');

    // 7. Change select to "Use New Address" and verify fields are cleared
    await selectDropdown.selectOption('new');
    await expect(page.locator('label:has-text("Full Name") + input')).toHaveValue('');
    await expect(page.locator('label:has-text("Street Address") + input')).toHaveValue('');
  });
});
