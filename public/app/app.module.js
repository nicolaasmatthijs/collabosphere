(function(window, angular) {

  'use strict';

  console.log('Initialising the app');

  /**
   * Initialize all of the submodules
   */
  //angular.module('datacultures.config', ['ngRoute', 'angulartics', 'angulartics.mixpanel']);
  //angular.module('collabosphere.controllers', []);
  //angular.module('datacultures.directives', []);
  //angular.module('collabosphere.factories', []);
  //angular.module('datacultures.filters', []);
  //angular.module('datacultures.services', ['ng']);

  var collabosphere = angular.module('collabosphere', [
    'ngRoute'
  ]);

  /**
   * Initialize all of the submodules
   *
  angular.module('datacultures.config', ['ngRoute', 'angulartics', 'angulartics.mixpanel']);
  angular.module('datacultures.controllers', []);
  angular.module('datacultures.directives', []);
  angular.module('datacultures.factories', []);
  angular.module('datacultures.filters', []);
  angular.module('datacultures.services', ['ng']);

  /**
   * Collabosphere module
   *
  var datacultures = angular.module('collabosphere', [
    'datacultures.config',
    'datacultures.controllers',
    'datacultures.directives',
    'datacultures.factories',
    'datacultures.filters',
    'datacultures.services',
    'ngRoute',
    'ngSanitize',
    'templates',
    'angulartics',
    'angulartics.mixpanel'
  ]);

  window.collabosphere = collabosphere;*/

})(window, window.angular);
