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

// Test 3
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

// test 4
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

// Test 5
test('Check specific customer name in Activity Dashboard',async ({page}) => {
    const searchKeyword = 'Tim';
    const customerName = page.locator('div').filter({ hasText: /^Customer Name:Tim$/ }).first();

    await loginAdmin(page);
    await page.goto('https://salesconnection.my/dashboard/digitalform?c=DR05');
    
    // Click search bar
    await page.getByRole('textbox', { name: 'Search' }).click();

    // Click 'Client' label
    await page.locator('div').filter({ hasText: /^Client$/ }).first().click();

    // Click 'Customer Name' label
    await page.getByText('Customer Name').click();

    // Click label 'Customer Name:' that has text 'Contain'
    await page.getByText('Contain', { exact: true }).click();

    /* ASSERTION START */
    // Fill Customer Name 'Tim'
    await page.getByPlaceholder('Find search key or enter').fill(searchKeyword);

    // Pressing the "Enter" key
    await page.getByPlaceholder('Find search key or enter').press('Enter');

    // Expects page to have a text contain 'Customer Name:Tim'.
    await expect(customerName).toBeVisible();
    /* ASSERTION END */

    /* REMOVE ASSERTION */
    // Close 'Customer Name:Tim'.
    await page.locator('.sc-search-tag-remove').click();

    // Expect page to not have a text contain 'Customer Name:Tim'.
    await expect(customerName).toBeHidden();
});