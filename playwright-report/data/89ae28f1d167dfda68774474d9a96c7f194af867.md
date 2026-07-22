# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: checkout-address.spec.ts >> AllThingsMerch E2E Address & Checkout Journey >> registers, adds address, adds item to cart, selects address at checkout
- Location: tests/e2e/checkout-address.spec.ts:4:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /.*account/
Received string:  "http://localhost:3000/register"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    14 × unexpected value "http://localhost:3000/register"

```

```yaml
- text: Official Licensed Merchandise • 1-to-1 Verified Authenticity TAG Included Free Nationwide Shipping on Orders over 3,000 THB
- banner:
  - link "AllThingsMerch":
    - /url: /
  - navigation:
    - link "Home":
      - /url: /
    - link "Shop":
      - /url: /products
    - link "Collection":
      - /url: /collections
    - link "Verify TAG":
      - /url: /verify
  - button "Search products"
  - button "Toggle theme"
  - link "User Account":
    - /url: /account
    - text: Thanakhon
  - link "Shopping Cart":
    - /url: /cart
- main:
  - heading "Create Collector Account" [level=1]
  - paragraph: Register to Track Verified Merch, TAGs & Order History
  - text: Full Name *
  - textbox "Full Name": Thanakhon Collector 53191
  - text: Email Address *
  - textbox "your@email.com": collector-53191@allthingsmerch.demo
  - text: Phone Number
  - textbox "0XX-XXX-XXXX": 089-123-4567
  - text: Password *
  - textbox "••••••••": Password123!
  - text: Confirm Password *
  - textbox "••••••••": Password123!
  - button "Create Account"
  - text: Already Registered?
  - link "Sign In Here":
    - /url: /login
- contentinfo:
  - link "AllThingsMerch":
    - /url: /
  - paragraph: Official licensed merchandise from your favorite Formula 1 teams, music artists, and collectible brands. Every item includes 1-to-1 Verified Authenticity TAG tracking.
  - text: Subscribe to our newsletter
  - textbox "Enter Email..."
  - button "Join"
  - text: Quick Links
  - list:
    - listitem:
      - link "Home":
        - /url: /
    - listitem:
      - link "Shop":
        - /url: /products
    - listitem:
      - link "Collection":
        - /url: /products?category=formula-1
    - listitem:
      - link "Verify Authenticity TAG":
        - /url: /verify
    - listitem:
      - link "Admin Portal":
        - /url: /admin
  - paragraph: © 2026 AllThingsMerch. All rights reserved.
  - text: Official Licensed Platform 1-to-1 TAG Verified
- alert
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('AllThingsMerch E2E Address & Checkout Journey', () => {
  4  |   test('registers, adds address, adds item to cart, selects address at checkout', async ({ page }) => {
  5  |     // 1. Generate unique details
  6  |     const randomNum = Math.floor(Math.random() * 100000);
  7  |     const email = `collector-${randomNum}@allthingsmerch.demo`;
  8  |     const password = 'Password123!';
  9  |     const fullName = `Thanakhon Collector ${randomNum}`;
  10 | 
  11 |     // 2. Register
  12 |     await page.goto('/register');
  13 |     await page.fill('input[placeholder="Full Name"]', fullName);
  14 |     await page.fill('input[placeholder="your@email.com"]', email);
  15 |     await page.fill('input[placeholder="0XX-XXX-XXXX"]', '089-123-4567');
  16 |     await page.fill('input[placeholder="••••••••"] >> nth=0', password);
  17 |     await page.fill('input[placeholder="••••••••"] >> nth=1', password);
  18 |     await page.click('button[type="submit"]');
  19 | 
  20 |     // 3. Verify redirected to Account and then go to Addresses
> 21 |     await expect(page).toHaveURL(/.*account/);
     |                        ^ Error: expect(page).toHaveURL(expected) failed
  22 |     await page.goto('/account/addresses');
  23 | 
  24 |     // 4. Add Address
  25 |     await page.click('button:has-text("Add New Address")');
  26 |     await page.fill('input[placeholder="e.g. Home, Office"]', 'My Office');
  27 |     await page.fill('label:has-text("Recipient Name") + input', fullName);
  28 |     await page.fill('label:has-text("Email") + input', email);
  29 |     await page.fill('label:has-text("Phone Number") + input', '089-765-4321');
  30 |     await page.fill('label:has-text("Street Address") + input', '123 Rama IX Road');
  31 |     await page.fill('label:has-text("City / Province") + input', 'Bangkok');
  32 |     await page.fill('label:has-text("Postal Code") + input', '10310');
  33 |     await page.click('button:has-text("Save Address")');
  34 | 
  35 |     // Wait for the address to appear in the list
  36 |     await expect(page.locator('text=My Office')).toBeVisible();
  37 | 
  38 |     // 5. Navigate to Product Detail and Add to Cart
  39 |     await page.goto('/products/red-bull-racing-2026-team-polo');
  40 |     
  41 |     // Select variant 'M'
  42 |     await page.click('button:has-text("M")');
  43 |     
  44 |     // Add to Cart
  45 |     await page.click('button:has-text("Add to Cart")');
  46 |     await expect(page.locator('text=Added to Shopping Cart')).toBeVisible();
  47 | 
  48 |     // 6. Go to Checkout
  49 |     await page.goto('/checkout');
  50 |     await expect(page).toHaveURL(/.*checkout/);
  51 | 
  52 |     // Verify Address Dropdown is present and prefilled
  53 |     const selectDropdown = page.locator('select');
  54 |     await expect(selectDropdown).toBeVisible();
  55 |     
  56 |     // Confirm the input fields have the populated values
  57 |     await expect(page.locator('label:has-text("Full Name") + input')).toHaveValue(fullName);
  58 |     await expect(page.locator('label:has-text("Street Address") + input')).toHaveValue('123 Rama IX Road');
  59 | 
  60 |     // 7. Change select to "Use New Address" and verify fields are cleared
  61 |     await selectDropdown.selectOption('new');
  62 |     await expect(page.locator('label:has-text("Full Name") + input')).toHaveValue('');
  63 |     await expect(page.locator('label:has-text("Street Address") + input')).toHaveValue('');
  64 |   });
  65 | });
  66 | 
```