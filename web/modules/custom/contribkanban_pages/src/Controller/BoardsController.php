<?php

namespace Drupal\contribkanban_pages\Controller;

use Drupal\Component\Serialization\Json;
use Drupal\contribkanban_boards\Entity\NodeBoard;
use Drupal\contribkanban_pages\Form\SearchBoardsForm;
use Drupal\Core\Access\CsrfTokenGenerator;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Form\FormBuilderInterface;
use Drupal\Core\Render\Markup;
use Drupal\user\UserInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\Entity\EntityTypeManager;
use Symfony\Component\Serializer\SerializerInterface;

/**
 * Class BoardsController.
 */
final class BoardsController extends ControllerBase {

  /**
   * Drupal\Core\Entity\EntityTypeManager definition.
   *
   * @var \Drupal\Core\Entity\EntityTypeManager
   */
  protected $entityTypeManager;

  protected $formBuilder;

  protected $serializer;

  protected $csrfToken;

  /**
   * Constructs a new BoardsController object.
   *
   * @param \Drupal\Core\Entity\EntityTypeManager $entity_type_manager
   */
  public function __construct(
    EntityTypeManager $entity_type_manager,
    FormBuilderInterface $form_builder,
    SerializerInterface $serializer,
    CsrfTokenGenerator $csrf_token_generator
  ) {
    $this->entityTypeManager = $entity_type_manager;
    $this->formBuilder = $form_builder;
    $this->serializer = $serializer;
    $this->csrfToken = $csrf_token_generator;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new self(
      $container->get('entity_type.manager'),
      $container->get('form_builder'),
      $container->get('serializer'),
      $container->get('csrf_token')
    );
  }

  public function userIssuesBoard(UserInterface $user) {
    try {
      $nids = \Drupal::getContainer()->get('contribkanban_users.issues_feed')->fetch($user);
    }
    catch (\Exception $e) {
      $nids = [];
    }
    $build['#attached']['drupalSettings']['board'] = [
      'nids' => Json::encode($nids),
      'uuid' => '',
    ];
    $build['output'] = [
      '#markup' => Markup::create('<div id="NodeBoard" style="position: relative;height: 100%;"></div>'),
    ];
    return $build;
  }

  public function addNodeBoard(UserInterface $user) {
    /** @var \Drupal\contribkanban_boards\Entity\NodeBoard $node_board */
    $node_board = NodeBoard::create();
    $node_board->setOwner($user);
    $node_board->get('nids')->appendItem('');
    $data = $this->serializer->normalize($node_board, 'json');

    $build = [];
    $build['#attached']['drupalSettings']['form'] = [
      'board' => $data,
      'uid' => $user->id(),
    ];
    $build['output']['#markup'] = '<div id="NodeBoardAddForm"></div>';
    return $build;
  }
  public function editNodeBoard(NodeBoard $node_board) {
    $data = $this->serializer->normalize($node_board, 'json');
    $build = [];
    $build['#attached']['drupalSettings']['form'] = [
      'board' => $data,
      'uid' => \Drupal::currentUser()->id(),
    ];
    $build['output']['#markup'] = '<div id="NodeBoardAddForm"></div>';
    return $build;
  }

  public function boards($type) {
    $add_form_class = '<div id="AddBoard"></div>';
    if ($type == 'sprint') {
      $add_form_class = '<div id="AddSprint"></div>';
    }

    $build = [
      '#theme' => 'boards',
      '#search' => $this->formBuilder->getForm(SearchBoardsForm::class),
      '#list' => $this->getList($type),
      '#add' => Markup::create($add_form_class),
      '#content' => NULL,
    ];
    return $build;
  }

  protected function getList($type) {
    $entity_type = $this->entityTypeManager->getDefinition('board');
    $storage = $this->entityTypeManager->getStorage('board');
    $query = $storage->getQuery()->sort('title');
    $query->pager(25);
    if ($type !== '') {
      $query->condition('type', 'drupalorg_' . $type);
    }
    $entity_ids = $query->accessCheck()->execute();
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

}
