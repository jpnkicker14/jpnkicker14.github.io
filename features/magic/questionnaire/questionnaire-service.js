kentonchunApp.factory("QuestionnaireNodeService", function ($http, $q) {
  return {
    getIp: function() {
      var deferred = $q.defer();
      $http.get('http://ipinfo.io/json').
        success(function(data) {
          deferred.resolve(data.ip);
        }).
        error(function(err){
          deferred.reject(err);
        });
      return deferred.promise;
    },
    sendQuestionnaire: function (form) {
      var deferred = $q.defer();
      Parse.Cloud.run('sendMagicQuestionnaire', form, {
        success: function (response) {
          deferred.resolve(response);
        },
        error: function () {
          deferred.reject('An error occurred connecting to the server');
        }
      });
      return deferred.promise;
    }
  }
});