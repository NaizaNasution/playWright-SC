import { test, expect } from '@playwright/test';

test.use({
    viewport: { width: 1920, height: 944 },
});

async function loginAdmin(page: any){
    await page.goto('https://prelive.salesconnection.my/login')

    // Login Starts
    await page.locator('input[type="text"]').click();
    await page.locator('input[type="text"]').fill('nasution.kagami@gmail.com');
    await page.locator('input[name="password"]').click();
    await page.locator('input[name="password"]').fill('Yonaka1928!');
    await page.getByRole('button', { name: 'Login' }).click();
    // Login Ends
}

async function loginSubadmin(page: any){
    await page.goto('https://prelive.salesconnection.my/login')

    // Login Starts
    await page.locator('input[type="text"]').click();
    await page.locator('input[type="text"]').fill('loveyonakasomuch@gmail.com');
    await page.locator('input[name="password"]').click();
    await page.locator('input[name="password"]').fill('Yonaka1928');
    await page.getByRole('button', { name: 'Login' }).click();
    // Login Ends
}

async function loginStaff(page: any){
    await page.goto('https://prelive.salesconnection.my/login')

    // Login Starts
    await page.locator('input[type="text"]').click();
    await page.locator('input[type="text"]').fill('josephstealean1@yopmail.com');
    await page.locator('input[name="password"]').click();
    await page.locator('input[name="password"]').fill('Yonaka1928');
    await page.getByRole('button', { name: 'Login' }).click();
    // Login Ends
}