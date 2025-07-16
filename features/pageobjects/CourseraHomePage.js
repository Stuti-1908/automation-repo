// features/pageobjects/CourseraHomePage.js
import { $ } from '@wdio/globals';
import BasePage from './BasePage.js'; // Use .js extension for clarity

class CourseraHomePage extends BasePage {
    get heroHeading() { return $('h1=Learn without limits'); }
    get navLinkForBusinesses() { return $('a=For Businesses'); }
    get navLinkForUniversities() { return $('a=For Universities'); }
    get navLinkForGovernments() { return $('a=For Governments'); }

    async navigateTo(pageName) {
        switch (pageName.toLowerCase()) {
            case 'business':
                await this.navLinkForBusinesses.click();
                break;
            case 'universities':
                await this.navLinkForUniversities.click();
                break;
            case 'governments':
                await this.navLinkForGovernments.click();
                break;
            default:
                throw new Error(`Navigation to page "${pageName}" is not defined.`);
        }
    }

    async open() {
        await super.open('/');
    }
}

export default new CourseraHomePage();