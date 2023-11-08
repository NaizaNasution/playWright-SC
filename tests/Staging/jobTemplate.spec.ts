import { test, expect } from '@playwright/test';

test.use({
    viewport: { width: 1920, height: 944 },
});

async function login(page: any){
    await page.goto('https://staging.salesconnection.my/login')

    // Login Starts
    await page.locator('input[type="text"]').click();
    await page.locator('input[type="text"]').fill('testeroftsushima@gmail.com');
    await page.locator('input[name="password"]').click();
    await page.locator('input[name="password"]').fill('Yonaka1928');
    await page.getByRole('button', { name: 'Login' }).click();
    // Login Ends

}

test('Set Prepopulate Assigned Users', async ({ page }) => {
    test.slow();

    // Call login
    await login(page);

    // Access Job Template Settings page
    await page.goto('https://staging.salesconnection.my/templateSettings/ActivityTemplates');

    // Change to Ad-Hoc Category
    await page.getByRole('button', { name: 'Meeting/Discussion' }).click();
    await page.locator('a').filter({ hasText: 'Ad-Hoc' }).click();

    // Add the users
    await page.getByRole('button', { name: 'person_add Add Users' }).click();
    await page.getByText('Naiza NasutionStaff').click();
    //await page.getByText('Nathan McDonaldStaff').click();
    await page.getByRole('button', { name: 'Save' }).click();

    // Save Template
    await page.locator('#ASX3-save i').click();
    await page.getByRole('button', { name: 'OK' }).click();
    await page.getByRole('button', { name: 'Overwrite All Templates' }).click();

    // Refresh page
    await page.reload();

    // Back to Ad-Hoc Category
    await page.getByRole('button', { name: 'Meeting/Discussion' }).click();
    await page.locator('a').filter({ hasText: 'Ad-Hoc' }).click();

    // Declare the Locators
    const l_firstUser = page.locator('#init-landing-assignee').getByText('Naiza Nasution');
    //const l_secondUser = page.locator('#init-landing-assignee').getByText('Nathan McDonald');
    /*const l_department = page.getByTitle('Technician');*/

    // Assertion #1 - 2 users, 1 department
    await expect(l_firstUser).toHaveText('Naiza Nasution');
    //await expect(l_secondUser).toHaveText('Nathan McDonald');
    /*await expect(l_department).toHaveText('Technician');*/

    // Wait for 5 seconds
    await page.waitForTimeout(5000);

    // Reset the Prepopulate settings
    await page.getByRole('button', { name: 'person_add Add Users' }).click();
    await page.getByRole('button', { name: 'Clear All' }).click();
    await page.getByRole('button', { name: 'Save' }).click();
    await page.locator('#ASX3-save i').click();
    await page.getByRole('button', { name: 'OK' }).click();

});

test('Set Address Not Required Checkbox', async ({ page }) => {
    test.slow();

    // Call login
    await login(page);

    // Access Job Template Settings page
    await page.goto('https://staging.salesconnection.my/templateSettings/ActivityTemplates');

    // Check the Display No Address
    await page.getByRole('button', { name: 'Meeting/Discussion' }).click();
    await page.locator('a').filter({ hasText: 'Ad-Hoc' }).click();
    await page.getByText('Display \'Address not required\'.').click();
    await page.locator('#ASX3-save i').click();
    await page.getByRole('button', { name: 'OK' }).click();
    await page.getByRole('button', { name: 'Overwrite All Templates' }).click();

    // Refresh page
    await page.reload();

    // Go back to the Ad-Hoc category
    await page.getByRole('button', { name: 'Meeting/Discussion' }).click();
    await page.locator('a').filter({ hasText: 'Ad-Hoc' }).click();

    // Assertion - The Display No Address Should be checked
    const l_noAddress = page.getByText('Display \'Address not required\'.');
    await expect(l_noAddress).toBeChecked();

    // Reset the checkbox
    await page.getByText('Display \'Address not required\'.').click();
    await page.locator('#ASX3-save i').click();
    await page.getByRole('button', { name: 'OK' }).click();

});

test('Set Address Prepopulate to Flag 2', async ({ page }) => {
    test.slow();

    // Call login
    await login(page);

    // Access Job Template Settings page
    await page.goto('https://staging.salesconnection.my/templateSettings/ActivityTemplates');

    // Set the Address Prepopulate Flag to 2
    await page.getByRole('button', { name: 'Meeting/Discussion' }).click();
    await page.locator('a').filter({ hasText: 'Ad-Hoc' }).click();
    await page.getByText('Prepopulate the most recent client address created in the list. Automatically pi').click();
    await page.locator('#ASX3-save i').click();
    await page.getByRole('button', { name: 'OK' }).click();
    await page.getByRole('button', { name: 'Overwrite All Templates' }).click();

    // Page Refresh
    await page.reload();
    
    // Assertion
    await page.getByRole('button', { name: 'Meeting/Discussion' }).click();
    await page.locator('a').filter({ hasText: 'Ad-Hoc' }).click();
    const address_prepopulate = page.getByText('Prepopulate the most recent client address created in the list. Automatically pi');
    await expect(address_prepopulate).toBeChecked();

});

test('Set Address Prepopulate to Flag 3', async ({ page }) => {
    test.slow();

    // Call login
    await login(page);

    // Access Job Template Settings page
    await page.goto('https://staging.salesconnection.my/templateSettings/ActivityTemplates');

    // Set the Address Prepopulate Flag to 3
    await page.getByRole('button', { name: 'Meeting/Discussion' }).click();
    await page.locator('a').filter({ hasText: 'Ad-Hoc' }).click();
    await page.getByText('Prepopulate "No Address Required" in the list. Automatically pick "No Address Re').click();
    await page.locator('#ASX3-save i').click();
    await page.getByRole('button', { name: 'OK' }).click();
    await page.getByRole('button', { name: 'Overwrite All Templates' }).click();

    // Page Refresh
    await page.reload();
    
    // Assertion
    await page.getByRole('button', { name: 'Meeting/Discussion' }).click();
    await page.locator('a').filter({ hasText: 'Ad-Hoc' }).click();
    const address_prepopulate = page.getByText('Prepopulate "No Address Required" in the list. Automatically pick "No Address Re');
    await expect(address_prepopulate).toBeChecked();

});

test('Set Address Prepopulate to Flag 4', async ({ page }) => {
    test.slow();

    // Call login
    await login(page);

    // Access Job Template Settings page
    await page.goto('https://staging.salesconnection.my/templateSettings/ActivityTemplates');

    // Set the Address Prepopulate Flag to 4
    await page.getByRole('button', { name: 'Meeting/Discussion' }).click();
    await page.locator('a').filter({ hasText: 'Ad-Hoc' }).click();
    await page.getByText('No prepopulation required. There will be no automated selection; users must manu').click();
    await page.locator('#ASX3-save i').click();
    await page.getByRole('button', { name: 'OK' }).click();
    await page.getByRole('button', { name: 'Overwrite All Templates' }).click();

    // Page Refresh
    await page.reload();
    
    // Assertion
    await page.getByRole('button', { name: 'Meeting/Discussion' }).click();
    await page.locator('a').filter({ hasText: 'Ad-Hoc' }).click();
    const address_prepopulate = page.getByText('No prepopulation required. There will be no automated selection; users must manu');
    await expect(address_prepopulate).toBeChecked();

});

test('Set Address Prepopulate to Flag 1', async ({ page }) => {
    test.slow();

    // Call login
    await login(page);

    // Access Job Template Settings page
    await page.goto('https://staging.salesconnection.my/templateSettings/ActivityTemplates');

    // Set the Address Prepopulate Flag to 1
    await page.getByRole('button', { name: 'Meeting/Discussion' }).click();
    await page.locator('a').filter({ hasText: 'Ad-Hoc' }).click();
    await page.getByText('Prepopulate the main client address in the list. Automatically pick the main cli').click();
    await page.locator('#ASX3-save i').click();
    await page.getByRole('button', { name: 'OK' }).click();
    await page.getByRole('button', { name: 'Overwrite All Templates' }).click();

    // Page Refresh
    await page.reload();
    
    // Assertion
    await page.getByRole('button', { name: 'Meeting/Discussion' }).click();
    await page.locator('a').filter({ hasText: 'Ad-Hoc' }).click();
    const address_prepopulate = page.getByText('Prepopulate the main client address in the list. Automatically pick the main cli');
    await expect(address_prepopulate).toBeChecked();
    
});

/*test ('Set Prepopulate Default Field', async ({ page }) => {
    test.slow();

    // Call login
    await login(page);

    // Access Job Template Settings page
    await page.goto('https://staging.salesconnection.my/templateSettings/ActivityTemplates');

    // Change to Ad-Hoc Category
    await page.getByRole('button', { name: 'Meeting/Discussion' }).click();
    await page.locator('a').filter({ hasText: 'Ad-Hoc' }).click();

    // Set the Prepopulate Description
    await page.locator('#DF-leftmaster-box').getByTitle('Toggle field configuration section').first().click();
    await page.getByRole('textbox', { name: 'Set initial value for textarea' }).click();
    await page.getByRole('textbox', { name: 'Set initial value for textarea' }).fill('Ad-hoc Job (by Playwright)');

    // Set Prepopulate Duration
    await page.locator('#DF-leftmaster-box').getByTitle('Toggle field configuration section').nth(3).click();
    await page.getByRole('button', { name: '' }).nth(3).click({
        clickCount: 3
      });
    
    // Save template
    await page.locator('#ASX3-save i').click();
    await page.getByRole('button', { name: 'OK' }).click();
    await page.getByRole('button', { name: 'OK' }).click();

    // Change to Ad-Hoc Category
    await page.getByRole('button', { name: 'Meeting/Discussion' }).click();
    await page.locator('a').filter({ hasText: 'Ad-Hoc' }).click();

    //Assertion 1 - Description
    await page.locator('#DF-leftmaster-box').getByTitle('Toggle field configuration section').first().click();
    const description_prepopulate = page.getByRole('textbox', { name: 'Set initial value for textarea' });
    await expect(description_prepopulate).toContainText('Ad-hoc Job (by Playwright)');

    //Assertion 2 - Duration
    await page.locator('#DF-leftmaster-box').getByTitle('Toggle field configuration section').nth(3).click();
    const duration_prepopulate = page.locator('#duration-picker').getByRole('textbox').nth(3);
    await expect(duration_prepopulate).toContainText('4');

    // Reset the settings
    await page.locator('#DF-leftmaster-box').getByTitle('Toggle field configuration section').first().click();
    await page.getByRole('textbox', { name: 'Set initial value for textarea' }).click();
    await page.getByRole('textbox', { name: 'Set initial value for textarea' }).fill('Ad-hoc Job');

    await page.getByRole('button', { name: '' }).nth(3).click({
        clickCount: 3
      });

    await page.locator('#ASX3-save i').click();
    await page.getByRole('button', { name: 'OK' }).click();

});*/


test('Enable a Custom Field', async ({ page }) => {
    test.slow();

    // Call login
    await login(page);

    // Access Job Template Settings page
    await page.goto('https://staging.salesconnection.my/templateSettings/ActivityTemplates');

    // Change category to Ad-Hoc
    await page.getByRole('button', { name: 'Meeting/Discussion' }).click();
    await page.locator('a').filter({ hasText: 'Ad-Hoc' }).click();

    //Enable a custom field
    await page.locator('li').filter({ hasText: 'unfold_more House Admin Email edit check close Text Disabled' }).getByTitle('Toggle field configuration section').click();
    await page.locator('#right-master-box').getByRole('list').locator('div').filter({ hasText: 'unfold_more House Admin Email edit check close Text Disabled Editable Field Requ' }).getByTitle('Enable This Field').locator('span').click();
    await page.locator('#ASX3-save i').click();
    await page.getByRole('button', { name: 'OK' }).click();
    await page.getByRole('button', { name: 'Overwrite All Templates' }).click();
    await page.getByRole('button', { name: 'OK' }).click();

    // Change category to Ad-Hoc
    await page.getByRole('button', { name: 'Meeting/Discussion' }).click();
    await page.locator('a').filter({ hasText: 'Ad-Hoc' }).click();

    //Assertion - Check if Enabled
    const field_indicator = page.getByText('unfold_more House Admin Email edit check close Text Enabled');
    await expect(field_indicator).toHaveText('unfold_more House Admin Email edit check close Text Enabled');
});

test('Disable a Custom Field', async ({ page }) => {
    test.slow();

    // Call login
    await login(page);

    // Access Job Template Settings page
    await page.goto('https://staging.salesconnection.my/templateSettings/ActivityTemplates');

    // Change category to Ad-Hoc
    await page.getByRole('button', { name: 'Meeting/Discussion' }).click();
    await page.locator('a').filter({ hasText: 'Ad-Hoc' }).click();

    //Enable a custom field
    await page.locator('li').filter({ hasText: 'unfold_more House Admin Email edit check close Text Enabled' }).getByTitle('Toggle field configuration section').click();
    await page.locator('#right-master-box').getByRole('list').locator('div').filter({ hasText: 'unfold_more House Admin Email edit check close Text Enabled Editable Field Requ' }).getByTitle('Enable This Field').locator('span').click();
    await page.locator('#ASX3-save i').click();
    await page.getByRole('button', { name: 'OK' }).click();
    await page.getByRole('button', { name: 'Overwrite All Templates' }).click();
    await page.getByRole('button', { name: 'OK' }).click();

    // Change category to Ad-Hoc
    await page.getByRole('button', { name: 'Meeting/Discussion' }).click();
    await page.locator('a').filter({ hasText: 'Ad-Hoc' }).click();

    //Assertion - Check if Enabled
    const field_indicator = page.getByText('unfold_more House Admin Email edit check close Text Disabled');
    await expect(field_indicator).toHaveText('unfold_more House Admin Email edit check close Text Disabled');
});


test('Edit Access Permission', async ({ page }) => {
    test.slow();

    // Call login
    await login(page);

    // Access Job Template Settings page
    await page.goto('https://staging.salesconnection.my/templateSettings/ActivityTemplates');

    // Access the Service Job Category
    await page.getByRole('button', { name: 'Meeting/Discussion' }).click();
    await page.locator('a').filter({ hasText: /^Service$/ }).click();

    // Change the Access Permission to All
    await page.locator('li').filter({ hasText: 'unfold_more This Text Is Locked edit check close Text Disabled' }).getByTitle('Toggle field configuration section').click();
    await page.locator('#right-master-box').getByRole('list').locator('div').filter({ hasText: 'unfold_more This Text Is Locked edit check close Text Disabled Editable Field Re' }).getByTitle('Only \'Admin\' will see this field').click();
    await page.locator('#ASX3-save i').click();
    await page.getByRole('button', { name: 'OK' }).click();
    await page.getByRole('button', { name: 'Overwrite Current Template' }).click();
    await page.getByRole('button', { name: 'OK' }).click();

    // Reset back to All Users
    await page.getByRole('button', { name: 'Meeting/Discussion' }).click();
    await page.locator('a').filter({ hasText: /^Service$/ }).click();
    await page.locator('li').filter({ hasText: 'unfold_more This Text Is Locked edit check close Text Disabled' }).getByTitle('Toggle field configuration section').click();
    await page.locator('#right-master-box').getByRole('list').locator('div').filter({ hasText: 'unfold_more This Text Is Locked edit check close Text Disabled Editable Field Re' }).getByTitle('All user type can see this field').first().click();
    await page.locator('#ASX3-save i').click();
    await page.getByRole('button', { name: 'OK' }).click();
    await page.getByRole('button', { name: 'Overwrite Current Template' }).click();

});