<?php

declare(strict_types=1);

namespace Drupal\Tests\contribkanban_boards\Kernel;

use Drupal\contribkanban_boards\BoardFactory;
use Drupal\contribkanban_boards\Entity\BoardListInterface;
use Drupal\contribkanban_projects\Entity\Project;
use Drupal\contribkanban_projects\Labels;
use Drupal\contribkanban_projects\Maintainers;
use Drupal\contribkanban_projects\Projects;
use Drupal\contribkanban_projects\Tags;
use Drupal\KernelTests\Core\Entity\EntityKernelTestBase;
use GuzzleHttp\Exception\TransferException;
use PHPUnit\Framework\Attributes\Group;
use PHPUnit\Framework\Attributes\RunTestsInSeparateProcesses;

/**
 * Verifies BoardFactory finds existing boards and builds new ones.
 */
#[Group('contribkanban_boards')]
#[RunTestsInSeparateProcesses]
class BoardFactoryTest extends EntityKernelTestBase {

  /**
   * {@inheritdoc}
   */
  protected static $modules = [
    'contribkanban_boards',
    'contribkanban_projects',
    'entity',
    'options',
  ];

  /**
   * {@inheritdoc}
   */
  protected function setUp(): void {
    parent::setUp();
    $this->installEntitySchema('board');
    $this->installEntitySchema('board_list');
    $this->installEntitySchema('project');
  }

  /**
   * Creates a factory whose drupal.org and GitLab lookups return given data.
   *
   * @param array<string, mixed> $project
   *   What the project lookup returns.
   * @param array<string, mixed> $tag
   *   What the tag lookup returns.
   * @param bool $label
   *   Whether GitLab work items have the label.
   * @param array{name: string, slug: string, projects: list<string>}|null $maintainer
   *   What the maintainer lookup returns.
   */
  private function createFactory(array $project = [], array $tag = [], bool $label = FALSE, ?array $maintainer = NULL): BoardFactory {
    $projects = $this->createMock(Projects::class);
    $projects->method('getProject')->willReturn($project);
    $tags = $this->createMock(Tags::class);
    $tags->method('getTag')->willReturn($tag);
    $labels = $this->createMock(Labels::class);
    $labels->method('hasWorkItems')->willReturn($label);
    $maintainers = $this->createMock(Maintainers::class);
    $maintainers->method('find')->willReturn($maintainer);
    return new BoardFactory($projects, $tags, $labels, $this->container->get('entity_type.manager'), $maintainers);
  }

  /**
   * Creates a factory whose drupal.org lookups fail, as on production.
   */
  private function createOfflineFactory(): BoardFactory {
    $exception = new TransferException('drupal.org returned 403 Forbidden.');
    $projects = $this->createMock(Projects::class);
    $projects->method('getProject')->willThrowException($exception);
    $tags = $this->createMock(Tags::class);
    $tags->method('getTag')->willThrowException($exception);
    $maintainers = $this->createMock(Maintainers::class);
    $maintainers->method('find')->willThrowException($exception);
    return new BoardFactory($projects, $tags, $this->createMock(Labels::class), $this->container->get('entity_type.manager'), $maintainers);
  }

  /**
   * Builds the project details Projects::getProject() returns.
   *
   * @return array<string, mixed>
   *   The project.
   */
  private function project(bool $has_issues = TRUE): array {
    return [
      'machine_name' => 'retrofit',
      'nid' => '2416735',
      'title' => 'Retrofit',
      'hasIssues' => $has_issues,
    ];
  }

  /**
   * Tests that a new project board uses drupal.org's details.
   */
  public function testNewProjectBoard(): void {
    $board = $this->createFactory($this->project(FALSE))->forProject('Retrofit');
    $this->assertNotNull($board);
    $this->assertTrue($board->isNew());
    $this->assertSame('drupalorg_project', $board->bundle());
    $this->assertSame('Retrofit', $board->label());
    $this->assertSame('retrofit', $board->get('machine_name')->value);
    $this->assertSame('2416735', (string) $board->get('project_nid')->value);
    $this->assertTrue((bool) $board->get('gitlab_work_items')->value);
    $lists = array_map(
      static fn (BoardListInterface $list): string => (string) $list->label(),
      $board->get('lists')->referencedEntities(),
    );
    $this->assertSame(['Postponed', 'Active', 'Needs Work', 'Needs Review', 'Reviewed & Tested', 'Fixed'], $lists);
    $this->assertCount(0, $board->validate());
  }

  /**
   * Tests that a project with a board gets that board back.
   */
  public function testExistingProjectBoard(): void {
    $factory = $this->createFactory($this->project());
    $board = $factory->forProject('retrofit');
    $this->assertNotNull($board);
    $board->save();

    $existing = $factory->forProject('retrofit');
    $this->assertNotNull($existing);
    $this->assertFalse($existing->isNew());
    $this->assertSame($board->id(), $existing->id());
  }

  /**
   * Tests that a project's board is found when drupal.org can't be reached.
   */
  public function testExistingProjectBoardOffline(): void {
    $board = $this->createFactory($this->project())->forProject('retrofit');
    $this->assertNotNull($board);
    $board->save();

    $existing = $this->createOfflineFactory()->forProject('retrofit');
    $this->assertNotNull($existing);
    $this->assertSame($board->id(), $existing->id());
  }

  /**
   * Tests that an unknown project has no board.
   */
  public function testUnknownProject(): void {
    $this->assertNull($this->createFactory()->forProject('not_a_project'));
  }

  /**
   * Tests that a new tag board uses the tag's drupal.org name.
   */
  public function testNewTagBoard(): void {
    $board = $this->createFactory(tag: ['name' => 'Novice', 'tid' => '772'])->forTag('novice');
    $this->assertNotNull($board);
    $this->assertTrue($board->isNew());
    $this->assertSame('drupalorg_sprint', $board->bundle());
    $this->assertSame('Novice', $board->label());
    $this->assertSame('772', (string) $board->get('tag')->value);
    $this->assertSame('Novice-tag', $board->get('machine_name')->value);
    $this->assertCount(0, $board->validate());
  }

  /**
   * Tests that a known term ID skips the drupal.org lookup.
   */
  public function testTagBoardWithTermId(): void {
    $tags = $this->createMock(Tags::class);
    $tags->expects($this->never())->method('getTag');
    $factory = new BoardFactory($this->createMock(Projects::class), $tags, $this->createMock(Labels::class), $this->container->get('entity_type.manager'), $this->createMock(Maintainers::class));
    $board = $factory->forTag('Novice', '772');
    $this->assertNotNull($board);
    $this->assertSame('772', (string) $board->get('tag')->value);
  }

  /**
   * Tests that a tag with a board gets that board back.
   */
  public function testExistingTagBoard(): void {
    $factory = $this->createFactory(tag: ['name' => 'Novice', 'tid' => '772']);
    $board = $factory->forTag('Novice');
    $this->assertNotNull($board);
    $board->save();

    $existing = $factory->forTag('Novice');
    $this->assertNotNull($existing);
    $this->assertSame($board->id(), $existing->id());
  }

  /**
   * Tests that a tag's board is found when drupal.org can't be reached.
   */
  public function testExistingTagBoardOffline(): void {
    $board = $this->createFactory(tag: ['name' => 'Novice', 'tid' => '772'])->forTag('Novice');
    $this->assertNotNull($board);
    $board->save();

    $existing = $this->createOfflineFactory()->forTag('novice');
    $this->assertNotNull($existing);
    $this->assertSame($board->id(), $existing->id());
  }

  /**
   * Tests that an unknown tag has no board.
   */
  public function testUnknownTag(): void {
    $this->assertNull($this->createFactory()->forTag('not a tag'));
  }

  /**
   * Tests that a GitLab label drupal.org has no tag for gets a board.
   */
  public function testGitLabLabelBoard(): void {
    $factory = $this->createFactory(label: TRUE);
    $board = $factory->forTag('cms::product-analytics');
    $this->assertNotNull($board);
    $this->assertTrue($board->isNew());
    $this->assertSame('drupalorg_sprint', $board->bundle());
    $this->assertSame('cms::product-analytics', $board->label());
    $this->assertTrue($board->get('tag')->isEmpty());
    $this->assertSame('cms::product-analytics-tag', $board->get('machine_name')->value);
    $this->assertCount(0, $board->validate());
    $board->save();

    $existing = $factory->forTag('cms::product-analytics');
    $this->assertNotNull($existing);
    $this->assertSame($board->id(), $existing->id());
  }

  /**
   * Tests that a label's board doesn't need drupal.org.
   */
  public function testLabelBoardOffline(): void {
    $tags = $this->createMock(Tags::class);
    $tags->expects($this->never())->method('getTag');
    $labels = $this->createMock(Labels::class);
    $labels->method('hasWorkItems')->willReturnCallback(static fn (string $label): bool => $label === 'cms::product-analytics');
    $factory = new BoardFactory($this->createMock(Projects::class), $tags, $labels, $this->container->get('entity_type.manager'), $this->createMock(Maintainers::class));

    $board = $factory->forLabel('cms::product-analytics');
    $this->assertNotNull($board);
    $this->assertTrue($board->get('tag')->isEmpty());
    $this->assertNull($factory->forLabel('cms::typo'));
  }

  /**
   * Stores a project that moved to GitLab, as drush ck-gitlab does.
   */
  private function createMovedProject(string $nid, string $machine_name): void {
    Project::create([
      'nid' => $nid,
      'name' => $machine_name,
      'machine_name' => $machine_name,
      'gitlab_issues' => TRUE,
    ])->save();
  }

  /**
   * Tests that a maintainer board stores all of the maintainer's projects.
   *
   * Moved projects come from stored projects, and drupal.org answers for the
   * rest.
   */
  public function testNewMaintainerBoard(): void {
    $this->createMovedProject('100', 'moved_project');
    $board = $this->createFactory($this->project(), maintainer: [
      'name' => 'kristen pol',
      'slug' => 'kristen-pol',
      'projects' => ['moved_project', 'retrofit'],
    ])->forMaintainer('Kristen Pol');

    $this->assertNotNull($board);
    $this->assertTrue($board->isNew());
    $this->assertSame('drupalorg_maintainer', $board->bundle());
    $this->assertSame('kristen pol', $board->label());
    $this->assertSame('kristen-pol-maintainer', $board->get('machine_name')->value);
    $this->assertSame(
      ['100', '2416735'],
      array_map('strval', array_column($board->get('project_nid')->getValue(), 'value')),
    );
    $this->assertCount(0, $board->validate());
    $board->save();
    $this->assertSame((string) $board->id(), (string) $this->createOfflineFactory()->forMaintainer('kristen pol')?->id());
  }

  /**
   * Tests that a user with no projects, or no such user, gets no board.
   */
  public function testMaintainerWithoutProjects(): void {
    $this->assertNull($this->createFactory()->forMaintainer('nobody'));
    $this->assertNull($this->createFactory(maintainer: [
      'name' => 'someone',
      'slug' => 'someone',
      'projects' => [],
    ])->forMaintainer('someone'));
  }

  /**
   * Tests that refreshing swaps a maintainer board's projects.
   */
  public function testRefreshMaintainer(): void {
    $this->createMovedProject('100', 'one');
    $this->createMovedProject('200', 'two');
    $maintainer = ['name' => 'someone', 'slug' => 'someone', 'projects' => ['one']];
    $board = $this->createFactory(maintainer: $maintainer)->forMaintainer('someone');
    $this->assertNotNull($board);
    $board->save();

    $this->assertFalse($this->createFactory(maintainer: $maintainer)->refreshMaintainer($board));
    $this->assertTrue($this->createFactory(maintainer: ['projects' => ['one', 'two']] + $maintainer)->refreshMaintainer($board));
    $this->assertSame(
      ['100', '200'],
      array_map('strval', array_column($board->get('project_nid')->getValue(), 'value')),
    );
  }

  /**
   * Tests that a profile listing nothing doesn't empty a board.
   *
   * A profile with no projects looks the same as drupal.org changing the
   * markup this reads.
   */
  public function testRefreshMaintainerKeepsProjects(): void {
    $this->createMovedProject('100', 'one');
    $maintainer = ['name' => 'someone', 'slug' => 'someone', 'projects' => ['one']];
    $board = $this->createFactory(maintainer: $maintainer)->forMaintainer('someone');
    $this->assertNotNull($board);
    $board->save();

    $this->assertFalse($this->createFactory(maintainer: ['projects' => []] + $maintainer)->refreshMaintainer($board));
    $this->assertSame('100', (string) $board->get('project_nid')->value);
  }

}
