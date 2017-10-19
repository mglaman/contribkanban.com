<?php

namespace Drupal\contribkanban_pages\Controller;

use Drupal\contribkanban_pages\Form\AddBoardForm;
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
    $build = [
      '#theme' => 'boards',
      '#search' => $this->formBuilder->getForm(SearchBoardsForm::class),
      '#list' => NULL,
      '#add' => $this->formBuilder->getForm(AddBoardForm::class),
      '#content' => NULL,
      '#cache' => [
        'max-age' => 0,
      ],
    ];
    return $build;
  }

}
