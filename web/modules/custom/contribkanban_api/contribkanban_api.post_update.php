<?php declare(strict_types = 1);

use Drupal\consumers\Entity\Consumer;
use Drupal\Core\Entity\EntityRepositoryInterface;

/**
 *
 */
function contribkanban_api_post_update_ensure_consumer() {
  $initial_consumer = Consumer::load(1);
  if ($initial_consumer) {
    $initial_consumer->delete();
  }
  contribkanban_api_ensure_default_consumer();
}

function contribkanban_api_post_update_remove_consumer_secret() {
  $entity_repository = \Drupal::service('entity.repository');
  assert($entity_repository instanceof EntityRepositoryInterface);
  $consumer = $entity_repository->loadEntityByUuid('consumer', 'd4f7c501-cff9-4a3f-bae7-aec1db19456c');
  assert($consumer instanceof Consumer);
  $consumer->set('secret', NULL);
  $consumer->save();
}
