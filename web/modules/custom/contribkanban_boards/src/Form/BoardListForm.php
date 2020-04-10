<?php

namespace Drupal\contribkanban_boards\Form;

use Drupal\Core\Entity\ContentEntityForm;
use Drupal\Core\Form\FormStateInterface;

class BoardListForm extends ContentEntityForm {

  /**
   *
   */
  public function form(array $form, FormStateInterface $form_state) {
    $form = parent::form($form, $form_state);
    $form['#theme'] = ['board_list_form'];
    $form['#attached']['library'][] = 'contribkanban_boards/form';
    return $form;
  }

}
