(function(angular, Highcharts) {
  'use strict';

  var collabosphere = angular.module('collabosphere');
  collabosphere.controller('EngagementIndexController', ['analyticsService', 'engagementIndexFactory', 'userService', 'utilService', '$scope', function(analyticsService, engagementIndexFactory, userService, utilService, $scope) {

    // Default sort
    $scope.sortBy = 'rank';
    $scope.reverse = true;

    // Variable that will be used to hold the box plot
    var chart = null;

    /**
     * Get the students in the engagement index and their engagement
     * index points
     */
    var getEngagementIndexList = function() {
      engagementIndexFactory.getEngagementIndexList().then(parseEngagementIndexList);
    };

    /**
     * Prepare the list of students in the engagement index for rendering
     */
    var parseEngagementIndexList = function(results) {
      $scope.students = results.students;
      $scope.currStudent = results.current_canvas_user;

      // If the user hasn't yet decided whether to share their engagement
      // points with the entire class, default the setting to `true`. Note that
      // admins will not see the splash screen, so their sharing setting should
      // not be defaulted
      if (!$scope.currStudent.has_answered_share_question && !$scope.me.isAdmin) {
        $scope.currStudent.share = true;
      }

      for (var i = 0; i < $scope.students.length; i++) {
        // Set the current student to the appropriate student in the engagement index list
        var student = $scope.students[i];
        if (student.id === $scope.currStudent.canvas_user_id) {
          $scope.currStudentItem = student;
          // Highlight the current user
          student.highlight = true;
        }
      }

      // If the current user is sharing its engagement index score and is not
      // an administrator, render the box plot showing how the current student
      // ranks in the class
      if ($scope.currStudent.share && !$scope.me.isAdmin) {
        drawBoxPlot();
      }

      // Track that the engagement index tool has been loaded
      analyticsService.track('Load Engagement Index Tool');
    };

    /**
     * Render the box plot showing how the current student ranks
     * in the class
     *
     * @api private
     */
    var drawBoxPlot = function() {
      var points = [];
      for (var i = 0; i < $scope.students.length; i++) {
        points.push($scope.students[i].points);
      }

      // Wait until Angular has finished rendering the box plot container on the screen
      setTimeout(function() {
        // Render the box plot using highcharts
        // @see http://api.highcharts.com/highcharts
        chart = new Highcharts.Chart({
          chart: {
            backgroundColor: 'transparent',
            inverted: true,
            // Ensure that the box plot is displayed horizontally
            margin: [0, 20, 0, 20],
            renderTo: 'dc-user-badge-boxplot',
            type: 'boxplot'
          },

          title:{
            // Ensure that no chart title is rendered
            text:''
          },

          legend: {
            // Ensure that no legend is rendered
            enabled: false
          },

          credits: {
            // Ensure that no highcarts watermark is rendered
            enabled: false
          },

          tooltip: {
            hideDelay: 100,
            positioner: function(labelWidth, labelHeight) {
              // Ensure that the tooltip does not overlap with the box plot to
              // allow access hover access to 'my points'
              return {
                x: 305,
                y: 15 - (labelHeight / 2)
              };
            },
            shadow: false,
            style: {
              color: '#fff'
            },
            // Ensure the tooltip is rendered as HTML to allow it
            // to overflow the box plot container
            useHTML: true
          },

          // Ensure that no x-axis labels or lines are shown and
          // that the box plot takes up the maximum amount of space
          xAxis: {
            endOnTick: false,
            labels: {
             enabled: false
            },
            lineWidth: 0,
            startOnTick: false,
            tickLength: 0
          },

          // Ensure that no y-axis labels or lines are shown and
          // that the box plot takes up the maximum amount of space
          yAxis: {
            endOnTick: false,
            gridLineWidth: 0,
            labels: {
              enabled: false
            },
            lineWidth: 0,
            maxPadding: 0,
            minPadding: 0,
            startOnTick: false,
            tickLength: 0,
            title: {
              enabled: false
            }
          },

          // Style the box plot
          plotOptions: {
            boxplot: {
              color: '#88acc4',
              fillColor: '#88acc4',
              lineWidth: 1,
              medianColor: '#eee',
              medianWidth: 3,
              whiskerLength: 20,
              whiskerWidth: 3
            }
          },

          series: [
            // Box plot data serie
            {
              data: [calculateBoxPlotData(points)],
              pointWidth: 40,
              tooltip: {
                headerFormat: '',
                pointFormat: 'Maximum: {point.high}<br/>' +
                             'Upper Quartile: {point.q3}<br/>' +
                             'Median: {point.median}<br/>' +
                             'Lower Quartile: {point.q1}<br/>' +
                             'Minimum: {point.low}'
              }
            // Current user points
            }, {
              data: [[0, $scope.currStudentItem.points]],
              marker: {
                fillColor: '#3179bc',
                lineWidth: 5,
                lineColor: '#3179bc'
              },
              tooltip: {
                headerFormat: '',
                  pointFormat: 'My Points: {point.y}'
              },
              type: 'scatter'
            }
          ]
        });
      }, 0);
    };

    /**
     * Calculate the maximum value, upper quartile, median, lower quartile
     * and minimum value of a data series. These values can be used to
     * generate a box plot diagram
     *
     * @param  {Number}       series          The data series used to calculate the box plot values
     * @return {Number[]}     boxplotData     The calculated box plot values
     * @return {Number}       boxplotData[0]  The maximum value
     * @return {Number}       boxplotData[1]  The upper quartile value
     * @return {Number}       boxplotData[2]  The median value
     * @return {Number}       boxplotData[3]  The lower quartile value
     * @return {Number}       boxplotData[4]  The minimum value
     * @api private
     */
    var calculateBoxPlotData = function(series) {
      // Sort the provided data series in ascending order
      series.sort(function(a, b) {
        return b - a;
      });

      var min = series[0];
      var max = series[series.length - 1];

      // Calculate the quartiles
      var q1 = calculateQuartile(series, 1);
      var q2 = calculateQuartile(series, 2);
      var q3 = calculateQuartile(series, 3);

      return [max, q3, q2, q1, min];
    };

    /**
     * Calculate a quartile value for an ordered data series
     *
     * @param  {Number[]}     series        The data series to calculate a quartile value for. Note that this should be sorted in ascending order
     * @param  {Number}       quartile      The quartile to generate. For the median value, `2` should be provided
     * @return {Number}                     The calculated quartile
     * @api private
     */
    var calculateQuartile = function(series, quartile) {
      // Calculate the position of the quartile point in the series
      var quartileIndex = Math.floor(series.length / 4 * quartile);

      // If the quartile point lands on an item in the series, return that value
      if (series.length % 2) {
        return series[quartileIndex];
      // If the quartile point lands in between 2 items, calculate the average of those items
      } else {
        return (series[quartileIndex - 1] + series[quartileIndex]) / 2;
      }
    };

    /**
     * Handle a change in the engagement index search by pushing an analytics
     * statement containing the search query and resizing the BasicLTI iFrame
     *
     * @param  {String}       search        The current search query
     */
    $scope.handleSearch = function(search) {
      // Track that the engagement index is being searched
      analyticsService.track('Search Engagement Index', {
        search: search || null
      });
    };

    /**
     * Change the sorting field and/or sorting direction when one of the
     * engagement list headers is clicked
     *
     * @param  {String}     sortBy            The name of the field to sort by
     */
    $scope.changeEngagementIndexSort = function(sortBy) {
      $scope.sortBy = sortBy;
      $scope.reverse = !$scope.reverse;

      // Track that the engagement index sort has been changed
      analyticsService.track('Sort Engagement Index', {
        sortBy: $scope.sortBy,
        reverse: $scope.reverse
      });
    };

    /**
     * Store whether the current student's engagement index points should be
     * shared with the entire class. This function will only be used for the
     * initial save
     */
    $scope.saveEngagementIndexStatus = function() {
      engagementIndexFactory.setEngagementIndexStatus($scope.currStudent.canvas_user_id, $scope.currStudent.share).success(function() {
        $scope.currStudent.has_answered_share_question = true;
        getEngagementIndexList();
      });
    };

    /**
     * Change whether the current student's engagement index should be shared
     * with the entire class. This will be executed every time the corresponding
     * checkbox is changed following the initial save
     */
    $scope.changeEngagementIndexStatus = function() {
      // Only save the new setting straight away when the initial
      // save has already happened. Note that admins will not see the
      // splash screens, so their changes can be saved straight away
      if ($scope.currStudent.has_answered_share_question || $scope.me.isAdmin) {
        $scope.currStudent.has_answered_share_question = true;
        engagementIndexFactory.setEngagementIndexStatus($scope.currStudent.canvas_user_id, $scope.currStudent.share).success(getEngagementIndexList);
      }
    };

    /**
     * Track downloads of the engagement index CSV export file in the MixPanel
     * analytics
     */
    $scope.trackCSVDownload = function() {
      analyticsService.track('Download Engagement Index CSV');
    };

    /**
     * Get the detailed information about the current user and load the students
     * in the engagement index
     */
    userService.getMe().then(function(me) {
      $scope.me = me;
      getEngagementIndexList();
    });

  }]);

})(window.angular, window.Highcharts);
