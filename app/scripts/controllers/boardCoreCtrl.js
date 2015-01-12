'use strict';

projectKanbanApp.controller(
  'boardCoreCtrl', [
    '$scope',
    '$routeParams',
    '$location',
    'issueService',
    'projectService',
    'Angularytics',
    function($scope, $routeParams, $location, issueService, projectService, Angularytics) {
      // project == param
      $scope.component = $routeParams.component;
      $scope.project = {
        nid: 3060,
        machine_name: 'drupal',
        title: $scope.component
      };
      $scope.projectType = 'project_core';
      $scope.page.setTitle('Component ' + $scope.component);
      $scope.releaseBranches = [];
      $scope.boardLists = [
        {name: 'backlog', label: 'Postponed',         param: 'field_issue_status', ids: [4,16]},
        {name: 'active',  label: 'Active',            param: 'field_issue_status', ids: [1]},
        {name: 'cnr',     label: 'Needs Review',      param: 'field_issue_status', ids: [8]},
        {name: 'cnw',     label: 'Needs Work',        param: 'field_issue_status', ids: [13]},
        {name: 'rtbc',    label: 'Reviewed & Tested', param: 'field_issue_status', ids: [14,15]},
        {name: 'done',    label: 'Fixed',             param: 'field_issue_status', ids: [2]}
      ];

      // Discover project releases for filtering.
      projectService.requestProjectRelease($scope.project.nid).then(function(releases) {
        $scope.releaseBranches = releases;
        $scope.projectRelease = $routeParams.branch || '';
      });

      // Ping Google.
      Angularytics.trackEvent('Project', 'Viewed core project: ' + $scope.component);
      console.log($scope.component);

      projectService.loadProject('3060').then(function(object) {




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
