kentonchunApp.controller('ContactCtrl', ['$scope', '$location', '$loading', 'ContactNodeService', 'ToastrNotifierService',
  function ($scope, $location, $loading, ContactNodeService, ToastrNotifierService) {
    ContactNodeService.getIp().then(
      function(ip) {
        $scope.message.ip = ip;
      },
      function(error) {
        console.error(error);
      });

    $scope.message = {name:"", email:"", phone:"", message:"", recaptcha:""};

    $scope.loadingOptions = {
      text: "Sending..."
    };
    $scope.captchaControl = {};
    $scope.resetCaptcha = function(){
      if($scope.captchaControl.reset){
        $scope.captchaControl.reset();
      }
    };

    $scope.sendMessage = function () {
      if ($scope.contact_form.$invalid || !$scope.gRecaptchaResponse) {
        $scope.resetCaptcha();
        ToastrNotifierService.notify({status:statusCodes.ERROR, message:'Please fill in required fields'});
      } else {
        $loading.start('contact');
        $scope.message.recaptcha = $scope.gRecaptchaResponse;
        ContactNodeService.sendEmail($scope.message).then(
          //success
          function (response) {
            ToastrNotifierService.notify({status:statusCodes.SUCCESS, message: response});
            $location.path('/');
          },
          function (error) {
            ToastrNotifierService.notify({status:statusCodes.ERROR, message: error});
          }
        ).finally(
          function(){
            $loading.finish('contact');
          }
        );
      }
    };

  }
]);
