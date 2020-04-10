<?php

namespace Drupal\contribkanban_boards\Plugin\Field\FieldWidget;

use Drupal\Core\Field\FieldDefinitionInterface;

/**
 * Plugin implementation of the 'status_options' widget.
 *
 * @FieldWidget(
 *   id = "priority_options",
 *   label = @Translation("Check boxes/radio buttons"),
 *   field_types = {
 *     "string",
 *   },
 *   multiple_values = TRUE
 * )
 */
class PriorityOptionsWidget extends StringOptionsWidget {

  /**
   * {@inheritdoc}
   */
  public function getOptions() {
    return [
      '100' => 'Minor',
      '200' => 'Normal',
      '300' => 'Major',
      '400' => 'Critical',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public static function isApplicable(FieldDefinitionInterface $field_definition) {
    return $field_definition->getName() == 'priority';
  }

}
