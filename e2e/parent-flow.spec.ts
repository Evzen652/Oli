import { test, expect } from '@playwright/test';

// Rodičovský flow — veřejná část (bez reálného loginu; autentizovanou logiku
// kryjí integrační testy hooks-supabase: useProfile/useChildren/useUserRole).
test.describe('Rodičovský flow — veřejné (bez loginu)', () => {
  test('registrační formulář má e-mail, heslo, tlačítko i benefity', async ({ page }) => {
    await page.goto('/auth?mode=register');
    await expect(page.getByLabel('E-mail')).toBeVisible();
    await expect(page.getByLabel('Heslo')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Vyzkoušet 14 dní zdarma' })).toBeVisible();
    await expect(page.getByText('Prvních 14 dní zdarma, bez platební karty.')).toBeVisible();
  });

  test('zapomenuté heslo — stránka se zobrazí', async ({ page }) => {
    await page.goto('/auth/forgot-password');
    await expect(page).toHaveURL(/forgot-password/);
    await expect(page.getByLabel('E-mail')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Odeslat odkaz' })).toBeVisible();
  });

  test('CTA „Zdarma" v ceníku vede na registraci (ne login) [F1]', async ({ page }) => {
    await page.goto('/');
    // Hero „Začít zdarma" míří na anonymní onboarding (kryje landing.spec.ts);
    // tenhle test hlídá druhé CTA — plán Zdarma v ceníku → registrace rodiče.
    await page.locator('#ceny').getByRole('button', { name: 'Začít zdarma' }).click();
    await expect(page).toHaveURL(/mode=register/);
    await expect(page.getByRole('button', { name: 'Vyzkoušet 14 dní zdarma' })).toBeVisible();
  });

  test('/parent bez přihlášení není přístupný (404)', async ({ page }) => {
    await page.goto('/parent');
    // Nepřihlášenému router ukazuje NotFound. Dřív to byl tichý redirect na
    // landing — ten schovával rozbitý odkaz, proto se obě větve sjednotily na 404.
    await expect(page.getByText('Stránka nebyla nalezena')).toBeVisible();
  });
});
