'use strict';
kentonchunApp.factory('ResumeService', function ($http, $q) {
  return{
    getWorkExperience: function() {
      return $http.get('features/resume/services/work-experience.json').then(
        function(resp) {
          return _.chain(resp.data)
            .sortBy('order')
            .reverse()
            .value();
        });
    },
    getEducation: function() {
      return $http.get('features/resume/services/education.json').then(
        function(resp) {
          return _.chain(resp.data)
            .sortBy('order')
            .reverse()
            .value();
        });
    },
    getSkills: function () {
      return $http.get('features/resume/services/skills.json').then(
        function(resp) {
          return _.chain(resp.data)
            .sortBy(['category', 'value'])
            .reverse()
            .value();
        });
    },
    getExtracurriculars: function() {
      return $http.get('features/resume/services/extracurriculars.json').then(
        function(resp) {
          return _.chain(resp.data)
            .sortBy('order')
            .reverse()
            .value();
        });
    }
  }
});