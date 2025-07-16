// features/step-definitions/steps.js

// Switched from 'require' to 'import' to match the page objects
import { Given, When, Then } from '@wdio/cucumber-framework';
import { expect } from '@wdio/globals';

import CourseraHomePage from '../pageobjects/CourseraHomePage.js';
import CourseraBusinessesPage from '../pageobjects/CourseraBusinessesPage.js';
import CourseraUniversitiesPage from '../pageobjects/CourseraUniversitiesPage.js';
import CourseraGovernmentsPage from '../pageobjects/CourseraGovernmentsPage.js';

const pages = {
    homepage: CourseraHomePage,
    business: CourseraBusinessesPage,
    universities: CourseraUniversitiesPage,
    governments: CourseraGovernmentsPage
};

Given(/^I am on the CourseraClone homepage$/, async () => {
    await browser.url('http://localhost:5173');
});

When(/^I navigate to the "([^\"]+)" page$/, async (page) => {
    const links = {
        homepage: '/',
        business: '/page2',
        universities: '/page3',
        governments: '/page4'
    };
    await browser.url(`http://localhost:5173${links[page]}`);
});

Then(/^I should be on the "([^\"]+)" page$/, async (page) => {
    const paths = {
        homepage: '/',
        business: '/page2',
        universities: '/page3',
        governments: '/page4'
    };
    const url = await browser.getUrl();
    expect(url).toContain(paths[page]);
});
