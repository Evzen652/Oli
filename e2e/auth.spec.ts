import { test, expect } from '@playwright/test';

test.describe('Auth — rodičovský login/registrace', () => {
  test('login stránka se zobrazí', async ({ page }) => {
    await page.goto('/auth');
    await expect(page.getByText('Přihlášení')).toBeVisible();
    await expect(page.getByLabel('E-mail')).toBeVisible();
    await expect(page.getByLabel('Heslo')).toBeVisible();
  });

  test('mode=register zobrazí registraci rodiče', async ({ page }) => {
    await page.goto('/auth?mode=register');
    await expect(page.getByText('Registrace rodiče')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Vyzkoušet 14 dní zdarma' })).toBeVisible();
    await expect(page.getByText('Prvních 14 dní zdarma, ať víte, do čeho jdete.')).toBeVisible();
  });

  test('email pole je prázdné (žádná dev data)', async ({ page }) => {
    await page.goto('/auth');
    await expect(page.getByLabel('E-mail')).toHaveValue('');
  });

  test('přepínání login ↔ registrace funguje', async ({ page }) => {
    await page.goto('/auth');
    await page.getByRole('button', { name: 'Vytvořit nový účet' }).click();
    await expect(page.getByRole('button', { name: 'Vyzkoušet 14 dní zdarma' })).toBeVisible();
    await page.getByRole('button', { name: /Už mám účet/ }).click();
    // „Přihlásit se" je na stránce 3× (nav, dlaždice žáka, submit) → locator
    // musí mířit na submit ve formuláři, jinak spadne na strict mode.
    await expect(page.locator('form').getByRole('button', { name: 'Přihlásit se' })).toBeVisible();
  });

  test('žák bez kódu vidí vysvětlení', async ({ page }) => {
    await page.goto('/auth/child');
    await expect(page.getByText('6místný kód')).toBeVisible();
  });
});
