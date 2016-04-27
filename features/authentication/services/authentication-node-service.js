kentonchunApp.factory('AuthenticationNodeService', ['$http', '$q', 'UserIdentityService', function ($http, $q, UserIdentityService) {
  'use strict';

  return {
    login: function (user) {
      // build a deferred object reference.
      var deferred = $q.defer();

      // fire off the update post to the node middleware.
      $http.post('/api/login', user)
        .success(function (response) {
          if (response.status === statusCodes.SUCCESS) {
            UserIdentityService.currentUser = response.data;
            deferred.resolve(response);
          } else {
            deferred.reject(response);
          }
        })
        .error(function () {
          deferred.reject({status: statusCodes.ERROR, message: 'Error: An error occurred while establishing a connection to the server.'});
        });

      return deferred.promise;
    },
    logout: function () {
      // build a deferred object reference.
      var deferred = $q.defer();
      // post needs some data value
      $http.post('/api/logout', {logout: true})
        .success(function (response) {
          if (response.status === statusCodes.SUCCESS) {
            UserIdentityService.currentUser = undefined;
            deferred.resolve(response);
          } else {
            deferred.reject(response);
          }
        })
        .error(function () {
          deferred.reject({status: statusCodes.ERROR, message: 'Error: An error occurred while establishing a connection to the server.'});
        });

      return deferred.promise;
    },
    getLoggedInUser: function () {
      var deferred = $q.defer();
      // post needs some data value
      $http.get('/api/loggedInUser')
        .success(function (response) {
          if (response.status === statusCodes.SUCCESS) {
            UserIdentityService.currentUser = response.data;
            deferred.resolve(response);
          } else {
            deferred.reject(response);
          }
        })
        .error(function () {
          deferred.reject({status: statusCodes.ERROR, message: 'Error: An error occurred while establishing a connection to the server.'});
        });

      return deferred.promise;
    },
    authorizeCurrentUserForRoute: function (role) {
      var deferred = $q.defer();

      function authorize(deferred, role){
        if(UserIdentityService.isAuthorized(role)){
          deferred.resolve({status:statusCodes.SUCCESS, message:'Authorized'});
        }else{
          deferred.reject({status:statusCodes.ERROR, message:'Not Authorized'});
        }
      }

      if(!UserIdentityService.currentUser){
        this.getLoggedInUser().then(
          function () {
            authorize(deferred, role);
          },
          function (error) {
            deferred.reject(error);
          });
      }else{
        authorize(deferred, role);
      }

      return deferred.promise;
    },
    resetPassword: function (user) {
      // build a deferred object reference.
      var deferred = $q.defer();
      // fire off the update post to the node middleware.
      $http.post('/api/resetPassword', user)
        .success(function (response) {
          if (response.status === statusCodes.SUCCESS) {
            deferred.resolve(response);
          } else {
            deferred.reject(response);
          }
        })
        .error(function () {
          deferred.reject({status: statusCodes.ERROR, message: 'Error: An error occurred while establishing a connection to the server.'});
        });
      return deferred.promise;
    }
  };
}]);