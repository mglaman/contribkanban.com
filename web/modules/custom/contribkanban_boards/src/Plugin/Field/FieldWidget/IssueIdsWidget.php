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
    $element['#placeholder'] = "3412345\nhttps://www.drupal.org/project/drupal/issues/3412345";
    // Replaces the field's description, which is written for developers.
    $element['#description'] = new TranslatableMarkup('One per line. Paste an issue number or its drupal.org URL.');
    $element['#element_validate'] = [[self::class, 'validateElement']];
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
      static fn (string $line): bool => self::parseIssueId($line) === NULL,
    );
    if ($invalid !== []) {
      $form_state->setError($element, new TranslatableMarkup('These lines are not drupal.org issues: %lines', [
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
      $id = self::parseIssueId($line);
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
   * Gets the issue ID from a number or an issue URL.
   *
   * @param string $line
   *   An issue number, such as "3412345" or "#3412345", or an issue URL on
   *   drupal.org or git.drupalcode.org. Migrated issues keep their number as
   *   their GitLab ID.
   *
   * @return string|null
   *   The issue ID, or NULL if the line isn't an issue.
   */
  public static function parseIssueId(string $line): ?string {
    if (preg_match('/^#?(\d+)$/', $line, $matches) === 1) {
      return ltrim($matches[1], '0') ?: NULL;
    }
    $patterns = [
      '~^https?://(?:www\.)?drupal\.org/(?:project/[^/]+/issues|node|i)/(\d+)(?:[/?#]|$)~',
      '~^https?://git\.drupalcode\.org/project/[^/]+/-/(?:issues|work_items)/(\d+)(?:[/?#]|$)~',
    ];
    foreach ($patterns as $pattern) {
      if (preg_match($pattern, $line, $matches) === 1) {
        return $matches[1];
      }
    }
    return NULL;
  }

}
