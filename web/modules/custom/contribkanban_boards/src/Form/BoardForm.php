<?php

namespace Drupal\contribkanban_boards\Form;

use Drupal\Core\Entity\ContentEntityForm;
use Drupal\Core\Form\FormStateInterface;

class BoardForm extends ContentEntityForm {

  /**
   * {@inheritdoc}
   */
  public function form(array $form, FormStateInterface $form_state) {
    $form = parent::form($form, $form_state);
    $form['#theme'] = ['board_form'];
    $form['#attached']['library'][] = 'contribkanban_boards/form';

    $form['footer'] = [
      '#type' => 'container',
      '#weight' => 99,
      '#attributes' => [
        'class' => ['board-form-footer'],
      ],
    ];
    $form['advanced'] = [
      '#type' => 'container',
      '#attributes' => ['class' => ['entity-meta']],
      '#weight' => 99,
    ];
    $form['basic_info'] = [
      '#attributes' => ['class' => ['entity-meta__header']],
      '#type' => 'container',
      '#group' => 'advanced',
      '#weight' => -100,
      'meta_title' => [
        '#weight' => -100,
        '#type' => 'html_tag',
        '#tag' => 'h3',
        '#value' => $this->t('Board information'),
        '#attributes' => [
          'class' => ['entity-meta__title'],
        ],
      ],
    ];

    $form['title']['#group'] = 'basic_info';
    if (isset($form['project_nid'])) {
      $form['project_nid']['#group'] = 'basic_info';
    }
    if (isset($form['tag'])) {
      $form['tag']['#group'] = 'basic_info';
    }
    if (isset($form['parent_issue'])) {
      $form['parent_issue']['#group'] = 'basic_info';
    }
    if (isset($form['version'])) {
      $form['version']['#group'] = 'basic_info';
    }
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function save(array $form, FormStateInterface $form_state) {
    $result = parent::save($form, $form_state);
    $form_state->setRedirectUrl($this->entity->toUrl('edit-form'));
    return $result;
  }

}
