import { test, expect } from '@playwright/test';

test('Submit Ads from Google', async ({ page }) => {

  // Access the page
  await page.goto('https://salesconnection.my/pages/customer-management-system.html?utm_source=google&utm_medium=cpc&utm_campaign=test&utm_adset={adgroupid}&utm_group={targetid}&utm_creative={creative}&keyword={keyword}&matchtype={matchtype}&partner={network}');
  
  // Click on the 'I Agree'
  await page.getByRole('button', { name: 'I agree' }).click();

  // Open the Modal
  await page.locator('#nav-menu-container').getByText('Get Started Today').click();

  // Fill in the Form

  // Name
  await page.getByLabel('Our system can be customized to suit your business needs whether you are an MNC or SME. Fill in the form below for a free consultation and begin empowering your team today').getByPlaceholder('Enter your name').click();
  await page.getByLabel('Our system can be customized to suit your business needs whether you are an MNC or SME. Fill in the form below for a free consultation and begin empowering your team today').getByPlaceholder('Enter your name').fill('Automated Test Reza');
  
  // Email
  await page.getByRole('textbox', { name: 'Enter your email' }).click();
  await page.getByRole('textbox', { name: 'Enter your email' }).fill('automatedreza.sctest731922@yopmail.com');
  
  // Phone Number
  await page.getByLabel('Our system can be customized to suit your business needs whether you are an MNC or SME. Fill in the form below for a free consultation and begin empowering your team today').getByPlaceholder('e.g. 123456789').click();
  await page.getByLabel('Our system can be customized to suit your business needs whether you are an MNC or SME. Fill in the form below for a free consultation and begin empowering your team today').getByPlaceholder('e.g. 123456789').fill('182939100923');
  
  // Company Name
  await page.getByLabel('Our system can be customized to suit your business needs whether you are an MNC or SME. Fill in the form below for a free consultation and begin empowering your team today').getByPlaceholder('Enter your company name').click();
  await page.getByLabel('Our system can be customized to suit your business needs whether you are an MNC or SME. Fill in the form below for a free consultation and begin empowering your team today').getByPlaceholder('Enter your company name').fill('SC Auto Test');
  
  // State
  await page.getByLabel('Our system can be customized to suit your business needs whether you are an MNC or SME. Fill in the form below for a free consultation and begin empowering your team today').locator('#state').selectOption('Selangor');
  
  // Checkbox - Want to Get Email
  await page.getByLabel('Our system can be customized to suit your business needs whether you are an MNC or SME. Fill in the form below for a free consultation and begin empowering your team today').locator('#retain-customer').check();
  
  // Checkbox - What to achieve
  await page.getByLabel('Our system can be customized to suit your business needs whether you are an MNC or SME. Fill in the form below for a free consultation and begin empowering your team today').locator('#organize-schedule').check();
  await page.getByLabel('Our system can be customized to suit your business needs whether you are an MNC or SME. Fill in the form below for a free consultation and begin empowering your team today').locator('#follow-sop').check();
  await page.getByLabel('Our system can be customized to suit your business needs whether you are an MNC or SME. Fill in the form below for a free consultation and begin empowering your team today').locator('#keep-track').check();
  await page.getByLabel('Our system can be customized to suit your business needs whether you are an MNC or SME. Fill in the form below for a free consultation and begin empowering your team today').locator('#mark_consent').check();
  
  // Click submit button
  await page.getByLabel('Our system can be customized to suit your business needs whether you are an MNC or SME. Fill in the form below for a free consultation and begin empowering your team today').getByRole('button', { name: 'Get Your Free Consultation Now' }).click();
});