'use strict';

projectKanbanApp.controller('browseCtrl', [
    '$scope',
    '$routeParams',
    '$location',
    'parseService',
    'projectService',
    function ($scope, $routeParams, $location, parseService) {
      $scope.location = $location;
      $scope.projects = [];
      $scope.routePath = 'board';

      $scope.queryProjects = function () {
        $scope.projects = [];

        var parseQuery = parseService.objectQuery('Project');

        // If passed a type, filter by that.
        if ($routeParams.type !== undefined) {
          parseQuery.equalTo('projectType', 'project_' + $routeParams.type);
        }
        // @todo: Need to come up with a paging solution.
        parseQuery.limit(200);

        parseQuery.find({}).then(function (results) {
          angular.forEach(results, function(val, key) {
            $scope.projects.push(val.attributes);
          });
          $scope.$apply();
        }, function () {

        });
      };
      $scope.queryProjects();
    }
  ]
);
