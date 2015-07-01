'use strict';

projectKanbanApp
  // Directive for setting app to match window height.
  .directive('appviewport', ['$window', function($window) {
    return {
      restrict: 'A',
      link: function (scope, element) {
        scope.initializeWindowSize = function () {
          $(element).css('min-height', $window.innerHeight);
        };
        scope.initializeWindowSize();
        angular.element($window).bind('resize', function () {
          scope.initializeWindowSize();
        });
      }
    };
  }])
  // Directive for matching board heights.
  .directive('boardviewport', [
    '$window', function ($window) {
      return {
        restrict: 'A',
        link: function (scope, element) {
          scope.initializeWindowSize = function () {
            $(element).css('height', $window.innerHeight - 50);
          };
          scope.initializeWindowSize();
          angular.element($window).bind('resize', function () {
            scope.initializeWindowSize();
          });
        }
      };
    }
  ])
  .directive('issue', ['$http', '$q', function ($http, $q) {
    return {
      restrict: 'A',
      templateUrl: 'views/issue.html',
      link: function (scope, element) {
        if (scope.issue.assigned.id != '') {
          var apiQuery = 'https://www.drupal.org/api-d7/user/' + scope.issue.assigned.id + '.json';

          $http.get(apiQuery, {cache: true}).success(function (response) {
            scope.issue.assigned.id =  response.name;
          });
        }
      }
    };
  }]);
