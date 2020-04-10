<?php

namespace Drupal\contribkanban_api\Controller;

use Drupal\contribkanban_api\Tags;
use Drupal\contribkanban_boards\BoardProviderManager;
use Drupal\contribkanban_boards\Entity\Board;
use Drupal\contribkanban_boards\Entity\BoardList;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;

class AddTag implements ContainerInjectionInterface {

  protected $tagsHelper;

  protected $boardProvider;

  protected $boardStorage;

  /**
   *
   */
  public function __construct(Tags $tags, BoardProviderManager $board_provider, EntityTypeManagerInterface $entity_type_manager) {
    $this->tagsHelper = $tags;
    $this->boardProvider = $board_provider;
    $this->boardStorage = $entity_type_manager->getStorage('board');
  }

  /**
   *
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('drupalorg_tags'),
      $container->get('plugin.manager.board_provider'),
      $container->get('entity_type.manager')
    );
  }

  /**
   *
   */
  public function handle($tag) {
    $tag = urldecode($tag);
    $tag = $this->tagsHelper->getTag($tag);
    $bundle = 'drupalorg_sprint';
    $existing_board = $this->boardStorage->loadByProperties(['tag' => $tag['tid'], 'type' => $bundle]);
    if (!empty($existing_board)) {
      $existing_board = reset($existing_board);
      return new JsonResponse([
        'url' => $existing_board->toUrl()->toString(),
      ], 200);
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
      'statuses' => [14, 15],
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

    return new JsonResponse([
      'url' => $board->toUrl()->toString(),
    ], 201);
  }

}
