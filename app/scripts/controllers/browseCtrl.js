'use strict';

projectKanbanApp.controller('browseCtrl', [
    '$scope',
    '$routeParams',
    '$location',
    'projectService',
    'parseProjectService',
    function ($scope, $routeParams, $location, projectService, parseProjectService) {
      $scope.location = $location;
      $scope.projects = [];
      $scope.routePath = 'board';

      $scope.queryProjects = function () {
        $scope.projects = [];
        var Project = parseProjectService.ParseObject;
        var parseQuery = new Parse.Query(Project);
        // If passed a type, filter by that.
        if ($routeParams.type !== undefined) {
          parseQuery.equalTo('projectType', 'project_' + $routeParams.type);
        }

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
