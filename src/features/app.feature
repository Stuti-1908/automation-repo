Feature: Hey There App
  As a user
  I want to use the Hey There App
  So that I can check selectors and navigate between pages

  Scenario: Navigate to About page
    Given I am on the app homepage
    When I click on About in navigation
    Then I should see the About page

  Scenario: Use CSS selector checker
    Given I am on the app homepage
    When I enter selector "div" and check it
    Then I should see the selector result

  Scenario: Send contact message
    Given I am on the app homepage
    When I fill out the contact form
    Then I should see a success message

  Scenario: Navigate back to Home
    Given I am on the About page
    When I click on Home in navigation
    Then I should see the Home page