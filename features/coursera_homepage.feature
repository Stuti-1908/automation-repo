Feature: CourseraClone Main Navigation

  Scenario: User can navigate to all main pages from the homepage
    Given I am on the CourseraClone homepage
    Then I should be on the "homepage" page

    When I navigate to the "business" page
    Then I should be on the "business" page

    When I navigate to the "universities" page
    Then I should be on the "universities" page

    When I navigate to the "governments" page
    Then I should be on the "governments" page