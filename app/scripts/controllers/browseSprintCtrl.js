'use strict';

projectKanbanApp.controller('browseSprintCtrl', [
    '$q',
    '$scope',
    '$routeParams',
    '$location',
    'parseService',
    function ($q, $scope, $routeParams, $location, parseService) {
      $scope.location = $location;
      $scope.routePath = 'sprint';
      $scope.projecsts = [];

      var querySprints = function () {
        var deferred = $q.defer();
        var parseQuery = parseService.objectQuery('Boards');
        parseQuery.find({
          success: function(results) {
            var rows = [];
            angular.forEach(results, function(val, key) {
              rows.push(val.attributes);
            });
            deferred.resolve(rows);
          },
          error: function(error) {

          }
        });
        return deferred.promise;
      };

      querySprints().then(function (results) {
        $scope.projects = results;
      });

    }
  ]
);
