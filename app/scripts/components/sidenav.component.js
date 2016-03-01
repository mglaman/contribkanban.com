(function (angular) {
  'use strict';
  angular.module('appContribkanban').directive('appSidenav', function () {
    return {
      restrict: 'E',
      templateUrl: 'views/components/app-sidenav.html',
      controllerAs: 'SidenavController',
      controller: function () {

      }
    };
  });
})(window.angular);
