'use strict';

projectKanbanApp.controller(
  'boardCtrl', [
    '$scope',
    '$routeParams',
    '$location',
    'issueService',
    'projectService',
    'Angularytics',
    function($scope, $routeParams, $location, issueService, projectService, Angularytics) {
      $scope.project = {};
      $scope.projectType = '';
      $scope.releaseBranches = [];
      $scope.boardLists = [];

      var boardListDefaults = [
        {name: 'backlog', label: 'Postponed',         param: 'field_issue_status', ids: [4,16]},
        {name: 'active',  label: 'Active',            param: 'field_issue_status', ids: [1]},
        {name: 'cnr',     label: 'Needs Review',      param: 'field_issue_status', ids: [8]},
        {name: 'cnw',     label: 'Needs Work',        param: 'field_issue_status', ids: [13]},
        {name: 'rtbc',    label: 'Reviewed & Tested', param: 'field_issue_status', ids: [14,15]},
        {name: 'done',    label: 'Fixed',             param: 'field_issue_status', ids: [2]}
        // Due to possible performance and query limitations, dropping this.
        // {name: 'wontfix', label: "Won't Fix", ids: [5,6,3,18]},
        // As mentioned above for perforamance and query issues, no closed() states.
        // {name: 'done', label: 'Fixed', param: 'field_issue_status', ids: [2,7]}
      ];

      projectService.loadProject($routeParams.project).then(function(object) {
        // Update the scope's project variable.
        $scope.project = object;
        $scope.projectType = object.projectType;

        // Set the page title to be the project's name.
        $scope.page.setTitle(object.title);

        // Initiate the board's lists.
        projectService.loadProjectConfig(object.nid).then(function(object) {
          if (object !== null) {
            $scope.boardLists = object;
          } else {
            $scope.boardLists = boardListDefaults;
          }
        });

        // Discover project releases for filtering.
        projectService.requestProjectRelease(object.nid).then(function(releases) {
          $scope.releaseBranches = releases;
          $scope.projectRelease = $routeParams.branch || '';
        });

        // Ping Google.
        Angularytics.trackEvent('Project', 'Viewed project: ' + object.title);
      });

      $scope.updateBoardRoute = function() {
        var pathParts = $location.path().split('/');
        if ($scope.projectRelease == null) {
          $location.path('/' + pathParts[1] + '/' + pathParts[2], false);

        } else {
          $location.path('/' + pathParts[1] + '/' + pathParts[2] + '/' + $scope.projectRelease, false);
        }
      };
    }
  ])
  .directive('boardviewport', ['$window', function($window) {
    return {
      restrict: 'A',
      link: function (scope, element) {
        scope.initializeWindowSize = function () {
          $(element).css('height', $window.innerHeight - 70);
        };
        scope.initializeWindowSize();
        angular.element($window).bind('resize', function () {
          scope.initializeWindowSize();
        });
      }
    };
  }]);
