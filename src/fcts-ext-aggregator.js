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

  getTimeMultiplier () {

  }

  getAvailablelAggreagation () {
    var config = this.config,
      avlAggMethods,
      avlTimePeriods,
      currentVisibleRange,
      currentTimeLength,
      xAxis = global.x,
      chart = global.chart;

    avlAggMethods = chart.getAvailableAggregationMethod();
    avlTimePeriods = avlTimePeriods = chart.getAvailableTimePeriod();

    currentVisibleRange = xAxis.getCurrentVisibleRange();
    currentTimeLength = currentVisibleRange.endDate - currentVisibleRange.startDate;

    config.avlTimePeriods = avlTimePeriods;
    config.avlAggMethods = avlAggMethods;
    config.currentTimeLength = currentTimeLength;
  }

  getValidTimeMultiplier () {
    var config = this.config,
      xAxis = global.x,
      i,
      len,
      currTimePeriod,
      nextTimePeriod,
      numOfMultiplier,
      currentTimeLength = xAxis.max - xAxis.min,
      avlTimePeriods = config.avlTimePeriods,
      getMultiplierArray = num => Array.from({length: num}, (v, k) => k + 1);

    config.avlTimeMultiplier = [];
    len = avlTimePeriods.length;

    for (i = 0; i < len; i++) {
      currTimePeriod = avlTimePeriods[i];
      nextTimePeriod = avlTimePeriods[(i + 1)];

      if (nextTimePeriod) {
        numOfMultiplier =
          nextTimePeriod[Object.keys(nextTimePeriod)[0]] / currTimePeriod[Object.keys(currTimePeriod)[0]];
      } else {
        numOfMultiplier =
          currentTimeLength / currTimePeriod[Object.keys(currTimePeriod)[0]];
      }
      config.avlTimeMultiplier.push(getMultiplierArray(numOfMultiplier));
    }
  }

  getValidAggregation () {
    var chartConfig = global.chart.config,
      config = this.config,
      i,
      j,
      len1,
      len2,
      avlTimePeriods,
      avlTimeMultiplier,
      minNumOfPlot = chartConfig.minNumOfPlot,
      minPlotWidth = chartConfig.minPlotWidth,
      canvasWidth = chartConfig.canvasWidth,
      currentTimeLength,
      timePeriod,
      time,
      expectedTime,
      multiplier,
      multiplierCounter,
      getMultiplierArray = num => Array.from({length: num}, (v, k) => k + 1),
      minTime,
      maxTime;

    avlTimePeriods = config.avlTimePeriods;
    avlTimeMultiplier = config.avlTimeMultiplier;
    currentTimeLength = config.currentTimeLength;

    config.minTime = minTime = (currentTimeLength / canvasWidth) * minPlotWidth;
    config.maxTime = maxTime = currentTimeLength / minNumOfPlot;

    config.validTimePeriod = [];
    config.validTimePeriodMultiplier = [];

    for (i = 0, len1 = avlTimePeriods.length; i < len1; i++) {
      timePeriod = Object.keys(avlTimePeriods[i])[0];
      time = avlTimePeriods[i][Object.keys(avlTimePeriods[i])[0]];
      multiplierCounter = 0;

      for (j = 0, len2 = avlTimeMultiplier[i].length; j < len2; j++) {
        multiplier = avlTimeMultiplier[i][j];
        expectedTime = multiplier * time;

        if ((expectedTime >= minTime) && (expectedTime <= maxTime)) {
          multiplierCounter++;
        }
      }
      if (multiplierCounter) {
        config.validTimePeriodMultiplier.push(getMultiplierArray(multiplierCounter));
        config.validTimePeriod.push(timePeriod);
      }
    }
    console.log(config.validTimePeriod, config.validTimePeriodMultiplier, config.avlAggMethods);
  }

  /**
   * Set Aggregation on time series
   */
  setAggregation (obj) {
    var avlAggMethods,
      validTimePeriod,
      timePeriodIndex,
      validTimePeriodMultiplier,
      config = this.config;

    this.getValidAggregation();

    avlAggMethods = config.avlAggMethods;
    validTimePeriod = config.validTimePeriod;
    validTimePeriodMultiplier = config.validTimePeriodMultiplier;

    if (avlAggMethods.includes(obj.aggregationMethod) && validTimePeriod.includes(obj.timePeriod)) {
      timePeriodIndex = validTimePeriod.indexOf(obj.timePeriod);
      if (validTimePeriodMultiplier[timePeriodIndex].includes(obj.timePeriodMultiplier)) {
        this.aggregation = obj;
        console.log(this.aggregation, true);
        return true;
      } else {
        console.log(this.aggregation, false);
        return false;
      }
    } else {
      console.log(this.aggregation, false);
      return false;
    }
  }

  /**
   * Reset Applied Aggregation
   */
  resetAggregation () {

  }

  init (require) {
    require('X-Axis', 'chart', function (x, chart) {
      global.x = x;
      global.chart = chart;
    });

    this.getAvailablelAggreagation();
    this.getValidTimeMultiplier();
    // this.getValidAggregation();
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
