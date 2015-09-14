'use strict';

projectKanbanApp.controller(
  'boardCtrl', [
    '$scope',
    '$routeParams',
    '$location',
    'parseService',
    'issueService',
    'projectService',
    'Angularytics',
    'DoubleClick',
    function ($scope, $routeParams, $location, parseService, issueService, projectService, Angularytics, DoubleClick) {
      $scope.project = {};
      $scope.projectID = '';
      $scope.projectMachineName = $routeParams.project;
      $scope.projectType = '';
      $scope.releaseBranches = [];
      $scope.boardLists = [];
      $scope.projectRelease = {name: $routeParams.branch, label: $routeParams.branch } || {};
      $scope.priorities = {
        100: 'Minor',
        200: 'Normal',
        300: 'Major',
        400: 'Critical'
      };
      $scope.categories = {
        1: 'Bug report',
        2: 'Task',
        3: 'Feature request',
        4: 'Support request',
        5: 'Plan'
      };

      var boardListDefaults = [
        {
          name: 'backlog',
          label: 'Postponed',
          tag: '',
          category: '',
          statuses: [4, 16],
          parentIssue: ''
        },
        {
          name: 'active',
          label: 'Active',
          tag: '',
          category: '',
          statuses: [1],
          parentIssue: ''
        },
        {
          name: 'cnw',
          label: 'Needs Work',
          tag: '',
          category: '',
          statuses: [13],
          parentIssue: ''
        },
        {
          name: 'cnr',
          label: 'Needs Review',
          tag: '',
          category: '',
          statuses: [8],
          parentIssue: ''
        },
        {
          name: 'rtbc',
          label: 'Reviewed & Tested',
          tag: '',
          category: '',
          statuses: [14, 15],
          parentIssue: ''
        },
        {
          name: 'done',
          label: 'Fixed',
          tag: '',
          category: '',
          statuses: [2],
          parentIssue: ''
        }
        // Due to possible performance and query limitations, dropping this.
        // {name: 'wontfix', label: "Won't Fix", statuses: [5,6,3,18]},
        // As mentioned above for perforamance and query issues, no closed() states.
        // {name: 'done', label: 'Fixed', tag: '', statuses: [2,7]}
      ];

      // projectService.loadProject($routeParams.project)
      projectService.loadProjectByMachineName($routeParams.project)
        .then(function (parseObject) {
          if (parseObject == null) {
            projectService.requestProject($routeParams.project).then(function (response) {
              // New Parse object.
              parseService.saveObject('Project', response).then(function (parseObject) {
                // Reload so user can see board.
                window.location.reload();
              }, function () {
              });
            });
          }


          // Update the scope's project variable.
          var object = parseObject.attributes;
          $scope.project = object;
          $scope.projectID = object.nid;
          $scope.projectType = object.projectType;
          $scope.releaseBranches = object.releaseBranches;

          // Set the page title to be the project's name.
          $scope.page.setTitle(object.title);
          $scope.setBoardLists();


          // Ping Google.
          Angularytics.trackEvent('Project', 'Viewed project: ' + object.title);
      });

      $scope.setBoardLists = function() {
        // Initiate the board's lists.
        projectService.loadProjectConfig($scope.projectMachineName, $scope.projectType)
          .success(function(data, status, headers, config) {
            $scope.boardLists = data;
          })
          .error(function(data, status, headers, config) {
            $scope.boardLists = boardListDefaults;
          });
      };

      $scope.updateBoardRoute = function () {
        var pathParts = $location.path().split('/');
        if ($scope.projectRelease == null) {
          $location.path('/' + pathParts[1] + '/' + pathParts[2], false);

        }
        else {
          $location.path('/' + pathParts[1] + '/' + pathParts[2] + '/' + $scope.projectRelease.name, false);
        }
      };
    }
  ]);
