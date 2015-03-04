(function(angular) {

  'use strict';

  var collabosphere = angular.module('collabosphere');
  collabosphere.service('userService', ['analyticsService', 'userFactory', '$q', function(analyticsService, userFactory, $q) {

    // Variable that caches the profile information for the current user
    var me = null;

    /**
     * Retrieve the profile information for the current user. This will only be retrieved once
     *
     * @return {Promise<Me>}                      Promise returning the profile information for the current user
     */
    var getMe = function() {
      var deferred = $q.defer();
      if (!me) {
        userFactory.getMe().then(function(retrievedMe) {
          me = retrievedMe;
          // Identify the current user to ensure that all following
          // events are associate to that user
          analyticsService.identify(me.canvas_user_id, me.canvas_username);
          deferred.resolve(me);
        });
      } else {
        deferred.resolve(me);
      }
      return deferred.promise;
    };

    return {
      getMe: getMe
    };

  }]);

}(window.angular));
