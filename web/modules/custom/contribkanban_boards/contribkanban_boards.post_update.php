<?php

/**
 * @file
 * Post update functions for contribkanban_boards.
 */

use Drupal\contribkanban_boards\Entity\BoardInterface;
use Drupal\contribkanban_boards\Entity\NodeBoard;
use Drupal\Component\Plugin\Exception\PluginNotFoundException;
use Drupal\Core\Utility\UpdateException;

/**
 * Add Collaboration field and populate defaults.
 */
function contribkanban_boards_post_update_node_boards_collaboration() {
  // Old update hook, commenting out deprecated call.
  // \Drupal::entityDefinitionUpdateManager()->applyUpdates();
  $node_board_storage = \Drupal::entityTypeManager()->getStorage('node_board');
  foreach ($node_board_storage->loadMultiple() as $node_board) {
    assert($node_board instanceof NodeBoard);
    $node_board->get('collaboration')->setValue(NodeBoard::IS_SHARED);
    $node_board->save();
  }
}

/**
 * No where else better to add this.
 */
function contribkanban_boards_post_update_migrate_to_install_profile() {
  $profile_name = 'contribkanban_installer';
  \Drupal::keyValue('system.schema')->delete('standard');
  \Drupal::keyValue('system.schema')->set($profile_name, 8000);

  $extension_config = \Drupal::configFactory()->getEditable('core.extension');
  $modules = $extension_config->get('module');
  $modules[$profile_name] = 1000;
  $extension_config->set('module', $modules);
  $extension_config->set('profile', $profile_name);
  $extension_config->save();
}

/**
 * Merge the per-project-type board bundles into drupalorg_project.
 */
function contribkanban_boards_post_update_migrate_board_providers_bundles() {
  $board_provider_manager = \Drupal::getContainer()->get('plugin.manager.board_provider');
  $board_provider_manager->clearCachedDefinitions();

  $entity_type_manager = \Drupal::entityTypeManager();

  try {
    $board_definition = $entity_type_manager->getDefinition('board');
    $board_list_definition = $entity_type_manager->getDefinition('board_list');
  }
  catch (PluginNotFoundException $e) {
    throw new UpdateException('Should not happen.', 0, $e);
  }

  $database = \Drupal::database();

  $board_data_table = $board_definition->getDataTable();
  if (!$board_data_table) {
    $board_data_table = $board_definition->getBaseTable();
  }
  $database->update($board_data_table)
    ->fields([
      'type' => 'drupalorg_project',
    ])
    ->condition('type', [
      'drupalorg_commerce',
      'drupalorg_distribution',
      'drupalorg_drupalorg',
      'drupalorg_module',
      'drupalorg_theme',
    ], 'IN')
    ->execute();

  $board_list_data_table = $board_list_definition->getDataTable();
  if (!$board_list_data_table) {
    $board_list_data_table = $board_list_definition->getBaseTable();
  }
  $database->update($board_list_data_table)
    ->fields([
      'type' => 'drupalorg_project',
    ])
    ->condition('type', [
      'drupalorg_commerce',
      'drupalorg_distribution',
      'drupalorg_drupalorg',
      'drupalorg_module',
      'drupalorg_theme',
    ], 'IN')
    ->execute();
}

/**
 * Delete custom and stale boards, orphaned lists, and duplicate names.
 */
function contribkanban_boards_post_update_prune_boards(): string {
  $entity_type_manager = \Drupal::entityTypeManager();
  $board_storage = $entity_type_manager->getStorage('board');
  $list_storage = $entity_type_manager->getStorage('board_list');

  // Custom boards were built in the admin UI and are all abandoned. The
  // experience_builder project was renamed to canvas, which has its own board.
  $stale = $board_storage->loadByProperties(['type' => 'drupalorg_custom'])
    + $board_storage->loadByProperties(['machine_name' => 'experience_builder']);
  $board_storage->delete($stale);

  // Lists whose board no longer exists.
  $database = \Drupal::database();
  $query = $database->select('board_list', 'l');
  $query->leftJoin('board', 'b', '[b].[board_id] = [l].[board_id]');
  $orphan_ids = $query->fields('l', ['board_list_id'])
    ->isNull('b.board_id')
    ->execute()
    ->fetchCol();
  $list_storage->delete($list_storage->loadMultiple($orphan_ids));

  // Boards are routed by machine name, so a duplicate is unreachable. Keep
  // the oldest board's name and suffix the others.
  $duplicates = $database->select('board', 'b')
    ->fields('b', ['machine_name'])
    ->groupBy('b.machine_name')
    ->having('COUNT(*) > 1')
    ->execute()
    ->fetchCol();
  $machine_names = \Drupal::service('contribkanban_boards.machine_names');
  $renamed = [];
  foreach ($duplicates as $machine_name) {
    $ids = $board_storage->getQuery()
      ->accessCheck(FALSE)
      ->condition('machine_name', $machine_name)
      ->sort('board_id')
      ->execute();
    array_shift($ids);
    foreach ($board_storage->loadMultiple($ids) as $board) {
      assert($board instanceof BoardInterface);
      $suffix = $board->bundle() === 'drupalorg_sprint' ? 'tag' : 'board';
      $new_name = $machine_names->unique($machine_name, $suffix, (int) $board->id());
      $board->set('machine_name', $new_name)->save();
      $renamed[] = "$machine_name to $new_name";
    }
  }

  return sprintf(
    'Deleted %d boards and %d orphaned lists. Renamed %s.',
    count($stale),
    count($orphan_ids),
    $renamed ? implode(', ', $renamed) : 'no boards'
  );
}
