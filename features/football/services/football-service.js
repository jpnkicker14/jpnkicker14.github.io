'use strict';
kentonchunApp.factory('FootballService', ['$http', '$q',
  function ($http, $q) {
    return {
      getFootballCount: function() {
        return $http.get('features/football/services/football-blog.json').then(
          function(resp) {
            return resp.data.length;
          });
      },
      getFootball: function (page, amount) {
        page = page ? page : 1;
        amount = amount ? amount : 9;

        var start = (page -1) * amount;

        return $http.get('features/football/services/football-blog.json').then(
          function(resp) {
            return _.chain(resp.data)
              .sortBy('createdDate')
              .reverse()
              .map(function(item) {
                item.intro = item.content.slice(0, 300).replace(/(<([^>]+)>)/ig,"");
                return item;
              })
              .slice(start, (page*amount))
              .value();
          });
      },
      getFootballItem: function (id) {
        var deferred = $q.defer();
        $http.get('features/football/services/football-blog.json').then(
          function(resp) {
            var found = _.find(resp.data, function(item) {return item.id === id;});
            if(found) {
              deferred.resolve(found);
            } else {
              deferred.reject('Cannot find itme');
            }
          },
        function(error) {
          deferred.reject(error);
        });
        return deferred.promise;
      },
      getStats: function () {
        return $http.get('features/football/services/stats.json').then(
          function(resp) {
            return resp.data;
          });
      }
    }
  }
]);