<?php

declare(strict_types=1);

namespace Drupal\contribkanban_boards\Form;

use Drupal\contribkanban_boards\Bookmarks;
use Drupal\contribkanban_boards\Entity\BoardInterface;
use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

final class BookmarkForm extends FormBase {

  /**
   * Constructs a BookmarkForm.
   *
   * @param \Drupal\contribkanban_boards\Bookmarks $bookmarks
   *   The users' bookmarked boards.
   */
  public function __construct(
    protected readonly Bookmarks $bookmarks,
  ) {}

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container): self {
    return new self($container->get('contribkanban_boards.bookmarks'));
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId(): string {
    return 'contribkanban_bookmark';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state, ?BoardInterface $board = NULL): array {
    assert($board instanceof BoardInterface);
    $form_state->set('board', $board);
    $bookmarked = $this->bookmarks->has($this->currentUser(), $board);
    $form['#attributes']['class'][] = 'bookmark-form';
    $form['bookmark'] = [
      '#type' => 'submit',
      '#value' => $bookmarked ? $this->t('Bookmarked') : $this->t('Bookmark'),
      '#attributes' => [
        'class' => ['board-shell__bookmark'],
        'aria-pressed' => $bookmarked ? 'true' : 'false',
        'title' => $bookmarked ? $this->t('Remove from your account page') : $this->t('Add to your account page'),
      ],
    ];
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state): void {
    $board = $form_state->get('board');
    assert($board instanceof BoardInterface);
    $bookmarked = $this->bookmarks->toggle($this->currentUser(), $board);
    $this->messenger()->addStatus($bookmarked
      ? $this->t('Bookmarked %title. It is on your account page.', ['%title' => $board->label()])
      : $this->t('Removed the bookmark for %title.', ['%title' => $board->label()]));
  }

}
