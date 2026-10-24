<?php

/**
 * @file
 * Post update functions for contribkanban_projects.
 */

declare(strict_types=1);

use Drupal\contribkanban_boards\Entity\BoardInterface;

/**
 * Flag projects whose project boards already read GitLab.
 *
 * The contribkanban:flag-gitlab-boards Drush command flags the rest from
 * drupal.org.
 */
function contribkanban_projects_post_update_seed_gitlab_issues(): void {
  $boards = \Drupal::entityTypeManager()->getStorage('board');
  $board_ids = $boards->getQuery()
    ->accessCheck(FALSE)
    ->condition('type', 'drupalorg_project')
    ->condition('gitlab_work_items', 1)
    ->execute();
  $nids = [];
  foreach ($boards->loadMultiple($board_ids) as $board) {
    assert($board instanceof BoardInterface);
    $nids[] = (string) $board->get('project_nid')->value;
  }
  $nids = array_values(array_filter(array_unique($nids)));
  if ($nids === []) {
    return;
  }
  $projects = \Drupal::entityTypeManager()->getStorage('project');
  $project_ids = $projects->getQuery()
    ->accessCheck(FALSE)
    ->condition('nid', $nids, 'IN')
    ->execute();
  foreach ($projects->loadMultiple($project_ids) as $project) {
    $project->set('gitlab_issues', TRUE)->save();
  }
}
