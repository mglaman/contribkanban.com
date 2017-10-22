<?php

namespace Drupal\contribkanban_pages\Form;

use Drupal\contribkanban_boards\Entity\Board;
use Drupal\contribkanban_boards\Entity\BoardList;
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
    $tags = \Drupal::getContainer()->get('drupalorg_tags');
    $board_provider_manager = \Drupal::getContainer()->get('plugin.manager.board_provider');
    $board_storage = \Drupal::entityTypeManager()->getStorage('board');

    $tag_name = $form_state->getValue('machine_name');
    $tag = $tags->getTag($tag_name);

    if (empty($tag)) {
      drupal_set_message(t('Unable to look up tag :tag', [':tag' => $tag_name]), 'error');
    }

    $bundle = 'drupalorg_sprint';
    if (!$board_provider_manager->hasDefinition($bundle)) {
      return;
    }

    $existing_board = $board_storage->loadByProperties(['tag' => $tag['tid'], 'type' => $bundle]);
    if (!empty($existing_board)) {
      $existing_board = reset($existing_board);
      $form_state->setRedirectUrl($existing_board->toUrl());
      return;
    }

    $active = BoardList::create([
      'type' => $bundle,
      'title' => 'Active',
      'statuses' => [1],
    ]);
    $needs_work = BoardList::create([
      'type' => $bundle,
      'title' => 'Needs Work',
      'statuses' => [13],
    ]);
    $needs_review = BoardList::create([
      'type' => $bundle,
      'title' => 'Needs Review',
      'statuses' => [8],
    ]);
    $rtbc = BoardList::create([
      'type' => $bundle,
      'title' => 'Reviewed & Tested',
      'statuses' => [14,15],
    ]);
    $fixed = BoardList::create([
      'type' => $bundle,
      'title' => 'Fixed',
      'statuses' => [2],
    ]);

    $board = Board::create([
      'type' => $bundle,
      'title' => $tag['name'],
      'tag' => [$tag['tid']],
      'lists' => [
        $needs_review,
        $needs_work,
        $active,
        $rtbc,
        $fixed,
      ],
    ]);
    $board->save();

    $form_state->setRedirectUrl($board->toUrl());
  }

}
