(function (angular) {
  'use strict';
  angular.module('appContribkanban').directive('appHeader', function () {
    return {
      restrict: 'E',
      template: '<md-sidenav class="site-sidenav md-sidenav-left md-whiteframe-z2 ng-isolate-scope md-closed" md-component-id="left" tabindex="-1"> ' +
      '<app-sidenav></app-sidenav> ' +
      '</md-sidenav><md-toolbar class="site-content-toolbar"ng-hide="embed"> ' +
      '<div class="md-toolbar-tools">' +
      '<md-button class="md-icon-button" aria-label="Settings" ng-click="toggleSidenav()" tabindex="-1" role="button"><md-icon>menu</md-icon></md-button> ' +
      '<div layout="row" flex class="fill-height"><h2 ng-click="toggleSidenav()" ng-bind="titleService.getHeaderTitle()"></h2></div> ' +
      '</div></md-toolbar>',
      controllerAs: 'HeaderController',
      controller: ['$scope', '$location', '$mdSidenav', '$mdDialog','TitleService', function ($scope, $location, $mdSidenav, $mdDialog, TitleService) {
        $scope.embed = $location.search().embed || false;
        $scope.titleService = TitleService;
        $scope.toggleSidenav = function () {
          $mdSidenav('left').toggle();
        };

        $scope.openHelp = function () {
          $mdDialog.show({
            templateUrl: 'views/help.html',
            controller: function () {
            },
            parent: angular.element(document.body),
            // targetEvent: ev,
            clickOutsideToClose: true
          });
        };
      }]
    };
  });
})(window.angular);
