kentonchunApp.factory('GenericNodeCRUDService', ['$http', '$q', 'StatusCodes',
  function ($http, $q, StatusCodes) {
    'use strict';
    return {
      /**
       * Gets from a url can be one or list
       * @param url
       * @param params
       * @returns {*}
       */
      getItems: function (url, params) {
        // build a deferred object reference.
        var deferred = $q.defer();
        $http.get(url, {params: params})
          .success(function (response) {
            if (response.status === StatusCodes.SUCCESS) {
              deferred.resolve(response);
            } else {
              deferred.reject(response);
            }
          })
          .error(function () {
            deferred.reject({
              status: StatusCodes.ERROR,
              message: 'Error: An error occurred while establishing a connection to the server.'
            });
          });
        return deferred.promise;
      },
      /**
       * Adds/Posts an item to the url
       * @param url
       * @param item
       * @returns {*}
       */
      addItem: function(url, item){
        var deferred = $q.defer();
        $http.post(url, item)
          .success(function (response) {
            if (response.status === StatusCodes.SUCCESS) {
              deferred.resolve(response);
            } else {
              deferred.reject(response);
            }
          })
          .error(function () {
            deferred.reject({
              status: StatusCodes.ERROR,
              message: 'Error: An error occurred while establishing a connection to the server.'
            });
          });
        return deferred.promise;
      },
      /**
       * Update an item ensure if id is needed in url to set it in URL param
       * @param url
       * @param item
       * @returns {*}
       */
      updateItem: function(url, item){
        var deferred = $q.defer();
        $http.put(url, item)
          .success(function (response) {
            if (response.status === StatusCodes.SUCCESS) {
              deferred.resolve(response);
            } else {
              deferred.reject(response);
            }
          })
          .error(function () {
            deferred.reject({
              status: StatusCodes.ERROR,
              message: 'Error: An error occurred while establishing a connection to the server.'
            });
          });
        return deferred.promise;
      },
      /**
       * Delete an item, set url before
       * @param url
       * @returns {*}
       */
      deleteItem: function(url){
        var deferred = $q.defer();
        $http.delete(url)
          .success(function (response) {
            if (response.status === StatusCodes.SUCCESS) {
              deferred.resolve(response);
            } else {
              deferred.reject(response);
            }
          })
          .error(function () {
            deferred.reject({
              status: StatusCodes.ERROR,
              message: 'Error: An error occurred while establishing a connection to the server.'
            });
          });
        return deferred.promise;
      }
    };
  }
]);