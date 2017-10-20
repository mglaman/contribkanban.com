<?php

namespace Drupal\contribkanban_pages\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;

class AddSprintForm extends FormBase {

  public function getFormId() {
    return 'add_sprint_form';
  }

  public function buildForm(array $form, FormStateInterface $form_state) {
    $form['#theme'] = 'add_board_form';
    $form['machine_name'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Tag name'),
      '#title_display' => 'hidden',
      '#placeholder' => $this->t('Tag name'),
    ];
    $form['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Add sprint'),
      '#attributes' => [
        'class' => [
          'is-info',
        ],
      ],
    ];
    return $form;
  }

  public function submitForm(array &$form, FormStateInterface $form_state) {
    // @todo look up sprint tid, set machine_name to tag w/o spaces.
  }

}
