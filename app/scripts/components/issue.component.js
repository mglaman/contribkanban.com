(function (angular) {
  'use strict';
  angular.module('appContribkanban').directive('kanbanIssue', function () {
    return {
      restrict: 'E',
      // templateUrl: 'views/components/issue.html',
      template: '<md-card-content layout="column">' +
      '<h2 class="md-subhead"><issue-title> </issue-title><issue-nid-link></issue-nid-link></h2> ' +
      '<div class="kanban-board--issue_tags" ng-hide="noTags">' +
      '<issue-meta-version></issue-meta-version>' +
      '<issue-meta-priority></issue-meta-priority>' +
      '<issue-meta-component></issue-meta-component>' +
      '<issue-meta-assigned></issue-meta-assigned>' +
      '<issue-meta-category></issue-meta-category>' +
      '<issue-meta-project ng-show="sprintBoard"></issue-meta-project>' +
      '</div></md-card-content>',
      controllerAs: 'IssueController',
      controller: ['$scope', '$http', 'UrlService', 'UserService', 'projectService', function ($scope, $http, UrlService, UserService, projectService) {
        $scope.username = '';
        $scope.project = '';

        var uid = $scope.issue.assigned.id;
        if (uid.length > 0 && $scope.username.length === 0) {
          UserService.get(uid).then(function (name) {
            $scope.username = name;
          });
        }

        if ($scope.project.length === 0) {
          projectService.getProjectTitle($scope.issue.project).then(function (title) {
            $scope.project = title;
          })
        }
      }]
    };
  });
})(window.angular);
