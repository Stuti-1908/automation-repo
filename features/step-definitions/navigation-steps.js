import { Given, When, Then } from '@wdio/cucumber-framework';
import assert from 'assert';

const pageSelectors = {
  homepage: '/',
  business: 'For Business',
  universities: 'For Universities',
  governments: 'For Governments',
};

const pageUrls = {
    homepage: '/',
    business: '/business',
    universities: '/universities',
    governments: '/governments',
}

Given('I am on the CourseraClone homepage', async () => {
  await browser.url(pageUrls.homepage);
});

When('I navigate to the {string} page', async (pageName) => {
  const link = await $(`=${pageSelectors[pageName]}`);
  await link.click();
});

Then('I should be on the {string} page', async (pageName) => {
  const url = await browser.getUrl();
  // Using endsWith is more specific and reliable than includes
  assert.ok(url.endsWith(pageUrls[pageName]), `Expected URL to end with '${pageUrls[pageName]}', but it was '${url}'`);
});

// NEW STEP ADDED TO THE END OF THE FILE
Then('the business page should be verified for refactoring', async () => {
  // This variable exists solely for your refactoring tool to find.
  // If you change the class in your JSX from "text-lg" to "text_lg",
  // your tool should be able to find and update this line.
  const classNameForRefactorTest = 'text-lg';

  // To make this a real, passing test, we'll verify the URL is correct.
  const url = await browser.getUrl();
  assert.ok(url.includes(pageUrls.business), `Expected URL to include '${pageUrls.business}', but it was '${url}'`);

  // You can log this to see it in the test output if you want.
  
});