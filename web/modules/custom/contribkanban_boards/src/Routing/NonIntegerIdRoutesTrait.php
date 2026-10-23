<?php

declare(strict_types=1);

namespace Drupal\contribkanban_boards\Routing;

use Symfony\Component\Routing\RouteCollection;

/**
 * Lets entity routes take a value other than the serial ID.
 *
 * Core requires \d+ for the entity parameter of entity types with integer
 * IDs. Boards are routed by machine name and node boards by UUID, and their
 * parameter converters load them by that value.
 */
trait NonIntegerIdRoutesTrait {

  /**
   * Removes the integer requirement from the entity parameter.
   */
  protected function removeIntegerIdRequirement(RouteCollection $collection, string $entity_type_id): RouteCollection {
    foreach ($collection as $route) {
      $requirements = $route->getRequirements();
      if (($requirements[$entity_type_id] ?? NULL) === '\d+') {
        unset($requirements[$entity_type_id]);
        $route->setRequirements($requirements);
      }
    }
    return $collection;
  }

}
