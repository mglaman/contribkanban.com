Feature: Add a project to create a kanban board
  As a Drupalista
  I can add a project
  So that I can view its kanban board

  Scenario: I can add the Paragraphs module
    Given I am an anonymous user
      And I am on the homepage
      And I wait
    When I fill in "Project machine name" with "paragraphs"
      And I press "Add a project"
    Then I wait to see "Paragraphs" in the "App Header"

  Scenario: I cannot add an invalid module
    Given I am an anonymous user
      And I am on the homepage
      And I wait
    When I fill in "Project machine name" with "this_does_not_exist"
      And I press "Add a project"
    Then I wait to see "This project is invalid"

