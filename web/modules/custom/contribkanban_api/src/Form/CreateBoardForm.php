<?php

declare(strict_types=1);

namespace Drupal\contribkanban_api\Form;

use Drupal\contribkanban_api\BoardFactory;
use Drupal\contribkanban_boards\Entity\BoardInterface;
use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use GuzzleHttp\Exception\GuzzleException;
use Symfony\Component\DependencyInjection\ContainerInterface;

final class CreateBoardForm extends FormBase {

  /**
   * Constructs a CreateBoardForm.
   *
   * @param \Drupal\contribkanban_api\BoardFactory $boardFactory
   *   Gets boards for drupal.org projects and tags.
   */
  public function __construct(
    protected readonly BoardFactory $boardFactory,
  ) {}

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container): self {
    return new self(
      $container->get('contribkanban_api.board_factory'),
    );
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId(): string {
    return 'contribkanban_create_board';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state): array {
    $form['#attributes']['class'][] = 'create-board';
    $form['intro'] = [
      '#markup' => $this->t('No account needed for project and tag boards.'),
      '#prefix' => '<p class="create-board__intro">',
      '#suffix' => '</p>',
    ];
    $form['kind'] = [
      '#type' => 'radios',
      '#title' => $this->t('What should it track?'),
      '#options' => [
        'project' => $this->t('A project'),
        'tag' => $this->t('A tag'),
      ],
      '#default_value' => 'project',
      'project' => ['#description' => $this->t("One project's issues")],
      'tag' => ['#description' => $this->t('One tag across projects')],
    ];
    $form['project'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Project machine name'),
      '#placeholder' => 'canvas',
      '#description' => $this->t('From drupal.org/project/<em>machine_name</em>'),
      '#states' => [
        'visible' => [':input[name="kind"]' => ['value' => 'project']],
      ],
    ];
    $form['tag'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Issue tag'),
      '#placeholder' => 'Novice',
      '#description' => $this->t('As it appears on drupal.org issues'),
      '#states' => [
        'visible' => [':input[name="kind"]' => ['value' => 'tag']],
      ],
    ];
    $form['actions'] = ['#type' => 'actions'];
    $form['actions']['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Create board'),
    ];
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state): void {
    $kind = $form_state->getValue('kind') === 'tag' ? 'tag' : 'project';
    $name = trim((string) $form_state->getValue($kind));
    if ($name === '') {
      $form_state->setErrorByName($kind, $kind === 'tag'
        ? $this->t('Enter an issue tag.')
        : $this->t('Enter a project machine name.'));
      return;
    }

    try {
      $board = $kind === 'tag'
        ? $this->boardFactory->forTag($name)
        : $this->boardFactory->forProject($name);
    }
    catch (GuzzleException $e) {
      $this->logger('contribkanban_api')->error('Looking up @name on drupal.org failed: @message', [
        '@name' => $name,
        '@message' => $e->getMessage(),
      ]);
      $form_state->setErrorByName($kind, $this->t("Couldn't reach drupal.org. Try again in a minute."));
      return;
    }

    if ($board === NULL) {
      $form_state->setErrorByName($kind, $kind === 'tag'
        ? $this->t('drupal.org has no issue tag named %name.', ['%name' => $name])
        : $this->t('drupal.org has no project named %name.', ['%name' => $name]));
      return;
    }
    if ($board->isNew()) {
      foreach ($board->validate() as $violation) {
        $form_state->setErrorByName($kind, $violation->getMessage());
      }
    }
    $form_state->set('board', $board);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state): void {
    $board = $form_state->get('board');
    assert($board instanceof BoardInterface);
    if ($board->isNew()) {
      $board->save();
      $this->messenger()->addStatus($this->t('Created the %title board.', ['%title' => $board->label()]));
    }
    else {
      $this->messenger()->addStatus($this->t('%title already has a board.', ['%title' => $board->label()]));
    }
    $form_state->setRedirectUrl($board->toUrl());
  }

}
