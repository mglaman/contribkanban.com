<?php

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

  \Drupal::service('module_installer')->install([$profile_name]);
  \Drupal::service('module_installer')->uninstall(['standard']);
}
