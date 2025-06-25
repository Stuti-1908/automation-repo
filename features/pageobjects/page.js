import { browser } from '@wdio/globals'

export default class Page {
    /**
    * Opens a sub page of the page
    * @param path path of the sub page (e.g. /path/to/page.html)
    */
    open (path = 'index.html') {
        return browser.url(path);
    }

    /**
     * Opens the main page
     */
    openMainPage () {
        return this.open('')
    }

    /**
     * Opens the login page
     */
    openLoginPage () {
        return this.open('login')
    }
}
