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

test('Check selected elements assigned to following board container', async ({page}) => {
    const completedElement = page.getByRole('tablist').getByText('Completed', { exact: true });
    const containerOfCompleted = page.locator('div:nth-child(2) > div').filter({ hasText: 'Completed' }).first();
    const containerOfCreated = page.locator('div:nth-child(2) > div').filter({ hasText: 'Created' }).first();

    await loginAdmin(page);
    // Go to Maintenance Form Dashboard - Sales Connection
    await page.goto('https://salesconnection.my/dashboard/digitalform?c=DR05');

    /* ASSERTION START */
    // Click the 'Completed' element
    await completedElement.click();
    
    // Expect page board have the container of 'Completed'
    await expect(containerOfCompleted).toBeVisible();
    /* ASSERTION END */

    /* REMOVE ASSERTION */
    await page.getByRole('tablist').getByText('Created').click();

    // Expect page board return to 'Created' container
    await expect(containerOfCreated).toBeVisible();
});

