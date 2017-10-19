<?php

namespace Drupal\contribkanban_pages\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;

class AddBoardForm extends FormBase {

  public function getFormId() {
    return 'add_board_form';
  }

  public function buildForm(array $form, FormStateInterface $form_state) {
    $form['#theme'] = 'add_board_form';
    $form['machine_name'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Project machine name'),
      '#title_display' => 'hidden',
      '#placeholder' => $this->t('Project machine name'),
    ];
    $form['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Add project')
    ];
    return $form;
  }

  public function submitForm(array &$form, FormStateInterface $form_state) {
    // TODO: Implement submitForm() method.
  }


}
