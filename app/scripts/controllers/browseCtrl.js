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

      $scope.queryProjects = function () {
        var Project = parseProjectService.ParseObject;
        var parseQuery = new Parse.Query(Project);
        // If passed a type, filter by that.
        if ($routeParams.type !== undefined) {
          parseQuery.equalTo('projectType', 'project_' + $routeParams.type);
        }

        parseQuery.find({}).then(function (results) {
          var rows = [];
          angular.forEach(results, function(val, key) {
            rows.push(val.attributes);
          });
          angular.copy(rows, $scope.projects);
          $scope.$apply();
        }, function () {

        });
      };

      $scope.$watch(function() {
        return projectService.getProject();
      }, function(nVal, oVal) {
        if (nVal) {
          $scope.queryProjects();
        }
      });
    }
  ]
);
