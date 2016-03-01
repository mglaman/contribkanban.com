(function(angular) {
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
    factory.issuePriorities = {
      0: 'Any',
      100: 'Minor',
      200: 'Normal',
      300: 'Major',
      400: 'Critical'
    };
    factory.issueCategories = {
      0: 'Any',
      1: 'Bug report',
      2: 'Task',
      3: 'Feature request',
      4: 'Support request',
      5: 'Plan'
    };
  }]);
})(window.angular);
