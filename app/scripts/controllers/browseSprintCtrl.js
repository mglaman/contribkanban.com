'use strict';

projectKanbanApp.controller('browseSprintCtrl', [
    '$q',
    '$scope',
    '$routeParams',
    '$location',
    'parseService',
    'UrlService',
    '$http',
    function ($q, $scope, $routeParams, $location, parseService, UrlService, $http) {
      $scope.location = $location;
      $scope.routePath = 'sprint';
      $scope.projecsts = [];
      $scope.addType = 'Sprint';
      $scope.addPlaceholder = 'Tag name';

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

              parseService.attributeQuery('Boards', 'tid', tagTerm.tid).then(function (object) {
                if (object !== null) {
                  alert('Tag already exists as sprint board');
                } else {
                  var cleanName = tagTerm.name.replace(/ /g,'');
                  parseService.saveObject('Boards', {
                    machine_name: cleanName,
                    title: tagTerm.name,
                    nid: cleanName,
                    tid: [tagTerm.tid]
                  })
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
