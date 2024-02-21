import { test, expect } from '@playwright/test';

test.slow();

test.use({
    viewport: { width: 1920, height: 944 },
});

/* Function that login to Sales Connection website */
async function loginAdmin(page: any){
    await page.goto('https://salesconnection.my/dashboard/digitalform?c=DR05');
    // Login Starts
    await page.locator('input[type="text"]').click();
    await page.locator('input[type="text"]').fill('nasution.kagami@gmail.com');
    await page.locator('input[name="password"]').click();
    await page.locator('input[name="password"]').fill('Yonaka1928!');
    await page.getByRole('button', { name: 'Login' }).click();
    // Login Ends
}

// Test 1
test('Open and close Contract Dashboard page from Activity Dashboard page', async ({ page }) => {
    await loginAdmin(page);
    
    // Go to Maintanence Form Dashboard - Sales Connection
    await page.goto('https://salesconnection.my/dashboard/digitalform?c=DR05');

    // Click icon of 'Activity Dashboard'
    const activityIcon = page.locator('ol').filter({ hasText: 'ActivityDashboard' }).locator('div').first();
    await activityIcon.click();

    /* ASSERTION START */
    // Open Activity Dashboard in new tab
    const newTab = page.waitForEvent('popup');
    const activityDashboardPage = await newTab;

    await activityDashboardPage.bringToFront();
    await activityDashboardPage.waitForLoadState();

    // Expect new page have text name 'Activity Dashboard'
    await expect(activityDashboardPage.getByText('Activity Dashboard')).toBeVisible();
    /* ASSERTION END */

    /* REMOVE ASSERTION */
    await activityDashboardPage.close();
});

// Test 2
test('Check visibility of each element inside the tablist',async ({page}) => {
    await loginAdmin(page);
    // Go to Maintenance Form Dashboard - Sales Connection
    await page.goto('https://salesconnection.my/dashboard/digitalform?c=DR05');

    // List of element text on tablist
    const elementTexts = [
        'Created',
        'Pending Approval',
        'In Progress',
        'Ongoing',
        'Needing Attention',
        'Completed',
        'Completed (DF)'
    ];

    /* ASSERTION START */
    for (const text of elementTexts) {
        const element = page.getByRole('tablist').getByText(text, { exact: true });

        // Expect page have each element inside the tablist
        await expect(element).toBeVisible();
    }
    /* ASSERTION END */
    
    /* REMOVE ASSERTION */
    await page.getByRole('tablist').getByText(elementTexts[0]).click();
});

// test 3
test('Check change of status inside the sidebar',async ({page}) => {
    const bannerCreatedStatus = page.getByText('CREATED by Naireza');
    const bannerPendingStatus = page.getByText('PENDING APPROVAL by Naireza');

    const updatePopUp = page.getByText('Maintenance Form UpdatedStatus Updated Successfully!');

    await loginAdmin(page);

    // Go to Maintenance Form Dashboard - Sales Connection
    await page.goto('https://salesconnection.my/dashboard/digitalform?c=DR05');

    // Click the 'Created' element on the tablist
    await page.getByRole('tablist').getByText('Created').click();
    
    // Click the job inside the 'Created' container
    await page.locator('.kanban-column-card-item').first().click();

    // Expect sidebar banner change to 'CREATED'
    await expect(bannerCreatedStatus).toBeVisible();

    // Click the edit icon button
    await page.locator('div').filter({ hasText: /^Maintenance FormMF01256$/ }).first().locator('i').click();

    /* ASSERTION START */
    // Click 'Change Status' button
    await page.locator('li').filter({ hasText: 'Change StatusClick here to' }).click();

    // Click tabpanel under the Status title
    await page.locator('div').filter({ hasText: /^StatusCreated$/ }).locator('div').first().click();

    // Click 'Pending Approval'
    await page.getByLabel('Pending Approval').click();

    // Click 'Save' button
    await page.getByRole('button', { name: 'Save' }).click();

    // Expect page have pop up of status update
    await expect(updatePopUp).toBeVisible();

    // Stop and wait 3000 milliseconds
    await page.waitForTimeout(3000);

    // Expect sidebar banner change to 'PENDING APPROVAL'
    await expect(bannerPendingStatus).toBeVisible();
    /* ASSERTINO END */

    /* REMOVE ASSERTION */
    // Click the edit icon button
    await page.locator('div').filter({ hasText: /^Maintenance FormMF01256$/ }).first().locator('i').click();

    // Click 'Change Status' button
    await page.locator('li').filter({ hasText: 'Change StatusClick here to' }).click();

    // Click tabpanel under the Status title
    await page.locator('div').filter({ hasText: /^StatusPending Approval$/ }).locator('div').first().click()

    // Click 'Pending Approval'
    await page.getByLabel('Created').click();

    // Click 'Save' button
    await page.getByRole('button', { name: 'Save' }).click();

    // Expect page have pop up of status update
    await expect(updatePopUp).toBeVisible();

    // Expect sidebar banner change to 'PENDING APPROVAL'
    await expect(bannerPendingStatus).toBeHidden();

    // Expect sidebar banner change to 'CREATED'
    await expect(bannerCreatedStatus).toBeVisible();
});
