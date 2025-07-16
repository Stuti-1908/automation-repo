// features/pageobjects/BasePage.js
import { browser } from '@wdio/globals';

// The 'export default' syntax is the modern ES Module way to export.
export default class BasePage {
    async open(path) {
        await browser.url(path);
    }
}