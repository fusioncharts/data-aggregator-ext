'use strict';
var FusionCharts = function () {};

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

FusionCharts.extAPI = function (obj) {
  obj.init(function () {
    var argsToApply = [];
    var cb = arguments[arguments.length - 1];

    for (var i = 0; i < arguments.length - 1; i++) {
      if (arguments[i] === 'X-Axis') {
        argsToApply.push(156772);
      } else if (arguments[i] === 'Y-Axis') {
        argsToApply.push(156765);
      }
    }
    cb.apply(this, argsToApply);
  });

  obj.placeInCanvas();

  obj.draw();

  obj.dispose();
};

module.exports = FusionCharts;
