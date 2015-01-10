'use strict';

projectKanbanApp.controller(
  'boardCtrl', [
    '$scope',
    '$routeParams',
    'issueService',
    'projectService',
    'Angularytics',
    function($scope, $routeParams, issueService, projectService, Angularytics) {
      // Hardcoded for now based on states
      $scope.boardLists = [
        {name: 'backlog', label: 'Postponed', ids: [4,16]},
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
      projectService.loadProject($routeParams.project).then(function(object) {
        $scope.page.setTitle(object.title);
        $scope.project = object;
        Angularytics.trackEvent('Project', 'Viewed project: ' + object.title);
      });
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