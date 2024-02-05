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
    const contractIcon = page.locator('ol').filter({ hasText: 'ContractDashboard' }).locator('div').first();
    const newTab = page.waitForEvent('popup');

    await loginAdmin(page);
    
    // Go to Activity Dashboard - Sales Connection
    await page.goto('https://salesconnection.my/dashboard/task');

    // Click icon of 'Contract Dashboard'
    await contractIcon.click();

    /* ASSERTION START */
    // Open Contract Dashboard in new tab
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
    const inReviewElement = page.getByRole('tablist').getByText('Pending Approval');
    const containerOfPendingApproval = page.locator('#board-container div').filter({ hasText: 'Pending Approval' }).nth(3);
    const containerOfNotStarted = page.locator('#board-container div').filter({ hasText: 'Not Started' }).nth(3);

    await loginAdmin(page);
    // Go to Activity Dashboard - Sales Connection
    await page.goto('https://salesconnection.my/dashboard/task');

    /* ASSERTION START */
    // Click the 'Pending Approval' element
    await inReviewElement.click();

    // Expect page board have the container of 'In Review'
    await expect(containerOfPendingApproval).toBeVisible();
    /* ASSERTION END */

    /* REMOVE ASSERTION */
    await page.getByRole('tablist').getByText('Not Started').click();

    // Expect page board return to 'Not Started' container
    await expect(containerOfNotStarted).toBeVisible();
});

test('Check change of status inside the sidebar',async ({page}) => {
    const statusNotStarted = page.locator('#board-container p').filter({ hasText: 'Not Started' }).first();
    const containerOfNotStarted = page.locator('#board-container div').filter({ hasText: 'Not Started' }).nth(3);
    const statusInProgress = page.locator('#board-container p').filter({ hasText: 'In Progress' }).first();
    const containerInProgress = page.locator('#board-container div').filter({ hasText: 'In Progress' }).nth(3);

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
    await expect(statusNotStarted).toBeVisible();

    // Expect the page have 'Not Started' board container
    await expect(containerOfNotStarted).toBeVisible();

    /* ASSERTION START */
    // Click the 'arrow_drop_down' under the status
    await page.locator('#board-container').getByText('arrow_drop_down').nth(1).click();

    // Click the search bar
    await page.getByRole('searchbox', { name: 'Search by user name' }).click();

    // Fill 'In Progress' inside the search bar
    await page.getByRole('searchbox', { name: 'Search by user name' }).fill('In Progress');
    
    // Press keyboard 'Enter'
    await page.getByRole('searchbox', { name: 'Search by user name' }).press('Enter');

    // Click the 'In Progress' checkbox
    await page.locator('p').filter({ hasText: 'In Progress' }).click();

    // Click 'Save' button
    await page.getByRole('button', { name: 'SAVE', exact: true }).click();

    // Expect the sidebar have 'In Progress' under the status
    await expect(statusInProgress).toBeVisible();

    // Expect the page have 'In Progress' board container
    await expect(containerInProgress).toBeVisible();
    /* ASSERTION END */

    /* REMOVE ASSERTION */
    // Click the 'arrow_drop_down' under the status
    await page.locator('#board-container').getByText('arrow_drop_down').nth(1).click();

    // Click the search bar
    await page.getByRole('searchbox', { name: 'Search by user name' }).click();

    // Fill 'Not Started' inside the search bar
    await page.getByRole('searchbox', { name: 'Search by user name' }).fill('Not Started');

    // Press keyboard 'Enter'
    await page.getByRole('searchbox', { name: 'Search by user name' }).press('Enter');

    // Click the 'Not Started' checkbox
    await page.locator('p').filter({ hasText: 'Not Started' }).nth(1).click();

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

test('Check specific customer name in Activity Dashboard',async ({page}) => {
    const searchKeyword = 'Tim';
    const customerName = page.locator('div').filter({ hasText: /^Customer Name:Tim$/ }).first();

    await loginAdmin(page);
    await page.goto('https://salesconnection.my/dashboard/task');

    // Click search bar
    await page.getByRole('textbox', { name: 'Search' }).click();

    // Click 'Client' label
    await page.getByText('Client', { exact: true }).click();

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
    await page.locator('div:nth-child(5) > .sc-search-tag-remove').click();

    // Expect page to not have a text contain 'Customer Name:Tim'.
    await expect(customerName).toBeHidden();
})

test('Add/remove a user inside the sidebar',async ({page}) => {
    const assignUser = page.getByRole('dialog').getByText('Frank').first();
    const sideBarAssignedUser = page.locator('#board-container').getByText('Frank');

    await loginAdmin(page);
    await page.goto('https://salesconnection.my/dashboard/task');

    // Click a job inside the 'Not Started' container
    await page.locator('.kanban-column-card-item').first().click();
    
    // Click edit button
    await page.locator('span').filter({ hasText: 'more_vert' }).click();
    
    // Click 'Edit Activity' button
    await page.getByText('Edit Activity', { exact: true }).click();

    /* ASSERTION START */
    // Click 'Add Assign' button
    await page.getByText('Add Assign').click();
    
    // Click search bar
    await page.getByRole('textbox', { name: 'Search name' }).click();
    
    // Fill in 'Frank' name
    await page.getByRole('textbox', { name: 'Search name' }).fill('Frank');
    
    // Press keyboard 'Enter'
    await page.getByRole('textbox', { name: 'Search name' }).press('Enter');
    
    // Click 'Frank' checkbox option
    await page.getByRole('dialog').getByText('Frank').first().click();

    // Expect page have the 'Frank' title added
    await expect(assignUser).toBeVisible();

    // Click 'Save' button
    await page.getByRole('button', { name: 'Save', exact: true }).click();

    // Expect sidebar assigned user have added 'Frank'
    await expect(sideBarAssignedUser).toBeVisible();
    /* ASSERTION END */

    /* REMOVE ASSERTION */
    // Click 'Add Assign' button
    await page.getByText('Add Assign').click();

    // Click remove 'Frank' button
    await page.locator('li').filter({ hasText: 'Frank' }).locator('span').nth(1).click();

    // Expect page have the 'Frank' title remove
    await expect(page.locator('li').filter({ hasText: 'Frank' }).locator('div')).toBeHidden();

    // Click 'Save' button
    await page.getByRole('button', { name: 'Save', exact: true }).click();

    // Expect sidebar assigned user hae remove 'Frank'
    await expect(sideBarAssignedUser).toBeHidden();
});

test('Create/delete a job',async ({page}) => {
    const defaultCategory = page.getByText('Category* Test (WEB)');
    const defaultStatus = page.getByText('Status* Not Started');
    const client = page.getByTitle('Test Create Activity');
    const jobTitle = page.getByText('Test Create Activity').first();
    const jobCategory = page.locator('#board-container p').filter({ hasText: 'Test (WEB)' }).first();
    const jobStatus = page.locator('#board-container p').filter({ hasText: /^Not Started$/ });
    const jobOnBoard = page.locator('.card-content').first().getByText('Test Create Activity');

    await loginAdmin(page);
    await page.goto('https://salesconnection.my/dashboard/task');

    /* ASSERTION START */
    // Click '+' button to add new job
    await page.locator('#board-container > div:nth-child(3)').click();

    // Expect side bar have both default category and status
    await expect(defaultCategory).toBeVisible();
    await expect(defaultStatus).toBeVisible();

    // Click 'Click Here To Attach Client' button
    await page.locator('.bg-blue-50').first().click();

    // Click search bar
    await page.getByRole('searchbox', { name: 'Search' }).click();

    // Fill 'Test Create Activity'
    await page.getByRole('searchbox', { name: 'Search' }).fill('Test Create Activity');

    // Press keyboard 'Enter'
    await page.getByRole('searchbox', { name: 'Search' }).press('Enter');

    // Click option 'Test Create Activity'
    await page.getByRole('button', { name: '- Test Create Activity - - -' }).click();

    // Click client 'Test Create Activity' contact
    await page.getByRole('button', { name: '\\a 2024-01-30 08:30:00 2024-' }).click();

    // Expect sidebar have client 'Test Create Activity'
    await expect(client).toBeVisible();
    
    // CLick 'TA 3' textbox
    await page.getByPlaceholder('Enter TA 3').click();

    // Fill 'Test Create Activity' into the textbox
    await page.getByPlaceholder('Enter TA 3').fill('Test Create Activity');

    // CLick 'Save Activity' button
    await page.getByRole('button', { name: 'Save Activity' }).click();

    // Click 'OK' button
    await page.getByRole('button', { name: 'OK' }).click();

    // Expect sidebar have job title 'Test Create Activity'
    await expect(jobTitle).toBeVisible();

    // Expect sidebar have job category 'Test (WEB)'
    await expect(jobCategory).toBeVisible();

    // Expect sidebar have job status 'Not Started'
    await expect(jobStatus).toBeVisible();

    // Expect container have job title 'Test Create Activity'
    await expect(jobOnBoard).toBeVisible();
    /* ASSERTION END */

    /* REMOVE ASSERTION */
    // Click edit button
    await page.locator('span').filter({ hasText: 'more_vert' }).click();

    // Click 'Delete' button
    await page.getByText('Delete', { exact: true }).click();

    // Click 'Yes' button
    await page.getByRole('button', { name: ' Yes' }).click();

    // Click 'OK' button
    await page.getByRole('button', { name: 'OK' }).click();

    // Expect container does not have job title 'Test Create Activity'
    await expect(jobOnBoard).toBeHidden();
});

test('Check change of category inside the sidebar',async ({page}) => {
    const initialCategory = page.locator('p').filter({ hasText: /^Service$/ });
    const initialJobCategory = page.locator('.kanban-column-card-item').first().filter({ hasText: 'Service' });
    const changedCategory = page.locator('p').filter({ hasText: 'Test (WEB)' });
    const changedJobCategory = page.locator('.kanban-column-card-item').first().filter({ hasText: 'Test (WEB)' });
    const textBoxTA3 = page.locator('.formcustomfields-container > div:nth-child(5)').getByPlaceholder('Enter TA 3');
    
    await loginAdmin(page);
    await page.goto('https://salesconnection.my/dashboard/task');

    // Click a job inside 'Not Started' container
    await page.locator('.kanban-column-card-item').first().click();

    // Expect sidebar initial category is 'Service'
    await expect(initialCategory).toBeVisible();
    
    /* ASSERTION START */
    // CLick edit button
    await page.getByText('more_vert').click();
    
    // Click 'Edit Activity' button
    await page.getByText('Edit Activity', { exact: true }).click();
    
    // Click drop down arrow under 'Category'
    await page.locator('#board-container').getByText('arrow_drop_down').first().click();

    // Click search bar
    await page.getByRole('searchbox', { name: 'Search by user name' }).click();

    // Fill 'Test (WEB)'
    await page.getByRole('searchbox', { name: 'Search by user name' }).fill('Test (WEB)');
    
    // Press keyboard 'Enter'
    await page.getByRole('searchbox', { name: 'Search by user name' }).press('Enter');

    // Click 'Test (WEB)' option
    await changedCategory.click();

    // Click 'Save' button
    await page.getByRole('button', { name: 'SAVE', exact: true }).click();

    // Get the value from the 'TA3' textbox
    const isTextBoxEmpty = await textBoxTA3.inputValue() === ' ';

    // Check 'TA3' textbox whether it's empty or not
    if (!isTextBoxEmpty) {
        //await page.getByPlaceholder('Enter TA 3').fill('Test change category\n');
        await textBoxTA3.fill('Test change category\n');
    }

    // Expect textbox 'TA3' is filled
    await expect(textBoxTA3).toHaveValue('Test change category\n');

    // Click 'Save Activity' button
    await page.getByRole('button', { name: 'Save Activity' }).click();
    
    // Click 'This Activity'
    await page.locator('div').filter({ hasText: 'This Activity' }).nth(4).click();

    // Click 'Continue' button
    await page.getByRole('button', { name: 'Continue' }).click();

    // Click 'OK' button
    await page.getByRole('button', { name: 'OK' }).click();

    // Expect sidebar have category 'Text (WEB)'
    await expect(changedJobCategory).toBeVisible();

    // Expect the job have category title 'Test (WEB)'
    await expect(changedCategory).toBeVisible();
    /* ASSERTION END */

    /* REMOVE ASSERTION */
    // CLick edit button
    await page.getByText('more_vert').click();
    
    // Click 'Edit Activity' button
    await page.getByText('Edit Activity', { exact: true }).click();
    
    // Click drop down arrow under 'Category'
    await page.locator('#board-container').getByText('arrow_drop_down').first().click();

    // Click search bar
    await page.getByRole('searchbox', { name: 'Search by user name' }).click();

    // Fill 'Service'
    await page.getByRole('searchbox', { name: 'Search by user name' }).fill('Service');
    
    // Press keyboard 'Enter'
    await page.getByRole('searchbox', { name: 'Search by user name' }).press('Enter');

    // CLick 'Service' option
    await initialCategory.click();
    
    // Click 'Save' button
    await page.getByRole('button', { name: 'SAVE', exact: true }).click();    
    
    // Click 'Save Activity' button
    await page.getByRole('button', { name: 'Save Activity' }).click();

    // Click 'This Activity'
    await page.locator('div').filter({ hasText: 'This Activity' }).nth(4).click();

    // Click 'Continue' button
    await page.getByRole('button', { name: 'Continue' }).click();

    // Click 'OK' button
    await page.getByRole('button', { name: 'OK' }).click();

    // Expect sidebar have category 'Service'
    await expect(initialCategory).toBeVisible();
    
    // Expect the job have category title 'Service'
    await expect(initialJobCategory).toBeVisible();
});

test('Check change of status by drag and drop between the container',async ({page}) => {
    const initialNotStartedJobCount = page.locator('#board-container div').filter({ hasText: 'Not Started' }).filter({ hasText: '33' }).nth(3);
    const finalNotStartedJobCount = page.locator('#board-container div').filter({ hasText: 'Not Started' }).filter({ hasText: '32' }).nth(3);
    const initialInProgressJobCount = page.locator('#board-container div').filter({ hasText: 'In Progress' }).filter({ hasText: '1' }).nth(3);
    const finalInProgressJobCount = page.locator('#board-container div').filter({ hasText: 'In Progress' }).filter({ hasText: '2' }).nth(3);

    const intitialBox = page.getByText('Change Status ToNot Started');
    const destinationBox = page.getByText('Change Status ToIn Progress');

    const popUpUpdate = page.locator('div').filter({ hasText: 'Confirm Update StatusAre you' }).first();

    await loginAdmin(page);
    await page.goto('https://salesconnection.my/dashboard/task');

    // Expect job count in status 'Not Started' is 31 and 'In Progress' is 1
    await expect(initialNotStartedJobCount).toBeVisible();
    await expect(initialInProgressJobCount).toBeVisible();

    // Hover the mouse to a job inside 'Not Started' container
    await page.locator('.card-content').first().hover();

    /* ASSERTION START */
    // Press down mouse button
    await page.mouse.down();

    // Hover the mouse to container of 'In Progress'
    await page.locator('div:nth-child(3) > .surface-hover').hover();

    // Hover the mouse to the colored box inside of 'In Progress' container
    await destinationBox.hover();

    // Release mouse button
    await page.mouse.up();

    // Click 'Update' button
    await page.getByRole('button', { name: 'Update' }).click();

    // Expect page have pop up of status update
    await expect(popUpUpdate).toBeVisible();

    // Expect job count in status 'Not Started' is 30 and 'In Progress' is 2
    await expect(finalNotStartedJobCount).toBeVisible();
    await expect(finalInProgressJobCount).toBeVisible();
    /* ASSERTION END */

    /* REMOVE ASSERTION */
    // Hover the mouse to a job inside 'In Progress' container
    await page.locator('div:nth-child(3) > .surface-hover > div > .card-wrapper-outter > .card-content').first().hover();

    // Press down the mouse
    await page.mouse.down();

    // Hover the mouse to container of 'Not Started'
    await page.locator('.kanban-column-container > div > .surface-hover').first().hover();

    // Hover the mouse to coloured box inside the 'Not Started' container
    await intitialBox.hover();

    // Release mouse button
    await page.mouse.up();

    // Expect page have pop up of status update
    await expect(popUpUpdate).toBeVisible();

    // Click 'Update' button
    await page.getByRole('button', { name: 'Update' }).click();

    // Expect page have pop up of status update
    await expect(popUpUpdate).toBeVisible();
        
    // Expect job count in status 'Not Started' is 31 and 'In Progress' is 1
    await expect(initialNotStartedJobCount).toBeVisible();
    await expect(initialInProgressJobCount).toBeVisible();
});