<?php

declare(strict_types=1);

namespace Drupal\contribkanban_boards\Form;

use Drupal\contribkanban_boards\PopularBoards;
use Drupal\Core\Entity\EntityTypeBundleInfoInterface;
use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Picks and orders the popular searches shown on the board listing.
 */
final class PopularBoardsForm extends FormBase {

  /**
   * Constructs a PopularBoardsForm.
   *
   * @param \Drupal\contribkanban_boards\PopularBoards $popularBoards
   *   Loads and orders the popular boards.
   * @param \Drupal\Core\Entity\EntityTypeBundleInfoInterface $bundleInfo
   *   The bundle info, for board type labels.
   */
  public function __construct(
    protected readonly PopularBoards $popularBoards,
    protected readonly EntityTypeBundleInfoInterface $bundleInfo,
  ) {}

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container): self {
    return new self(
      $container->get('contribkanban_boards.popular_boards'),
      $container->get('entity_type.bundle.info'),
    );
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId(): string {
    return 'contribkanban_popular_boards';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state): array {
    $bundles = $this->bundleInfo->getBundleInfo('board');
    $boards = $this->popularBoards->load();
    $form['intro'] = [
      '#type' => 'html_tag',
      '#tag' => 'p',
      '#value' => $this->t('Popular searches show below the search on the board listing, in this order.'),
    ];
    $form['boards'] = [
      '#type' => 'table',
      '#header' => [
        $this->t('Board'),
        $this->t('Type'),
        $this->t('Weight'),
        $this->t('Remove'),
      ],
      '#empty' => $this->t('There are no popular searches.'),
      '#tabledrag' => [
        [
          'action' => 'order',
          'relationship' => 'sibling',
          'group' => 'popular-weight',
        ],
      ],
    ];
    foreach ($boards as $weight => $board) {
      $form['boards'][$board->id()] = [
        '#attributes' => ['class' => ['draggable']],
        '#weight' => $weight,
        'board' => $board->toLink()->toRenderable(),
        'type' => ['#plain_text' => (string) $bundles[$board->bundle()]['label']],
        'weight' => [
          '#type' => 'weight',
          '#title' => $this->t('Weight for @board', ['@board' => $board->label()]),
          '#title_display' => 'invisible',
          '#default_value' => $weight,
          '#delta' => count($boards),
          '#attributes' => ['class' => ['popular-weight']],
        ],
        'remove' => [
          '#type' => 'checkbox',
          '#title' => $this->t('Remove @board', ['@board' => $board->label()]),
          '#title_display' => 'invisible',
        ],
      ];
    }
    $form['add'] = [
      '#type' => 'entity_autocomplete',
      '#title' => $this->t('Add a board'),
      '#target_type' => 'board',
      '#description' => $this->t('It goes to the end of the list.'),
    ];
    $form['actions'] = ['#type' => 'actions'];
    $form['actions']['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Save'),
      '#button_type' => 'primary',
    ];
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state): void {
    // An empty table submits no rows.
    $rows = array_filter($form_state->getValue('boards') ?? [], static fn ($row) => empty($row['remove']));
    uasort($rows, static fn ($a, $b) => (int) $a['weight'] <=> (int) $b['weight']);
    $ids = array_keys($rows);
    $add = $form_state->getValue('add');
    if (is_numeric($add) && !in_array((int) $add, $ids, TRUE)) {
      $ids[] = (int) $add;
    }
    $this->popularBoards->set($ids);
    $this->messenger()->addStatus($this->t('Saved the popular searches.'));
  }

}
