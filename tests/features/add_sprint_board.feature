Feature: Add a sprint board
  As a Drupalista
  I can tag an issue tag
  To create a sprint board

  Scenario: I can add a sprint board for the API-First initiative
    Given I am an anonymous user
    And I am on "/boards/sprint"
    When I fill in "Tag name" with "API-First Initiative"
    And I press "Add sprint"
    Then I wait to see "API-First Initiative" in the "App Header"
