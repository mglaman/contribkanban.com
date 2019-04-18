Feature: Create custom node boards
  In order to provide custom boards
  As a user
  I want to specify specific issue Node IDs

  @api @user
  Scenario: I can create a custom node board
    Given users:
    | name              | status | mail              | pass         |
    | behat@example.com | 1      | behat@example.com | Password123! |
    When I am on "/user/login"
    And I fill in the following:
    | Email    | behat@example.com  |
    | Password | Password123!       |
    And I press "Log in"
    Then I should see "behat@example.com"
