(function (angular) {
  'use strict';
  angular.module('appContribkanban')
    .service('TitleService', function () {
      var pageTitle = 'Contrib Kanban';
      var headerTitle = 'Contib Kanban';

      return {
        setPageTitle: function (title) {
          pageTitle = title;
        },
        getPageTitle: function () {
          return pageTitle;
        },
        setHeaderTitle: function (title) {
          headerTitle = title;
        },
        getHeaderTitle: function () {
          return headerTitle;
        }
      }
    });
})(window.angular);
