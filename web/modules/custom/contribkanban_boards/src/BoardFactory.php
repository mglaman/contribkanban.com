<?php

declare(strict_types=1);

namespace Drupal\contribkanban_boards;

use Drupal\contribkanban_boards\Entity\BoardInterface;
use Drupal\contribkanban_projects\Projects;
use Drupal\contribkanban_projects\Tags;
use Drupal\Core\Entity\EntityTypeManagerInterface;

final class BoardFactory {

  /**
   * The lists a new project board starts with, as title => statuses.
   */
  private const PROJECT_LISTS = [
    'Postponed' => [4, 16],
    'Active' => [1],
    'Needs Work' => [13],
    'Needs Review' => [8],
    'Reviewed & Tested' => [14, 15],
    'Fixed' => [2],
  ];

  /**
   * The lists a new tag board starts with, as title => statuses.
   */
  private const TAG_LISTS = [
    'Needs Review' => [8],
    'Needs Work' => [13],
    'Active' => [1],
    'Reviewed & Tested' => [14, 15],
    'Fixed' => [2],
  ];

  /**
   * Constructs a BoardFactory.
   *
   * @param \Drupal\contribkanban_projects\Projects $projects
   *   Looks up projects on drupal.org.
   * @param \Drupal\contribkanban_projects\Tags $tags
   *   Looks up issue tags on drupal.org.
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entityTypeManager
   *   The entity type manager.
   */
  public function __construct(
    private readonly Projects $projects,
    private readonly Tags $tags,
    private readonly EntityTypeManagerInterface $entityTypeManager,
  ) {}

  /**
   * Gets the board for a drupal.org project.
   *
   * @param string $machine_name
   *   The project's machine name.
   *
   * @return \Drupal\contribkanban_boards\Entity\BoardInterface|null
   *   The existing board, a new unsaved board, or NULL if drupal.org has no
   *   such project. Validate a new board before saving it.
   *
   * @throws \GuzzleHttp\Exception\GuzzleException
   *   When drupal.org can't be reached.
   */
  public function forProject(string $machine_name): ?BoardInterface {
    $project = $this->projects->getProject($machine_name);
    if ($project === []) {
      return NULL;
    }
    $existing = $this->loadExisting('drupalorg_project', 'project_nid', (string) $project['nid']);
    if ($existing !== NULL) {
      return $existing;
    }
    return $this->create('drupalorg_project', self::PROJECT_LISTS, [
      'title' => $project['title'],
      'project_nid' => [$project['nid']],
      'machine_name' => $project['machine_name'],
      // Projects without a drupal.org issue queue have moved to GitLab.
      'gitlab_work_items' => $project['hasIssues'] === FALSE,
    ]);
  }

  /**
   * Gets the board for a drupal.org issue tag.
   *
   * @param string $name
   *   The tag name.
   * @param string|null $tid
   *   The tag's term ID, if the caller already looked it up.
   *
   * @return \Drupal\contribkanban_boards\Entity\BoardInterface|null
   *   The existing board, a new unsaved board, or NULL if drupal.org has no
   *   such tag. Validate a new board before saving it.
   *
   * @throws \GuzzleHttp\Exception\GuzzleException
   *   When drupal.org can't be reached.
   */
  public function forTag(string $name, ?string $tid = NULL): ?BoardInterface {
    if ($tid === NULL) {
      $tag = $this->tags->getTag($name);
      if ($tag === []) {
        return NULL;
      }
      $name = (string) $tag['name'];
      $tid = (string) $tag['tid'];
    }
    $existing = $this->loadExisting('drupalorg_sprint', 'tag', $tid);
    if ($existing !== NULL) {
      return $existing;
    }
    return $this->create('drupalorg_sprint', self::TAG_LISTS, [
      'title' => $name,
      'tag' => [$tid],
    ]);
  }

  /**
   * Loads the board of a type that tracks a drupal.org ID.
   *
   * @param string $bundle
   *   The board type.
   * @param string $field
   *   The field holding the drupal.org ID.
   * @param string $value
   *   The drupal.org ID.
   *
   * @return \Drupal\contribkanban_boards\Entity\BoardInterface|null
   *   The board, or NULL if there is none.
   */
  private function loadExisting(string $bundle, string $field, string $value): ?BoardInterface {
    $boards = $this->entityTypeManager->getStorage('board')->loadByProperties([
      'type' => $bundle,
      $field => $value,
    ]);
    $board = reset($boards);
    return $board instanceof BoardInterface ? $board : NULL;
  }

  /**
   * Creates an unsaved board with its lists.
   *
   * @param string $bundle
   *   The board type.
   * @param array<string, int[]> $lists
   *   The lists, as title => statuses.
   * @param array<string, mixed> $values
   *   The board's field values.
   *
   * @return \Drupal\contribkanban_boards\Entity\BoardInterface
   *   The board.
   */
  private function create(string $bundle, array $lists, array $values): BoardInterface {
    $list_storage = $this->entityTypeManager->getStorage('board_list');
    $values['type'] = $bundle;
    $values['lists'] = [];
    foreach ($lists as $title => $statuses) {
      $values['lists'][] = $list_storage->create([
        'type' => $bundle,
        'title' => $title,
        'statuses' => $statuses,
      ]);
    }
    $board = $this->entityTypeManager->getStorage('board')->create($values);
    assert($board instanceof BoardInterface);
    return $board;
  }

}
