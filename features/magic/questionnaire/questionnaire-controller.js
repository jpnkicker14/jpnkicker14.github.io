kentonchunApp.controller('QuestionnaireController', ['$scope', '$location', '$loading', 'QuestionnaireNodeService', 'ToastrNotifierService',
  function ($scope, $location, $loading, QuestionnaireNodeService, ToastrNotifierService) {
    QuestionnaireNodeService.getIp().then(
      function(ip) {
        $scope.questionnaire.ip = ip;
      },
      function(error) {
        console.error(error);
      });

    $scope.questionnaire = {};

    /*******************************************
    **  Scope Functions
    *******************************************/
    $scope.resetCaptcha = function(){
      if($scope.captchaControl.reset){
        $scope.captchaControl.reset();
      }
    };

    $scope.openDate = function($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.openedDate = true;
    };

    $scope.submit = function() {
      if ($scope.questionnaire_form.$invalid || !$scope.gRecaptchaResponse) {
        $scope.resetCaptcha();
        ToastrNotifierService.notify({status:statusCodes.ERROR, message:'Please check all required fields'});
      } else {
        $loading.start('questionnaire');
        $scope.questionnaire.recaptcha = $scope.gRecaptchaResponse;
        console.log($scope.questionnaire)
        QuestionnaireNodeService.sendQuestionnaire($scope.questionnaire).then(
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
            $loading.finish('questionnaire');
          }
        );
      }
    };
    /*******************************************
    **  Initialize
    *******************************************/
    $scope.tomorow = moment().add(1, 'days');
    $scope.questionnaire = {};
    $scope.captchaControl = {};
    $scope.loadingOptions = {
      text: "Sending..."
    };
    $scope.placeholderToday = $scope.tomorow.format('MM/DD/YYYY');

    $scope.dateOptions ={
      "show-weeks": false
    }
  }
]);