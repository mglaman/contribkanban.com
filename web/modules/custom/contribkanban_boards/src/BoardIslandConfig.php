<?php

declare(strict_types=1);

namespace Drupal\contribkanban_boards;

use Drupal\contribkanban_boards\Entity\BoardInterface;
use Drupal\contribkanban_boards\Entity\BoardListInterface;
use Drupal\contribkanban_boards\Entity\NodeBoard;
use Drupal\Core\Field\EntityReferenceFieldItemListInterface;
use Drupal\Core\Field\FieldItemListInterface;

final class BoardIslandConfig {

  /**
   * Column header colors, by a list's first status.
   */
  private const TONES = [
    '1' => 'active',
    '2' => 'fixed',
    '4' => 'postponed',
    '7' => 'fixed',
    '8' => 'needs-review',
    '13' => 'needs-work',
    '14' => 'rtbc',
    '15' => 'rtbc',
    '16' => 'postponed',
  ];

  /**
   * An issue collection's columns, by title and statuses.
   */
  private const COLLECTION_LISTS = [
    'Postponed' => ['4', '16'],
    'Active' => ['1'],
    'Needs work' => ['13'],
    'Needs review' => ['8'],
    'Reviewed & tested' => ['14', '15'],
    'Fixed' => ['2', '7'],
  ];

  /**
   * Builds the configuration the board island reads.
   *
   * Each list gets the board's projects, tags, and versions merged into its
   * own, so the island queries one list at a time.
   *
   * @param \Drupal\contribkanban_boards\Entity\BoardInterface $board
   *   The board.
   * @param string $version
   *   A version from the URL, added to every list.
   * @param list<int> $moved_projects
   *   For tag boards, node IDs of projects whose issues moved to GitLab.
   *   Drupal.org keeps their issues, frozen, so the island drops them.
   *
   * @return array{source: string, gitlabProject: string|null, gitlabLabel: string|null, movedProjects: list<int>, lists: list<array<string, mixed>>}
   *   The configuration.
   */
  public static function build(BoardInterface $board, string $version = '', array $moved_projects = []): array {
    $gitlab = $board->bundle() === 'drupalorg_project' && (bool) $board->get('gitlab_work_items')->value;
    $tag_board = $board->bundle() === 'drupalorg_sprint';
    $board_versions = self::values($board->get('version'));
    if ($version !== '') {
      $board_versions[] = $version;
    }
    $lists = [];
    $field = $board->get('lists');
    assert($field instanceof EntityReferenceFieldItemListInterface);
    foreach ($field->referencedEntities() as $list) {
      assert($list instanceof BoardListInterface);
      $statuses = self::values($list->get('statuses'));
      $versions = array_merge(self::values($list->get('version')), $board_versions);
      $component = $list->get('component')->value;
      $lists[] = [
        'title' => (string) $list->label(),
        'tone' => self::TONES[$statuses[0] ?? ''] ?? 'neutral',
        'statuses' => $statuses,
        'projects' => self::merge($list->get('project_nid'), $board->get('project_nid')),
        'tags' => self::merge($list->get('tag'), $board->get('tag')),
        'versions' => array_values(array_unique(array_map(self::devVersion(...), $versions))),
        'component' => is_string($component) && $component !== '' ? $component : NULL,
      ];
    }
    return [
      'source' => $gitlab ? 'gitlab' : 'drupalorg',
      // Project boards are named after the project's machine name, which is
      // also its path on git.drupalcode.org.
      'gitlabProject' => $gitlab ? 'project/' . $board->get('machine_name')->value : NULL,
      // Tag boards also load GitLab work items with a label named after the
      // tag, which is the board's title.
      'gitlabLabel' => $tag_board ? (string) $board->label() : NULL,
      'movedProjects' => $tag_board ? $moved_projects : [],
      'lists' => $lists,
    ];
  }

  /**
   * Builds the board island's configuration for an issue collection.
   *
   * The island loads the collection's issues once and sorts them into the
   * columns by status.
   *
   * @param \Drupal\contribkanban_boards\Entity\NodeBoard $collection
   *   The issue collection.
   * @param list<int> $moved_projects
   *   Node IDs of projects whose issues moved to GitLab. The island loads
   *   those issues from GitLab.
   *
   * @return array{source: string, gitlabProject: null, gitlabLabel: null, movedProjects: list<int>, nids: list<string>, lists: list<array<string, mixed>>}
   *   The configuration.
   */
  public static function collection(NodeBoard $collection, array $moved_projects = []): array {
    $lists = [];
    foreach (self::COLLECTION_LISTS as $title => $statuses) {
      $lists[] = [
        'title' => $title,
        'tone' => self::TONES[$statuses[0]],
        'statuses' => $statuses,
        'projects' => [],
        'tags' => [],
        'versions' => [],
        'component' => NULL,
      ];
    }
    return [
      'source' => 'drupalorg',
      'gitlabProject' => NULL,
      'gitlabLabel' => NULL,
      'movedProjects' => $moved_projects,
      'nids' => array_values(array_unique(self::values($collection->get('nids')))),
      'lists' => $lists,
    ];
  }

  /**
   * Gets a string field's values.
   *
   * @param \Drupal\Core\Field\FieldItemListInterface $items
   *   The field.
   *
   * @return list<string>
   *   The values.
   */
  private static function values(FieldItemListInterface $items): array {
    return array_values(array_map('strval', array_column($items->getValue(), 'value')));
  }

  /**
   * Merges a list's values with the board's.
   *
   * @param \Drupal\Core\Field\FieldItemListInterface $list_items
   *   The list's field.
   * @param \Drupal\Core\Field\FieldItemListInterface $board_items
   *   The board's field.
   *
   * @return list<string>
   *   The unique values.
   */
  private static function merge(FieldItemListInterface $list_items, FieldItemListInterface $board_items): array {
    return array_values(array_unique(array_merge(self::values($list_items), self::values($board_items))));
  }

  /**
   * Converts a branch name to drupal.org's dev release name.
   *
   * @param string $version
   *   A version, such as "8.x-1.x" or "11.x-dev".
   *
   * @return string
   *   The version, with "-dev" after a branch name.
   */
  private static function devVersion(string $version): string {
    return str_ends_with($version, '.x') ? $version . '-dev' : $version;
  }

}
