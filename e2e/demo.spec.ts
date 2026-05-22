import { test, expect } from '@playwright/test';

test.describe('Demo flow', () => {
  test('demo se otevře bez registrace', async ({ page }) => {
    await page.goto('/demo');
    await expect(page.getByText('Demo')).toBeVisible();
    await expect(page).not.toHaveURL(/\/auth/);
  });

  test('žákovský pohled — tlačítko Začít funguje', async ({ page }) => {
    await page.goto('/demo');
    await page.getByText('Jsem žák').click();
    await page.getByText('Matematika').first().click();
    await expect(page).toHaveURL(/\/demo\/session/);
    await expect(page.getByText('Zkus si to')).toBeVisible({ timeout: 5000 });
  });

  test('žákovský pohled — Začít procvičovat funguje', async ({ page }) => {
    await page.goto('/demo');
    await page.getByText('Jsem žák').click();
    await page.getByRole('button', { name: /Začít procvičovat/ }).click();
    await expect(page).toHaveURL(/\/demo\/session/);
  });
});
