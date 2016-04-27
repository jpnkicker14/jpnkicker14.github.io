kentonchunApp.controller('MagicController', ['$scope', '$sce',
  function ($scope, $sce) {
    'use strict';
    $scope.magicMedia = [
      {
        type: "image",
        image: "resources/images/magic_home.jpg",
        link: ""
      },
      {
        type: "video",
        image: "http://img.youtube.com/vi/mpzSjuPaJpU/0.jpg",
        link: "mpzSjuPaJpU"
      },
      {
        type: "video",
        image: "http://img.youtube.com/vi/kVS3umn5Niw/0.jpg",
        link: "kVS3umn5Niw"
      },
      {
        type: "video",
        image: "http://img.youtube.com/vi/8sN8y5Vl6h8/0.jpg",
        link: "8sN8y5Vl6h8"
      }
    ];

    $scope.setMedia = function(media){
      $scope.mainMeida = media;
      if($scope.mainMeida.type === "video"){
        $scope.videoLink = $sce.trustAsResourceUrl("//www.youtube.com/embed/"+media.link+"?rel=0");
      }
    };

    //init
    $scope.setMedia($scope.magicMedia[0]);
  }
]);