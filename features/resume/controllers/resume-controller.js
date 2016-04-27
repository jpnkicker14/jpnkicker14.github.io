kentonchunApp.controller('ResumeController', ['$scope', '$q', '$filter', '$loading', 'ResumeService', 'ToastrNotifierService',
  function($scope, $q, $filter, $loading, ResumeService, ToastrNotifierService){

    $loading.start('resume');

    ResumeService.getWorkExperience().then(
      function(workExperience){
        $scope.workExperience = workExperience;
      },
      function(error) {
        ToastrNotifierService.notify(error);
      });
    $q.all([ResumeService.getWorkExperience(),
            ResumeService.getEducation(),
            ResumeService.getSkills(),
            ResumeService.getExtracurriculars()]).then(function(resume) {
      $scope.workExperiences = resume[0];
      $scope.educations = resume[1];
      $scope.rawSkills = resume[2];
      kcGroup(resume[2], 3);
      $scope.extracurriculars = resume[3];
    }).finally(function(){
      $loading.finish('resume');
    });

  }
]);

