<?php

use Drupal\Component\Plugin\Exception\PluginNotFoundException;
use Drupal\Core\Utility\UpdateException;

/**
 * Add Collaboration field and populate defaults.
 */
function contribkanban_boards_post_update_node_boards_collaboration() {
  \Drupal::entityDefinitionUpdateManager()->applyUpdates();
  $node_board_storage = \Drupal::entityTypeManager()->getStorage('node_board');
  foreach ($node_board_storage->loadMultiple() as $node_board) {
    $node_board->get('collaboration')->setValue(\Drupal\contribkanban_boards\Entity\NodeBoard::IS_SHARED);
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

function contribkanban_boards_post_update_migrate_board_providers() {
  $board_provider_manager = \Drupal::getContainer()->get('plugin.manager.board_provider');
  $board_provider_manager->clearCachedDefinitions();

  $entity_type_manager = \Drupal::entityTypeManager();

  try {
    $board_definition = $entity_type_manager->getDefinition('board');
    $board_list_definition = $entity_type_manager->getDefinition('board_list');
  } catch (PluginNotFoundException $e) {
    throw new UpdateException('Should not happen.', 0, $e);
  }
  if (!$board_definition || !$board_list_definition) {
    throw new UpdateException('Should not happen.', 0);
  }

  $database = \Drupal::database();

  $board_data_table = $board_definition->getDataTable();
  if (!$board_data_table) {
    $board_data_table = $board_definition->getBaseTable();
  }
  $database->update($board_data_table)
    ->fields([
      'type' => 'drupalorg_project'
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
      'type' => 'drupalorg_project'
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
