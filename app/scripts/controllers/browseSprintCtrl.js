'use strict';

projectKanbanApp.controller('browseSprintCtrl', [
    '$scope',
    '$routeParams',
    '$location',
    'parseSprintService',
    function ($scope, $routeParams, $location, parseSprintService) {
      $scope.location = $location;
      $scope.routePath = 'sprint';
      $scope.projects = [];

      var Sprint = parseSprintService.ParseObject;
      var parseQuery = new Parse.Query(Sprint);
      parseQuery.find({
        success: function(results) {
          console.log(results);
          var rows = [];
          angular.forEach(results, function(val, key) {
            rows.push(val.attributes);
          });
          angular.copy(rows, $scope.projects);
          $scope.$apply();
        },
        error: function(error) {

        }
      })


    }
  ]
);
