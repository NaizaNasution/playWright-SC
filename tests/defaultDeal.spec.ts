import { test, expect } from '@playwright/test';

test.use({
    viewport: { width: 1920, height: 944 },
});

async function login(page: any){
    await page.goto('https://staging.salesconnection.my/login')

    // Login Starts
    await page.locator('input[type="text"]').click();
    await page.locator('input[type="text"]').fill('testeroftsushima@gmail.com');
    await page.locator('input[name="password"]').click();
    await page.locator('input[name="password"]').fill('Yonaka1928');
    await page.getByRole('button', { name: 'Login' }).click();
    // Login Ends

}


test('Test Assign User', async ({ page }) => {

    // Call login
    await login(page);

    // Access the Default Project settings page
    await page.goto('https://staging.salesconnection.my/settings/DefaultDealCreation');

    // Select the user
    await page.getByRole('button', { name: 'person_add Add Users' }).click();
    await page.getByText('Sales', { exact: true }).nth(1).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Save' }).click();

    // Assertion - Correct User
    const l_defaultDealUser = page.locator('#init-landing-assignee').getByText('Sales');
    await expect(l_defaultDealUser).toHaveText('Sales');

    // Save the settings
    await page.getByRole('button', { name: 'Save' }).click();

    // Reload page
    await page.reload();

    // Reset the settings
    await page.getByRole('button', { name: 'person_add Add Users' }).click();
    await page.getByRole('button', { name: 'Clear All' }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'Save' }).click();
});