Feature: CourseraClone Navigation

  Scenario: Navigate through all main pages
    Given I am on the CourseraClone homepage
    When I click on "For Businesses"
    Then I should be on the Businesses page

    When I click on "For Universities"
    Then I should be on the Universities page

    When I click on "For Governments"
    Then I should be on the Governments page
