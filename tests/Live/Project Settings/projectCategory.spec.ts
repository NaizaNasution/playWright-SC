import {test, expect} from '@playwright/test';

test.slow()

var ind:number = 159420;

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

//This block test whether the position of the Project category can be changed using drag and drop movement.
test('Change position', async ({page}) => {
    
    //Login to the system
    //await login(page);

    //Redirect to project category settings
    await page.goto('https://salesconnection.my/settings/CategoryList?type=dssecond');

    //Assertion before drag and drop
    //Checking if the Project category is in their original position
    await expect(page.getByText('1 Sales')).toBeVisible();
    await expect(page.getByText('2 Services')).toBeVisible();

    //Test drag and drop function
    await page.getByText('2 Services').hover(); //Hover over the second Project category
    await page.mouse.down(); //Click and hold the second Project category
    await page.getByText('1 Sales').hover(); //Hover over the first Project category while dragging the second Project category
    await page.mouse.up(); //Release the hold on second Project category

    //Locate the save changes button with action click to save the changes made to the category
    await page.getByRole('button', { name: 'Save Changes' }).click();

    //Locate the OK button with action click to close the alert message windw
    await page.getByRole('button', { name: 'OK' }).click();

    //Assertion
    //Checking whether position of the Project category has been changed
    await expect(page.getByText('1 Services')).toBeVisible();
    await expect(page.getByText('2 Sales')).toBeVisible();

    //Return the element back to its place
    await page.getByText('2 Sales').hover();
    await page.mouse.down();
    await page.getByText('1 Services').hover();
    await page.mouse.up();

    //Locate the save changes button with action click to save the changes made to the category
    await page.getByRole('button', { name: 'Save Changes' }).click();

    //Locate the OK button with action click to close the alert message windw
    await page.getByRole('button', { name: 'OK' }).click();
    
})

test('Add new category', async ({page}) => {

    //Login to the system
    //await login(page);

    //Redirect to project category settings
    await page.goto('https://salesconnection.my/settings/CategoryList?type=dssecond')

    //Locate the add new category button with action click to add new project category
    await page.getByRole('button', { name: 'Add New Category' }).click();

    //Locate the new category name textbox with action click and fill the new project category
    await page.locator('#new_category_name').click();
    await page.locator('#new_category_name').fill('Upgrade');

    //Locate the submit button with action click to submit the new project category
    await page.getByRole('button', { name: 'Submit' }).click();

    //Locate the Save Changes button to save changes made to the project category
    await page.getByRole('button', { name: 'Save Changes' }).click();

    //Locate the OK button to close the alert message window
    await page.getByRole('button', { name: 'OK' }).click();

    //Assertion
    //Check if the new project category has been added successfully and if the name is same as input
    await expect(page.getByText('Upgrade')).toBeVisible();
    
})

test('Edit category', async ({page}) => {

    //Login to the system
    //await login(page);

    //Redirect to the project category settings
    await page.goto('https://salesconnection.my/settings/CategoryList?type=dssecond');

    //Locate the edit button of the project category with action click
    await page.locator(`#category_row_${ind}`).getByRole('button', { name: 'Edit' }).click();

    //Locate the new project category name textbox and fill the textbox with a new name or edited name
    await page.locator(`#category_name_edit_${ind}`).click();
    await page.locator(`#category_name_edit_${ind}`).fill('Events');

    //Locate the close button to close the edit project category window
    await page.locator(`#editCategoryModal_${ind}`).getByText('Close').click();

    //Locate the save changes button with action click to save the changes made to the project category
    await page.getByRole('button', { name: 'Save Changes' }).click();

    //Locate the OK button to close the alert message window
    await page.getByRole('button', { name: 'OK' }).click();

    //Assertion
    //Check whether the edited project category is the same as input
    await expect(page.locator(`#category_name_div_${ind}`)).toContainText('Events');

    //Adding 'Event' as category name will cause error when assertion by text
})

test('Visibility and Delete', async ({page}) => {

    //Login to the system
    //await login(page);

    //Redirect to the project category settings
    await page.goto('https://salesconnection.my/settings/CategoryList?type=dssecond')

    //Assertion for visibility
    //Checking if the project category is currently visible
    await expect(page.getByRole('button', {name: 'visibility_off'})).not.toBeVisible()

    //Locate the visibility button of the project category with action click
    await page.locator(`#hideCategory_${ind}`).click();

    //Assertion for visibility
    //Checking if the project category is currently hidden
    await expect(page.getByRole('button', {name: 'visibility_off'})).toBeVisible()

    //Locate the delete button with action click to delete the project category
    await page.locator(`#category_row_${ind}`).getByRole('button', { name: 'Delete' }).click();

    //Locate the yes button with action click to delete the project category
    await page.getByRole('button', { name: ' Yes' }).click();

    //Locate the OK button with action click to confirm the deletion of the project category
    await page.getByRole('button', { name: 'OK' }).click();

    //Locate the save changes button with action click to save the changes made to the project category
    await page.getByRole('button', { name: 'Save Changes' }).click();

    //Locate the OK button with action click to close the alert message window
    await page.getByRole('button', { name: 'OK' }).click();

    //Assertion for deletion
    //Checking if the project category is deleted
    await expect(page.getByText('Events')).not.toBeVisible();

});