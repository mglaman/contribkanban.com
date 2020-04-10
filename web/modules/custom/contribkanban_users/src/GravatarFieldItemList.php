<?php

declare(strict_types=1);

namespace Drupal\contribkanban_users;

use Drupal\Core\Field\FieldItemList;
use Drupal\Core\TypedData\ComputedItemListTrait;
use Drupal\user\UserInterface;

final class GravatarFieldItemList extends FieldItemList
{
    use ComputedItemListTrait;

    protected function computeValue()
    {
        $entity = $this->getEntity();
        assert($entity instanceof UserInterface);
        $hash = md5(strtolower(trim($entity->getEmail())));
        $this->list[0] = $this->createItem(0, $hash);
    }
}
