import { $ } from '@wdio/globals'
import Page from './page.js';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class LoginPage extends Page {
    /**
     * define selectors using getter methods
     */
    get inputUsername () {
        return $('#my-input');
    }

    get btnSubmit () {
        return $('#my-button');
    }

    /**
     * a method to encapsule automation code to interact with the page
     * e.g. to login using username and password
     */
    async login (username) {
        await this.inputUsername.waitForExist({ timeout: 5000 });
        await this.inputUsername.setValue(username);
        await this.btnSubmit.click();
    }

    /**
     * overwrite specific options to adapt it to page object
     */
    open () {
        return super.open('index.html');
    }
}

export default new LoginPage();
