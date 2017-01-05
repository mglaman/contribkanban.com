(function (angular) {
  'use strict';
  angular.module('appContribkanban').directive('kanbanIssue', function () {
    return {
      restrict: 'E',
      templateUrl: 'views/components/issue.html',
      controllerAs: 'IssueController',
      controller: ['$scope', '$http', 'UrlService', function ($scope, $http, UrlService) {
        if ($scope.issue.assigned.id !== '') {
          // @note: not in filter because filters + promises = bad juju
          var uid = $scope.issue.assigned.id;
          // Check local contributor data
          $http.get('/api/contributor/' + uid, {cache: true}).then(function (res) {
            // If local, use that.
            if (res.data !== null) {
              $scope.issue.assigned.id = res.data.name;
            }
            // Else ping Drupal.org and cache
            else {
              $http.get('https://www.drupal.org/api-d7/user/' + $scope.issue.assigned.id + '.json', {cache: true}).then(function (response) {
                $http.post('/api/contributor', {
                  uid: response.data.uid,
                  name: response.data.name
                });
                $scope.issue.assigned.id = response.data.name;
              });
            }
          });
        }

        if ($scope.issue.project === "3060") {
          $scope.issue.project = 'Drupal core';
        } else {
          $http.get('/api/project/' + $scope.issue.project, {cache: true}).then(function (res) {
            if (res.data !== null) {
              $scope.issue.project = res.data.title;
            } else {
              var nodeUrl = new UrlService().setEntityEndpoint('node').addParameter('nid', $scope.issue.project);
              $http.get(nodeUrl.getEndpointUrl()).then(function (res) {
                $scope.issue.project = res.data.list[0].title;
              })
            }
          });
        }
      }]
    };
  });
})(window.angular);
