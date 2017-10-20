<?php

namespace Drupal\contribkanban_pages\Form;

use Drupal\contribkanban_boards\Entity\Board;
use Drupal\contribkanban_boards\Entity\BoardList;
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
      '#value' => $this->t('Add project'),
      '#attributes' => [
        'class' => [
          'is-info',
        ],
      ],
    ];
    return $form;
  }

  public function submitForm(array &$form, FormStateInterface $form_state) {
    $projects = \Drupal::getContainer()->get('drupalorg_projects');
    $board_provider_manager = \Drupal::getContainer()->get('plugin.manager.board_provider');
    $board_storage = \Drupal::entityTypeManager()->getStorage('board');

    $machine_name = $form_state->getValue('machine_name');
    $project = $projects->getProject($machine_name);

    $bundle = str_replace('project_', 'drupalorg_', $project['projectType']);
    if (preg_match("/commerce|commerce_|dc_/", $machine_name) === 1) {
      $bundle = 'drupalorg_commerce';
    }

    if (!$board_provider_manager->hasDefinition($bundle)) {
      dpm($project);
      return;
    }

    $existing_board = $board_storage->loadByProperties(['project_nid' => $project['nid'], 'type' => $bundle]);
    if (!empty($existing_board)) {
      $existing_board = reset($existing_board);
      $form_state->setRedirectUrl($existing_board->toUrl());
      return;
    }

    $backlog = BoardList::create([
      'type' => $bundle,
      'title' => 'Postponed',
      'statuses' => [4, 16],
    ]);
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
      'title' => $project['title'],
      'project_nid' => [$project['nid']],
      'machine_name' => $machine_name,
      'lists' => [
        $backlog,
        $active,
        $needs_work,
        $needs_review,
        $rtbc,
        $fixed
      ],
    ]);
    $board->save();

    $form_state->setRedirectUrl($board->toUrl());
  }

}
