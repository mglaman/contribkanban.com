<?php

namespace Drupal\contribkanban_projects\Entity;

use Drupal\Core\Entity\EntityStorageInterface;
use Drupal\Core\Field\BaseFieldDefinition;
use Drupal\Core\Entity\ContentEntityBase;
use Drupal\Core\Entity\EntityChangedTrait;
use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\user\UserInterface;

/**
 * Defines the Project entity.
 *
 * @ingroup contribkanban_projects
 *
 * @ContentEntityType(
 *   id = "project",
 *   label = @Translation("Project"),
 *   handlers = {
 *     "list_builder" = "Drupal\contribkanban_projects\ProjectListBuilder",
 *     "access" = "\Drupal\entity\EntityAccessControlHandler",
 *     "permission_provider" = "\Drupal\entity\EntityPermissionProvider",
 *     "views_data" = "\Drupal\views\EntityViewsData",
 *     "form" = {
 *       "default" = "Drupal\contribkanban_projects\Form\ProjectForm",
 *       "add" = "Drupal\contribkanban_projects\Form\ProjectForm",
 *       "edit" = "Drupal\contribkanban_projects\Form\ProjectForm",
 *       "delete" = "\Drupal\Core\Entity\ContentEntityDeleteForm",
 *     },
 *     "route_provider" = {
 *       "html" = "\Drupal\Core\Entity\Routing\AdminHtmlRouteProvider",
 *     },
 *   },
 *   base_table = "project",
 *   admin_permission = "administer project",
 *   entity_keys = {
 *     "id" = "id",
 *     "label" = "name",
 *     "uuid" = "uuid",
 *   },
 *   links = {
 *     "canonical" = "/admin/structure/project/{project}",
 *     "add-form" = "/admin/structure/project/add",
 *     "edit-form" = "/admin/structure/project/{project}/edit",
 *     "delete-form" = "/admin/structure/project/{project}/delete",
 *     "collection" = "/admin/structure/project",
 *   },
 * )
 */
class Project extends ContentEntityBase implements ProjectInterface {

  /**
   * {@inheritdoc}
   */
  public static function baseFieldDefinitions(EntityTypeInterface $entity_type) {
    $fields = parent::baseFieldDefinitions($entity_type);

    $fields['name'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Name'))
      ->setReadOnly(TRUE);

    $fields['machine_name'] = BaseFieldDefinition::create('string')
      ->setLabel('Machine name')
      ->setReadOnly(TRUE);

    $fields['project_type'] = BaseFieldDefinition::create('string')
      ->setLabel('Project type')
      ->setReadOnly(TRUE);

    $fields['version_format'] = BaseFieldDefinition::create('string')
      ->setLabel('Version format')
      ->setReadOnly(TRUE);

    $fields['nid'] = BaseFieldDefinition::create('string')
      ->setLabel('Node ID')
      ->setReadOnly(TRUE);

    $fields['components'] = BaseFieldDefinition::create('string')
      ->setLabel('Components')
      ->setCardinality(BaseFieldDefinition::CARDINALITY_UNLIMITED)
      ->setReadOnly(TRUE);

    $fields['versions'] = BaseFieldDefinition::create('string')
      ->setLabel('Versions')
      ->setCardinality(BaseFieldDefinition::CARDINALITY_UNLIMITED)
      ->setReadOnly(TRUE);

    return $fields;
  }

}
