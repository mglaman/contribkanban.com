'use strict';

var projectKanbanApp = angular.module('projectKanbanApp', ['ngRoute', 'angularytics', 'ngMaterial', 'ngDfp'])
  .config(['$compileProvider', '$routeProvider', '$mdThemingProvider', '$locationProvider', 'AngularyticsProvider', 'DoubleClickProvider', function($compileProvider, $routeProvider, $mdThemingProvider, $locationProvider, AngularyticsProvider, DoubleClickProvider) {
    AngularyticsProvider.setEventHandlers(['GoogleUniversal']);

    DoubleClickProvider
      .defineSlot('/122240946/CD-DEPLOY-SQUARE', [[120, 90], [320,50]], 'div-gpt-ad-1421106878492-1')
      .defineSlot('/122240946/CKB-BOARD-HEADER', [[970,90], [728,90], [468, 60], [320,50]], 'div-gpt-ad-1421106878492-0');
    DoubleClickProvider
      .defineSizeMapping('div-gpt-ad-1421106878492-0')
      .addSize([1024, 768], [970, 90])
      .addSize([980, 690], [728, 90])
      .addSize([640, 480], [468, 60])
      // Fits browsers of any size smaller than 640 x 480
      .addSize([0, 0], [320, 50]);

    // Initialize Parse
    Parse.initialize("9tjijJ4jwAQeyIhaF2o0ju8IMtzd7X5JeM5ujsRX", "JmoMBRlRmmtLqJMzJZdaa1ovSV9G8zpZvSL3GQVj");

    $routeProvider
      .when('/', {
        title: 'Browse',
        redirectTo: '/browse'
      })
      .when('/browse/sprint', {
        title: 'Browse Sprints',
        templateUrl: 'views/browse.html',
        controller: 'browseSprintCtrl'
      })
      .when('/browse/:type?', {
        title: 'Browse Projects',
        templateUrl: 'views/browse.html',
        controller: 'browseCtrl'
      })
      .when('/board/:project/:branch?', {
        templateUrl: 'views/kanban.html',
        controller: 'boardCtrl'
      })
      .when('/sprint/:sprint/:needs?', {
        templateUrl: 'views/kanban-sprint.html',
        controller: 'sprintCtrl'
      })
      .when('/changelog', {
        title: 'Changelog',
        templateUrl: 'views/changelog.html'
      })
      .otherwise({
        title: 'Home',
        redirectTo: '/browse'
      });

    $locationProvider.html5Mode({enabled: true});

    $compileProvider.debugInfoEnabled(false);

    $mdThemingProvider.theme('default')
      .primaryPalette('light-blue')
      .accentPalette('blue-grey');
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
