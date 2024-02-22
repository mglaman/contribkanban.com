<?php

namespace Drupal\contribkanban_users;

use Drupal\Core\Field\Plugin\Field\FieldType\StringItem;
use Drupal\user\UserInterface;
use Laminas\Feed\Reader\Http\ClientInterface;
use Laminas\Feed\Reader\Http\Psr7ResponseDecorator;
use Laminas\Feed\Reader\Reader;

class UserIssuesFeed {
  public function fetch(UserInterface $user) {
    if ($user->get('drupalorg_uid')->isEmpty()) {
      throw new \InvalidArgumentException('Empty D.o user ID');
    }
    $field = $user->get('drupalorg_uid')->first();
    assert($field instanceof StringItem);
    $url = "https://www.drupal.org/project/issues/user/{$field->get('value')->getValue()}/feed";
    Reader::setHttpClient(new class () implements ClientInterface {

      public function get($uri) {
        $response = \Drupal::httpClient()->get($uri);
        return new Psr7ResponseDecorator($response);
      }
    });
    $channel = Reader::import($url);
    $items = [];
    foreach ($channel as $item) {
      $link = $item->getLink();
      $parsed = parse_url($link);
      $path_parts = explode('/', $parsed['path']);
      $node_id = end($path_parts);
      $items[] = $node_id;
    }
    return $items;
  }
}
