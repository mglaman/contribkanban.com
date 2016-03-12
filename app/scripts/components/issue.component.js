(function (angular) {
  'use strict';
  angular.module('appContribkanban').directive('kanbanIssue', function () {
    return {
      restrict: 'E',
      templateUrl: 'views/components/issue.html',
      controllerAs: 'IssueController',
      controller: ['$scope', '$http', function ($scope, $http) {
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
              $http.get('https://www.drupal.org/api-d7/user/' + $scope.issue.assigned.id + '.json', {cache: true}).success(function (response) {
                $http.post('/api/contributor', {
                  uid: response.uid,
                  name: response.name
                });
                $scope.issue.assigned.id = response.name;
              });
            }
          });
        }
      }]
    };
  });
})(window.angular);
