Feature: Coursera Clone Basic Navigation

  As a user of the Coursera Clone application
  I want to navigate between different sections
  So that I can explore courses and learn about the platform

  Scenario: Navigate to About Us page
    Given I am on the Home page
    When I click the "Learn More About Us" link
    Then I should be on the About Us page

  Scenario: Navigate to Contact Us page from About
    Given I am on the About Us page
    When I click the "Get In Touch" button
    Then I should be on the Contact Us page

  Scenario: View a Sample User Profile
    Given I am on the Home page
    When I click the "View Sample Profile" link
    Then I should be on the User Profile page for "Jane Doe"
