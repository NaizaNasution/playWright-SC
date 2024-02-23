import { test, expect } from '@playwright/test';

test.slow();

test.use({
    viewport: { width: 1920, height: 944 },
});

// URL link of add maintenance form
let addMFUrl: string;

// URL link of detail maintenance form
let detailMFUrl: string;

/* Function that login to Sales Connection website */
async function loginAdmin(page: any){
    await page.goto('https://salesconnection.my/login');
    // Login Starts
    await page.locator('input[type="text"]').click();
    await page.locator('input[type="text"]').fill('nasution.kagami@gmail.com');
    await page.locator('input[name="password"]').click();
    await page.locator('input[name="password"]').fill('Yonaka1928!');
    await page.getByRole('button', { name: 'Login' }).click();
    // Login Ends
}

test ('Create and get "Add Maintenance Form" url', async ({page}) => {
    let pageMF: any;

    await test.step('1. Go to Activity Dashboard - Sales Connection', async () => {
        await loginAdmin(page);
        await page.goto('https://salesconnection.my/dashboard/task');
    });

    await test.step('2. Select favourite filter "Favourite Activity A08567"', async () => {
        const favouriteFilterA08567 = page.locator('div').filter({ hasText: /^Filter Activity A08567$/ }).first();

        await page.locator('div').filter({ hasText: /^Favourite Filter$/ }).nth(1).click();
        await page.getByText('Filter Activity A08567public_off').click();

        // Expect the page have the "Filter Activity A08567" as favourite filter
        await expect(favouriteFilterA08567).toBeVisible();
    });

    await test.step('3. Select Create Digital Form', async () => {
        const job = page.locator('.kanban-column-card-item');
        const createDF = page.getByTitle('Create Digital Form');
        const optionMF = page.locator('div').filter({ hasText: 'Maintenance FormCode: MF' }).nth(3);

        await job.click();
        await createDF.click();
        await optionMF.click();
    });

    await test.step('4. Open "Add Maintenance Form" in a new tab', async () => {
        pageMF = await page.waitForEvent('popup');

        await pageMF.bringToFront();
        await pageMF.waitForLoadState();
    });

    await test.step('5. Get the "Add Maintenance Form" url', async () => {
        addMFUrl = pageMF.url();

        await test.step('Check "Add Maintenance Form" header', async () => {
            const headerMF = pageMF.getByRole('heading', { name: 'Add Maintenance Form' });

            // Expect the page have header "Add Maintenance Form"
            await expect(headerMF).toBeVisible();
        });

        // Expect the page to have 'Add Maintenance Form' url
        await expect(pageMF).toHaveURL('https://salesconnection.my/ServiceReport/Transaction?g=1245&t=DR05&a=2477940&c=291640&d=255356&f=activity');
    });
});

test ('Create and get "Maintenance Form Details" url', async ({ page }) => {
    await test.step('1. Go to "Add Maintenance Form"', async () => {
        await loginAdmin(page);
        await page.goto(addMFUrl);
    });
    
    await test.step('2. Fill in details', async () => {
        const customT1 = 'Test add MF';

        await page.getByPlaceholder('Enter Custom Text 1').fill(customT1);
    });

    await test.step('3. Save the Maintenance Form', async () => {
        await page.locator('.btn-savechanges').click();
        await page.waitForTimeout(3000);
        await page.getByRole('button', { name: 'OK' }).click();
        await page.waitForTimeout(3000);

        // Expect the page have shown 'Successfully Saved'
        await expect(page.getByRole('heading', { name: 'Successfully Saved.' })).toBeVisible();
    
        await page.getByRole('button', { name: 'OK' }).click();
    });

    await test.step('4. Get "Maintenance Form Details" url', async () => {
        detailMFUrl = page.url();

        await test.step('Check "Maintenance Form Details" header', async () => {
            const headerDF = page.getByRole('heading', { name: 'Maintenance Form Details' });

            // Expect the page have header "Maintenance Form Details"
            await expect(headerDF).toBeVisible();
        });

        // Expect the page not have 'Add Maintenance Form' url;
        await expect(page).not.toHaveURL('https://salesconnection.my/ServiceReport/Transaction?g=1245&t=DR05&a=2477940&c=291640&d=255356&f=activity');
    });
});