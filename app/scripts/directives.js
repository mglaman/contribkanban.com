(function (angular) {
  'use strict';

  angular.module('appContribkanban')
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
    .directive('issueNidLink', function () {
      return {
        restrict: 'E',
        template: '<a class="kanban-board--issue__link" ng-href="" target="_blank" ng-bind="\'#\' + (issue.nid)"></a>'
      };
    })
    .directive('issueTitle', function () {
      return {
        restrict: 'E',
        template: '<span class="kanban-board--issue__title" ng-bind="issue.summary"></span>'
      };
    })
    .directive('issueMetaVersion', function () {
      return {
        restrict: 'E',
        template: '<span class="kanban-board--issue__version bg-success" ng-bind="issue.version"></span>'
      };
    })
    .directive('issueMetaPriority', function () {
      return {
        restrict: 'E',
        template: '<span class="kanban-board--issue__priority bg-{{ issue.priority | priorityClassFilter }}" ng-bind="issue.priority | priorityLabelFilter"></span>'
      };
    })
    .directive('issueMetaComponent', function () {
      return {
        restrict: 'E',
        template: '<span class="kanban-board--issue__component bg-default" ng-bind="issue.component"></span>'
      };
    })
    .directive('issueMetaAssigned', function () {
      return {
        restrict: 'E',
        template: '<span class="kanban-board--issue__component btn-primary" ng-hide="!issue.assigned.id" ng-bind="\'ASSIGNED: \' + issue.assigned.id"></span>'
      };
    })
    .directive('issueMetaCategory', function () {
      return {
        restrict: 'E',
        template: '<span class="kanban-board--issue__component btn-{{ issue.category | categoryClassFilter }}" ng-bind="issue.category | categoryLabelFilter"></span>'
      };
    })
    .directive('issueMetaProject', function () {
      return {
        restrict: 'E',
        template: '<span class="kanban-board--issue__component btn-default" ng-bind="issue.project"></span>'
      };
    });
})(window.angular);
