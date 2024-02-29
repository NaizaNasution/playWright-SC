import { test, expect } from '@playwright/test';

test.slow();

test.use({
    viewport: { width: 1920, height: 944 },
});

// URL link of add maintenance form
let addMFUrl: string;

// URL link of detail maintenance form
let detailMFUrl: string;

// URL link of update maintenance form
let updateMFUrl: string;

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

/* Function that open and select favourite filter */
async function openFavouriteFilter(page: any) {
    await page.locator('div').filter({ hasText: /^Favourite Filter$/ }).nth(1).click();
    await page.getByText('Filter Activity A08571public_off').click();
}

/* Function that save the update/add of the 'Add Maintenance Form' and 'Update Maintenance Form' */
async function saveMF(page: any) {
    await page.locator('.btn-savechanges').click();
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'OK' }).click();
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'OK' }).click();
}

// Open a new maintenance form for Activity A08567
test ('Open and get "Add Maintenance Form" url', async ({page}) => {
    let pageMF: any;

    await test.step('1. Go to Activity Dashboard - Sales Connection', async () => {
        await loginAdmin(page);
        await page.goto('https://salesconnection.my/dashboard/task');
        await page.waitForLoadState();
    });

    await test.step('2. Select favourite filter "Favourite Activity A08567"', async () => {
        await page.waitForTimeout(5000);
        await openFavouriteFilter(page);
        await page.waitForTimeout(5000);
    });

    await test.step('3. Select Create Digital Form', async () => {
        const job = page.locator('.card-content').first();
        const createDF = page.getByTitle('Create Digital Form');
        const optionMF = page.locator('div').filter({ hasText: 'Maintenance FormCode: MF' }).nth(3);

        await page.waitForTimeout(5000);
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
    });

    test.fail(addMFUrl === null, 'The page does not open new tab in "Add Maintenance Form" url');
});

test ('Create new "Maintenance Form Details"', async ({ page }) => {
    await test.step('1. Go to "Add Maintenance Form"', async () => {
        await loginAdmin(page);
        await page.goto(addMFUrl);
        await page.waitForLoadState();
    });
    
    await test.step('2. Fill in details', async () => {
        const customT1 = 'Test add MF';

        await page.getByPlaceholder('Enter Custom Text 1').fill(customT1);
    });

    await test.step('3. Save the Maintenance Form', async () => {
        await saveMF(page);
        await page.waitForLoadState();
    });

    test.fail(page.url() === addMFUrl, 'The page is still in "Add Maintenance Form" url');
});

test ('Open and get "Maintenance Form Details" url', async ({ page }) => {
    let pageDMF: any;

    await test.step('1. Go to Maintenance Form Dashboard - Sales Connection', async () => {
        await loginAdmin(page);
        await page.goto('https://salesconnection.my/dashboard/digitalform?c=DR05');
        await page.waitForLoadState();
    });

    await test.step('2. Select favourite filter "Favourite Activity A08567"', async () => {
        await page.waitForTimeout(5000);
        await openFavouriteFilter(page);
        await page.waitForTimeout(5000);
    });

    await test.step('3. Open a job', async () => {
        const job = page.locator('.card-content').first();

        await page.waitForTimeout(3000);
        await job.click();
        await page.waitForTimeout(3000);
        await page.getByRole('button', { name: '' }).click();
    });

    await test.step('4. Open "Maintenance Form Detail" in a new tab', async () => {
        pageDMF = await page.waitForEvent('popup');

        await pageDMF.bringToFront();
        await pageDMF.waitForLoadState();
    });

    await test.step('5. Get the "Maintenance Form Details" url', async () => {
        detailMFUrl = pageDMF.url();
    });

    test.fail(detailMFUrl === null, 'The page does not open new tab in "Maintenance Form Detail" url');
});

test ('Open and get "Update Maintenance Form" url', async ({ page }) => {
    await test.step('1. Go to Maintenance Form Dashboard - Sales Connection', async () => {
        await loginAdmin(page);
        await page.goto('https://salesconnection.my/dashboard/digitalform?c=DR05');
        await page.waitForLoadState();
    });
    
    await test.step('2. Select favourite filter "Favourite Activity A08567"', async () => {
        await page.waitForTimeout(5000);
        await openFavouriteFilter(page);
        await page.waitForTimeout(5000);
    });

    await test.step('3. Open a "Update Maintenance Form"', async () => {
        const job = page.locator('.card-content').first();
        const threedot = page.locator('div').locator('i').nth(1);
        const editBtn = page.locator('li').filter({ hasText: 'EditClick to edit your' });

        await page.waitForTimeout(3000);
        await job.click();
        await page.waitForTimeout(3000);
        await threedot.click();
        await editBtn.click();
        await page.getByRole('button', { name: 'Edit' }).click();
        await page.waitForLoadState();
    });

    await test.step('4. Get "Update Maintenance Form" url', async () => {
        await page.waitForLoadState();
        updateMFUrl = page.url();
    });

    test.fail(updateMFUrl === 'https://salesconnection.my/dashboard/digitalform?c=DR05', 'The page is still in "Maintenance Form Dashboard" url');
});

test ('Delete Maintenance Form Details', async ({page}) => {
    await test.step('1. Go to "Maintenance Form Details"', async () => {
        await loginAdmin(page);
        await page.goto(detailMFUrl);
    });

    await test.step('2. Delete the Maintenance Form', async () => {
        const deletedText = page.getByText('Digital Form was deleted');

        await page.locator('#action-bar span i').click();
        await page.getByRole('heading', { name: 'Delete' }).click();
        await page.getByRole('button', { name: ' Yes' }).click();
        await page.waitForTimeout(3000);

        // Expect page show text 'Digital Form was deleted'
        await expect(deletedText).toBeVisible();
    });

    await page.close();
});