import { expect, test } from '@playwright/test';

test.describe('Navigation', () => {
  test('loads split view by default', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/#\/split/);
  });

  test('navigates to view mode', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'View' }).click();
    await expect(page).toHaveURL(/#\/view/);
  });

  test('navigates to edit mode', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Edit' }).click();
    await expect(page).toHaveURL(/#\/edit/);
  });

  test('navigates to split mode', async ({ page }) => {
    await page.goto('#/view');
    await page.getByRole('link', { name: 'Split' }).click();
    await expect(page).toHaveURL(/#\/split/);
  });

  test('shows header with title', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('header h1')).toContainText('Markdown Lab');
  });

  test('toggles dark mode', async ({ page }) => {
    await page.goto('/');
    const darkBtn = page.getByRole('button', { name: /dark mode|light mode/i });
    await darkBtn.click();
    await expect(page.locator('html')).toHaveClass(/dark/);
    await darkBtn.click();
    await expect(page.locator('html')).not.toHaveClass(/dark/);
  });

  test('shows status bar with word count', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('footer')).toContainText('words');
  });
});
