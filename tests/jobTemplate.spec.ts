import { test, expect } from '@playwright/test';

test.use({
    viewport: { width: 1920, height: 944 },
});

test('Set Prepopulate Assigned Users', async ({ page }) => {
    // Go to Sales Connection - Login
    await page.goto('https://staging.salesconnection.my/login');

    // Login Starts
    await page.locator('input[type="text"]').click();
    await page.locator('input[type="text"]').fill('testeroftsushima@gmail.com');
    await page.locator('input[name="password"]').click();
    await page.locator('input[name="password"]').fill('Yonaka1928');
    await page.getByRole('button', { name: 'Login' }).click();
    // Login Ends

    // Access Job Template Settings page
    await page.goto('https://staging.salesconnection.my/templateSettings/ActivityTemplates');

    // Change to Ad-Hoc Category
    await page.getByRole('button', { name: 'Meeting/Discussion' }).click();
    await page.locator('a').filter({ hasText: 'Ad-Hoc' }).click();

    // Add the users
    await page.getByRole('button', { name: 'person_add Add Users' }).click();
    await page.getByText('Naiza NasutionStaff').click();
    await page.getByText('Nathan McDonaldStaff').click();
    await page.getByRole('button', { name: 'Save' }).click();

    // Save Template
    await page.locator('#ASX3-save i').click();
    await page.getByRole('button', { name: 'OK' }).click();
    await page.reload();

    // Back to Ad-Hoc Category
    await page.getByRole('button', { name: 'Meeting/Discussion' }).click();
    await page.locator('a').filter({ hasText: 'Ad-Hoc' }).click();

    // Declare the Locators
    const l_firstUser = page.locator('#init-landing-assignee').getByText('Naiza Nasution');
    const l_secondUser = page.locator('#init-landing-assignee').getByText('Nathan McDonald');
    /*const l_department = page.getByTitle('Technician');*/

    // Assertion #1 - 2 users, 1 department
    await expect(l_firstUser).toHaveText('Naiza Nasution');
    await expect(l_secondUser).toHaveText('Nathan McDonald');
    /*await expect(l_department).toHaveText('Technician');*/

    // Wait for 5 seconds
    await page.waitForTimeout(5000);

    // Reset the Prepopulate settings
    await page.getByRole('button', { name: 'person_add Add Users' }).click();
    await page.getByRole('button', { name: 'Clear All' }).click();
    await page.getByRole('button', { name: 'Save' }).click();
    await page.locator('#ASX3-save i').click();
    await page.getByRole('button', { name: 'OK' }).click();

});