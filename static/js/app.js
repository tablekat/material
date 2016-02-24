
var app = angular.module('app', ['ngRoute', 'ngMaterial', 'mdColorPicker']);

app.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider){
    $routeProvider
      .when('/', {
        templateUrl: '/static/partials/index.html',
        controller: 'MainPageCtrl'
      })
      .otherwise({
        templateUrl: '/static/partials/404.html',
        controller: 'Error404Ctrl'
      });
    /*$locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });*/
  }]);

app.run(function($rootScope, $location, $routeParams) {

    $rootScope.$on("$locationChangeStart", function(event, newUrl, oldUrl){
      var shouldMatch404 = $location.protocol + "://" + $location.host() + "/404";
      if($location.url() == "/404"){
        $location.search('prevUrl', oldUrl);
      }else if($location.path() != "/404"){
        $location.search('prevUrl', null);
      }
    });

 });

app.controller("Error404Ctrl", function($scope, $location, $routeParams){
  $scope.goto = function(path){
    $location.path(path);
  }
  $scope.prevLocation = $routeParams.prevUrl;
});

app.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('grey')
});
