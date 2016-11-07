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
  }

  /**
   * Calculates valid aggregation time periods and corresponding multipliers
   * @private
   */
  getValidAggregation () {
    var chartConfig = this.chart.config,
      config = this.config,
      xAxis = this.x,
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
      maxTime,
      currentVisibleRange;

    config.currentVisibleRange = currentVisibleRange = xAxis.getCurrentVisibleRange();
    config.currentTimeLength = currentVisibleRange.endDate - currentVisibleRange.startDate;

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
      if (validTimePeriodMultiplier[timePeriodIndex].includes(Number(obj.timePeriodMultiplier))) {
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
    // var multiplierFld,
    //   timePeriodFld,
    //   AggMethodFld,
    //   // chart = this.chart,
    //   config = this.config,
    //   // currentAggregation,
    //   label,
    //   mainCont = $('#mainCont'),
    //   validTimePeriod = config.validTimePeriod,
    //   validTimePeriodMultiplier = config.validTimePeriodMultiplier,
    //   indexOfTimeUnit,
    //   avlAggMethods = config.avlAggMethods,
    //   timePeriodOnChange = function () {
    //     var timePeriodVal = $('#time_period').val(),
    //       timePeriodMultiplierVal = $('#mul').val(),
    //       indexOfTimeUnit,
    //       indexOfTimeMul;

    //     indexOfTimeUnit = validTimePeriod.indexOf(timePeriodVal);
    //     indexOfTimeMul = validTimePeriodMultiplier[indexOfTimeUnit].indexOf(Number(timePeriodMultiplierVal));

    //     $('#mul').empty();
    //     console.log(indexOfTimeUnit, indexOfTimeMul);

    //     for (var mulVal of validTimePeriodMultiplier[indexOfTimeUnit]) {
    //       $('<option />', {text: mulVal}).appendTo(multiplierFld);
    //     }

    //     if (indexOfTimeMul < 0) {
    //       $('#mul').val(validTimePeriodMultiplier[indexOfTimeUnit][0]);
    //     } else {
    //       $('#mul').val(timePeriodMultiplierVal);
    //     }
    //   };

    // // currentAggregation = chart.getAggregation();

    // if (mainCont.length === 0) {
    //   return;
    // }

    // mainCont.empty();

    // label = $('<label>').text('Aggregate Data: ');
    // label.appendTo(mainCont);

    // multiplierFld = $('<select id="mul"/>');
    // timePeriodFld = $('<select id="time_period"/>');
    // AggMethodFld = $('<select id="agg_method"/>');

    // for (var unitVal of validTimePeriod) {
    //   $('<option />', {text: unitVal}).appendTo(timePeriodFld);
    // }

    // indexOfTimeUnit = validTimePeriod.indexOf(validTimePeriod[0]);

    // if (indexOfTimeUnit >= 0) {
    //   for (var mulVal of validTimePeriodMultiplier[indexOfTimeUnit]) {
    //     $('<option />', {text: mulVal}).appendTo(multiplierFld);
    //   }
    // }

    // for (var aggVal of avlAggMethods) {
    //   $('<option />', {text: aggVal}).appendTo(AggMethodFld);
    // }

    // multiplierFld.appendTo(mainCont);
    // // $('#mul').val(currentAggregation.timePeriodMultiplier);
    // timePeriodFld.appendTo(mainCont);
    // // $('#time_period').val(currentAggregation.timePeriod);
    // AggMethodFld.appendTo(mainCont);
    // // $('#agg_method').val(currentAggregation.aggregationMethod);

    // $('<button/>').text('Apply').appendTo(mainCont);
    // $('<button/>').text('Reset').appendTo(mainCont);

    // $('#time_period').change(timePeriodOnChange);
  }

  rangeChangeCallback () {
    this.getValidAggregation();
    this.draw();
  }

  dispose () {
    // dispose extension
  }
}

module.exports = Aggregator;
