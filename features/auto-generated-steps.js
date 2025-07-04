import { Then } from '@wdio/cucumber-framework';
import assert from 'assert';

Then('I should see the "{word}" element', async function(selector) {
    if (typeof selector !== 'string') {
        throw new Error('Selector parameter is not defined or not a string');
    }
    let el;
    if (selector.startsWith('.') || selector.startsWith('#')) {
        el = await $(selector);
    } else {
        el = await $(`#${selector}`);
    }
    assert.ok(await el.isExisting(), `${selector} element not found`);
});
