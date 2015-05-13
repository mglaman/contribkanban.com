'use strict';

var projectKanbanApp = angular.module('projectKanbanApp', ['ngRoute', 'angularytics', 'angularModalService', 'ngDfp'])
  .config(['$compileProvider', '$routeProvider', 'AngularyticsProvider', 'DoubleClickProvider', function($compileProvider, $routeProvider, AngularyticsProvider, DoubleClickProvider) {
    AngularyticsProvider.setEventHandlers(['Console', 'GoogleUniversal']);

    DoubleClickProvider.defineSlot('/122240946/CD-DEPLOY-SQUARE', [300, 250], 'div-gpt-ad-1421103564732-0')
      .defineSlot('/122240946/CKB-BOARD-HEADER', [468, 60], 'div-gpt-ad-1421106878492-0');

    // Initialize Parse
    Parse.initialize("PARSE_APP_ID", "PARSE_JS_KEY");

    // Browsing my regular project types.
    $routeProvider.when('/browse/sprint', {
      title: 'Browse Sprints',
      templateUrl: 'views/browse.html',
      controller: 'browseSprintCtrl'
    });
    $routeProvider.when('/browse/:type?', {
      title: 'Browse Projects',
      templateUrl: 'views/browse.html',
      controller: 'browseCtrl'
    });
    // View a board.
    $routeProvider.when('/board/:project/:branch?', {
      templateUrl: 'views/kanban.html',
      controller: 'boardCtrl'
    });
    $routeProvider.when('/sprint/:sprint/:needs?', {
      templateUrl: 'views/kanban-sprint.html',
      controller: 'sprintCtrl'
    });
    $routeProvider.when('/changelog', {
      title: 'Changelog',
      templateUrl: 'views/changelog.html'
    });
    $routeProvider.otherwise({
      title: 'Home',
      redirectTo: '/browse'
    });

    $compileProvider.debugInfoEnabled(false);
  }])
  .run(['$route', '$rootScope', '$location', 'Angularytics', function($route, $rootScope, $location, Angularytics) {
    Angularytics.init();

    $rootScope.page = {
      setTitle: function(title) {
        this.title = title + ' | Contrib Kanban';
      }
    };
    $rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
      if (current.$$route.title !== undefined) {
        $rootScope.page.setTitle( current.$$route.title || '');
      }
    });

    var original = $location.path;
    $location.path = function (path, reload) {
      if (reload === false) {
        var lastRoute = $route.current;
        var un = $rootScope.$on('$locationChangeSuccess', function () {
          $route.current = lastRoute;
          un();
        });
      }
      return original.apply($location, [path]);
    };
  }]);
