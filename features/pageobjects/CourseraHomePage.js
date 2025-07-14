// features/pageobjects/CourseraHomePage.js
/**
 * This class represents the Home Page of the Coursera Clone application.
 * It contains getters for various UI elements on the home page.
 */
export default class CourseraHomePage {
  /**
   * Getter for the main title on the Home page.
   * @returns {WebdriverIO.Element} The element representing the home page title.
   */
  get homeTitle() {
    return $('#home-title'); // Selector for the main title
  }

  /**
   * Getter for the "Learn More About Us" link.
   * @returns {WebdriverIO.Element} The element representing the "Learn More About Us" link.
   */
  get learnMoreLink() {
    return $('#learn-more-link'); // Selector for the "Learn More About Us" link
  }

  /**
   * Getter for the "View Sample Profile" link.
   * @returns {WebdriverIO.Element} The element representing the "View Sample Profile" link.
   */
  get userProfileLink() {
    return $('#user-profile-link'); // Selector for the "View Sample Profile" link
  }

  /**
   * Getter for the first feature card title.
   * @returns {WebdriverIO.Element} The element representing the title of the first feature card.
   */
  get featureOneTitle() {
    return $('#feature-one-title'); // Selector for "Dynamic Solutions" title
  }

  /**
   * Opens the base URL of the application.
   * @async
   */
  async open() {
    // Assuming the base URL is configured in wdio.conf.js or passed globally
    await browser.url('/');
  }

  /**
   * Clicks a link on the home page based on its text content.
   * This is a generic method for links that might not have a specific ID.
   * @param {string} linkText The visible text of the link to click.
   * @async
   */
  async clickLinkByText(linkText) {
    const link = await $(`a=${linkText}`); // WebdriverIO selector for link by text
    await link.waitForClickable({ timeout: 10000 });
    await link.click();
  }
}
