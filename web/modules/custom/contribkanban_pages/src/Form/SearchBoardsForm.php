<?php

namespace Drupal\contribkanban_pages\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;

class SearchBoardsForm extends FormBase {

  public function getFormId() {
    return 'search_boards_form';
  }

  public function buildForm(array $form, FormStateInterface $form_state) {
    $form['#theme'] = 'search_boards_form';
    $form['query'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Board name'),
      '#title_display' => 'hidden',
      '#placeholder' => $this->t('Board name'),
      '#size' => 50
    ];
    $form['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Search'),
      '#button_type' => 'primary',
    ];
    return $form;
  }

  public function submitForm(array &$form, FormStateInterface $form_state) {

  }

}
