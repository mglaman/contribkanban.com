(function (angular) {
  'use strict';
  angular.module('appContribkanban').run(['$route', '$rootScope', '$location', 'Angularytics', function ($route, $rootScope, $location, Angularytics) {
    Angularytics.init();

    $rootScope.page = {
      setTitle: function (title) {
        this.title = title + ' | Contrib Kanban';
      }
    };
    $rootScope.$on('$routeChangeSuccess', function (event, current) {
      if (current.$$route.title !== undefined) {
        $rootScope.page.setTitle(current.$$route.title || '');
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
})(window.angular);
