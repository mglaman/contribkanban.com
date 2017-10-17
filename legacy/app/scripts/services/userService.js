(function (angular) {
  'use strict';
  angular.module('appContribkanban')
    .service('UserService', ['$http', '$q', function ($http, $q) {
      var cache = {};

      return {
        get: function (uid) {
          if (cache.hasOwnProperty(uid)) {
            return cache[uid];
          }

          var deferred = $q.defer();
          $http.get('/api/contributor/' + uid, {cache: true}).then(function (res) {
            // If local, use that.
            if (res.data !== null) {
              deferred.resolve(res.data.name);
            }
            // Else ping Drupal.org and cache
            else {
              $http.get('https://www.drupal.org/api-d7/user/' + uid+ '.json', {cache: true}).then(function (response) {
                $http.post('/api/contributor', {
                  uid: response.data.uid,
                  name: response.data.name
                });
                cache[response.data.uid] = response.data.name;
                deferred.resolve(response.data.name);
              });
            }
          });
          return deferred.promise;
        }
      };
    }]);
})(window.angular);
