import { test, expect } from '@playwright/test';

test.describe('Auth stránka', () => {
  test('login stránka se zobrazí správně', async ({ page }) => {
    await page.goto('/auth');
    await expect(page.getByText('Přihlášení')).toBeVisible();
    await expect(page.getByText('Jsem rodič')).toBeVisible();
    await expect(page.getByText('Jsem žák')).toBeVisible();
  });

  test('mode=register zobrazí registraci', async ({ page }) => {
    await page.goto('/auth?mode=register');
    await expect(page.getByRole('button', { name: /Registrovat/i })).toBeVisible();
  });

  test('email pole je prázdné (žádná dev data)', async ({ page }) => {
    await page.goto('/auth');
    const emailInput = page.getByLabel('E-mail');
    await expect(emailInput).toHaveValue('');
  });

  test('žák bez kódu vidí vysvětlení', async ({ page }) => {
    await page.goto('/auth/child');
    await expect(page.getByText('6místný kód')).toBeVisible();
  });
});
