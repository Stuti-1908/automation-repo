// features/pageobjects/CourseraHomePage.js

import { $ } from '@wdio/globals';

/**
 * This class represents the Home Page of the Coursera Clone application.
 * It contains getters for various UI elements and methods to interact with them.
 */
class CourseraHomePage {
  // --- Hero Section and Navigation ---

  /**
   * Getter for the main navigation bar container.
   * Based on the image provided, it targets the main nav element.
   * @returns {WebdriverIO.Element}
   */
  get navBar() {
    // Try <header> as the navigation bar is often a header in React apps.
    return $('header');
  }

  get forIndividuals() {
    return $('a=For Individuals');
  }
  get forBusinesses() {
    return $('a=For Businesses');
  }
  get forUniversities() {
    return $('a=For Universities');
  }
  get forGovernments() {
    return $('a=For Governments');
  }

  /**
   * Getter for a heading element by its text.
   * @param {string} headingText - The text of the heading.
   * @returns {WebdriverIO.Element}
   */
  heading(headingText) {
    // Using a partial text match `*=`, which is flexible for h1, h2, etc.
    return $(`h1*=${headingText}`);
  }

  /**
   * Getter for a button by its visible text.
   * @param {string} buttonText - The text of the button.
   * @returns {WebdriverIO.Element}
   */
  button(buttonText) {
    // This will match <button>Join for free</button> or <a role="button">...</a>
    return $(`button=${buttonText}`);
  }

  // --- Career Roles Carousel ---

  /**
   * Clicks on a specific role within the career carousel.
   * @param {string} roleName - The name of the role to click (e.g., "Data Analyst").
   */
  async clickRoleInCarousel(roleName) {
    // Assuming roles are identifiable by their text content. XPath is great for this.
    const roleElement = await $(`//div[contains(@class, 'carousel')]//div[text()="${roleName}"]`);
    await roleElement.click();
  }

  /**
   * Getter for the feedback text from a specific person.
   * @param {string} personName - The name of the person giving feedback (e.g., "Rachel L.").
   * @returns {WebdriverIO.Element}
   */
  feedbackBy(personName) {
    // This selector looks for any element containing the specified text.
    return $(`//*[contains(text(),"${personName}")]`);
  }

  // --- General Sections and Cards ---

  /**
   * Getter for all degree program cards.
   * @returns {WebdriverIO.ElementArray}
   */
  get degreeProgramCards() {
    // $$ returns an array of elements. '.degree-card' is a plausible selector.
    return $$('.degree-card');
  }

  /**
   * Getter for a section element by its heading text.
   * @param {string} sectionTitle - The title of the section (e.g., "Explore Coursera").
   * @returns {WebdriverIO.Element}
   */
  section(sectionTitle) {
    return $(`//*[text()="${sectionTitle}"]`);
  }

  /**
   * Getter for a category link within the "Explore" section.
   * @param {string} categoryName - The name of the category (e.g., "Data Science").
   * @returns {WebdriverIO.Element}
   */
  categoryLink(categoryName) {
    return $(`a=${categoryName}`);
  }

  /**
   * Getter for a testimonial by a specific user.
   * @param {string} userName - The name of the user in the testimonial.
   * @returns {WebdriverIO.Element}
   */
  testimonialBy(userName) {
    return $(`//*[contains(text(),'${userName}')]`);
  }

  /**
   * Getter for the container of company logos.
   * @returns {WebdriverIO.Element}
   */
  get companyLogosContainer() {
    // Assuming logos are in a div with a specific, identifiable class.
    return $('.company-logos');
  }

  // --- Footer ---

  /**
   * Getter for the call-to-action element at the bottom of the page.
   * @param {string} text - The text of the call-to-action.
   * @returns {WebdriverIO.Element}
   */
  callToAction(text) {
    return $(`//*[contains(text(),"${text}")]`);
  }

  /**
   * Getter for a specific footer section by its title.
   * @param {string} sectionTitle - The title of the footer section.
   * @returns {WebdriverIO.Element}
   */
  footerSection(sectionTitle) {
    return $(`//footer//h3[text()="${sectionTitle}"]`);
  }

  /**
   * Opens the base URL of the application.
   * @async
   */
  async open() {
    await browser.url('/');
  }
}

export default new CourseraHomePage();