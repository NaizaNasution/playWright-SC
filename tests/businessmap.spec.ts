import { test, expect } from '@playwright/test';

test.use({
    viewport: { width: 1920, height: 944 },
});

test('Click Assisted Checkout button', async ({ page }) => {

    // Go to Sales Connection
    await page.goto('https://staging.salesconnection.my/');

    // Login Starts
    await page.locator('#nav-menu-container').getByRole('link', { name: 'User loginLogin' }).click();
    await page.locator('input[type="text"]').click();
    await page.locator('input[type="text"]').fill('testeroftsushima@gmail.com');
    await page.locator('input[name="password"]').click();
    await page.locator('input[name="password"]').fill('Yonaka1928');
    await page.getByRole('button', { name: 'Login' }).click();
    // Login Ends

    // Go to the Business Map - Overview
    await page.locator('.cursor-pointer').first().click();
    await page.getByRole('link', { name: '+ Business Map –' }).click();
    await page.getByRole('link', { name: 'Overview' }).click();

    //Click on the Assisted Checkout button
    await page.getByRole('button', { name: 'Assisted Check-out' }).click();
    await page.getByRole('button', { name: 'OK' }).click();

})