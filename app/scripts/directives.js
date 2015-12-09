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
      restrict: 'E',
      templateUrl: 'views/issue.html',
      link: function (scope, element) {
        // @note: not in filter because filters + promises = bad juju
        if (scope.issue.assigned.id != '') {
          var uid = scope.issue.assigned.id;
          // Check local contributor data
          $http.get('/api/contributor/' + uid, {cache: true}).then(function (res) {
            // If local, use that.
            if (res.data !== null) {
              scope.issue.assigned.id = res.data.name;
              console.log('cache hit: ' + res.data.name);
            }
            // Else ping Drupal.org and cache
            else {
              $http.get('https://www.drupal.org/api-d7/user/' + scope.issue.assigned.id + '.json', {cache: true}).success(function (response) {
                $http.post('/api/contributor', {
                  uid: response.uid,
                  name: response.name
                });
                scope.issue.assigned.id =  response.name;
                console.log('cache miss: ' + response.name);
              });
            }
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
      template: '<a class="kanban-board--issue__link" ng-href="" target="_blank" ng-bind="\'#\' + (issue.nid)"></a>'
    }
  })
  .directive('issueTitle', function () {
    return {
      restrict: 'E',
      template: '<span class="kanban-board--issue__title" ng-bind="issue.summary"></span>'
    }
  })
  .directive('issueMetaVersion', function () {
    return {
      restrict: 'E',
      template: '<span class="kanban-board--issue__version bg-success" ng-bind="issue.version"></span>'
    }
  })
  .directive('issueMetaPriority', function () {
    return {
      restrict: 'E',
      template: '<span class="kanban-board--issue__priority bg-{{ issue.priority | priorityClassFilter }}" ng-bind="issue.priority | priorityLabelFilter"></span>'
    }
  })
  .directive('issueMetaComponent', function () {
    return {
      restrict: 'E',
      template: '<span class="kanban-board--issue__component bg-default" ng-bind="issue.component"></span>'
    }
  })
  .directive('issueMetaAssigned', function () {
    return {
      restrict: 'E',
      template: '<span class="kanban-board--issue__component btn-primary" ng-hide="!issue.assigned.id" ng-bind="\'ASSIGNED: \' + issue.assigned.id"></span>'
    }
  })
  .directive('issueMetaCategory', function () {
    return {
      restrict: 'E',
      template: '<span class="kanban-board--issue__component btn-{{ issue.category | categoryClassFilter }}" ng-bind="issue.category | categoryLabelFilter"></span>'
    }
  })
  .directive('issueMetaProject', function () {
    return {
      restrict: 'E',
      template: '<span class="kanban-board--issue__component btn-default" ng-bind="issue.project"></span>'
    }
  });
