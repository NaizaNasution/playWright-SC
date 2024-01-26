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
    
    // Go to Activity Dashboard - Sales Connection
    await page.goto('https://salesconnection.my/dashboard/task');

    // Click icon of 'Contract Dashboard'
    const contractIcon = page.locator('ol').filter({ hasText: 'ContractDashboard' }).locator('div').first();
    await contractIcon.click();

    /* ASSERTION START */
    // Open Contract Dashboard in new tab
    const newTab = page.waitForEvent('popup');
    const contractDashboardPage = await newTab;

    await contractDashboardPage.bringToFront();
    await contractDashboardPage.waitForLoadState();

    // Expect new page have text name 'Contract Dashboard'
    await expect(contractDashboardPage.getByText('Contract Dashboard')).toBeVisible();
    /* ASSERTION END */

    /* REMOVE ASSERTION */
    await contractDashboardPage.close();
});


test('Check selected elements assigned to following board container', async ({page}) => {
    await loginAdmin(page);
    // Go to Activity Dashboard - Sales Connection
    await page.goto('https://salesconnection.my/dashboard/task');

    /* ASSERTION START */
    // Click the 'Pending Approval' element
    const inReviewElement = page.getByRole('tablist').getByText('Pending Approval');
    await inReviewElement.click();

    // Expect page board have the container of 'In Review'
    const containerOfPendingApproval = page.locator('#board-container div').filter({ hasText: 'Pending Approval' }).nth(3);
    await expect(containerOfPendingApproval).toBeVisible();
    /* ASSERTION END */

    /* REMOVE ASSERTION */
    await page.getByRole('tablist').getByText('Not Started').click();

    // Expect page board return to 'Not Started' container
    const containerOfNotStarted = page.locator('#board-container div').filter({ hasText: 'Not Started' }).nth(3);
    await expect(containerOfNotStarted).toBeVisible();
});

test('Check change of status inside the sidebar',async ({page}) => {
    await loginAdmin(page);

    // Go to Activity Dashboard - Sales Connection
    await page.goto('https://salesconnection.my/dashboard/task');
    
    // Click the 'Not Started' element on tablist
    await page.getByRole('tablist').getByText('Not Started').click();
    // Click the job inside the 'Not Started' container
    await page.locator('.card-content').first().click();
    // Click the 'more_vert' button
    await page.locator('span').filter({ hasText: 'more_vert' }).click();
    // Click the 'Edit Activity' button
    await page.locator('span').filter({ hasText: 'mode_edit' }).click();
    // Expect the sidebar have 'Not Started' status
    const statusNotStarted = page.locator('p').filter({ hasText: 'Not Started' }).first();
    await expect(statusNotStarted).toBeVisible();
    // Expect the page have 'Not Started' board container
    const containerOfNotStarted = page.locator('#board-container div').filter({ hasText: 'Not Started' }).nth(3);
    await expect(containerOfNotStarted).toBeVisible();

    /* ASSERTION START */
    // Click the 'arrow_drop_down' under the status
    await page.locator('#board-container').getByText('arrow_drop_down').nth(1).click();
    // Click the 'In Progress' checkbox
    await page.locator('div:nth-child(3) > .listoption-checkbox > label').first().click();
    // Click 'Save' button
    await page.getByRole('button', { name: 'SAVE', exact: true }).click();

    // Expect the sidebar have 'In Progress' under the status
    const statusInProgress = page.locator('#board-container p').filter({ hasText: 'In Progress' }).first();
    await expect(statusInProgress).toBeVisible();
    // Expect the page have 'In Progress' board container
    const containerInProgress = page.locator('#board-container div').filter({ hasText: 'In Progress' }).nth(3);
    await expect(containerInProgress).toBeVisible();
    /* ASSERTION END */

    /* REMOVE ASSERTION */
    // Click the 'arrow_drop_down' under the status
    await page.locator('#board-container').getByText('arrow_drop_down').nth(1).click();
    // Click the 'Not Started' checkbox
    await page.locator('.listoption-checkbox > label').first().click();
    // Click 'Save' button
    await page.getByRole('button', { name: 'SAVE', exact: true }).click();

    // Expect the sidebar have 'Not Started' status
    await expect(statusNotStarted).toBeVisible();
    // Expect the page have 'Not Started' board container
    await expect(containerOfNotStarted).toBeVisible();
});

test('Check visibility of each element inside the tablist', async ({page}) => {
    await loginAdmin(page);
    // Go to Activity Dashboard - Sales Connection
    await page.goto('https://salesconnection.my/dashboard/task');

    // List of element text on tablist
    const elementTexts = [
        'Not Started',
        'Standby',
        'In Progress',
        'Needing Attention',
        'Request Approved',
        'In Review (Job)',
        'Pending Customer\'s Feedback',
        'Test Status',
        'Pending Approval',
        'Completed',
        'Completed (DF)',
        'Completed (Job)',
        'Completed (PF)'
    ];

    /* ASSERTION START */
    for (const text of elementTexts) {
        const element = page.getByRole('tablist').getByText(text, { exact: true });

        // Expect page have each element inside the tablist
        await expect(element).toBeVisible();
    }
    /* ASSERTION END */
    
    /* REMOVE ASSERTION */
    await page.getByRole('tablist').getByText('Not Started').click();
});