(function (angular) {
  'use strict';
  angular.module('appContribkanban').config(['$compileProvider', '$routeProvider', '$mdThemingProvider', '$locationProvider', function ($compileProvider, $routeProvider, $mdThemingProvider, $locationProvider) {

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
      .when('/custom/:board/:needs?', {
        templateUrl: 'views/kanban-custom.html',
        controller: 'customBoardController'
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
  }]);
})(window.angular);
