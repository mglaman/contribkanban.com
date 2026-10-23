<?php

declare(strict_types=1);

namespace Drupal\contribkanban_boards\Form;

use Drupal\Core\Entity\ContentEntityDeleteForm;
use Drupal\Core\Url;

final class NodeBoardDeleteForm extends ContentEntityDeleteForm {

  /**
   * {@inheritdoc}
   *
   * Owners can't reach the admin collection, so they go to their account.
   */
  protected function getRedirectUrl(): Url {
    $collection = $this->getEntity()->toUrl('collection');
    if ($collection->access()) {
      return $collection;
    }
    return Url::fromRoute('entity.user.canonical', ['user' => $this->currentUser()->id()]);
  }

}
