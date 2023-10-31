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


test('Test Project Title', async ({ page }) => {

    // Login
    await login(page);

    // Set the Project Title
    await page.goto('https://staging.salesconnection.my/settings/DefaultDealCreation');
    await page.getByPlaceholder('Site/Company Name - Contract').click();
    await page.getByPlaceholder('Site/Company Name - Contract').press('Meta+a');
    await page.getByPlaceholder('Site/Company Name - Contract').fill('Test Project Default');
    await page.getByRole('button', { name: 'Save' }).click();

    // Reload page
    await page.reload();

    // Assertion - Have Title
    const l_dealTitle = page.getByPlaceholder('Site/Company Name - Contract');
    await expect(l_dealTitle).toHaveText('Test Project Default');

});

test('Test Project Description', async ({ page }) => {

    // Login
    await login(page);

    // Set Project Description
    await page.goto('https://staging.salesconnection.my/settings/DefaultDealCreation');
    await page.getByPlaceholder('Describe your Contract here...').click();
    await page.getByPlaceholder('Describe your Contract here...').press('Meta+a');
    await page.getByPlaceholder('Describe your Contract here...').fill('Test Project Default Description');
    await page.getByRole('button', { name: 'Save' }).click();

    // Reload Page
    await page.reload();

    const l_dealDescription = page.getByPlaceholder('Describe your Contract here...');
    await expect(l_dealDescription).toHaveText('Test Project Default Description');

});

test('Test Project Category and Status', async ({ page }) => {
    
    // Login
    await login(page);

    // Access the Default Project settings page
    await page.goto('https://staging.salesconnection.my/settings/DefaultDealCreation');

    // Set Project Category & Status
    await page.getByRole('button', { name: 'Case-by-Case' }).click();
    await page.locator('a').filter({ hasText: 'General' }).click();
    await page.getByRole('button', { name: 'In Progress' }).click();
    await page.locator('a').filter({ hasText: 'Proposal' }).click();
    await page.getByRole('button', { name: 'Save' }).click();
    
    // Reload page
    await page.reload();

    // Assertion - Project Category & Status
    const l_dealStatus = page.getByRole('button', { name: 'Proposal' });
    const l_dealCategory = page.getByRole('button', { name: 'General' });
    
    await expect(l_dealStatus).toHaveText('Proposal');
    await expect(l_dealCategory).toHaveText('General');

    // Reset Settings
    await page.getByRole('button', { name: 'Proposal' }).click();
    await page.locator('a').filter({ hasText: 'In Progress' }).click();
    await page.getByRole('button', { name: 'General' }).click();
    await page.locator('a').filter({ hasText: 'Case-by-Case' }).click();
    await page.getByRole('button', { name: 'Save' }).click();

});