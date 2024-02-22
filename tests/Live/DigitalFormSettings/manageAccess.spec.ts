import {test, expect} from '@playwright/test';

const url = 'https://salesconnection.my/ServiceReport/draccess'

test.slow();

test.beforeEach( async({page}) => {
    await page.goto('https://salesconnection.my/login');
})

//Manual login for backup if global setup went wrong
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

};*/

test('Layout of the user interface', async({page}) => {

    //Login to the system
    //await login(page);

    //Redirect to Manage Access Settings for Digital Form
    await page.goto(url);

    //Assertion
    //Check if the page loaded is correct
    await expect(page.getByRole('heading', {name: 'Digital Form Access Settings'})).toBeVisible();

    //Check if important element is loaded correctly
    //Name
    await expect(page.getByText('Name')).toBeVisible();

    //Feature Access
    await expect(page.getByText('Feature Access')).toBeVisible();

    //T-Box containing the types of DF
    await expect(page.locator('#T-header-box').getByText('Quotation Sales Order Service')).toBeVisible();
})



