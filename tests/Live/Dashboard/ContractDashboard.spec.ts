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

test('Open and close Activity Dashboard page from Contract Dashboard page', async ({ page }) => {
    await loginAdmin(page);
    
    // Go to Contract Dashboard - Sales Connection
    await page.goto('https://salesconnection.my/dashboard/project');

    // Click icon of 'Activity Dashboard'
    const activityIcon = page.locator('ol').filter({ hasText: 'ActivityDashboard' }).locator('div').first();
    await activityIcon.click();

    /* ASSERTION START */
    // Open Contract Dashboard in new tab
    const newTab = page.waitForEvent('popup');
    const activityDashboardPage = await newTab;

    await activityDashboardPage.bringToFront();
    await activityDashboardPage.waitForLoadState();

    // Expect new page have text name 'Contract Dashboard'
    await expect(activityDashboardPage.getByText('Activity Dashboard')).toBeVisible();
    /* ASSERTION END */

    /* REMOVE ASSERTION */
    await activityDashboardPage.close();
});

test('Check visibility of each element inside the tablist',async ({page}) => {
    await loginAdmin(page);
    // Go to Contract Dashboard - Sales Connection
    await page.goto('https://salesconnection.my/dashboard/project');

    // List of element text on tablist
    const elementTexts = [
        'Active Lead',
        'Standby',
        'Proposal',
        'Negotiation',
        'Needing Attention',
        'Need Support',
        'Pending Approval',
        'Management Approved',
        'Pending Customer\'s Feedback',
        'Final Review',
        'Pending Payment',
        'Completed',
        'Completed (Job)',
        'Completed (Customer)',
        'Not Interested/Cancelled'
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
    await loginAdmin(page);
    // Go to Contract Dashboard - Sales Connection
    await page.goto('https://salesconnection.my/dashboard/project');

    /* ASSERTION START */
    // Click the 'Pending Approval' element
    const pendingApprovalElement = page.getByRole('tablist').getByText('Pending Approval');
    await pendingApprovalElement.click();

    // Expect page board have the container of 'Pending Approval'
    const containerOfPendingApproval = page.locator('div:nth-child(2) > div').filter({ hasText: 'Pending Approval' }).first();
    await expect(containerOfPendingApproval).toBeVisible();
    /* ASSERTION END */

    /* REMOVE ASSERTION */
    await page.getByRole('tablist').getByText('Active Lead').click();

    // Expect page board return to 'Active Lead' container
    const containerOfActiveLead = page.locator('div:nth-child(2) > div').filter({ hasText: 'Active Lead' }).first();
    await expect(containerOfActiveLead).toBeVisible();
});

test('Check change of status inside the sidebar',async ({page}) => {
    await loginAdmin(page);

    // Go to Contract Dashboard - Sales Connection
    await page.goto('https://salesconnection.my/dashboard/project');
    
    // Click the 'Active Lead' element on the tablist
    await page.getByRole('tablist').getByText('Active Lead').click();
    // Click the job inside the 'Active Lead' container
    await page.locator('div:nth-child(2) > .card-wrapper-outter > .card-content').first().click();

    /* ASSERTION START */
    // Click the edit icon button
    await page.locator('#sc-layout-vue-app').getByText('edit', { exact: true }).click();

    // Open arrow drop down and select 'Stand By' option
    const statusOption = page.getByRole('combobox').nth(1);
    const selectStandBy = statusOption.selectOption('9467');
    await selectStandBy;

    // Click 'Save Contract' button
    await page.getByRole('button', { name: 'Save Contract' }).click();

    // Expect sidebar status have 'Stand By'
    const statusStandBy = page.getByRole('textbox', { name: 'Standby' }).first();
    await expect(statusStandBy).toBeVisible();
    /* ASSERTION END */

    /* REMOVE ASSERTION */
    // Click the edit icon button
    await page.locator('#sc-layout-vue-app').getByText('edit', { exact: true }).click();

    // Open arrow drop down and select 'Stand By' option
    const selectActive = statusOption.selectOption('61574');
    await selectActive;

    // Click 'Save Contract' button
    await page.getByRole('button', { name: 'Save Contract' }).click();

    // Expect sidebar status have 'Stand By'
    const statusActive = page.getByRole('textbox', { name: 'Active Lead' }).first();
    await expect(statusActive).toBeVisible();
});