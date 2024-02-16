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
    const pendingApprovalElement = page.getByRole('tablist').getByText('Pending Approval');
    const containerOfPendingApproval = page.locator('div:nth-child(2) > div').filter({ hasText: 'Pending Approval' }).first();
    const containerOfActiveLead = page.locator('div:nth-child(2) > div').filter({ hasText: 'Active Lead' }).first();

    await loginAdmin(page);
    // Go to Contract Dashboard - Sales Connection
    await page.goto('https://salesconnection.my/dashboard/project');

    /* ASSERTION START */
    // Click the 'Pending Approval' element
    await pendingApprovalElement.click();

    // Expect page board have the container of 'Pending Approval'
    await expect(containerOfPendingApproval).toBeVisible();
    /* ASSERTION END */

    /* REMOVE ASSERTION */
    await page.getByRole('tablist').getByText('Active Lead').click();

    // Expect page board return to 'Active Lead' container
    await expect(containerOfActiveLead).toBeVisible();
});

test('Check change of status inside the sidebar',async ({page}) => {
    const statusOption = page.getByRole('combobox').nth(1);
   
    const statusStandBy = page.getByRole('textbox', { name: 'Standby' }).first();
    const containerStandBy = page.getByTitle('Standby').nth(1);

    const statusActive = page.getByRole('textbox', { name: 'Active Lead' }).first();
    const containerActive = page.getByTitle('Active Lead').nth(1);

    await loginAdmin(page);

    // Go to Contract Dashboard - Sales Connection
    await page.goto('https://salesconnection.my/dashboard/project');
    
    // Click the 'Active Lead' element on the tablist
    await page.getByRole('tablist').getByText('Active Lead').click();
    
    // Click the job inside the 'Active Lead' container
    await page.locator('.card-content').first().click();

    /* ASSERTION START */
    // Click the edit icon button
    await page.locator('#sc-layout-vue-app').getByText('edit').click();

    // Open arrow drop down and select 'Stand By' option
    const selectStandby = statusOption.selectOption('9467');
    await selectStandby;

    // Click 'Save Contract' button
    await page.getByRole('button', { name: 'Save Contract' }).click();

    // Expect sidebar status have 'Stand By'
    await expect(statusStandBy).toBeVisible();

    // Expect page have add the job from 'Active lead' to 'Stand By' container 
    await expect(containerStandBy).toBeVisible();
    /* ASSERTION END */

    /* REMOVE ASSERTION */
    // Click the edit icon button
    await page.locator('#sc-layout-vue-app').getByText('edit', { exact: true }).click();

    // Open arrow drop down and select 'Stand By' option
    const selectActive = statusOption.selectOption('61574');
    await selectActive;

    // Click 'Save Contract' button
    await page.getByRole('button', { name: 'Save Contract' }).click();

    // Expect sidebar status have 'Active Lead'
    await expect(statusActive).toBeVisible();
    
    // Expect page have add the job from 'Stand By' to 'Active Lead' container 
    await expect(containerActive).toBeVisible();
});

test('Check specific customer name in Contract Dashboard',async ({page}) => {
    await loginAdmin(page);

    // Go to Contract Dashboard - Sales Connection
    await page.goto('https://salesconnection.my/dashboard/project');

    // Assign the search key
    const searchKeyword = 'Freck';

    // Click search bar
    await page.getByRole('textbox', { name: 'Search' }).click();
    // Click 'Client' label
    await page.locator('div').filter({ hasText: /^Client$/ }).first().click();    
    // Click 'Customer Name' label
    await page.getByText('Customer Name').click();
    // Click label 'Customer Name:' that has text 'Contain'
    await page.getByText('Contain', { exact: true }).click();
    
    /* ASSERTION START */
    // Fill Customer Name 'Freck'
    await page.getByPlaceholder('Find search key or enter').fill(searchKeyword);
    // Pressing the "Enter" key
    await page.getByPlaceholder('Find search key or enter').press('Enter');
    
    // Expects page to have a text contain 'Customer Name:Freck'.
    const customerName = page.locator('div').filter({ hasText: /^Customer Name:Freck$/ }).first();
    await expect(customerName).toBeVisible();
    /* ASSERTION END */

    /* REMOVE ASSERTION */
    // Close 'Customer Name:Freck'.
    await page.locator('.sc-search-tag-remove').click();
    // Expect page to not have a text contain 'Customer Name:Tim'.
    await expect(customerName).toBeHidden();
});