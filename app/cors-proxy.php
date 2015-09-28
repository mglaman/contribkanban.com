<?php

/**
 * PHP proxy for non-CORS endpoints.
 */

define('DRUPALORG', 'https://www.drupal.org');
define('ISSUE_TAG_ENDPOINT', '/taxonomy/autocomplete/taxonomy_vocabulary_9');

switch ($_GET['type']) {
case 'tag':
    print file_get_contents(DRUPALORG . ISSUE_TAG_ENDPOINT . '/' . $_GET['name']);
    break;
}
