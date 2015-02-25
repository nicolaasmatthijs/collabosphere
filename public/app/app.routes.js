/**
 * Configure the routes for DataCultures
 */
(function(angular) {

  console.log('Initializing routes');

  'use strict';

  // Set the configuration
  angular.module('collabosphere').config(function($routeProvider, $locationProvider) {

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    }).hashPrefix('!');;

    // List all the routes
    $routeProvider.when('/assetlibrary', {
      templateUrl: './app/components/assetLibrary/assetLibrary.html'
    }).
    when('/engagementindex', {
      templateUrl: './app/components/engagementIndex/engagementIndex.html'
    }).
    // Redirect to a 404 page
    otherwise({
      template: "This doesn't exist"
    });
  });

})(window.angular);

