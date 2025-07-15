import { expect } from '@wdio/globals';
import { Given, When, Then } from '@wdio/cucumber-framework';
import CourseraHomePage from '../pageobjects/CourseraHomePage.js';

Given('I am on the CourseraClone homepage', async () => {
  await CourseraHomePage.open();
});

When('I click on "For Businesses"', async () => {
  await CourseraHomePage.forBusinesses.click();
});

Then('I should be on the Businesses page', async () => {
  expect(await browser.getUrl()).toContain('/page2');
});

When('I click on "For Universities"', async () => {
  await CourseraHomePage.forUniversities.click();
});

Then('I should be on the Universities page', async () => {
  expect(await browser.getUrl()).toContain('/page3');
});

When('I click on "For Governments"', async () => {
  await CourseraHomePage.forGovernments.click();
});

Then('I should be on the Governments page', async () => {
  expect(await browser.getUrl()).toContain('/page4');
});