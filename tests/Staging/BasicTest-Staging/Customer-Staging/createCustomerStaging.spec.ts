import { test, expect } from '@playwright/test';

test.use({
    viewport: { width: 1920, height: 944 },
});

async function loginAdmin(page: any){
    await page.goto('https://staging.salesconnection.my/login')

    // Login Starts
    await page.locator('input[type="text"]').click();
    await page.locator('input[type="text"]').fill('testeroftsushima@gmail.com');
    await page.locator('input[name="password"]').click();
    await page.locator('input[name="password"]').fill('Yonaka1928!');
    await page.getByRole('button', { name: 'Login' }).click();
    // Login Ends
}

async function loginSubadmin(page: any){
    await page.goto('https://staging.salesconnection.my/login')

    // Login Starts
    await page.locator('input[type="text"]').click();
    await page.locator('input[type="text"]').fill('rika.mcdonald@yopmail.com');
    await page.locator('input[name="password"]').click();
    await page.locator('input[name="password"]').fill('Yonaka1928');
    await page.getByRole('button', { name: 'Login' }).click();
    // Login Ends
}

async function loginStaff(page: any){
    await page.goto('https://staging.salesconnection.my/login')

    // Login Starts
    await page.locator('input[type="text"]').click();
    await page.locator('input[type="text"]').fill('caitsith.sctest9918@gmail.com');
    await page.locator('input[name="password"]').click();
    await page.locator('input[name="password"]').fill('Yonaka1928');
    await page.getByRole('button', { name: 'Login' }).click();
    // Login Ends
}

test('Create Customer for Admin', async ({ page }) => {
    test.slow();

    // Call login
    await loginAdmin(page);

    // Access Customer List
    await page.goto('https://staging.salesconnection.my/customers');

    
});

test('Create Customer for Subadmin', async ({ page }) => {
    test.slow();

    // Call login
    await loginSubadmin(page);

    // Access Customer List
    await page.goto('https://staging.salesconnection.my/customers');
});

test('Create Customer for Staff', async ({ page }) => {
    test.slow();

    // Call login
    await loginStaff(page);

    // Access Customer List
    await page.goto('https://staging.salesconnection.my/customers');
});
