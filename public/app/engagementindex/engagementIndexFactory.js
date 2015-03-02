(function(angular) {

  'use strict';

  /**
   * Engagement Index Factory
   */
  var collabosphere = angular.module('collabosphere');
  collabosphere.factory('engagementIndexFactory', ['analyticsService', '$http', function(analyticsService, $http) {

    /**
     * Get the list of students and their engagement index points in the
     * engagement index
     *
     * @return {Promise<EngagementIndexData[]>}               $http promise returning the engagement index data for all students
     */
    var getEngagementIndexList = function() {
      return $http.get('/api/engagementindex').then(function(response) {
        var results = response.data;

        // Order the students by points
        results.students = results.students.sort(function(a, b) {
          return b.points - a.points;
        });
        // Add the rank information onto each student
        if (results.students[0]) {
          results.students[0].rank = 1;
        }
        for (var i = 1; i < results.students.length; i++) {
          // Students with the same score will have the same rank
          if (results.students[i].points === results.students[i - 1].points) {
            results.students[i].rank = results.students[i - 1].rank;
          } else {
            results.students[i].rank = (i + 1);
          }
        }

        return results;
      });
    };

    /**
     * Save whether a student's engagement index points should be shared with
     * the entire course
     *
     * @param  {String}                             id        The canvas user id of the students for which to set the share status
     * @param  {Boolean}                            share     Whether the student's engagement index points should be shared with the entire course
     * @return {Promise}                                      $http promise
     */
    var setEngagementIndexStatus = function(id, share) {
      var url = '/api/v1/students/' + id;
      var data = {
        status: share
      };
      // Track that the engagement index share status has been changed
      analyticsService.track('Update Engagement Index Sharing', {
        share: share
      });
      return $http.post(url, data);
    };

    return {
      getEngagementIndexList: getEngagementIndexList,
      setEngagementIndexStatus: setEngagementIndexStatus
    };

  }]);

}(window.angular));
