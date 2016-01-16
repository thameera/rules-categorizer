'use strict';

angular.module('rulesApp', [
  'ngRoute',
  'auth0',
  'angular-storage',
  'angular-jwt'
])
.config(['$routeProvider', '$locationProvider', 'authProvider', '$httpProvider', 'jwtInterceptorProvider', function($routeProvider, $locationProvider, authProvider, $httpProvider, jwtInterceptorProvider) {

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

    authProvider.init({
      domain: AUTH0_DOMAIN,
      clientID: AUTH0_CLIENT_ID,
      loginUrl: '/login'
    });

    jwtInterceptorProvider.tokenGetter = function(store) {
      return store.get('token');
    };

    $httpProvider.interceptors.push('jwtInterceptor');

}])
.run(['$rootScope', 'auth', 'store', 'jwtHelper', '$location', function($rootScope, auth, store, jwtHelper, $location) {

  $rootScope.$on('$locationChangeStart', function() {
    if (!auth.isAuthenticated) {
      var token = store.get('token');
      if (token) {
        if (!jwtHelper.isTokenExpired(token)) {
          auth.authenticate(store.get('profile'), token);
        } else {
          $location.path('/login');
        }
      }
    }
  });

}])
.controller('LoginCtrl', ['$scope', 'auth', '$location', 'store', function($scope, auth, $location, store) {

  $scope.login = function() {
    auth.signin({}, function(profile, token) {
      store.set('profile', profile);
      store.set('token', token);
      $location.path('/');
    }, function(err) {
      console.log('There was an error logging in', err);
    });
  };

}])
.controller('HomeCtrl', ['$scope', 'auth', '$location', 'store', '$http', function($scope, auth, $location, store, $http) {

  $scope.apps = [];

  $http({
    url: '/getRuleCategories',
    method: 'GET'
  })
    .then(function(res) {
      console.log(res);
      $scope.apps = res.data;
    }, function(err) {
      console.error(err);
    });

  $scope.logout = function() {
    auth.signout();
    store.remove('profile');
    store.remove('token');
    $location.path('/login');
  };

}]);
