<?php declare(strict_types = 1);

use Drupal\consumers\Entity\Consumer;

function contribkanban_api_post_update_ensure_consumer() {
    $initial_consumer = Consumer::load(1);
    if ($initial_consumer) {
        $initial_consumer->delete();
    }
    contribkanban_api_ensure_default_consumer();
}
