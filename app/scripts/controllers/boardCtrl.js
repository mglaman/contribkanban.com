'use strict';

projectKanbanApp.controller(
  'boardCtrl', [
    '$scope',
    '$routeParams',
    'issueService',
    'projectService',
    function($scope, $routeParams, issueService, projectService) {
      // Hardcoded for now based on states
      $scope.boardLists = [
        {name: 'backlog', label: 'Backlog', ids: [4,16]},
        {name: 'active', label: 'Active', ids: [1]},
        {name: 'cnr', label: 'Needs Review', ids: [8]},
        {name: 'cnw', label: 'Needs Work', ids: [13]},
        {name: 'rtbc', label: 'Reviewed & Tested', ids: [14,15]},
        // Due to possible performance and query limitations, dropping this.
        // {name: 'wontfix', label: "Won't Fix", ids: [5,6,3,18]},
        // As mentioned above for perforamance and query issues, no closed() states.
        // {name: 'done', label: 'Fixed', ids: [2,7]}
        {name: 'done', label: 'Fixed', ids: [2]}
      ];

      $scope.boardIssues = [];
      /*
      issueService.requestIssues($routeParams.project).then(function(issues) {
          $scope.boardIssues = issues;
        }
      );
*/
      projectService.loadProject($routeParams.project).then(function(object) {
        $scope.project = object;
      });
    }
  ]);