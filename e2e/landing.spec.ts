import { test, expect } from '@playwright/test';

test.describe('Landing page', () => {
  test('zobrazí se správně', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Zvládnete školu')).toBeVisible();
    await expect(page.getByText('Začít zdarma')).toBeVisible();
    await expect(page.getByText('Vyzkoušet demo')).toBeVisible();
  });

  test('"Začít zdarma" vede na registraci', async ({ page }) => {
    await page.goto('/');
    await page.getByText('Začít zdarma').click();
    await expect(page).toHaveURL(/auth\?mode=register/);
  });

  test('"Vyzkoušet demo" vede na /demo', async ({ page }) => {
    await page.goto('/');
    await page.getByText('Vyzkoušet demo').click();
    await expect(page).toHaveURL(/\/demo/);
  });
});
