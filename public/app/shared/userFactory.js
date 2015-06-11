/*!
 * Copyright 2015 UC Berkeley (UCB) Licensed under the
 * Educational Community License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may
 * obtain a copy of the License at
 *
 *     http://opensource.org/licenses/ECL-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an "AS IS"
 * BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

(function(angular) {

  'use strict';

  angular.module('collabosphere').factory('userFactory', function(utilService, $http) {

    /**
     * Retrieve the profile information for the current user
     *
     * @return {Promise<Me>}                      Promise returning the profile information for the current user
     */
    var getMe = function() {
      return $http.get(utilService.getApiUrl('/users/me'), {'cache': true});
    };

    /**
     * Get the users for the current course
     *
     * @return {Promise<User[]>}                  $http promise returning the users in the current course
     */
    var getUsers = function() {
      return $http.get(utilService.getApiUrl('/users'));
    };

    /**
     * Get the users for the current course and their points
     *
     * @return {Promise<User[]>}                  $http promise returning the users in the current course and their points
     */
    var getLeaderboard = function() {
      return $http.get(utilService.getApiUrl('/users/leaderboard'));
    };

    return {
      'getMe': getMe,
      'getUsers': getUsers,
      'getLeaderboard': getLeaderboard
    };

  });

}(window.angular));
