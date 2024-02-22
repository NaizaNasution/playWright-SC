import {test, expect} from "@playwright/test";

test.slow();

var ind:number = 159411;

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

//This block test whether the position of the customer category can be changed using drag and drop movement.
test('Change position', async ({page}) => {
    
    //Login to the system
    //await login(page);

    //Redirect to customer category settings
    await page.goto('https://salesconnection.my/settings/CategoryList?type=csfirst');

    //Assertion before drag and drop
    //Checking if the customer category is in their original position
    await expect(page.getByText('1 Personal')).toBeVisible();
    await expect(page.getByText('2 SME')).toBeVisible();

    //Test drag and drop function
    await page.getByText('unfold_more 2 SME edit').hover(); //Hover over the second customer category
    await page.mouse.down(); //Click and hold the second customer category
    await page.getByText('unfold_more 1 Personal/').hover(); //Hover over the first customer category while dragging the second customer category
    await page.mouse.up(); //Release the hold on second customer category

    //Locate the save changes button with action click to save the changes made to the status
    await page.getByRole('button', { name: 'Save Changes' }).click();

    //Locate the OK button with action click to close the alert message windw
    await page.getByRole('button', { name: 'OK' }).click();

    //Assertion
    //Checking whether position of the customer category has been changed
    await expect(page.getByText('1 SME')).toBeVisible();
    await expect(page.getByText('2 Personal')).toBeVisible();

    //Return the element back to its place
    await page.getByText('unfold_more 2 Personal/').hover();
    await page.mouse.down();
    await page.getByText('unfold_more 1 SME edit').hover();
    await page.mouse.up();

    //Locate the save changes button with action click to save the changes made to the status
    await page.getByRole('button', { name: 'Save Changes' }).click();

    //Locate the OK button with action click to close the alert message windw
    await page.getByRole('button', { name: 'OK' }).click();
    
})

test('Add New Customer Category', async({page}) => {

    //Login to the system
    //await login(page);

    //Redirect to customer category settings
    await page.goto('https://salesconnection.my/settings/CategoryList?type=csfirst');

    //Locate the add new category button with action click to add new category
    await page.getByRole('button', {name: 'Add New Category'}).click();

    //Locate the category name text box and fill in with new customer category name
    await page.locator('#new_category_name').click();
    await page.locator('#new_category_name').fill('GOV');

    //Locate the submit button with action click to submit the new customer category
    await page.getByRole('button', { name: 'Submit' }).click();

    //Locate the Save Changes button to save changes made to the customer category
    await page.getByRole('button', { name: 'Save Changes' }).click();

    //Locate the OK button with action click to close the alert message windw
    await page.getByRole('button', { name: 'OK' }).click();

    //Assertion
    //Check if the new customer category has been added successfully and if the name is same as input
    await expect(page.getByText('GOV')).toBeVisible();

})

test('Edit Customer Category', async({page}) => { 

    //Login to the system
    //await login(page);

    //Redirect to customer category settings
    await page.goto('https://salesconnection.my/settings/CategoryList?type=csfirst')

    //Locate the edit button with action click to edit the customer category
    await page.locator(`#category_row_${ind}`).getByRole('button', { name: 'Edit' }).click();

    //Locate the category name text box and fill in with new name/edited name
    await page.locator(`#category_name_edit_${ind}`).click();
    await page.locator(`#category_name_edit_${ind}`).fill('Gov');

    //Locate the close button with action click to close the customer category edit window
    await page.locator(`#editCategoryModal_${ind}`).getByText('Close').click();

    //Locate the save changes button with action click to save the changes made to the customer category
    await page.getByRole('button', { name: 'Save Changes' }).click();

    //Locate the OK button with action click to close the alert message window
    await page.getByRole('button', { name: 'OK' }).click();

    //Assertion
    //Check whether the edited customer category is the same as input
    await expect(page.getByText('Gov')).toBeVisible();

})

test('Visibility and Delete', async({page}) => {

    //Login to the system
    //await login(page);

    //Redirect to customer category settings
    await page.goto('https://salesconnection.my/settings/CategoryList?type=csfirst')

    //Assertion for visibility
    //Checking if the customer category is currently visible
    await expect(page.getByRole('button', {name: 'visibility_off'})).not.toBeVisible()

    //Locate the visibility button with action click to change the visibility of the customer category
    await page.locator(`#hideCategory_${ind}`).click();

    //Assertion for visibility
    //Checking if the customer category is currently hidden
    await expect(page.getByRole('button', {name: 'visibility_off'})).toBeVisible()

    //Locate the delete button with action click to delete the customer category
    await page.locator(`#category_row_${ind}`).getByRole('button', { name: 'Delete' }).click();

    //Locate the yes button with action click to delete the customer category
    await page.getByRole('button', { name: ' Yes' }).click();

    //Locate the OK button with action click to confirm the deletion of the customer category
    await page.getByRole('button', { name: 'OK' }).click();

    //Locate the save changes button with action click to save the changes made to the customer category
    await page.getByRole('button', { name: 'Save Changes' }).click();

    //Locate the OK button with action click to close the alert message window
    await page.getByRole('button', { name: 'OK' }).click();

    //Assertion for deletion
    //Checking if the customer category is deleted
    await expect(page.getByText('Gov')).not.toBeVisible();

});
