<?php

declare(strict_types=1);

namespace Drupal\contribkanban_boards\Attribute;

use Drupal\Component\Plugin\Attribute\Plugin;
use Drupal\Core\StringTranslation\TranslatableMarkup;

#[\Attribute(\Attribute::TARGET_CLASS)]
final class BoardProvider extends Plugin {

  /**
   * Constructs a BoardProvider attribute.
   *
   * @param string $id
   *   The plugin ID, which is also the board bundle.
   * @param \Drupal\Core\StringTranslation\TranslatableMarkup $label
   *   The bundle label.
   * @param \Drupal\Core\StringTranslation\TranslatableMarkup|null $description
   *   The bundle description.
   * @param class-string|null $deriver
   *   The deriver class, if any.
   */
  public function __construct(
    public readonly string $id,
    public readonly TranslatableMarkup $label,
    public readonly ?TranslatableMarkup $description = NULL,
    public readonly ?string $deriver = NULL,
  ) {}

}
