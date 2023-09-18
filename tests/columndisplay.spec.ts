import { test, expect } from '@playwright/test';

test.use({
    viewport: { width: 1920, height: 944 },
});

test('test', async ({ page }) => {
    // Go to Sales Connection
    await page.goto('https://salesconnection.my/');

    // Login Starts
    await page.locator('#nav-menu-container').getByRole('link', { name: 'User loginLogin' }).click();
    await page.locator('input[type="text"]').click();
    await page.locator('input[type="text"]').fill('nasution.kagami@gmail.com');
    await page.locator('input[name="password"]').click();
    await page.locator('input[name="password"]').fill('Yonaka1928!');
    await page.getByRole('button', { name: 'Login' }).click();
    // Login Ends
    
    // Access Customer List
    await page.locator('.cursor-pointer').first().click();
    await page.getByRole('link', { name: 'Organization List' }).click();

    // Open the Customer
    const page1Promise = page.waitForEvent('popup');
    await page.getByRole('row', { name: 'open_in_new 3 Prototech Resea Harris Schwartz Personal - Petroleum & Ene Harris Schwartz Prototech Research Corp 00451 N/A N/A N/A Personal Active Joseph Stelean' }).locator('i').click();
    const page1 = await page1Promise;

    // Click on the Project Console tab
    await page1.getByRole('link', { name: 'Contract' }).click();

    // Switch to Table View
    await page1.getByRole('button', { name: 'Table View' }).click();

    // Open the Columns Display modal
    await page1.getByText('Default Columns').click();
    await page1.getByRole('button', { name: ' Create' }).click();
  });