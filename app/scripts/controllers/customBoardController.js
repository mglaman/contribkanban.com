(function (angular) {
  'use strict';

  angular.module('appContribkanban').controller(
    'customBoardController', [
      '$scope',
      '$routeParams',
      '$location',
      'issueService',
      '$http',
      function ($scope, $routeParams, $location, issueService, $http) {
        $scope.sprintBoard = true;
        $scope.projectID = null;
        $scope.boardLists = [];
        $scope.issueNeedsTag = $routeParams.needs || '';
        $scope.priorities = issueService.issuePriorities;
        $scope.categories = issueService.issueCategories;
        $scope.needs = {
          0: 'All',
          36358: 'Needs reroll',
          345: 'Needs tests',
          310: 'Needs usability review',
          374: 'Needs issue summary update',
          488: 'Needs documentation',
          978: 'Needs screenshots',
          5144: 'Needs manual testing',
          7066: 'Needs accessibility review',
          29726: 'Needs change record'
        };

        $http.get('/api/custom/' + $routeParams.board).then(function (res) {
          var object = res.data;
          // Set the page title to be the project's name.
          $scope.page.setTitle(object.title);
          $scope.boardLists = object.lists;
        });

        $scope.updateBoardRoute = function () {
          var pathParts = $location.path().split('/');
          if ($scope.issueNeedsTag === null) {
            $location.path('/' + pathParts[1] + '/' + pathParts[2], false);

          }
          else {
            $location.path('/' + pathParts[1] + '/' + pathParts[2] + '/' + $scope.issueNeedsTag, false);
          }
        };
      }
    ]);
})(window.angular);
