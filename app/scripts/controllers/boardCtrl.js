'use strict';

projectKanbanApp.controller(
  'boardCtrl', [
    '$scope',
    '$routeParams',
    '$location',
    'issueService',
    'projectService',
    'Angularytics',
    'DoubleClick',
    function ($scope, $routeParams, $location, issueService, projectService, Angularytics, DoubleClick) {
      $scope.project = {};
      $scope.projectType = '';
      $scope.releaseBranches = [];
      $scope.boardLists = [];

      var boardListDefaults = [
        {
          name: 'backlog',
          label: 'Postponed',
          tag: '',
          category: '',
          statuses: [4, 16]
        },
        {
          name: 'active',
          label: 'Active',
          tag: '',
          category: '',
          statuses: [1]
        },
        {
          name: 'cnr',
          label: 'Needs Review',
          tag: '',
          category: '',
          statuses: [8]
        },
        {
          name: 'cnw',
          label: 'Needs Work',
          tag: '',
          category: '',
          statuses: [13]
        },
        {
          name: 'rtbc',
          label: 'Reviewed & Tested',
          tag: '',
          category: '',
          statuses: [14, 15]
        },
        {
          name: 'done',
          label: 'Fixed',
          tag: '',
          category: '',
          statuses: [2]
        }
        // Due to possible performance and query limitations, dropping this.
        // {name: 'wontfix', label: "Won't Fix", statuses: [5,6,3,18]},
        // As mentioned above for perforamance and query issues, no closed() states.
        // {name: 'done', label: 'Fixed', tag: '', statuses: [2,7]}
      ];

      projectService.loadProject($routeParams.project).then(function (parseObject) {
        // Update the scope's project variable.
        var object = parseObject.attributes;
        $scope.project = object;
        $scope.projectType = object.projectType;
        $scope.releaseBranches = object.releaseBranches;
        $scope.projectRelease = $routeParams.branch || '';

        // Set the page title to be the project's name.
        $scope.page.setTitle(object.title);

        // Initiate the board's lists.
        projectService.loadProjectConfig(object.nid).then(function (configObject) {
          if (configObject !== null) {
            $scope.boardLists = configObject;
          }
          else {
            // Test
            if ($routeParams.project == '1303302') {
              $scope.boardLists = [
                {
                  name: 'features',
                  label: 'Backlog: Feature requests',
                  tag: '',
                  category: '3',
                  statuses: [1, 4, 16]
                },
                {
                  name: 'support',
                  label: 'Backlog: Support requests',
                  tag: '',
                  category: '4',
                  statuses: [1, 4, 16]
                },
                {
                  name: 'bugs',
                  label: 'Backlog: Bug Reports',
                  tag: '',
                  category: '1',
                  statuses: [1, 4, 16]
                },
                {
                  name: 'cnw',
                  label: 'Needs Work',
                  tag: '',
                  category: '',
                  statuses: [13]
                },
                {
                  name: 'cnr',
                  label: 'Needs Review',
                  tag: '',
                  category: '',
                  statuses: [8]
                },
                {
                  name: 'fixed',
                  label: 'RTBC/Fixed',
                  tag: '',
                  category: '',
                  statuses: [14, 2]
                }
              ]
            }
            else {
              $scope.boardLists = boardListDefaults;
            }
          }
        });

        // Ping Google.
        Angularytics.trackEvent('Project', 'Viewed project: ' + object.title);
        DoubleClick.refreshAds('div-gpt-ad-1421106878492-0');
      });

      $scope.updateBoardRoute = function () {
        var pathParts = $location.path().split('/');
        if ($scope.projectRelease == null) {
          $location.path('/' + pathParts[1] + '/' + pathParts[2], false);

        }
        else {
          $location.path('/' + pathParts[1] + '/' + pathParts[2] + '/' + $scope.projectRelease, false);
        }
      };
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
