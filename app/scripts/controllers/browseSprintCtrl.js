'use strict';

projectKanbanApp.controller('browseSprintCtrl', [
    '$scope',
    '$routeParams',
    '$location',
    'parseService',
    function ($scope, $routeParams, $location, parseService) {
      $scope.location = $location;
      $scope.routePath = 'sprint';
      $scope.projects = [];

      var parseQuery = parseService.objectQuery('Boards');
      parseQuery.find({
        success: function(results) {
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
