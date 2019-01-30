Feature: Add a project to create a kanban board
  As a Drupalista
  I can add a project
  So that I can view its kanban board

  Scenario: I cannot add an invalid module
    Given I am an anonymous user
    And I am on the homepage
    When I fill in "Project machine name" with "this_does_not_exist"
    And I press "Add a project"
    Then I wait to see "This project is invalid"

  Scenario: I can add the Paragraphs module
    Given I am an anonymous user
      And I am on the homepage
    When I fill in "Project machine name" with "paragraphs"
      And I press "Add a project"
    Then I wait to see "Paragraphs" in the "App Header"

  Scenario: I can add the Claro theme
    Given I am an anonymous user
      And I am on the homepage
    When I fill in "Project machine name" with "claro"
      And I press "Add a project"
    Then I wait to see "Claro" in the "App Header"

  Scenario: I can add the Thunder distro
    Given I am an anonymous user
      And I am on the homepage
    When I fill in "Project machine name" with "thunder"
      And I press "Add a project"
    Then I wait to see "Thunder" in the "App Header"

  Scenario: Adding a project again redirects to the existing board.
    Given I am an anonymous user
    And I am on the homepage
    When I fill in "Project machine name" with "paragraphs"
    And I press "Add a project"
    Then I wait to see "Paragraphs" in the "App Header"
