<?php

namespace Drupal\contribkanban_boards\Plugin\Field\FieldWidget;

use Drupal\Core\Field\FieldDefinitionInterface;
use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Form\FormStateInterface;

/**
 * Plugin implementation of the 'status_options' widget.
 *
 * @FieldWidget(
 *   id = "category_options",
 *   label = @Translation("Check boxes/radio buttons"),
 *   field_types = {
 *     "string",
 *   },
 *   multiple_values = TRUE
 * )
 */
class CategoryOptionsWidget extends StringOptionsWidget {

  /**
   * {@inheritdoc}
   */
  public function getOptions() {
    return [
      '1' => 'Bug',
      '2' => 'Task',
      '3' => 'Feature',
      '4' => 'Support',
      '5' => 'Plan',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public static function isApplicable(FieldDefinitionInterface $field_definition) {
    return $field_definition->getName() == 'category';
  }

}
