'use strict';
kentonchunApp.controller('FootballListCtrl', ['$scope', '$location', '$routeParams', '$sce', '$timeout', '$loading', 'FootballService',
  function ($scope, $location, $routeParams, $sce, $timeout, $loading, FootballService) {
    $loading.start('football');

    if ($routeParams.footballId) {
      $scope.fromPage = $location.search().fromPage ? $location.search().fromPage : '';

      $scope.setImage = function(imgLink){
        $scope.img = true;
        $scope.mainImage = imgLink;
      };

      $scope.setVideo = function(videoId){
        $scope.img = false;
        $scope.mainVideoUrl = $sce.trustAsResourceUrl("//www.youtube.com/embed/"+videoId+"?rel=0");
      };

      FootballService.getFootballItem($routeParams.footballId).then(
        function (footballItem) {
          $scope.footballItem = footballItem;
          if($scope.footballItem.images && $scope.footballItem.images.length > 0){
            $scope.setImage($scope.footballItem.images[0]);
          }else{
            if($scope.footballItem.videos && $scope.footballItem.videos.length > 0){
              $scope.setVideo($scope.footballItem.videos[0]);
            }
          }

        },
        function (error) {
          $location.path('/football');
        }).finally(
        function() {
          $loading.finish('football');
        }
      );
    } else {
      $scope.pageSize = 9; // how many rows of 3 should be shown
      FootballService.getStats().then(
        function(stats) {
          $scope.stats = stats;
        });

      FootballService.getFootballCount().then(
        function(count) {
          $scope.currentPage = $location.search().page ? $location.search().page : 1;
          $scope.totalFootball = count;
          getFootballItems($scope.currentPage);
        });
    }

    $scope.pageChange = function() {
      $loading.start('football');
      $location.path('/football').search({page: $scope.currentPage});
      getFootballItems($scope.currentPage);
    };

    function getFootballItems(currentPage) {
      FootballService.getFootball(currentPage, 9).then(function (fl) {
        $scope.footballRows = kcGroup(fl, 3);
      }).finally(
        function() {
          $loading.finish('football');
        });
    }

  }
]);



