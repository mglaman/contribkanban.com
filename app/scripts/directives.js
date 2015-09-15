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
            $(element).css('height', $window.innerHeight - 64);
          };
          scope.initializeWindowSize();
          angular.element($window).bind('resize', function () {
            scope.initializeWindowSize();
          });
        }
      };
    }
  ])
  // Issue directives.
  .directive('issue', ['$http', '$q', function ($http, $q) {
    return {
      restrict: 'A',
      templateUrl: 'views/issue.html',
      link: function (scope, element) {
        if (scope.issue.assigned.id != '') {
          // @note: not in filter because filters + promises = bad juju
          var apiQuery = 'https://www.drupal.org/api-d7/user/' + scope.issue.assigned.id + '.json';

          $http.get(apiQuery, {cache: true}).success(function (response) {
            scope.issue.assigned.id =  response.name;
          });
        }
      }
    };
  }])
  .directive('issueSprint', ['$http', '$q', function ($http, $q) {
    return {
      restrict: 'A',
      templateUrl: 'views/issue-sprint.html',
      link: function (scope, element) {
        if (scope.issue.assigned.id != '') {
          // @note: not in filter because filters + promises = bad juju
          var apiQuery = 'https://www.drupal.org/api-d7/node/' + scope.issue.assigned.id + '.json';

          $http.get(apiQuery, {cache: true}).success(function (response) {
            scope.issue.assigned.id =  response.name;
          });
        }

        if (scope.issue.project != 3060) {
          var apiQuery = 'https://www.drupal.org/api-d7/node/' + scope.issue.project + '.json';
          $http.get(apiQuery, {cache: true}).success(function (response) {
            scope.issue.project =  response.title;
          });
        } else {
          scope.issue.project = 'Drupal core';
        }
      }
    };
  }])
  .directive('issueNidLink', function () {
    return {
      restrict: 'E',
      template: '<a class="kanban-board--issue__link" href="https://www.drupal.org/node/{{ issue.nid}}" target="_blank">#{{ issue.nid}}</a>'
    }
  })
  .directive('issueTitle', function () {
    return {
      restrict: 'E',
      template: '<span class="kanban-board--issue__title">{{ issue.summary }}</span>'
    }
  })
  .directive('issueMetaVersion', function () {
    return {
      restrict: 'E',
      template: '<span class="kanban-board--issue__version bg-success">{{ issue.version }}</span>'
    }
  })
  .directive('issueMetaPriority', function () {
    return {
      restrict: 'E',
      template: '<span class="kanban-board--issue__priority bg-{{ issue.priority | priorityClassFilter }}">{{ issue.priority | priorityLabelFilter }}</span>'
    }
  })
  .directive('issueMetaComponent', function () {
    return {
      restrict: 'E',
      template: '<span class="kanban-board--issue__component bg-default">{{ issue.component }}</span>'
    }
  })
  .directive('issueMetaAssigned', function () {
    return {
      restrict: 'E',
      template: '<span class="kanban-board--issue__component btn-primary" ng-hide="!issue.assigned.id">ASSIGNED: {{ issue.assigned.id }}</span>'
    }
  })
  .directive('issueMetaCategory', function () {
    return {
      restrict: 'E',
      template: '<span class="kanban-board--issue__component btn-{{ issue.category | categoryClassFilter }}">{{ issue.category | categoryLabelFilter }}</span>'
    }
  })
  .directive('issueMetaProject', function () {
    return {
      restrict: 'E',
      template: '<span class="kanban-board--issue__component btn-default">{{ issue.project }}</span>'
    }
  });
