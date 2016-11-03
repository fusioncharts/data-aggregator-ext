'use strict';
/**
 * Class representing the Data Aggregator.
 */
class Aggregator {
  /**
   * Create a Aggregator.
   * @typedef {object} Aggregator.aggregation
   * @property {string} timePeriod - The time interval of aggregation.
   * @property {number} timePeriodMultiplier - The multiplier of time interval.
   * @property {string} aggregationMethod - The method applied to aggregate.
   */
  constructor () {
    /**
     * @private
     */
    this.appliedAggregation = {
      timePeriod: null,
      timePeriodMultiplier: 1,
      aggregationMethod: null
    };
    this.config = {};
  }

  /**
   * An object representing the timePeriod, timePeriodMultiplier, aggregationMethod.
   * @type {Aggregator.aggregation}
   */
  get aggregation () {
    return this.appliedAggregation;
  }

  set aggregation (obj) {
    this.appliedAggregation.timePeriod = obj.timePeriod;
    this.appliedAggregation.timePeriodMultiplier = obj.timePeriodMultiplier;
    this.appliedAggregation.aggregationMethod = obj.aggregationMethod;
  }

  /**
   * Sets available aggregation options in configuration of extension
   * @private
   */
  getAvailablelAggreagation () {
    var config = this.config,
      currentVisibleRange,
      xAxis = this.x,
      chart = this.chart,
      avlTimePeriods,
      i,
      len;

    config.avlAggMethods = chart.getAvailableAggregationMethod();
    avlTimePeriods = config.avlTimePeriods = chart.getAvailableTimePeriod();

    config.avlTimeMultiplier = [];
    len = avlTimePeriods.length;

    for (i = 0; i < len; i++) {
      config.avlTimeMultiplier.push(avlTimePeriods[i].multipliers);
    }

    currentVisibleRange = xAxis.getCurrentVisibleRange();
    config.currentTimeLength = currentVisibleRange.endDate - currentVisibleRange.startDate;
  }

  /**
   * Calculates valid aggregation time periods and corresponding multipliers
   * @private
   */
  getValidAggregation () {
    var chartConfig = this.chart.config,
      config = this.config,
      i,
      j,
      len1,
      len2,
      avlTimePeriods,
      avlTimeMultiplier,
      minNumOfPlot = chartConfig.minNumOfPlot,
      maxNumOfPlot = chartConfig.maxNumOfPlot,
      multipliersArr,
      currentTimeLength,
      timePeriod,
      time,
      expectedTime,
      multiplier,
      minTime,
      maxTime;

    avlTimePeriods = config.avlTimePeriods;
    avlTimeMultiplier = config.avlTimeMultiplier;
    currentTimeLength = config.currentTimeLength;

    config.minTime = minTime = currentTimeLength / maxNumOfPlot;
    config.maxTime = maxTime = currentTimeLength / minNumOfPlot;

    config.validTimePeriod = [];
    config.validTimePeriodMultiplier = [];

    for (i = 0, len1 = avlTimePeriods.length; i < len1; i++) {
      timePeriod = Object.keys(avlTimePeriods[i])[0];
      time = avlTimePeriods[i][Object.keys(avlTimePeriods[i])[0]];
      multipliersArr = [];

      for (j = 0, len2 = avlTimeMultiplier[i].length; j < len2; j++) {
        multiplier = avlTimeMultiplier[i][j];
        expectedTime = multiplier * time;

        if ((expectedTime >= minTime) && (expectedTime <= maxTime)) {
          multipliersArr.push(avlTimeMultiplier[i][j]);
        }
      }
      if (multipliersArr.length > 0) {
        config.validTimePeriodMultiplier.push(multipliersArr);
        config.validTimePeriod.push(timePeriod);
      }
    }
    console.log('Time Period: ', config.validTimePeriod);
    console.log('Number Of Multipliers: ', config.validTimePeriodMultiplier);
    console.log('Methods: ', config.avlAggMethods);
  }

  /**
   * Set Aggregation on time series
   * @param  {object} obj
   * @property {string} timePeriod - The time interval of aggregation.
   * @property {number} timePeriodMultiplier - The multiplier of time interval.
   * @property {string} aggregationMethod - The method applied to aggregate.
   */
  setAggregation (obj) {
    var avlAggMethods,
      validTimePeriod,
      timePeriodIndex,
      validTimePeriodMultiplier,
      config = this.config;

    avlAggMethods = config.avlAggMethods;
    validTimePeriod = config.validTimePeriod;
    validTimePeriodMultiplier = config.validTimePeriodMultiplier;

    if (avlAggMethods.includes(obj.aggregationMethod) && validTimePeriod.includes(obj.timePeriod)) {
      timePeriodIndex = validTimePeriod.indexOf(obj.timePeriod);
      if (validTimePeriodMultiplier[timePeriodIndex].includes(obj.timePeriodMultiplier)) {
        this.aggregation = obj;
        console.log(this.aggregation);
        return true;
      } else {
        console.log(this.aggregation);
        return false;
      }
    } else {
      console.log(this.aggregation);
      return false;
    }
  }

  /**
   * Reset Applied Aggregation
   */
  resetAggregation () {

  }

  init (require) {
    var self = this;

    require('X-Axis', 'chart', function (x, chart) {
      self.x = x;
      self.chart = chart;
    });

    this.getAvailablelAggreagation();
    this.getValidAggregation();
  }

  placeInCanvas () {
    // space management
  }

  draw () {
    // draw extension
  }

  dispose () {
    // dispose extension
  }
}

module.exports = Aggregator;
