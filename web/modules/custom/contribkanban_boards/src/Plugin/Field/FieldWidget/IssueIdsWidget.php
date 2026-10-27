<?php

declare(strict_types=1);

namespace Drupal\contribkanban_boards\Plugin\Field\FieldWidget;

use Drupal\Core\Field\Attribute\FieldWidget;
use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\WidgetBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\StringTranslation\TranslatableMarkup;

#[FieldWidget(
  id: 'issue_ids',
  label: new TranslatableMarkup('Issue IDs, one per line'),
  field_types: ['string'],
  multiple_values: TRUE,
)]
final class IssueIdsWidget extends WidgetBase {

  /**
   * {@inheritdoc}
   */
  public function formElement(FieldItemListInterface $items, $delta, array $element, array &$form, FormStateInterface $form_state): array {
    $values = array_column($items->getValue(), 'value');
    $element['#type'] = 'textarea';
    $element['#default_value'] = implode("\n", $values);
    $element['#rows'] = max(6, min(20, count($values) + 2));
    $element['#placeholder'] = "https://www.drupal.org/project/drupal/issues/3412345\nhttps://git.drupalcode.org/project/tool/-/work_items/3583123";
    // Replaces the field's description, which is written for developers.
    $element['#description'] = new TranslatableMarkup('One per line. Paste a drupal.org issue URL or number, or a git.drupalcode.org work item URL.');
    $element['#element_validate'] = [[self::class, 'validateElement']];
    // The board island lists the issues under the field. Issues from projects
    // that moved to GitLab load from there.
    $element['#attributes']['data-issue-ids'] = json_encode(_contribkanban_boards_gitlab_project_nids(), JSON_THROW_ON_ERROR);
    return $element;
  }

  /**
   * Flags the lines that aren't issues.
   *
   * @param array<string, mixed> $element
   *   The textarea element.
   * @param \Drupal\Core\Form\FormStateInterface $form_state
   *   The form state.
   */
  public static function validateElement(array $element, FormStateInterface $form_state): void {
    $invalid = array_filter(
      self::lines((string) $element['#value']),
      static fn (string $line): bool => self::parseIssue($line) === NULL,
    );
    if ($invalid !== []) {
      $form_state->setError($element, new TranslatableMarkup('These lines are not drupal.org issues or GitLab work items: %lines', [
        '%lines' => implode(', ', $invalid),
      ]));
    }
  }

  /**
   * {@inheritdoc}
   */
  public function massageFormValues(array|string $values, array $form, FormStateInterface $form_state): array {
    $items = [];
    foreach (self::lines((string) $values) as $line) {
      $id = self::parseIssue($line);
      if ($id !== NULL) {
        $items[$id] = ['value' => $id];
      }
    }
    return array_values($items);
  }

  /**
   * Splits the textarea value into trimmed, non-empty lines.
   *
   * @param string $value
   *   The textarea value.
   *
   * @return string[]
   *   The lines.
   */
  private static function lines(string $value): array {
    $lines = array_map('trim', preg_split('/\R/', $value) ?: []);
    return array_values(array_filter($lines, static fn (string $line): bool => $line !== ''));
  }

  /**
   * Gets the stored value for a drupal.org issue or a GitLab work item.
   *
   * A drupal.org issue is stored as its node ID. A GitLab work item is stored
   * as its project path and IID, such as "project/tool#3583123", because IIDs
   * are only unique within a project. Work items created on GitLab share
   * numbers with unrelated drupal.org nodes.
   *
   * @param string $line
   *   An issue number, such as "3412345" or "#3412345", a drupal.org issue
   *   URL, a git.drupalcode.org work item URL, or a stored work item value.
   *
   * @return string|null
   *   The value to store, or NULL if the line isn't an issue.
   */
  public static function parseIssue(string $line): ?string {
    if (preg_match('/^#?(\d+)$/', $line, $matches) === 1) {
      return ltrim($matches[1], '0') ?: NULL;
    }
    if (preg_match('~^https?://(?:www\.)?drupal\.org/(?:project/[^/]+/issues|node|i)/(\d+)(?:[/?#]|$)~', $line, $matches) === 1) {
      return $matches[1];
    }
    $patterns = [
      '~^https?://git\.drupalcode\.org/(project/[a-z0-9_]+)/-/(?:issues|work_items)/(\d+)(?:[/?#]|$)~',
      '~^(project/[a-z0-9_]+)#(\d+)$~',
    ];
    foreach ($patterns as $pattern) {
      if (preg_match($pattern, $line, $matches) === 1) {
        return $matches[1] . '#' . $matches[2];
      }
    }
    return NULL;
  }

}
