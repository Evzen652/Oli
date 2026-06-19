import { test, expect } from '@playwright/test';

// Rodičovský flow — veřejná část (bez reálného loginu; autentizovanou logiku
// kryjí integrační testy hooks-supabase: useProfile/useChildren/useUserRole).
test.describe('Rodičovský flow — veřejné (bez loginu)', () => {
  test('registrační formulář má e-mail, heslo, tlačítko i benefity', async ({ page }) => {
    await page.goto('/auth?mode=register');
    await expect(page.getByLabel('E-mail')).toBeVisible();
    await expect(page.getByLabel('Heslo')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Vytvořit účet' })).toBeVisible();
    await expect(page.getByText('14 dní zdarma')).toBeVisible();
  });

  test('zapomenuté heslo — stránka se zobrazí', async ({ page }) => {
    await page.goto('/auth/forgot-password');
    await expect(page).toHaveURL(/forgot-password/);
    await expect(page.getByLabel('E-mail')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Odeslat odkaz' })).toBeVisible();
  });

  test('nav „Registrace zdarma" vede na registraci (ne login) [F1]', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Registrace zdarma' }).first().click();
    await expect(page.getByRole('button', { name: 'Vytvořit účet' })).toBeVisible();
  });

  test('/parent bez přihlášení není přístupný (redirect na landing)', async ({ page }) => {
    await page.goto('/parent');
    // Nepřihlášený router přesměruje pryč z /parent na landing.
    await page.waitForURL((url) => !url.pathname.startsWith('/parent'), { timeout: 6000 });
    expect(page.url()).not.toContain('/parent');
  });
});
