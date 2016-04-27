'use strict';
var kentonchunApp = angular.module('kentonchunApp', [
  //'ngCookies',
  //'ngResource',
  'ngRoute',
  'ngSanitize',
  'ui.utils',
  'ui.bootstrap',
  'darthwade.dwLoading',
  'angulartics',
  'angulartics.google.analytics',
  'angular.filter'
]);
_.mixin(s.exports());
//Setting up route
kentonchunApp.config(['$routeProvider', function ($routeProvider) {

  $routeProvider.
    //when('/login', {                      controller: 'AuthenticationController', templateUrl: '/features/authentication/views/login.html'}).
    when('/magic', {controller: 'MagicController', templateUrl: '/features/magic/magic.html'}).
    when('/magic/questionnaire', {controller: 'QuestionnaireController', templateUrl: '/features/magic/questionnaire/questionnaire.html'}).
    when('/football', {controller: 'FootballListCtrl', templateUrl: '/features/football/views/football_list.html', reloadOnSearch: false}).
    when('/football/:footballId', {
      controller: 'FootballListCtrl',
      templateUrl: '/features/football/views/football_item.html'
    }).
    when('/resume', {controller: 'ResumeController', templateUrl: '/features/resume/views/resume.html'}).
    when('/contact', {controller: 'ContactCtrl', templateUrl: '/features/contact/contact.html'}).
    when('/', {controller: 'HomeCtrl', templateUrl: '/features/home/home.html'}).
    otherwise({redirectTo: '/'});
}
]);

kentonchunApp.config(['$locationProvider', function ($locationProvider) {
  $locationProvider.hashPrefix('!');
}
]);


//TODO add resolve

//theme js
$(function () {
  $(window).scroll(function () {
    if ($(".navbar").offset().top > 30) {
      $(".navbar-fixed-top").addClass("sticky");
    }
    else {
      $(".navbar-fixed-top").removeClass("sticky");
    }
  });

  // Flex
  if ($(".flexslider").length) {
    $('.flexslider').flexslider();
  }

  servicesCircle.initialize();

  staticHeader.initialize();

  portfolioItem.initialize();


  // segun esto corrige el pedo del dropdown en tablets and such
  // hay que testearlo!
  $('.dropdown-toggle').click(function (e) {
    e.preventDefault();
    setTimeout($.proxy(function () {
      if ('ontouchstart' in document.documentElement) {
        $(this).siblings('.dropdown-backdrop').off().remove();
      }
    }, this), 0);
  });
});

var portfolioItem = {
  initialize: function () {
    var $container = $("#portfolio_tem .left_box");
    var $bigPics = $container.find(".big img");
    var $thumbs = $container.find(".thumbs .thumb");

    $bigPics.hide().eq(0).show();

    $thumbs.click(function (e) {
      e.preventDefault();
      var index = $thumbs.index(this);
      $bigPics.fadeOut();
      $bigPics.eq(index).fadeIn();
    });
  }
};

var staticHeader = {
  initialize: function () {
    if ($(".navbar-static-top").length) {
      $("body").css("padding-top", 0);
    }
  }
};

var servicesCircle = {
  initialize: function () {
    var $container = $(".services_circles");
    var $texts = $container.find(".description .text");
    var $circles = $container.find(".areas .circle");

    $circles.click(function () {
      var index = $circles.index(this);
      $texts.fadeOut();
      $texts.eq(index).fadeIn();
      $circles.removeClass("active");
      $(this).addClass("active");
    });
  }
};

//global functions
function kcGroup(list, amt) {
  var i, _i, _ref, _results;
  if (list.length === 0) {
    return [];
  } else {
    _results = [];
    for (i = _i = 0, _ref = list.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = _i += amt) {
      _results.push(list.slice(i, (i + amt - 1) + 1 || 9e9));
    }
    return _results;
  }
}
