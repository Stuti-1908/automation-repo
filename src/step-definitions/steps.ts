import { Given, When, Then } from '@wdio/cucumber-framework';
import { remote } from 'webdriverio';
import { expect } from 'expect-webdriverio';

const browser = await remote({
  capabilities: {
    browserName: 'chrome',
  },
});

Given('I am on the app homepage', async () => {
    await browser.url('/');
});

Given('I am on the About page', async () => {
    await browser.url('/');
    await browser.$('[data-testid="nav-about"]').click();
});

When('I click on About in navigation', async () => {
    await browser.$('[data-testid="nav-about"]').click();
});

When('I click on Home in navigation', async () => {
    await browser.$('[data-testid="nav-home"]').click();
});

When('I enter selector {string} and check it', async (selector: string) => {
    await browser.$('[data-testid="selector-input"]').setValue(selector);
    await browser.$('[data-testid="check-button"]').click();
});

When('I fill out the contact form', async () => {
    await browser.$('[data-testid=\"contact_name"]').setValue('John Doe');
    await browser.$('[data-testid=\"contact-email"]').setValue('john@example.com');
    await browser.$('[data-testid=\"contact-message"]').setValue('Test message');
    await browser.$('[data-testid=\"contact-submit"]').click();
});

Then('I should see the About page', async () => {
    const heading = await browser.$('h2=About Hey There App');
    await expect(heading).toBeDisplayed();
});

Then('I should see the Home page', async () => {
    const heading = await browser.$('h2=CSS Selector Checker');
    await expect(heading).toBeDisplayed();
});

Then('I should see the selector result', async () => {
    const result = await browser.$('[data-testid="selector-result"]');
    await expect(result).toBeDisplayed();
});

Then('I should see a success message', async () => {
    await browser.pause(1000);
    const toast = await browser.$('*=Message sent!');
    await expect(toast).toBeDisplayed();
});
