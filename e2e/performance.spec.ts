import { test, expect } from '@playwright/test';

test.describe('Výkon', () => {
  test('landing page se načte do 3s', async ({ page }) => {
    const start = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(3000);
  });

  test('demo se načte do 3s', async ({ page }) => {
    const start = Date.now();
    await page.goto('/demo');
    await page.waitForLoadState('networkidle');
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(3000);
  });

  test('žádné console errory na landing page', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(errors).toHaveLength(0);
  });

  test('žádné console errory v demu', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.goto('/demo');
    await page.waitForLoadState('networkidle');
    expect(errors).toHaveLength(0);
  });
});
