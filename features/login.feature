Feature: App Panel Interactions

  Scenario: User enters input and clicks the button on main panel
    Given I open the app
    When I enter "Hello World" in the main input box
    And I click the "Click Me" button
    Then I should see "Hello World" displayed below
    When I click the "Reset" button
    Then the main input and output should be cleared

  Scenario: User interacts with the settings panel
    Given I open the app
    When I click the "Toggle Settings" button
    Then the settings panel should be hidden or shown
    When I enter "Dark Mode" in the settings input box
    And I click the "Save Settings" button
    Then I should see "Settings saved to: Dark Mode"
