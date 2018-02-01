<?php

namespace Drupal\contribkanban_users;

use Drupal\user\UserInterface;
use Zend\Feed\Reader\Reader;

class UserIssuesFeed {
  public function fetch(UserInterface $user) {
    if ($user->get('drupalorg_uid')->isEmpty()) {
      throw new \InvalidArgumentException('Empty D.o user ID');
    }
    $url = "https://www.drupal.org/project/issues/user/{$user->get('drupalorg_uid')->value}/feed";
    $response = \Drupal::httpClient()->get($url);
    $source_string = (string) $response->getBody();
    // Set our bridge extension manager to Zend Feed.
    Reader::setExtensionManager(\Drupal::service('feed.bridge.reader'));
    $channel = Reader::importString($source_string);
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
