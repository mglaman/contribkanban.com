Feature: Create custom node boards
  In order to provide custom boards
  As a user
  I want to specify specific issue Node IDs

  @api @user
  Scenario: I can create a custom node board
    Given I am an anonymous user
    Given users:
    | name              | status | mail              | pass         |
    | behat@example.com | 1      | behat@example.com | Password123! |
    When I am on "/user/login"
    And I fill in the following:
    | Email    | behat@example.com  |
    | Password | Password123!       |
    And I press "Log in"
    And I wait
    Then I should see "behat@example.com"
    When I click "Add Board"
    And I wait
    Then I should see "Add new board"
    When I fill in "Board name" with "Behat Testing board"
      And I fill in "issue-node-id-0" with "3009338"
    And I press "Submit"
    Then I wait to see "Behat Testing board" in the "App header" region
    And I wait to see "[META] Prepare core and Drupal.org to handle semantic versioning for contrib extensions (modules, themes, etc)"
