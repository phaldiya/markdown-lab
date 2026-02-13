import { expect, test } from '@playwright/test';

test.describe('Visual regression', () => {
  test('split view default', async ({ page }) => {
    await page.goto('#/split');
    await page.waitForTimeout(1000);
    await expect(page).toHaveScreenshot('split-view-default.png');
  });

  test('view mode', async ({ page }) => {
    await page.goto('#/view');
    await page.waitForTimeout(1000);
    await expect(page).toHaveScreenshot('view-mode.png');
  });

  test('dark mode', async ({ page }) => {
    await page.goto('#/split');
    await page.getByRole('button', { name: /dark mode/i }).click();
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot('dark-mode.png');
  });
});
