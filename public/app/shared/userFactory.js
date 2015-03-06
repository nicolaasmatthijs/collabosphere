
(function(angular) {

  'use strict';

  /**
   * User Factory - Retrieve information about the current user
   */
  angular.module('collabosphere').factory('userFactory', function(utilService, $http) {

    /**
     * Retrieve the profile information for the current user
     *
     * @return {Promise<Me>}                      Promise returning the profile information for the current user
     */
    var getMe = function() {
      return $http.get(utilService.getApiUrl('/me')).then(function(response) {
        var me = response.data;
        // Determine whether the current user is a Datacultures administrator.
        // Currently, only Lecturers and Course Designers will be administrators
        // TODO: Improve the REST API to determine the administration status
        // on the back-end and return it as part of the response
        //if (me.canvas_roles.indexOf('Instructor') !== -1 ||
        //    me.canvas_roles.indexOf('ContentDeveloper') !== -1 ||
        //    me.canvas_roles.indexOf('urn:lti:role:ims/lis/TeachingAssistant') !== -1) {
        //  me.isAdmin = true;
        //}
        return me;
      });
    };

    return {
      getMe: getMe
    };

  });

}(window.angular));
