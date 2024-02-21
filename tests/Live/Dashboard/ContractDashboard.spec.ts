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

/* Function that get total count of jobs in each status container */
async function getStatusJobCount(page: any) {
    const statusCountLabel = page.locator('div:nth-child(2) > div:nth-child(2) > div > div').first();
    
    // Get inner text of status and count
    const textContent = await statusCountLabel.innerText();

    // Get only number string from the textContent
    const numbersOnly = textContent.match(/\d+/g);

    // Return list of Job Count in number data tyoe
    return numbersOnly.map( (num: string) => parseInt(num) );
}

/* Function that create new favourite filter*/
async function createNewFavourite(page: any, keyword: String) {
    // Click 'Favourite Filter' button
    await page.locator('div').filter({ hasText: /^Favourite Filter$/ }).first().click();
    
    // Click 'Add' button
    await page.getByText('Add').click();

    // Click search bar with placeholder 'Enter label name'
    await page.getByPlaceholder('Enter label name').click();

    // Fill keyword inside the search bar
    await page.getByPlaceholder('Enter label name').fill(keyword);

    // Click 'Save' button
    await page.locator('div').filter({ hasText: /^Save$/ }).locator('span').click();
}

// Test 1
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

// Test 2
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

// Test 3
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

// Test 4
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

// Test 5
test('Check specific customer name in Contract Dashboard',async ({page}) => {
    const searchKeyword = 'Freck';
    const customerName = page.locator('div').filter({ hasText: /^Customer Name:Freck$/ }).first();

    await loginAdmin(page);

    // Go to Contract Dashboard - Sales Connection
    await page.goto('https://salesconnection.my/dashboard/project');

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
    await expect(customerName).toBeVisible();
    /* ASSERTION END */

    /* REMOVE ASSERTION */
    // Close 'Customer Name:Freck'.
    await page.locator('.sc-search-tag-remove').click();
    
    // Expect page to not have a text contain 'Customer Name:Tim'.
    await expect(customerName).toBeHidden();
});

// Test 6
test('Add/remove a user inside the sidebar',async ({page}) => {
    const searchUserKeyword = 'Frank';
    const assignUser = page.locator('div').filter({ hasText: /^Frank$/ });
    const sideBarAssignedUser = page.getByText('person_add Add People JJoseph');

    await loginAdmin(page);
    await page.goto('https://salesconnection.my/dashboard/project');

    // Click a job inside the 'Active lead' container
    await page.locator('.card-content').first().click();

    // Click edit button from the sidebar
    await page.locator('#sc-layout-vue-app').getByText('edit').click();

    // Click list user bar on title 'Assigned To'
    await sideBarAssignedUser.click();

    /* ASSERTION START */
    // Click search bar
    await page.getByRole('textbox', { name: 'Search name' }).click();

    // Fill in 'Frank' name
    await page.getByRole('textbox', { name: 'Search name' }).fill(searchUserKeyword);

    // Press keyboard 'Enter'
    await page.getByRole('textbox', { name: 'Search name' }).press('Enter');

    // Click 'Frank' checkbox option
    await page.getByRole('dialog').locator('div').filter({ hasText: /^FFrankSub Admin$/ }).first().click();
    
    // Expect page have the 'Frank' title added
    await expect(assignUser).toBeVisible();

    // Click 'Save' button
    await page.getByRole('button', { name: 'Save', exact: true }).click();

    // Expect sidebar assigned user have added 'Frank'
    await expect(sideBarAssignedUser).toContainText(searchUserKeyword);
    /* ASSERTION END */

    /* REMOVE ASSERTION */
    // Click list user bar on title 'Assigned To'
    await sideBarAssignedUser.click();

    // Click remove 'Frank' button
    await page.locator('li').filter({ hasText: 'Frank' }).locator('span').nth(1).click();
    
    // Expect page have the 'Frank' title removed
    await expect(assignUser).toBeHidden();

    // Click 'Save' button
    await page.getByRole('button', { name: 'Save', exact: true }).click();

    // Expect sidebar assigned user have remove 'Frank'
    await expect(sideBarAssignedUser).not.toContainText(searchUserKeyword);
});

// Test 7
test('Check change of category inside the sidebar',async ({page}) => {
    const job = page.locator('.card-content').first();
    const categoryOption = page.getByRole('combobox').first();
    const statusOption = page.getByRole('combobox').nth(1);
    const initialCategory = page.getByRole('textbox', { name: 'Sales' });
    const initialStatus = page.getByRole('textbox', { name: 'Active Lead' });
    const changedCategory = page.getByRole('textbox', { name: 'Service' });
    const changedStatus = page.getByRole('textbox', { name: 'Standby' });

    await loginAdmin(page);
    await page.goto('https://salesconnection.my/dashboard/project');

    // Click a job inside the 'Active lead' container
    await job.click();

    // Expect sidebar initial category and status is 'Sales' and 'Active Lead'
    await expect(initialCategory).toBeVisible();
    await expect(initialStatus).toBeVisible();

    /* ASSERTION START */
    // Click edit button from the sidebar
    await page.locator('#sc-layout-vue-app').getByText('edit').click();

    // Open arrow drop down and select 'Service' option
    const selectService = categoryOption.selectOption('85154');
    await selectService;

    // Expect option 'StandBy' is auto selected
    await expect(statusOption).toHaveValue('9467');

    // Click 'Save' button
    await page.getByRole('button', { name: 'Save Contract' }).click();

    // Expect sidebar have category 'Service' and service 'Stand by'
    await expect(changedCategory).toBeVisible();
    await expect(changedStatus).toBeVisible();
    /* ASSERTION END */

    /* REMOVE ASSERTION */
    // Click edit button from the sidebar
    await page.locator('#sc-layout-vue-app').getByText('edit').click();
    
    // Open arrow drop down and select 'Sales' option
    const selectSales = categoryOption.selectOption('82882');
    await selectSales;

    // Open arrow drop down and select 'Stand By' option
    const selectActive = statusOption.selectOption('61574');
    await selectActive;

    // Click 'Save' button
    await page.getByRole('button', { name: 'Save Contract' }).click();

    // Expect sidebar have category 'Sales' and service 'Active Lead'
    await expect(initialCategory).toBeVisible();
    await expect(initialStatus).toBeVisible();
});

// test 8
test('Check change of status by drag and drop between the container',async ({page}) => {
    // Job before and after switch of the position
    const initialJobPosition = page.locator('.card-content').first();
    const changedJobPosition = page.locator('div:nth-child(2) > .surface-hover > div').first();
    
    // Change of status box that allow user to drop the job
    const intitialBox = page.getByText('Change Status ToActive Lead');
    const destinationBox = page.getByText('Change Status ToStandby');

    const popUpUpdate = page.getByText('Status Updated Status');

    await loginAdmin(page);
    await page.goto('https://salesconnection.my/dashboard/project');

    // Stop and wait 5000 milliseconds
    await page.waitForTimeout(5000);

    // Call function that get each status initial count of job from the page
    const initialListOfJobCounts =  await getStatusJobCount(page);

    // Hover the mouse to a job inside 'Active Lead' container
    await initialJobPosition.hover();

    /* ASSERTION START */
    // Press down mouse button
    await page.mouse.down();

    // Hover the mouse to container of 'Standby'
    await page.locator('div:nth-child(2) > .surface-hover').first().hover();

    // Hover the mouse to the colored box inside of 'Standby' container
    await destinationBox.hover();

    // Release mouse button
    await page.mouse.up();

    // Click 'Update' button
    await page.getByRole('button', { name: 'Update' }).click();

    // Expect page have pop up of status update
    await expect(popUpUpdate).toBeVisible();

    // Stop and wait 5000 milliseconds
    await page.waitForTimeout(5000);

    // Call function that get each status changed count of job from the page
    const changedListOfJobCounts =  await getStatusJobCount(page);

    // Expect the changed count of jobs label is less than initial count of jobs label in 'Active Lead' status column
    expect(changedListOfJobCounts[0]).toBeLessThan(initialListOfJobCounts[0]);

    // Expect the changed count of jobs label is equal to initial count of jobs label "-1" in 'Active Lead' status column
    expect(changedListOfJobCounts[0]).toEqual(initialListOfJobCounts[0] - 1);

    // Expect the changed count of jobs label is less than initial count of jobs label in 'Standby' status column
    expect(changedListOfJobCounts[1]).toBeGreaterThan(initialListOfJobCounts[1]);

    // Expect the changed count of jobs label is equal to initial count of jobs label "+1" in 'Standby' status column
    expect(changedListOfJobCounts[1]).toEqual(initialListOfJobCounts[1] + 1);
    /* ASSERTION END */

    /* REMOVE ASSERTION */
    // Hover the mouse to a job inside 'Active Lead' container
    await changedJobPosition.hover();

    // Press down the mouse
    await page.mouse.down();

    // Hover the mouse to container of 'Standby'
    await page.locator('.kanban-column-container > div > .surface-hover').first().hover();

    // Hover the mouse to coloured box inside the 'Not Started' container
    await intitialBox.hover();

    // Release mouse button
    await page.mouse.up();

    // Click 'Update' button
    await page.getByRole('button', { name: 'Update' }).click();
    
    // Expect page have pop up of status update
    await expect(popUpUpdate).toBeVisible();

    // Stop and wait 5000 milliseconds
    await page.waitForTimeout(5000);

    // Call function that get each status final count of job from the page
    const finalListOfJobCounts = await getStatusJobCount(page);

    // Expect the final count of jobs label is equal to initial count of jobs label in 'Active Lead' status column
    expect(finalListOfJobCounts[0]).toEqual(initialListOfJobCounts[0]);
    
    // Expect the final count of jobs label is equal to initial count of jobs label in 'Standby' status column
    expect(finalListOfJobCounts[0]).toEqual(initialListOfJobCounts[0]);
});

// test 9
test('Check visibility of each job inside a status container', async ({page}) => {
    // Index of 'Active Lead' the status column
    const kanbanColumnIndex = 1;
    // Index of the job
    let surfaceHoverIndex = 1;

    let selector = '.kanban-column-container > div:nth-child(' + kanbanColumnIndex + ') > .surface-hover > div:nth-child(' + surfaceHoverIndex + ')';
    let selectJob = page.locator(selector).first();

    await loginAdmin(page);
    await page.goto('https://salesconnection.my/dashboard/project');

    // Stop and wait 5000 milliseconds
    await page.waitForTimeout(5000);

    // Count of job shown on the status container
    const listOfJobCounts = await getStatusJobCount(page);

    // Iteration on job in 'Active Lead' container
    for (let i = 1; i <= listOfJobCounts[0]; i++) {
        surfaceHoverIndex = i;

        selector = '.kanban-column-container > div:nth-child(' + kanbanColumnIndex + ') > .surface-hover > div:nth-child(' + surfaceHoverIndex + ')';
        selectJob = page.locator(selector).first();

        // Scroll down when there is no visible of the job
        await selectJob.scrollIntoViewIfNeeded();

        // Expect the column have the job shown
        await expect(selectJob).toBeInViewport();
    }
});

// test 10
test('Create/delete a favourite filter', async ({page}) => {
    const favouriteFilterKeyword = 'Filter contract C00717';
    const defaultFavouriteFilter = page.locator('div').filter({ hasText: /^Favourite Filter$/ }).first();
    const newFavouriteFilter = page.locator('div').filter({ hasText: /^Filter contract C00717$/ }).first();
    const addedFilter = page.getByText('Filter contract C00717public_off');
    const popUpDeleted = page.locator('div').filter({ hasText: 'DeletedFavourite filter' }).nth(3);

    await loginAdmin(page);
    await page.goto('https://salesconnection.my/dashboard/project');

    // Expect button title 'Favourite Filter' is shown
    await expect(defaultFavouriteFilter).toBeVisible();

    /* ASSERTION START */
    // Call function to create new favourite filter
    await createNewFavourite(page, favouriteFilterKeyword);

    // Expect button title 'Filter contract C00717' is shown
    await expect(newFavouriteFilter).toBeVisible();

    // Click 'Filter contract C00717' button
    await newFavouriteFilter.click();

    // Expect menu bar has title 'Filter contract C00717'
    await expect(addedFilter).toBeVisible();
    /* ASSERTION END */

    /* REMOVE ASSERTION */
    // Click 'Delete' button
    await page.getByTitle('Delete').first().click();

    // Click 'Yes' button
    await page.getByRole('button', { name: ' Yes' }).click();

    // Expect pop up 'DeletedFavourite filter' is shown
    await expect(popUpDeleted).toBeVisible();

    // Expect button title 'Filter contract C00717' is not shown
    await expect(newFavouriteFilter).not.toBeVisible();

    // Expect button title 'Favourite Filter' is shown
    await expect(defaultFavouriteFilter).toBeVisible();

    // Click 'Favourite Filter' button
    await defaultFavouriteFilter.click();

    // Expect menu bar has no title 'Filter contract C00717'
    await expect(addedFilter).not.toBeVisible();
})