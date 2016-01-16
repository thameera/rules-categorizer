'use strict';

angular.module('rulesApp', [
  'ngRoute'
])
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

  $routeProvider
    .when('/', {
      controller: 'HomeCtrl',
      templateUrl: 'views/home.html',
      requiresLogin: true
    })
    .when('/login', {
      controller: 'LoginCtrl',
      templateUrl: 'views/login.html'
    });

}])
.controller('LoginCtrl', ['$scope', function($scope) {
}])
.controller('HomeCtrl', ['$scope', function($scope) {
}]);
