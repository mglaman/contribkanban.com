(function (angular) {
  'use strict';

  angular.module('appContribkanban').controller('ModalController', ['$scope', 'close', function ($scope, close) {
    $scope.close = function () {
      close({}, 200);
    };
  }]);
})(window.angular);
