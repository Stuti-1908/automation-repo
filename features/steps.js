import { Given, Then } from '@wdio/cucumber-framework';
import assert from 'assert';

Given('I open the app', async () => {
    await browser.url('index.html');
});
Given('I open the settings page', async () => {
    await browser.url('settings.html');
});

Then('I should see the input box', async () => {
    await $('#my-input').waitForExist({ timeout: 5000 });
    const exists = await $('#my-input').isExisting();
    assert.ok(exists, 'Input box not found');
});

Then('I should see the button', async () => {
    await $('#my-button').waitForExist({ timeout: 5000 });
    const exists = await $('#my-button').isExisting();
    assert.ok(exists, 'Button not found');
});


