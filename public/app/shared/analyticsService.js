(function(angular) {

  'use strict';

  var collabosphere = angular.module('collabosphere');
  collabosphere.service('analyticsService', function() { // $analytics

    /**
     * Identify the current user to MixPanel. This will ensure that all events that
     * happen during the current session will be associated with that user
     *
     * @param  {String}         userId          The id of the user to associate to the current session
     * @param  {String}         name            The display name of the user being tracked
     */
    var identify = function(userId, name) {
      return;
      $analytics.setUserProperties({
        $name: name,
        last_activity: new Date()
      });
      $analytics.setUsername(userId);
    };

    /**
     * Track a new event through MixPanel
     *
     * @param  {String}         event           The unique identifier of the event to track
     * @param  {Object}         [options]       Additional options to store against the specified event
     */
    var track = function(event, options) {
      return;
      $analytics.eventTrack(event, options);
    };

    /**
     * Get the properties for a gallery item that should be tracked
     * in the MixPanel analytics
     *
     * @param  {GalleryItem}    item            The gallery item for which to retrieve the analytics tracking properties
     * @return {Object}                         Object containing the properties for the GalleryItem that should be tracked in the MixPanel analytics
     */
    var getGalleryItemTrackingProperties = function(item) {
      return {
        itemId: item.id,
        type: item.type,
        likes: item.likes,
        dislikes: item.dislikes,
        liked: item.liked,
        assignmentId: item.assignment_id,
        submissionId: item.submission_id,
        author: item.canvas_user_id,
        contentType: item.content_type,
        commentCount: item.comment_count,
        views: item.views
      };
    };

    return {
      identify: identify,
      track: track,
      getGalleryItemTrackingProperties: getGalleryItemTrackingProperties
    };

  });

}(window.angular));
