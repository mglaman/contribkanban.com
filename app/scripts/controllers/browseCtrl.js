'use strict';

projectKanbanApp.controller(
  'browseCtrl', [
    '$scope',
    '$routeParams',
    '$location',
    'projectService',
    'Angularytics',
    function($scope, $routeParams, $location, projectService, Angularytics) {
      $scope.location = $location;
      $scope.projects = [];

      $scope.queryProjects = function() {
        var Project = Parse.Object.extend('Project');
        var parseQuery = new Parse.Query(Project);
        // If passed a type, filter by that.
        if ($routeParams.type !== undefined) {
          parseQuery.equalTo('projectType', 'project_' + $routeParams.type);
        }

        parseQuery.find({
          success: function(results) {
            $scope.$apply(function() {
              var rows = [];
              angular.forEach(results, function(val, key) {
                rows.push((val.attributes));
              });
              $scope.projects = rows;

            });
          }
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
