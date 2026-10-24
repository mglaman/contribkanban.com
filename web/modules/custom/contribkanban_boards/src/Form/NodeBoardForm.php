<?php

namespace Drupal\contribkanban_boards\Form;

use Drupal\Core\Entity\ContentEntityForm;
use Drupal\Core\Form\FormStateInterface;

class NodeBoardForm extends ContentEntityForm {

  /**
   * {@inheritdoc}
   */
  public function save(array $form, FormStateInterface $form_state) {
    $status = parent::save($form, $form_state);
    $this->messenger()->addStatus($status === SAVED_NEW
      ? $this->t('Created the %title issue collection.', ['%title' => $this->entity->label()])
      : $this->t('Saved the %title issue collection.', ['%title' => $this->entity->label()]));
    $form_state->setRedirectUrl($this->entity->toUrl());
    return $status;
  }

}
