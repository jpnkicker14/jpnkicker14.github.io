kentonchunApp.controller('AuthenticationController', ['$scope', '$location', 'AuthenticationNodeService', 'UserIdentityService', 'ToastrNotifierService', function ($scope, $location, AuthenticationNodeService, UserIdentityService, ToastrNotifierService) {
  'use strict';
  //check for logged in user
  AuthenticationNodeService.getLoggedInUser();
  $scope.resetUser ={};
  $scope.identity = UserIdentityService;
  $scope.nowDate = new Date();

  $scope.$on('$routeChangeStart', function(next, current) {
    if($location.path() === '/'){
      $scope.home = true;
    }else{
      $scope.home = false;
    }
  });
  //set navbar based on page


  $scope.login = function () {
    //prevent empty form from being submitted
    if (!$scope.user || !$scope.user.username || !$scope.user.password) {
      ToastrNotifierService.notify({status: statusCodes.ERROR, message: 'Please fill in all fields'});
    } else {
      AuthenticationNodeService.login($scope.user).then(
        //success
        function (response) {
          //identity set in service
          ToastrNotifierService.notify(response);
          $location.path('/');
        },
        //failure
        function (error) {
          $scope.user.password = '';
          ToastrNotifierService.notify(error);
        });
    }
  };

  $scope.logout = function () {
    AuthenticationNodeService.logout().then(
      function (response) {
        //identity removed in service
        //logout message
        ToastrNotifierService.notify(response);
        //redirect to root
        $location.path('/');
      },
      //failure
      function (err) {
        ToastrNotifierService.notify(err);
      });
  };

  $scope.resetPassword = function () {
    AuthenticationNodeService.resetPassword($scope.resetUser).then(
      function (response) {
        ToastrNotifierService.notify(response);
      },
      function (err) {
        ToastrNotifierService.notify(err);
      });
  }
}]);