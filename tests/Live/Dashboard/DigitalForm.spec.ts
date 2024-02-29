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