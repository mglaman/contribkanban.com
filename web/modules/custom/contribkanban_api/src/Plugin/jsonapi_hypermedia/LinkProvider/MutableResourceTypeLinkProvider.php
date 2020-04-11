<?php

namespace Drupal\contribkanban_api\Plugin\jsonapi_hypermedia\LinkProvider;

use Drupal\Core\Cache\CacheableMetadata;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\jsonapi\JsonApiResource\ResourceObject;
use Drupal\jsonapi_hypermedia\AccessRestrictedLink;
use Drupal\jsonapi_hypermedia\Plugin\LinkProviderBase;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Link provider for mutable hypermedia controls.
 *
 * This plugin provides links on mutable resource objects that indicate the
 * clients ability to update and remove the context resource object. These
 * presence of these links can express access control or other business logic
 * so that those rules do not need to be duplicated in the client.
 *
 * @JsonapiHypermediaLinkProvider(
 *   id = "contribkanban_api.mutability_controls",
 *   deriver = "Drupal\contribkanban_api\Plugin\Derivative\MutableResourceTypeLinkProviderDeriver",
 * )
 */
final class MutableResourceTypeLinkProvider extends LinkProviderBase implements ContainerFactoryPluginInterface
{

  use ResourceObjectEntityLoaderTrait;

  /**
   * The JSON:API operation.
   *
   * @var string
   */
  protected $operation;

  /**
   * {@inheritdoc}
   */
  protected function __construct(array $configuration, string $plugin_id, $plugin_definition)
  {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
    assert(!empty($configuration['operation']) && in_array($configuration['operation'], ['update', 'remove'], TRUE), "The operation must be set to either 'update' or 'remove'.");
    $this->operation = $configuration['operation'];
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition)
  {
    $provider = new static($configuration, $plugin_id, $plugin_definition);
    $provider->setEntityRepository($container->get('entity.repository'));
    return $provider;
  }

  /**
   * {@inheritdoc}
   */
  public function getLink($resource_object)
  {
    assert($resource_object instanceof ResourceObject);
    $entity = $this->loadEntityFromResourceObject($resource_object);
    $entity_operation_mapping = [
      'update' => 'update',
      'remove' => 'delete',
    ];
    $access = $entity->access($entity_operation_mapping[$this->operation], NULL, TRUE);
    return AccessRestrictedLink::createLink($access, new CacheableMetadata(), $resource_object->toUrl(), $this->getLinkRelationType());
  }
}
