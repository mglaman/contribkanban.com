<?php

namespace Drupal\contribkanban_pages\Controller;

use Drupal\contribkanban_pages\Form\AddBoardForm;
use Drupal\contribkanban_pages\Form\AddSprintForm;
use Drupal\contribkanban_pages\Form\SearchBoardsForm;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Form\FormBuilderInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\Entity\EntityTypeManager;

/**
 * Class BoardsController.
 */
class BoardsController extends ControllerBase {

  /**
   * Drupal\Core\Entity\EntityTypeManager definition.
   *
   * @var \Drupal\Core\Entity\EntityTypeManager
   */
  protected $entityTypeManager;

  protected $formBuilder;

  /**
   * Constructs a new BoardsController object.
   *
   * @param \Drupal\Core\Entity\EntityTypeManager $entity_type_manager
   */
  public function __construct(EntityTypeManager $entity_type_manager, FormBuilderInterface $form_builder) {
    $this->entityTypeManager = $entity_type_manager;
    $this->formBuilder = $form_builder;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('entity_type.manager'),
      $container->get('form_builder')
    );
  }

  public function boards($type) {
    $add_form_class = AddBoardForm::class;
    if ($type == 'sprint') {
      $add_form_class = AddSprintForm::class;
    }

    $build = [
      '#theme' => 'boards',
      '#search' => $this->formBuilder->getForm(SearchBoardsForm::class),
      '#list' => $this->getList($type),
      '#add' => $this->formBuilder->getForm($add_form_class),
      '#content' => NULL,
    ];
    return $build;
  }

  protected function getList($type) {
    $entity_type = $this->entityTypeManager->getDefinition('board');
    $storage = $this->entityTypeManager->getStorage('board');
    $query = $storage->getQuery()->sort('title');
    $query->pager(25);
    if ($type) {
      $query->condition('type', 'drupalorg_' . $type);
    }
    $entity_ids = $query->execute();
    $boards = $storage->loadMultiple($entity_ids);

    $build = [
      '#cache' => [
        'contexts' => $entity_type->getListCacheContexts(),
        'tags' => $entity_type->getListCacheTags(),
      ],
    ];
    foreach ($boards as $board) {
      $build[$board->id()] = [
        '#type' => 'inline_template',
        '#template' => '<div class="card"><div class="card-content"><span><a href="{{ link }}">{{ label }}</a></span> ({{ type }})</div></div>',
        '#context' => [
          'link' => $board->toUrl()->toString(),
          'label' => $board->label(),
          'type' => $board->bundle(),
        ]
      ];
    }
    if (empty($boards)) {
      $build['empty'] = [
        '#type' => 'inline_template',
        '#template' => '<div class="card"><div class="card-content">There are no boards.</div></div>',
        '#context' => [
        ]
      ];
    }
    $build['pager'] = [
      '#type' => 'pager',
    ];
    return $build;
  }

  /**
   * Loads entity IDs using a pager sorted by the entity id.
   *
   * @param null $type
   *
   * @return array An array of entity IDs.
   * An array of entity IDs.
   */
  protected function getEntityIds($type = NULL) {

  }
}
