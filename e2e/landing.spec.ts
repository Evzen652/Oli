import { test, expect } from '@playwright/test';

test.describe('Landing page', () => {
  test('zobrazí se správně', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: 'Začít zdarma' }).first()).toBeVisible();
  });

  test('"Začít zdarma" (hero) vede na anon onboarding', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Začít zdarma' }).first().click();
    await expect(page).toHaveURL(/\/onboarding/);
  });
});
