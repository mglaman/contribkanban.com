import { test, expect } from '@playwright/test';

test('logs in and shows me Me page', async ({ page }) => {
  await page.goto('/login');
  
  await page.getByLabel('Email Address *').fill('logintest@example.com');
  await page.getByLabel('Password *').fill('letmein');
  
  await page.getByRole('button', { name: 'Sign In' }).click();

  // Wait for redirect to Me page and check if it shows the user info
  await expect(page.locator('text=logintest@example.com')).toBeVisible({ timeout: 10000 });
});
