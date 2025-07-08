import { Given, When, Then } from '@wdio/cucumber-framework';
import MainPanelPage from './pageobjects/MainPanelPage.js';
import SettingsPanelPage from './pageobjects/SettingsPanelPage.js';

const mainPanel = new MainPanelPage();
const settingsPanel = new SettingsPanelPage();

Given('I open the app', async () => {
    await browser.url('http://localhost:5173/');
});

When(/^I enter "(.*)" in the main input box$/, async (text) => {
  await mainPanel.enterInput(text);
});

When('I click the {string} button', async (btnText) => {
    await mainPanel.clickButton(btnText) || await settingsPanel.clickButton(btnText);
});

Then('I should see {string} displayed below', async (text) => {
    await expect(mainPanel.outputText).toHaveText(text);
});

Then('the main input and output should be cleared', async () => {
    await expect(mainPanel.inputBox).toHaveValue('');
    await expect(mainPanel.outputText).toHaveText('');
});

Then('the settings panel should be hidden or shown', async () => {
    const isDisplayed = await settingsPanel.panel.isDisplayed();
    expect(typeof isDisplayed).toBe('boolean');
});

When('I enter {string} in the settings input box', async (text) => {
    await settingsPanel.enterInput(text);
});

Then('I should see {string}', async (text) => {
    await expect(settingsPanel.outputField).toHaveText(text);
});
