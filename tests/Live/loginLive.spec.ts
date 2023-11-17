import { test, expect } from '@playwright/test';

test.use({
    viewport: { width: 1920, height: 944 },
});

test('Login', async ({ page }) => {

    // Go to Staging - Sales Connection
    await page.goto('https://salesconnection.my/');

    // Login page - enter email and password
    await page.getByRole('button', { name: '' }).click();
    await page.getByRole('link', { name: 'User loginLogin' }).click();
    await page.locator('input[type="text"]').click();
    await page.locator('input[type="text"]').fill('nasution.kagami@gmail.com');
    await page.locator('input[name="password"]').click();
    await page.locator('input[name="password"]').fill('Yonaka1928');
    await page.getByRole('button', { name: 'Login' }).click();
    // Login Ends

    // Confirm the title of the page is "Activity Schedule"
    await expect(page).toHaveTitle(/Activity Schedule/);
});