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
      timePeriodMultiplier: 0,
      aggregationMethod: null
    };
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
   * Set Aggregation on time series
   */
  setAggregation (obj) {
    this.aggregation = obj;
    return true;
  }

  /**
   * Reset Applied Aggregation
   */
  reset () {

  }

  init (require) {
    require('X-Axis', 'Y-Axis', function (x, y) {
      global.x = x;
      global.y = y;
    });
  }

  placeInCanvas () {
    // space management
    var isSet = this.setAggregation({
      timePeriod: 'month',
      timePeriodMultiplier: 3,
      aggregationMethod: 'sum'
    });
    console.log(this.aggregation, isSet);
  }

  draw () {
    // draw extension
  }

  dispose () {
    // dispose extension
  }
}

module.exports = Aggregator;
