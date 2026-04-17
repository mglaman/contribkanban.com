import { test, expect } from '@playwright/test';

test('logs in and shows me Me page', async ({ page }) => {
  await page.goto('/login');
  
  await page.fill('label:has-text("Email Address *")', 'logintest@example.com');
  await page.fill('label:has-text("Password *")', 'letmein');
  
  await page.click('button:has-text("Sign In")');

  // Wait for redirect to Me page and check if it shows the user info
  await expect(page.locator('text=logintest@example.com')).toBeVisible({ timeout: 10000 });
});
