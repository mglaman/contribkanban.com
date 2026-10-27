<?php

declare(strict_types=1);

namespace Drupal\contribkanban_boards;

use Drupal\contribkanban_boards\Entity\BoardInterface;
use Drupal\contribkanban_boards\Form\BookmarkForm;
use Drupal\Core\Cache\CacheableMetadata;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Form\FormBuilderInterface;
use Drupal\Core\Security\TrustedCallbackInterface;
use Drupal\Core\Session\AccountInterface;

final class BookmarkLazyBuilder implements TrustedCallbackInterface {

  /**
   * Constructs a BookmarkLazyBuilder.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entityTypeManager
   *   The entity type manager.
   * @param \Drupal\Core\Form\FormBuilderInterface $formBuilder
   *   The form builder.
   * @param \Drupal\Core\Session\AccountInterface $currentUser
   *   The current user.
   */
  public function __construct(
    private readonly EntityTypeManagerInterface $entityTypeManager,
    private readonly FormBuilderInterface $formBuilder,
    private readonly AccountInterface $currentUser,
  ) {}

  /**
   * Builds the Bookmark button, for logged-in users.
   *
   * As a lazy builder, it keeps the board page cacheable for everyone, since
   * only the button varies by user.
   *
   * @param string $board_id
   *   The board's ID.
   *
   * @return array<string, mixed>
   *   A render array.
   */
  public function build(string $board_id): array {
    $build = [];
    $board = $this->entityTypeManager->getStorage('board')->load($board_id);
    if ($this->currentUser->isAuthenticated() && $board instanceof BoardInterface) {
      $build = $this->formBuilder->getForm(BookmarkForm::class, $board);
    }
    CacheableMetadata::createFromRenderArray($build)
      ->addCacheContexts(['user'])
      ->addCacheTags([Bookmarks::cacheTag($this->currentUser)])
      ->applyTo($build);
    return $build;
  }

  /**
   * {@inheritdoc}
   */
  public static function trustedCallbacks(): array {
    return ['build'];
  }

}
