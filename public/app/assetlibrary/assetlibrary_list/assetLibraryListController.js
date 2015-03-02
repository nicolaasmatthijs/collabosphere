/**
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

  angular.module('collabosphere').controller('AssetLibraryListController', ['analyticsService', 'assetLibraryListFactory', '$scope', function(analyticsService, assetLibraryListFactory, $scope) {

    $scope.assets = [];
    $scope.page = 0;
    $scope.isLoading = false;

    /**
     * TODO
     */
    var loadAssetLibraryList = function() {
      $scope.page = 0;
      getAssetLibraryList();
    };

    /**
     * TODO
     */
    var getAssetLibraryList = $scope.getAssetLibraryList = function() {
      console.log('getAssetLibraryList');
      $scope.isLoading = true;
      assetLibraryListFactory.getAssetLibraryList().success(function(assets) {
        $scope.assets = $scope.assets.concat(assets);
        $scope.isLoading = false;
      });
      $scope.page++;
    };

    loadAssetLibraryList();

  }]);

}(window.angular));
