import { test, expect, type Page } from '@playwright/test';

// Projde reálným anon onboardingem (nastaví trial v localStorage správně přes startTrial).
async function startAnonTrial(page: Page, grade = 3) {
  await page.goto('/onboarding');
  await page.getByRole('button', { name: String(grade), exact: true }).click();
  await page.waitForURL(/\/student/, { timeout: 6000 });
}

// Anonymní žákovský flow — celý jde bez přihlášení (trial v localStorage).
test.describe('Žákovský flow — anonymní trial', () => {
  test('onboarding: výběr ročníku → přesměrování na /student', async ({ page }) => {
    await page.goto('/onboarding');
    await expect(page.getByText('Vyber ročník')).toBeVisible();
    await page.getByRole('button', { name: '3', exact: true }).click();
    await page.waitForURL(/\/student/, { timeout: 6000 });
    await expect(page).toHaveURL(/\/student/);
  });

  test('anon dashboard ukazuje trial banner (Den X)', async ({ page }) => {
    await startAnonTrial(page, 3);
    await expect(page.getByText(/Den \d/)).toBeVisible({ timeout: 5000 });
  });

  test('anon dashboard je interaktivní (lze spustit procvičování)', async ({ page }) => {
    await startAnonTrial(page, 3);
    await expect(page.getByText(/Den \d/)).toBeVisible({ timeout: 5000 });
    // Dashboard nabízí akce (denní úkoly / vlastní téma) → existují klikací prvky
    expect(await page.getByRole('button').count()).toBeGreaterThan(0);
  });
});
