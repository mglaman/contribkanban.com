(function (angular) {
  'use strict';

  angular.module('appContribkanban').controller(
    'sprintCtrl', [
      '$scope',
      '$routeParams',
      '$location',
      'issueService',
      '$http',
      'Angularytics',
      function ($scope, $routeParams, $location, issueService, $http, Angularytics) {
        $scope.sprintBoard = true;
        $scope.sprint = {};
        $scope.projectID = null;
        $scope.boardLists = [];
        $scope.issueNeedsTag = $routeParams.needs || '';
        $scope.priorities = issueService.issuePriorities;
        $scope.categories = issueService.issueCategories;
        $scope.needs = {
          0: 'All',
          36358: 'Needs reroll',
          310: 'Needs usability review',
          374: 'Needs issue summary update',
          488: 'Needs documentation',
          978: 'Needs screenshots',
          5144: 'Needs manual testing',
          7066: 'Needs accessibility review',
          29726: 'Needs change record'
        };

        var boardListDefaults = function (tagID) {
          return [
            {
              name: 'cnr',
              label: 'Needs Review',
              tag: tagID,
              category: '',
              statuses: [8],
              parentIssue: ''
            },
            {
              name: 'cnw',
              label: 'Needs Work',
              tag: tagID,
              category: '',
              statuses: [13],
              parentIssue: ''
            },
            {
              name: 'active',
              label: 'Active',
              tag: tagID,
              category: '',
              statuses: [1],
              parentIssue: ''
            },
            {
              name: 'rtbc',
              label: 'Reviewed & Tested',
              tag: tagID,
              category: '',
              statuses: [14, 15],
              parentIssue: ''
            },
            {
              name: 'done',
              label: 'Fixed',
              tag: tagID,
              category: '',
              statuses: [2],
              parentIssue: ''
            }
          ]
        };

        $http.get('/api/sprint/' + $routeParams.sprint).then(function (res) {
          var object = res.data;
          $scope.sprint = object;
          // Set the page title to be the project's name.
          $scope.page.setTitle(object.title);

          $http.get('/api/board/sprint/' + $routeParams.sprint)
            .success(function (data, status, headers, config) {
              angular.forEach(data, function (val, key) {
                data[key].tag = object.tid;
              });
              $scope.boardLists = data;
            })
            .error(function (data, status, headers, config) {
              $scope.boardLists = {}
            });

          // Ping Google.
          Angularytics.trackEvent('Project', 'Viewed sprint: ' + object.title);
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
