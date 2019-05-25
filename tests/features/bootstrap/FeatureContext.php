<?php

use Behat\Mink\Driver\GoutteDriver;
use Behat\Mink\Exception\ElementNotFoundException;
use Behat\Mink\Exception\ExpectationException;
use Drupal\DrupalExtension\Context\RawDrupalContext;
use Behat\Behat\Context\SnippetAcceptingContext;

/**
 * Defines application features from the specific context.
 */
class FeatureContext extends RawDrupalContext {

  /**
   * Initializes context.
   *
   * Every scenario gets its own context instance.
   * You can also pass arbitrary arguments to the
   * context constructor through behat.yml.
   */
  public function __construct() {
  }

  /**
   * @When I wait for loading to finish
   */
  public function iWaitForLoadingToFinish()
  {
    $this->spin(function (FeatureContext $context) {
      try {
        $element = $this->getSession()->getPage();
        $element->findAll('css', '.is-loading');
        return FALSE;
      }
      catch (ElementNotFoundException $e) {
        return TRUE;
      }
    });
  }


  /**
   * Click on non-anchor element.
   *
   * @Then /^I click on "([^"]*)"$/
   */
  public function iClickOn($element) {
    $page = $this->getSession()->getPage();
    $findName = $page->find("css", $element);
    if (!$findName) {
      throw new Exception($element . " could not be found");
    }
    else {
      $findName->click();
    }
  }

  /**
   * Click on non-anchor element.
   *
   * @Then I click on :element in the :region( region)
   */
  public function iClickOnInRegion($element, $region) {
    $session = $this->getSession();
    $regionObj = $session->getPage()->find('region', $region);
    $findName = $regionObj->find("css", $element);
    if (!$findName) {
      throw new Exception($element . " could not be found");
    }
    else {
      $findName->click();
    }
  }

  /**
   * Just wait.
   *
   * @Given I wait
   */
  public function iWait() {
    sleep(1);
  }

  /**
   * @Given I wait for the :region region
   */
  public function iWaitForTheRegion($region) {
    $this->spin(function (FeatureContext $context) use ($region) {
      try {
        $session = $this->getSession();
        $region_obj = $session->getPage()->find('region', $region);
        if (!$region_obj) {
          throw new \Exception(sprintf('No region "%s" found on the page %s.', $region, $session->getCurrentUrl()));
        }
        return TRUE;
      }
      catch (\Exception $e) {
        return FALSE;
      }
    });
  }

  /**
   * @Then the :arg1 region should exist
   */
  public function theRegionShouldExist($arg1) {
    $session = $this->getSession();
    $region_obj = $session->getPage()->find('region', $arg1);
    if (!$region_obj) {
      throw new \Exception(sprintf('No region "%s" found on the page %s.', $arg1, $session->getCurrentUrl()));
    }
  }

  /**
   * @Then /^(?:|I )wait to see "(?P<text>(?:[^"]|\\")*)"$/
   */
  public function iWaitToSee($text) {
    $this->spin(function (FeatureContext $context) use ($text) {
      try {
        $this->assertSession()->pageTextContains(str_replace('\\"', '"', $text));
        return TRUE;
      }
      catch (ElementNotFoundException $e) {
        return FALSE;
      }
    });
  }

  /**
   * @Then I wait to see( the text) :text in the :region( region)
   */
  public function iWaitToSeeInRegion($text, $region) {
    $this->spin(function (FeatureContext $context) use ($text, $region) {
      try {
        $this->assertSession()->elementTextContains('css', '.app-header .page-title h1', $text);
        return TRUE;
      }
      catch (ElementNotFoundException $e) {
        return FALSE;
      }
    });
  }

  /**
   * Based on Behat's own example.
   *
   * @see http://docs.behat.org/en/v2.5/cookbook/using_spin_functions.html#adding-a-timeout
   * @param $lambda
   * @param int $wait
   * @throws \Exception
   */
  public function spin($lambda, $wait = 60) {
    $time = time();
    $stopTime = $time + $wait;
    while (time() < $stopTime) {
      try {
        if ($lambda($this)) {
          return;
        }
      }
      catch (\Exception $e) {
        // do nothing.
      }

      usleep(250000);
    }

    throw new \Exception("Spin function timed out after {$wait} seconds");
  }

  /**
   * @Then the :arg1 field should be disabled
   */
  public function theFieldShouldBeDisabled($arg1) {
    $this->assertSession()->elementAttributeExists('named', ['field', $arg1],'disabled');
    $this->assertSession()->elementAttributeExists('named', ['field', $arg1],'readonly');
  }

  /**
   * @Then the :arg1 button should be disabled
   */
  public function theButtonShouldBeDisabled($arg1) {
    $this->assertSession()->elementAttributeExists('named', ['button', $arg1],'disabled');
  }

  /**
   * Click on a region.
   *
   * @When I click on the :region( region)
   */
  public function iClickOnTheRegion($region) {
    $session   = $this->getSession();
    $regionObj = $session->getPage()->find('region', $region);
    if (!$regionObj) {
      throw new Exception("The " . $region . " region could not be found");
    }
    else {
      $regionObj->click();
    }
  }

  /**
   * @When /^I open the sidebar$/
   */
  public function iOpenTheSidebar() {
    $session = $this->getSession();
    $trigger = $session->getPage()->find('css', '[data-drupal-selector="app-siderbar-trigger"]');
    $trigger->click();
    $this->iWaitForTheRegion('App Sidebar');
    $this->iWait();
  }


}
