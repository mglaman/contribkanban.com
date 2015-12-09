'use strict';

projectKanbanApp.controller('browseSprintCtrl', [
    '$q',
    '$scope',
    '$routeParams',
    '$location',
    '$http',
    'UrlService',
    function ($q, $scope, $routeParams, $location, $http, UrlService) {
      $scope.location = $location;
      $scope.routePath = 'sprint';
      $scope.projecsts = [];
      $scope.addType = 'Sprint';
      $scope.addPlaceholder = 'Tag name';

      var querySprints = function () {
        var deferred = $q.defer();
        $http.get('/api/sprints').then(function(results) {
          var rows = [];
          angular.forEach(results.data, function(val, key) {
            rows.push(val);
          });
          deferred.resolve(rows);
        });
        return deferred.promise;
      };

      querySprints().then(function (results) {
        $scope.projects = results;
      });

      $scope.addBoard = function (tagName) {
        var apiQuery = new UrlService().setEntityEndpoint('taxonomy_term')
          .addParameter('limit', 1)
          .addParameter('name', tagName)
          .addParameter('sort', 'tid')
          .addParameter('direction', 'ASC');
        $http.get(apiQuery.getEndpointUrl()).then(
          function (response) {
            if (response.data.list.length >= 1) {
              var tagTerm = response.data.list[0];

              $http.get('/api/sprint/exists/', tagTerm.tid).then(function (object) {
                if (object.data !== null) {
                  $location.url('/sprint/' + object.data.machine_name)
                } else {
                  var cleanName = tagTerm.name.replace(/ /g,'');
                  $http.post('/api/sprint', {
                    machine_name: cleanName,
                    title: tagTerm.name,
                    nid: cleanName,
                    tid: [tagTerm.tid]
                  });
                  $location.url('/sprint/' + cleanName)
                }
              });

            }
          }, function (response) {
            console.log(response);
            alert('Unable to get data about ' + tagName);
          }
        );
      }
    }
  ]
);
