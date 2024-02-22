import {test, expect} from '@playwright/test';

test.slow();

var ind:number = 74648;

test.beforeEach(async ({page}) => {
    await page.goto('http://salesconnection.my/login');
});

/*async function login(page){
    //Direct to sales connection login site  
    await page.goto('https://salesconnection.my/login');

    //Locate the username textbox
    await page.locator('input[type="text"]').click();

    //Fill the username
    await page.locator('input[type="text"]').fill('haziq.sctraining130224@yopmail.com');

    //Locate the password textbox
    await page.locator('input[name="password"]').click();

    //Fill the password
    await page.locator('input[name="password"]').fill('YdC27G');

    //Assertion
    //Check if the main page is loaded
    await expect(page.locator('#scheduler-toolbar-section').getByText('Job Schedule')).toBeVisible();
    
}*/

//This block test whether the position of the Project Status can be changed using drag and drop movement.
test('Change position', async ({page}) => {
    
    //Login to the system
    //await login(page);

    //Redirect to project Status settings
    await page.goto('https://salesconnection.my/settings/StatusList?type=dssecond');

    //Assertion before drag and drop
    //Checking if the Project Status is in their original position
    await expect(page.getByText('1 Not Started')).toBeVisible();
    await expect(page.getByText('2 Proposal')).toBeVisible();

    //Test drag and drop function
    await page.getByText('2 Proposal').hover(); //Hover over the second Project Status
    await page.mouse.down(); //Click and hold the second Project Status
    await page.getByText('1 Not Started').hover(); //Hover over the first Project Status while dragging the second Project Status
    await page.mouse.up(); //Release the hold on second Project Status

    //Locate the save changes button with action click to save the changes made to the Status
    const saveChanges =  page.getByRole('button', { name: 'Save Changes' });
    await saveChanges.scrollIntoViewIfNeeded();
    await page.getByRole('button', { name: 'Save Changes' }).click();

    //Locate the OK button with action click to close the alert message window
    await page.getByRole('button', { name: 'OK' }).click();

    //Assertion
    //Checking whether position of the Project Status has been changed
    await expect(page.getByText('1 Proposal')).toBeVisible();
    await expect(page.getByText('2 Not Started')).toBeVisible();

    //Return the element back to its place
    await page.getByText('2 Not Started').hover();
    await page.mouse.down();
    await page.getByText('1 Proposal').hover();
    await page.mouse.up();

    //Locate the save changes button with action click to save the changes made to the Status
    await saveChanges.scrollIntoViewIfNeeded();
    await page.getByRole('button', { name: 'Save Changes' }).click();

    //Locate the OK button with action click to close the alert message windw
    await page.getByRole('button', { name: 'OK' }).click();
    
})

test('Add new status', async({page}) => {

    //Login to the system
    //await login(page);

    //Redirect to Project Status Settings
    await page.goto('https://salesconnection.my/settings/StatusList?type=dssecond');

    //Locate the Add New Status with action click to add new project status
    await page.getByRole('button', { name: 'Add New Status' }).click();

    //Locate the new project status name textbox with action click and fill the textbox with the new project status name
    await page.locator('#new_status_name').click();
    await page.locator('#new_status_name').fill('On Hold');

    //Locate the submit button with action click to submit the new project status name
    await page.getByRole('button', { name: 'Submit' }).click();

    //Locate the save changes button with action click to save the changes made to the Status
    const saveChanges =  page.getByRole('button', { name: 'Save Changes' });
    await saveChanges.scrollIntoViewIfNeeded();
    await saveChanges.click();

    //Locate the OK button with action click to close the alert message window
    await page.getByRole('button', { name: 'OK' }).click();

    //Assertion
    //Check if the new project status is added to the list
    const chckStatus = page.getByText('On Hold');
    await chckStatus.scrollIntoViewIfNeeded();
    await expect(chckStatus).toBeVisible();

})

test('Edit Project Status', async({page}) => {

    //Login to the system
    //await login(page);

    //Redirect to Project Status Settings
    await page.goto('https://salesconnection.my/settings/StatusList?type=dssecond');

    //Locate the edit button with action click to edit the project status
    const editBtnLoc = page.locator(`#status_row_${ind}`).getByRole('button', { name: 'Edit' });
    await editBtnLoc.scrollIntoViewIfNeeded();
    await editBtnLoc.click();

    //Change Name
    await page.locator(`#status_name_edit_${ind}`).click();
    await page.locator(`#status_name_edit_${ind}`).fill('On-Hold');

    //Locate the Edit Access dropdown and change the edit access
    await page.locator(`#editStatusModal_${ind}`).getByText('Edit Access').click();
    await page.getByRole('menu').locator('a').filter({ hasText: 'Admin & Subadmin'}).click();

    //Locate the close button to close the edit project status window
    const closebtn = page.locator(`#editStatusModal_${ind}`).getByText('Close');
    await closebtn.scrollIntoViewIfNeeded();
    await closebtn.click();

    //Locate the save changes button with action click to save the changes made to the Status
    await page.getByRole('button', { name: 'Save Changes' }).click();

    //Locate the OK button with action click to close the alert message window
    await page.getByRole('button', { name: 'OK' }).click();

    //Assertion
    //Check if the edited status name is the same as input
    await expect(page.getByText('On-Hold')).toBeVisible();

    //Check if the edit access has been changed according to the input
    await expect(page.locator(`#status_useredit_div_${ind}`)).toContainText('Admin & Subadmin');

})

test('Visibility and delete', async({page}) => {

    //Login to the system
    //await login(page);

    //Redirect to the Project Status Settings
    await page.goto('https://salesconnection.my/settings/StatusList?type=dssecond')

    //Locate the visibility button
    const visiBtn = page.locator(`#hideStatus_${ind}`);
    await visiBtn.scrollIntoViewIfNeeded();

    //Assertion for visibility
    //Checking if the project status is currently visible
    await expect(page.getByRole('button', {name: 'visibility_off'})).not.toBeVisible();

    //locate the visibility button with action click to hide the project status
    await visiBtn.click();

    //Assertion for visibility
    //Checking if the project status is currently hidden
    await expect(page.getByRole('button', {name: 'visibility_off'})).toBeVisible();

    //locate the delete button with action click to delete the project status
    await page.locator(`#status_row_${ind}`).getByRole('button', { name: 'delete'}).click();

    //Locate the yes button to confirm deletion of project status
    await page.getByRole('button', { name: ' Yes' }).click();

    //Locate the OK button to close the alert message window
    await page.getByRole('button', { name: 'OK' }).click();

    //Locate the Save Changes button with action click to save the updated list of the project status
    await page.getByRole('button', { name: 'Save Changes' }).click();

    //Locate the OK button to close the alert message window
    await page.getByRole('button', { name: 'OK' }).click();

    //Assertion
    //Make sure that the deleted project status is no longer visible
    await expect(page.getByText('On-Hold')).not.toBeVisible();
})