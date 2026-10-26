<?php

declare(strict_types=1);

namespace Drupal\Tests\contribkanban_boards\Unit;

use Drupal\contribkanban_boards\Plugin\Field\FieldWidget\IssueIdsWidget;
use Drupal\Tests\UnitTestCase;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Group;

/**
 * Verifies which lines the issue IDs widget accepts.
 */
#[Group('contribkanban_boards')]
class IssueIdsWidgetTest extends UnitTestCase {

  /**
   * Lines and the values the widget stores for them.
   *
   * @return array<string, array{string, string|null}>
   *   The line, and the expected value or NULL.
   */
  public static function lines(): array {
    return [
      'number' => ['3412345', '3412345'],
      'hash' => ['#3412345', '3412345'],
      'leading zeros' => ['007', '7'],
      'zero' => ['0', NULL],
      'text' => ['Issue 1', NULL],
      'issue URL' => ['https://www.drupal.org/project/olivero/issues/3092318', '3092318'],
      'issue URL with comment' => ['https://www.drupal.org/project/olivero/issues/3092318#comment-1', '3092318'],
      'node URL' => ['https://www.drupal.org/node/2353867', '2353867'],
      'short URL' => ['https://drupal.org/i/2353867', '2353867'],
      'work item URL' => ['https://git.drupalcode.org/project/canvas/-/work_items/3512345', 'project/canvas#3512345'],
      'work item URL with note' => ['https://git.drupalcode.org/project/tool/-/work_items/1#note_1', 'project/tool#1'],
      'GitLab issue URL' => ['https://git.drupalcode.org/project/canvas/-/issues/3512345', 'project/canvas#3512345'],
      'stored work item' => ['project/tool#3583123', 'project/tool#3583123'],
      'other GitLab group' => ['https://git.drupalcode.org/issue/tool-3583123/-/issues/1', NULL],
      'project URL' => ['https://www.drupal.org/project/notify_to_slack', NULL],
      'other site' => ['https://example.com/node/123', NULL],
    ];
  }

  /**
   * Tests parsing a line into a stored value.
   */
  #[DataProvider('lines')]
  public function testParseIssue(string $line, ?string $expected): void {
    $this->assertSame($expected, IssueIdsWidget::parseIssue($line));
  }

}
