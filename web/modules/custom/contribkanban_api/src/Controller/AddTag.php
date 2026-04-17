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
use Symfony\Component\HttpFoundation\Request;
use Drupal\Component\Serialization\Json;

final class AddTag implements ContainerInjectionInterface {

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
    return new self(
      $container->get('drupalorg_tags'),
      $container->get('plugin.manager.board_provider'),
      $container->get('entity_type.manager')
    );
  }

  /**
   *
   */
  public function handle(Request $request, $tag) {
    $tag_name = urldecode($tag);
    $payload = Json::decode($request->getContent());

    if (!empty($payload['tid'])) {
      $tag_data = [
        'name' => $tag_name,
        'tid' => $payload['tid'],
      ];
    }
    else {
      $tag_data = $this->tagsHelper->getTag($tag_name);
    }

    $bundle = 'drupalorg_sprint';
    $existing_board = $this->boardStorage->loadByProperties(['tag' => $tag_data['tid'], 'type' => $bundle]);
    if (!empty($existing_board)) {
      $existing_board = reset($existing_board);
      return new JsonResponse([
        'machine_name' => $existing_board->get('machine_name')->value,
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
      'title' => $tag_data['name'],
      'tag' => [$tag_data['tid']],
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
      'machine_name' => $board->get('machine_name')->value,
    ], 201);
  }

}
