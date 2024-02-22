import {test, expect} from '@playwright/test';

var ind:number = 74446;

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
}*/

//This block test to see if user will be able to navigate to the customer status settings from the business company settings
test('Navigate to Customer Status Settings', async({page}) => {
    
    //Login to the system
    //await login(page);

    //Locate the sidebar
    await page.locator('.cursor-pointer').first().click();

    //These line of code scroll the sidebar to find the business Company Settings if needed
    const busCompSet = page.getByRole('link', { name: '+ business Company Settings –' })
    await busCompSet.scrollIntoViewIfNeeded();

    //Locate Business Company Settings with action Click
    await page.getByRole('link', { name: '+ business Company Settings –' }).click();
    //Locate Customer Settings with action Click
    await page.getByRole('link', { name: '+ Customer Settings –' }).click();
    //Locate Customer Status with action Click
    await page.getByRole('link', { name: 'Customer Status' }).click();

    //Assertion
    //To make sure that the selected menu is Customer Status Settings
    await expect(page.getByText('Customer Status Settings')).toBeVisible();
})

//This block test if new status is able to be added top the system
test('Add New Status', async({page}) => {

    //Login to the system
    //await login(page);

    //Redirect to the customer status settings
    await page.goto('https://salesconnection.my/settings/StatusList?type=csfirst')

    //await page.getByRole('button', { name: 'Later' }).click();

    //Locate the add new status button with action click
    await page.getByRole('button', { name: 'Add New Status' }).click();

    //Locate the new status name textbox with action click and fill the textbox
    await page.locator('#new_status_name').click();
    await page.locator('#new_status_name').fill('Expired');

    //Locate the status type dropdown with action click and choose Cancelled/Postpone/Lost status
    await page.getByRole('button', { name: 'In Progress' }).click();
    await page.locator('#addStatusModal a').filter({ hasText: 'Cancelled/Postponed/Lost' }).click();

    //Locate the status color textbox with action click and fill the textbox
    await page.locator('#new_status_color').click();
    await page.locator('#new_status_color').fill('#FF0000');

    //Locate the submit button with action click to submit the new customer status
    await page.getByRole('button', { name: 'Submit' }).click();

    //Assertion
    //Check the name newly added status to see if it matches the one from input
    await expect(page.getByText('Expired')).toBeVisible();

    //Check if the customer status type matches the one chosen from input
    await expect(page.locator(`#status_type_div_${ind}`)).toContainText('Cancelled / Postponed / Lost');

})

//This block test if the newly added status or existing status is able to be edited
test('Edit Status', async({page}) => {

    //Login to the system
    //await login(page);

    //Redirect to the customer status settings
    await page.goto('https://salesconnection.my/settings/StatusList?type=csfirst')

    //await page.getByRole('button', { name: 'Later' }).click();

    //Locate the edit button with action click to edit the status
    await page.locator(`#status_row_${ind}`).getByRole('button', { name: 'edit' }).click();

    
    //Locate the edit access dropdown and change the edit access to admin and sub-admin
    await page.locator(`#editStatusModal_${ind}`).getByText('Edit Access All Account Type').click();
    await page.getByRole('menu').locator('a').filter({ hasText: 'Admin & Subadmin' }).click();

    //Locate the Status Modification drpdown and change the status modification to admin and sub-admin
    await page.locator(`#editStatusModal_${ind}`).getByText('Status Modification All Account Type').click();
    await page.getByRole('menu').locator('a').filter({ hasText: 'Admin & Subadmin' }).click();

    //Locate the close button with action click to close the edit status
    await page.locator(`#editStatusModal_${ind}`).getByText('Close').click();

    //Locate the save changes button with action click to save the changes made to the status
    await page.getByRole('button', { name: 'Save Changes' }).click();

    //Locate the OK button with action click to close the alert message
    await page.getByRole('button', { name: 'OK' }).click();

    //Assertion
    //Check if the status name are still the same after edit
    await expect(page.getByText('Expired')).toBeVisible();

    //Check if the Edit Access are modified according to the edit input
    await expect(page.locator(`#status_useredit_div_${ind}`)).toContainText('Admin & Subadmin');

    //Check if the Status Modification are modified according to the edit input
    await expect(page.locator(`#status_modification_div_${ind}`)).toContainText('Admin & Subadmin');

    //Check if the status type are still the same after edit
    await expect(page.locator(`#status_type_div_${ind}`)).toContainText('Cancelled / Postponed / Lost');
})

//This block test the customer status visibility and customer status delete
test('Visibility and Delete', async({page}) => {

    //Login to the system
    //await login(page);

    //Redirect to the customer status settings
    await page.goto('https://salesconnection.my/settings/StatusList?type=csfirst')


    //Customer status visibility
    //Check if the current customer status is visible
    await expect(page.locator(`#hideStatus_${ind}_icon`)).toContainText('visibility');

    //Locate the hide status button with action click to hide the customer status
    await page.locator(`#hideStatus_${ind}`).click();

    //Check if the current customer status has been changed to hidden
    await expect(page.locator(`#hideStatus_${ind}_icon`)).toContainText('visibility_off');

    //Delete customer status
    //Locate the delete button with action click to delete the customer status
    await page.locator(`#status_row_${ind}`).getByRole('button', { name: 'delete' }).click();

    //Locate the yes button with action click to confirm deletion
    await page.getByRole('button', { name: ' Yes' }).click();

    //Locate the OK button with action click to close the alert message
    await page.getByRole('button', { name: 'OK' }).click();

    //Assertion
    //Check if the deleted status is still visible
    await expect(page.getByText('Expired')).not.toBeVisible();
    ind++;

});