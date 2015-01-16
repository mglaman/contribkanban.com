'use strict';

projectKanbanApp.controller(
  'sprintCtrl', [
    '$scope',
    '$routeParams',
    '$location',
    'issueService',
    'parseSprintService',
    'Angularytics',
    'DoubleClick',
    function ($scope, $routeParams, $location, issueService, parseSprintService, Angularytics, DoubleClick) {
      $scope.sprint = {};
      $scope.projectID = null;
      $scope.boardLists = [];

      var boardListDefaults = function(tagID) {
        return [
          {
            name: 'backlog',
            label: 'Postponed',
            tag: tagID,
            category: '',
            statuses: [4, 16],
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

      parseSprintService.attributeQuery('nid', $routeParams.sprint).then(
        function (parseObject) {
          var object = parseObject.attributes;
          $scope.sprint = object;
          // Set the page title to be the project's name.
          $scope.page.setTitle(object.title);
          $scope.boardLists = boardListDefaults(object.tid);

          // Ping Google.
          Angularytics.trackEvent('Project', 'Viewed sprint: ' + object.title);
          DoubleClick.refreshAds('div-gpt-ad-1421106878492-0');


        }, function () {

        });
    }
  ])
  .directive('boardviewport', [
    '$window', function ($window) {
      return {
        restrict: 'A',
        link: function (scope, element) {
          scope.initializeWindowSize = function () {
            $(element).css('height', $window.innerHeight - 70);
          };
          scope.initializeWindowSize();
          angular.element($window).bind('resize', function () {
            scope.initializeWindowSize();
          });
        }
      };
    }
  ]);
