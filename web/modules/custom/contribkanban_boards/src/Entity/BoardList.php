<?php

namespace Drupal\contribkanban_boards\Entity;

use Drupal\Core\Entity\ContentEntityBase;
use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\Core\Field\BaseFieldDefinition;

/**
 * Defines the 'board' entity class.
 *
 * @ContentEntityType(
 *   id = "board_list",
 *   label = @Translation("Board list"),
 *   bundle_label = @Translation("Board provider"),
 *   bundle_plugin_type = "board_provider",
 *   base_table = "board",
 *   admin_permission = "administer content",
 *   fieldable = TRUE,
 *   admin_permission = "administer board_list",
 *   permission_granularity = "bundle",
 *   entity_keys = {
 *     "id" = "board_list_id",
 *     "uuid" = "uuid",
 *     "bundle" = "type",
 *     "label" = "title",
 *   },
 *   handlers = {
 *     "access" = "\Drupal\Core\Entity\EntityAccessControlHandler",
 *     "permission_provider" = "\Drupal\entity\EntityPermissionProvider",
 *     "form" = {
 *       "default" = "\Drupal\Core\Entity\ContentEntityForm",
 *     },
 *   },
 * )
 */
class BoardList extends ContentEntityBase implements BoardInterface {

  public static function baseFieldDefinitions(EntityTypeInterface $entity_type) {
    $fields = parent::baseFieldDefinitions($entity_type);
    $fields['title'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Title'))
      ->setDescription(t('The board title'));
    return $fields;
  }

}
