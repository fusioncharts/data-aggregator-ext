'use strict';
import { describe, it } from 'mocha';
import { expect } from 'chai';

var FusionCharts = require('../lib/fusioncharts');

var Aggregator = require('../src/fcts-ext-aggregator');

describe('Aggregator', function () {
  var self = this;
  FusionCharts.register('extension', ['date-range-chooser', function (id) {
    var global = this;
    var extAPI = global.extAPI;

    self.dr = new Aggregator();
    extAPI(self.dr);
  }]);
  var fc = new FusionCharts(); // eslint-disable-line no-unused-vars

  describe('#aggregation', function () {
    var extObj = new Aggregator();

    var avlAggMethods = ['sum', 'average', 'custom'],
      avlTimePeriods = [{
        'min': '60000',
        'multipliers': [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30]
      },
        {
          'hour': '3600000',
          'multipliers': [1, 2, 3, 4, 6, 8, 12]
        },
        {
          'day': '86400000',
          'multipliers': [1, 2, 3, 5, 6, 10, 15]
        },
        {
          'month': '2592000000',
          'multipliers': [1, 2, 3, 4, 6]
        },
        {
          'year': '31104000000',
          'multipliers': [1, 2, 3, 4, 5, 6]
        }];

    var chartObj = extObj.chart = {};

    chartObj.config = {};

    var xAxis = extObj.x = {};

    xAxis.getCurrentVisibleRange = function () {
      return {
        startDate: +new Date('1970-01-01'),
        endDate: +new Date('1970-01-05')
      };
    };

    chartObj.config.minNumOfPlot = 2;
    chartObj.config.maxNumOfPlot = 200;

    chartObj.getAvailableAggregationMethod = function () {
      return avlAggMethods;
    };

    chartObj.getAvailableTimePeriod = function () {
      return avlTimePeriods;
    };

    // extObj.getAvailablelAggreagation();
    // extObj.getValidAggregation();

    it('should be an object', function () {
      expect(extObj.aggregation).to.be.an('object');
    });

    it('should prepare available aggregation', function () {
      var flag = true;

      extObj.getAvailablelAggreagation();

      if (JSON.stringify(avlAggMethods) !== JSON.stringify(extObj.config.avlAggMethods)) {
        flag = false;
      }

      if (JSON.stringify(avlTimePeriods) !== JSON.stringify(extObj.config.avlTimePeriods)) {
        flag = false;
      }

      for (var i = 0; i < avlTimePeriods.length; i++) {
        if (JSON.stringify(avlTimePeriods[i].multipliers) !== JSON.stringify(extObj.config.avlTimeMultiplier[i])) {
          flag = false;
        }
      }

      expect(true).equal(flag);
    });

    it('should prepare valid aggregation', function () {
      var flag = true,
        validTimePeriod = ['min', 'hour', 'day'],
        validTimePeriodMultiplier = [ [ 30 ], [ 1, 2, 3, 4, 6, 8, 12 ], [ 1, 2 ] ];

      extObj.getValidAggregation();

      if (JSON.stringify(validTimePeriod) !== JSON.stringify(extObj.config.validTimePeriod)) {
        flag = false;
      }

      if (JSON.stringify(validTimePeriodMultiplier) !== JSON.stringify(extObj.config.validTimePeriodMultiplier)) {
        flag = false;
      }

      if (JSON.stringify(avlTimePeriods) !== JSON.stringify(extObj.config.avlTimePeriods)) {
        flag = false;
      }

      expect(true).equal(flag);
    });

    it('should set Aggregation', function () {
      var flag;

      flag = extObj.setAggregation({
        timePeriod: 'hour',
        timePeriodMultiplier: '2',
        aggregationMethod: 'sum'
      });

      expect(true).equal(flag);
    });
  });
  self.dr.dispose();
});
