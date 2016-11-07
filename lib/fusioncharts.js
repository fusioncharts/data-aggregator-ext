'use strict';
var FusionCharts = function () {
  var i, l = extList.length, self = this;

  self.xAxis = {
    range: {
      startDate: +new Date('1970-01-01'),
      endDate: +new Date('1970-01-05'),
    },
    getCurrentVisibleRange: function () {
                return this.range;
    },
    min: +new Date('1970-01-01'),
    max: +new Date('1985-01-01')
  };

  if (self.test) {

    self.requireFn = function () {
      var callBack = arguments[arguments.length - 1],
      callBackArgument = [];

      for (var i = 0; i < arguments.length - 1; i++) {
        if (arguments[i] === 'X-Axis') {
          callBackArgument.push(self.xAxis);
        } else if (arguments[i] === 'chart') {
          callBackArgument.push(self);
        }
        else {
          callBackArgument.push(self[arguments[i]]);
        }
      }
      callBack.apply(self, callBackArgument);
    }
    self.extensions = [];
    for (i = 0; i < l; i += 1) {
      var tempExt = new extList[i]();
      tempExt.init(self.requireFn);
      tempExt.draw();
      self.extensions.push(tempExt);
    }
  }
};

FusionCharts.prototype = {
  test: true,
  getAvailableTimePeriod: function () {
    return [{
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
  },
  getAvailableAggregationMethod: function () {
    return ['sum', 'average', 'custom'];
  },
  setCurrentVisibleRange: function (stDt, endDt) {
    this.xAxis.range.startDate = +new Date(stDt);
    this.xAxis.range.endDate = +new Date(endDt);

    this.extensions[0].rangeChangeCallback();
  },
  getAggregation: function() {
    return {
      timePeriod: 'hour',
      timePeriodMultiplier: '1',
      aggregationMethod: 'sum'
    };
  },
  config: {
    minNumOfPlot: 3,
    maxNumOfPlot: 200
  }
};

FusionCharts.register = function (ext, arr) {
  var extName = arr[0];
  var fn = arr[1];
  console.log('Currently active extension: ' + extName);
  fn.bind(this, 565)();
};

FusionCharts.getComponent = function (componentType, componentName) {
  var toolBox = {
    x: 24,
    y: 56,
    width: 100,
    height: 20,
    index: 4
  };

  if (componentType === 'api' && componentName === 'toolbox') {
    return toolBox;
  }

  return null;
};
var extList = [];

FusionCharts.extAPI = function (obj) {
  var tempConstractor = function () {};
  tempConstractor.prototype = obj;

  extList.push(tempConstractor);
};

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = FusionCharts;
} else {
  window.FusionCharts = FusionCharts;
}
