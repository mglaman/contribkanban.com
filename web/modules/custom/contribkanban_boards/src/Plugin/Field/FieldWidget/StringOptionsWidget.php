<?php

namespace Drupal\contribkanban_boards\Plugin\Field\FieldWidget;

use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\WidgetBase;
use Drupal\Core\Form\FormStateInterface;

abstract class StringOptionsWidget extends WidgetBase {

  /**
   * {@inheritdoc}
   */
  public function formElement(FieldItemListInterface $items, $delta, array $element, array &$form, FormStateInterface $form_state) {
    $selected = [];
    foreach ($items as $item) {
      $selected[] = $item->value;
    }

    $element += [
      '#type' => $items->getFieldDefinition()->getFieldStorageDefinition()->getCardinality() == 1 ? 'radios' : 'checkboxes',
      '#default_value' => $selected,
      '#options' => $this->getOptions(),
      '#element_validate' => [[get_class($this), 'validateElement']],
    ];

    return $element;
  }

  /**
   * Element validation helper.
   */
  public static function validateElement(array $element, FormStateInterface $form_state) {
    if (is_array($element['#value'])) {
      $values = array_values($element['#value']);
    }
    else {
      $values = [$element['#value']];
    }

    $items = [];
    foreach ($values as $value) {
      $items[] = ['value' => $value];
    }

    $form_state->setValueForElement($element, $items);
  }

  /**
   *
   */
  abstract public function getOptions();

}
