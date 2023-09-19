import { test, expect } from '@playwright/test';

test.use({
    viewport: { width: 1920, height: 944 },
});

test('has column displays', async ({ page }) => {
    // Go to Sales Connection - Login
    await page.goto('https://salesconnection.my/login');

    // Login Starts
    await page.locator('input[type="text"]').click();
    await page.locator('input[type="text"]').fill('josephstealean1@yopmail.com');
    await page.locator('input[name="password"]').click();
    await page.locator('input[name="password"]').fill('Yonaka1928!');
    await page.getByRole('button', { name: 'Login' }).click();
    // Login Ends
    
    /* Access Customer List
    await page.locator('.cursor-pointer').first().click();
    await page.getByRole('link', { name: 'Organization List' }).click();
    */

    // Open the Customer
    await page.goto('https://salesconnection.my/customerdetails/246350');

    // Open Project Console
    await page.getByRole('link', { name: 'Contract' }).click();

    // Switch to Table View
    await page.getByRole('button', { name: 'Table View' }).click();

    // Open the Display Column modal
    await page.getByText('Default Columns').click();

    // Open the Edit Columns modal
    await page.locator('.border-100 > span:nth-child(3)').click();

    // Assertion #1 - There is column called "Contract Description"
    const locator_contractDescription = page.getByText('Contract Description');
    await expect(locator_contractDescription).toHaveText('Contract Description');
  });