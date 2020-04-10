<?php

declare(strict_types=1);

namespace Drupal\contribkanban_api\EventSubscriber;

use Drupal\jsonapi\ResourceType\ResourceTypeBuildEvent;
use Drupal\jsonapi\ResourceType\ResourceTypeBuildEvents;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

final class ResourceTypeBuildSubscriber implements EventSubscriberInterface {

  /**
   *
   */
  public static function getSubscribedEvents() {
    return [
      ResourceTypeBuildEvents::BUILD => 'onResourceTypeBuild',
    ];
  }

  /**
   *
   */
  public function onResourceTypeBuild(ResourceTypeBuildEvent $event) {
    $entities_to_disable = [
      'block', 'field_config', 'field_storage_config', 'filter_format',
      'view', 'base_field_override', 'entity_view_mode', 'entity_view_display',
      'entity_form_mode', 'date_format', 'user_role', 'entity_form_display',
      'menu', 'action', 'rest_resource_config', 'page', 'page_variant', 'node_type',
      'node', 'path_alias',
    ];
    [$entity_type_id, $bundle] = explode('--', $event->getResourceTypeName());
    if (in_array($entity_type_id, $entities_to_disable, TRUE)) {
      $event->disableResourceType();
    }
    foreach ($event->getFields() as $field) {
      // Disable the internal Drupal identifiers.
      if (strpos($field->getPublicName(), 'drupal_internal__') === 0) {
        $event->disableField($field);
      }
      elseif ($field->getPublicName() === $entity_type_id . '_type') {
        $event->disableField($field);
      }
    }
  }

}
