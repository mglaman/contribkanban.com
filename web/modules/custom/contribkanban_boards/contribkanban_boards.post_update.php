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
