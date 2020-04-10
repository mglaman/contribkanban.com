<?php

namespace Drupal\contribkanban_api\Plugin\jsonapi_hypermedia\LinkProvider;

use Drupal\Core\Entity\EntityRepositoryInterface;
use Drupal\jsonapi\JsonApiResource\ResourceObject;

/**
 * Trait for loading the entity represented by a resource object.
 *
 * @internal
 */
trait ResourceObjectEntityLoaderTrait {

  /**
   * The entity repository.
   *
   * @var \Drupal\Core\Entity\EntityRepositoryInterface
   */
  protected $entityRepository;

  /**
   * Sets the entity repository.
   *
   * @param \Drupal\Core\Entity\EntityRepositoryInterface $entity_repository
   *   The entity repository service.
   */
  protected function setEntityRepository(EntityRepositoryInterface $entity_repository) {
    $this->entityRepository = $entity_repository;
  }

  /**
   * Gets the entity represented by the given resource object.
   *
   * @param \Drupal\jsonapi\JsonApiResource\ResourceObject $resource_object
   *   The resource object.
   *
   * @return \Drupal\Core\Entity\EntityInterface|null
   *   The represented entity or NULL if the entity does not exist.
   *
   * @throws \Drupal\Core\Entity\EntityStorageException
   *   Thrown in case the requested entity type does not support UUIDs.
   */
  public function loadEntityFromResourceObject(ResourceObject $resource_object) {
    return $this->entityRepository->loadEntityByUuid($resource_object->getResourceType()->getEntityTypeId(), $resource_object->getId());
  }

}
