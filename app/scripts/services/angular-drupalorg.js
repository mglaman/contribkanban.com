(function() {
  /*global angular*/
  'use strict';

  var module = angular.module('angularDrupalOrg', ['ngResource']);

  // Setup all requests to accept application/json.
  module.config(function ($httpProvider) {
    $httpProvider.defaults.headers.common = {
      'Accept': 'application/json'
    };
  });

  module.factory('DrupalOrgService', ['$resource', function () {
    var factory = {};
    factory.apiUrl = 'https://www.drupal.org/api-d7';
    factory.apiSort = '&sort=changed&direction=DESC';

  }]);
})(angular);
