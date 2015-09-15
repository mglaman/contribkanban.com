'use strict';

projectKanbanApp.controller(
  'sprintCtrl', [
    '$scope',
    '$routeParams',
    '$location',
    'issueService',
    'parseService',
    'Angularytics',
    'DrupalOrgService',
    function ($scope, $routeParams, $location, issueService, parseService, Angularytics, DrupalOrgService) {
      $scope.sprint = {};
      $scope.projectID = null;
      $scope.boardLists = [];
      $scope.issueNeedsTag = $routeParams.needs || '';
      $scope.priorities = DrupalOrgService.issuePriorities;
      $scope.categories = DrupalOrgService.issueCategories;
      $scope.needs = {
        36358: 'Needs reroll',
        310: 'Needs usability review',
        374: 'Needs issue summary update',
        488: 'Needs documentation',
        978: 'Needs screenshots',
        5144: 'Needs manual testing',
        7066: 'Needs accessibility review',
        29726: 'Needs change record'
      };

      var boardListDefaults = function(tagID) {
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

      parseService.attributeQuery('Boards', 'nid', $routeParams.sprint).then(
        function (parseObject) {
          var object = parseObject.attributes;
          $scope.sprint = object;
          // Set the page title to be the project's name.
          $scope.page.setTitle(object.title);
          $scope.boardLists = boardListDefaults(object.tid);

          // Ping Google.
          Angularytics.trackEvent('Project', 'Viewed sprint: ' + object.title);

        }, function () {

        });

      $scope.updateBoardRoute = function () {
        var pathParts = $location.path().split('/');
        if ($scope.issueNeedsTag == null) {
          $location.path('/' + pathParts[1] + '/' + pathParts[2], false);

        }
        else {
          $location.path('/' + pathParts[1] + '/' + pathParts[2] + '/' + $scope.issueNeedsTag, false);
        }
      };
    }
  ]);
