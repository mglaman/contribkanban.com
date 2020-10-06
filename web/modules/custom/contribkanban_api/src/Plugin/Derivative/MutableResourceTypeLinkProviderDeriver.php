<?php

namespace Drupal\contribkanban_api\Plugin\Derivative;

use Drupal\Component\Plugin\Derivative\DeriverBase;
use Drupal\Core\Plugin\Discovery\ContainerDeriverInterface;
use Drupal\jsonapi\ResourceType\ResourceType;
use Drupal\jsonapi\ResourceType\ResourceTypeRepositoryInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Derives plugins that add HATEOAS controls for mutable resources.
 */
final class MutableResourceTypeLinkProviderDeriver extends DeriverBase implements ContainerDeriverInterface {

  /**
   * The JSON:API resource type repository.
   *
   * @var \Drupal\jsonapi\ResourceType\ResourceTypeRepositoryInterface
   */
  protected $resourceTypeRepository;

  /**
   * MutableResourceTypeLinkProviderDeriver constructor.
   *
   * @param \Drupal\jsonapi\ResourceType\ResourceTypeRepositoryInterface $resource_type_repository
   *   The JSON:API resource type repository.
   */
  public function __construct(ResourceTypeRepositoryInterface $resource_type_repository) {
    $this->resourceTypeRepository = $resource_type_repository;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, $base_plugin_id) {
    return new self(
      $container->get('jsonapi.resource_type.repository')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function getDerivativeDefinitions($base_plugin_definition) {
    $resource_types = array_filter($this->resourceTypeRepository->all(), function (ResourceType $resource_type) {
      return $resource_type->isLocatable() && $resource_type->isMutable();
    });
    $derivative_definitions = array_reduce($resource_types, function ($derivative_definitions, ResourceType $resource_type) use ($base_plugin_definition) {
      foreach (['update', 'remove'] as $operation) {
        $derivative_id = "{$resource_type->getTypeName()}.$operation";
        $derivative_definitions[$derivative_id] = array_merge($base_plugin_definition, [
          'link_key' => 'self',
          'link_relation_type' => $operation,
          'link_context' => [
            'resource_object' => $resource_type->getTypeName(),
          ],
          'default_configuration' => [
            'operation' => $operation,
          ],
        ]);
      }
      return $derivative_definitions;
    }, []);
    return $derivative_definitions;
  }

}
