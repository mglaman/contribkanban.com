<?php

namespace Drupal\contribkanban_boards\Plugin\Field\FieldWidget;

use Drupal\Core\Field\FieldDefinitionInterface;
use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Form\FormStateInterface;

/**
 * Plugin implementation of the 'status_options' widget.
 *
 * @FieldWidget(
 *   id = "status_options",
 *   label = @Translation("Check boxes/radio buttons"),
 *   field_types = {
 *     "string",
 *   },
 *   multiple_values = TRUE
 * )
 */
class StatusOptionsWidget extends StringOptionsWidget {

  /**
   * {@inheritdoc}
   */
  public function getOptions() {
    return [
      '1' => 'Active',
      '2' => 'Fixed',
      '8' => 'Needs Review',
      '13' => 'Needs Work',
      '14' => 'RTBC',
      '15' => 'Patch (to be ported)',
      '4' => 'Postponed',
      '16' => 'Postponed (Needs more info)',
      '7' => 'Closed (Fixed)',
      '3' => 'Closed (Duplicate)',
      '5' => 'Closed (Won\'t Fix)',
      '6' => 'Closed (Works as designed)',
      '18' => 'Closed (Cannot Reproduce)',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public static function isApplicable(FieldDefinitionInterface $field_definition) {
    return $field_definition->getName() == 'statuses';
  }

}
