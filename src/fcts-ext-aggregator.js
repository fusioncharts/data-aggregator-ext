'use strict';

module.exports = function (dep) {
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
        binSize: null,
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
        dataAgg = config.dataAgg,
        avlTimePeriods = config.avlTimePeriods = dataAgg.getAggregationTimeRules(),
        i,
        len;

      config.avlTimeMultiplier = [];
      len = avlTimePeriods.length;

      for (i = 0; i < len; i++) {
        config.avlTimeMultiplier.push(avlTimePeriods[i].possibleFactors);
      }
    }

    /**
     * Calculates valid aggregation time periods and corresponding multipliers
     * @private
     */
    getValidAggregation () {
      var self = this,
        config = self.config,
        tsObject = self.tsObject,
        dataAgg = config.dataAgg,
        i,
        j,
        len1,
        len2,
        avlTimePeriods,
        avlTimeMultiplier,
        // minNumOfPlot = 5,
        maxNumOfPlot = config.composition.reactiveModel.model['max-plot-point'],
        multipliersArr,
        currentTimeLength,
        timePeriod,
        time,
        expectedTime,
        multiplier,
        minBinSize;
        // maxBinSize;

      config.currentTimeLength = tsObject.globalReactiveModel.model['x-axis-visible-range-end'] -
        tsObject.globalReactiveModel.model['x-axis-visible-range-start'];

      avlTimePeriods = config.avlTimePeriods;
      avlTimeMultiplier = config.avlTimeMultiplier;
      currentTimeLength = config.currentTimeLength;

      config.minBinSize = minBinSize = currentTimeLength / maxNumOfPlot;
      // config.maxBinSize = maxBinSize = currentTimeLength / minNumOfPlot;

      config.validTimePeriod = [];
      config.validTimePeriodMultiplier = [];
      config.avlAggMethods = dataAgg.getAllAggregationMethod();

      for (i = 0, len1 = avlTimePeriods.length; i < len1; i++) {
        timePeriod = avlTimePeriods[i].name;
        time = avlTimePeriods[i].interval;
        multipliersArr = [];

        for (j = 0, len2 = avlTimeMultiplier[i].length; j < len2; j++) {
          multiplier = avlTimeMultiplier[i][j];
          expectedTime = multiplier * time;

          // if ((expectedTime >= minBinSize) && (expectedTime <= maxBinSize)) {
          if ((expectedTime >= minBinSize)) {
            multipliersArr.push(avlTimeMultiplier[i][j]);
          }
        }
        if (multipliersArr.length > 0) {
          config.validTimePeriodMultiplier.push(multipliersArr);
          config.validTimePeriod.push(timePeriod);
        }
      }
      // console.log('Time Period: ', config.validTimePeriod);
      // console.log('Number Of Multipliers: ', config.validTimePeriodMultiplier);
      // console.log('Methods: ', config.avlAggMethods);
    }

    getCurrentAggreation () {
      var self = this,
        config = self.config,
        dataAgg = config.dataAgg,
        composition = config.composition,
        model = composition.reactiveModel,
        currentAggMethod,
        suitableInterval,
        binSize;

      binSize = model.prop('bin-size') - 1;

      if (isFinite(binSize)) {
        config.canAggregate = true;
        suitableInterval = dataAgg.timeRules.getSuitableInterval(binSize);
        currentAggMethod = model.prop('aggregation-fn');
      } else {
        config.canAggregate = false;
        suitableInterval = {
          name: '',
          step: ''
        };
        config.validTimePeriod = [suitableInterval.name];
        config.validTimePeriodMultiplier = [[suitableInterval.step]];
        config.avlAggMethods = {
          'invalid': {
            formalName: '',
            nickName: ''
          }
        };
        currentAggMethod = config.avlAggMethods['invalid'];
      }

      return {
        timePeriod: suitableInterval.name,
        timePeriodMultiplier: suitableInterval.step,
        aggregationMethod: {
          value: currentAggMethod.nickName,
          text: currentAggMethod.formalName
        }
      };
    }

    init (require) {
      var self = this,
        config = self.config,
        toolboxComponent = config.toolboxComponent = {},
        api,
        store,
        composition,
        saveTo = 'tsObject',
        requiredParams = [
          'graphics',
          'globalReactiveModel',
          'chart',
          'spaceManagerInstance',
          'chartInstance',
          'smartLabel',
          function acquire () {
            let i = 0,
              ii = requiredParams.length - 1,
              param = '';
            self[saveTo] = self[saveTo] || {};
            self.requiredParams = {};
            for (i = 0; i < ii; ++i) {
              param = requiredParams[i];
              self[saveTo][param] = arguments[i];
            }
            // onInit(self[saveTo]);
          }
        ];
      require(requiredParams);

      api = self.tsObject.chartInstance.apiInstance;
      store = api.getComponentStore();
      config.composition = composition = store.getCanvasByIndex(0).composition;
      config.dataAgg = composition.impl.getDataAggregator();

      toolboxComponent.toolbox = dep.FC.getComponent('api', 'toolbox');
      toolboxComponent.config = {};

      self.toolbars = [];

      self.measurement = {};

      self.toolbars.push(self.createToolbar());

      window.Aggregator = self;
      return self;
    }

    createToolbar () {
      var self = this,
        group,
        toolbar,
        timeMulSelectMenu,
        timePeriodSelectMenu,
        aggMethodSelectMenu,
        resetButton,
        applyButton,
        config = self.config,
        tsObject = self.tsObject,
        label,

        toolboxComponent = config.toolboxComponent,
        toolbox = toolboxComponent.toolbox,
        toolboxCompConfig = toolboxComponent.config,
        HorizontalToolbar = toolbox.HorizontalToolbar,
        ComponentGroup = toolbox.ComponentGroup,
        SymbolStore = toolbox.SymbolStore,

        graphics = tsObject.graphics,
        paper = graphics.paper,
        container = graphics.container,
        chart = tsObject.chart,
        smartLabel = tsObject.smartLabel,

        multiplierVal,
        timeMulSelectMenuOpt,
        timePeriodMenuDisableConfig,
        timeMultiplierMenuDisableConfig,
        aggMethodMenuDisableonfig,
        dropDownMenuStyle,
        applyButtonDisableConfig,
        resetButtonDisableConfig,

        style,

        dependencies = {
          paper: paper,
          chart: chart,
          smartLabel: smartLabel,
          chartContainer: container
        },
        apply = (set) => {
          var model = config.composition.reactiveModel,
            timePeriodVal = timePeriodSelectMenu.value(),
            timePeriodMultiplierVal = timeMulSelectMenu.value(),
            aggMethodSelectMenuVal = aggMethodSelectMenu.value(),
            keys,
            binSize,
            timeInterval,
            aggregation = self.aggregation,
            canvas = config.composition.impl;

          for (keys of config.avlTimePeriods) {
            if (keys.name === timePeriodVal) {
              timeInterval = keys.interval;
              break;
            }
          }
          binSize = timeInterval * Number(timePeriodMultiplierVal);
          if (set && isFinite(model.prop('bin-size'))) {
            model
              .lock()
              .prop('bin-size-ext', binSize)
              .prop('aggregation-fn-ext', config.avlAggMethods[aggMethodSelectMenuVal])
              .unlock();
            aggregation.binSize = binSize;
            aggregation.aggregationMethod = aggMethodSelectMenuVal;
            applyButton.updateVisual('disabled');
            resetButton.updateVisual('enabled');
          } else {
            canvas.resetAggregation();
            aggregation.binSize = null;
            aggregation.aggregationMethod = null;
            resetButton.updateVisual('disabled');
          }
        },

        timePeriodOnChange = () => {
          var timePeriodVal = timePeriodSelectMenu.value(),
            timePeriodMultiplierVal = timeMulSelectMenu.value(),
            prevTimePeroidMulVal = timePeriodMultiplierVal,
            validTimePeriod = config.validTimePeriod,
            validTimePeriodMultiplier = config.validTimePeriodMultiplier,
            indexOfTimeUnit,
            indexOfTimeMul;

          indexOfTimeUnit = validTimePeriod.indexOf(timePeriodVal);
          indexOfTimeMul = validTimePeriodMultiplier[indexOfTimeUnit].indexOf(Number(timePeriodMultiplierVal));

          timeMulSelectMenuOpt = [];
          for (multiplierVal of validTimePeriodMultiplier[indexOfTimeUnit]) {
            timeMulSelectMenuOpt.push({
              name: multiplierVal.toString(),
              value: multiplierVal.toString()
            });
          }

          timeMulSelectMenu.updateList(timeMulSelectMenuOpt);

          if (indexOfTimeMul < 0) {
            timeMulSelectMenu.value(validTimePeriodMultiplier[indexOfTimeUnit][0].toString());
          } else {
            timeMulSelectMenu.value(prevTimePeroidMulVal);
          }
        },

        onChange = (type) => {
          var currentAgg = self.getCurrentAggreation();

          if (currentAgg.timePeriodMultiplier.toString() !== timeMulSelectMenu.value() ||
            currentAgg.timePeriod !== timePeriodSelectMenu.value() ||
            currentAgg.aggregationMethod.value !== aggMethodSelectMenu.value()) {
            applyButton.updateVisual('enabled');
          } else {
            applyButton.updateVisual('disabled');
          }
        };

      group = new ComponentGroup(dependencies);
      toolbar = new HorizontalToolbar(dependencies);

      config.usrConfig = {
        enabled: true,
        posWrtCanvas: 'top',
        alignment: 'left',
        orientation: 'horizontal',
        styles: {
          timeMultiplierInputField: {
            enabled: {
              'fill': '#fff',
              'labelFill': '#696969',
              'stroke': '#c8cecd',
              'strokeWidth': 1,
              'hoverStroke': '#696969',
              'hoverStrokeWidth': 1,
              'radius': 1,
              'width': 45,
              'height': 22
            },
            disabled: {
              'fill': '#fff',
              'stroke-width': 1,
              'stroke': 'rgb(192, 192, 192)',
              'labelFill': '#000'
            }
          },
          timePeriodInputField: {
            enabled: {
              'fill': '#fff',
              'labelFill': '#696969',
              'stroke': '#c8cecd',
              'strokeWidth': 1,
              'hoverStroke': '#696969',
              'hoverStrokeWidth': 1,
              'radius': 1,
              'width': 75,
              'height': 22
            },
            disabled: {
              'fill': '#fff',
              'stroke-width': 1,
              'stroke': 'rgb(192, 192, 192)',
              'labelFill': '#000'
            }
          },
          aggregationMethodInputField: {
            enabled: {
              'fill': '#fff',
              'labelFill': '#696969',
              'stroke': '#c8cecd',
              'strokeWidth': 1,
              'hoverStroke': '#696969',
              'hoverStrokeWidth': 1,
              'radius': 1,
              'width': 100,
              'height': 22
            },
            disabled: {
              'fill': '#fff',
              'stroke-width': 1,
              'stroke': 'rgb(192, 192, 192)',
              'labelFill': '#000'
            }
          },
          dropDown: {
            enabled: {
              'fill': '#898b8b',
              'labelFill': '#fff'
            },
            normal: {
              'fill': '#fff',
              'labelFill': '#000'
            },
            hover: {
              'fill': '#e6e8e8',
              'labelFill': '#000'
            }
          },
          applyButton: {
            enabled: {
              'fill': '#555',
              'labelFill': '#f3f3f3',
              'stroke': '#c8cecd',
              'strokeWidth': 1,
              'hoverFill': '#555',
              'hoverStrokeWidth': 1,
              'hoverStroke': '',
              'radius': 1,
              'width': 30,
              'height': 20
            },
            disabled: {
              'fill': '#bebebe',
              'stroke-width': 3,
              'stroke': 'rgb(192, 192, 192)',
              'labelFill': '#f3f3f3'
            }
          },
          resetButton: {
            enabled: {
              'fill': '#898b8b',
              'labelFill': '#f3f3f3',
              'stroke': '#c8cecd',
              'strokeWidth': 1,
              'hoverFill': '#898b8b',
              'hoverStrokeWidth': 1,
              'hoverStroke': '',
              'radius': 1,
              'width': 30,
              'height': 20
            },
            disabled: {
              'fill': '#bebebe',
              'stroke-width': 3,
              'stroke': 'rgb(192, 192, 192)',
              'labelFill': '#f3f3f3'
            }
          },
          base: {
            font: {
              'fontSize': 11
            }
          }
        }
      };

      style = config.usrConfig.styles || {};

      style = {
        timeMultiplierInputField: {
          enabled: (style.timeMultiplierInputField && style.timeMultiplierInputField.enabled) || {},
          disabled: (style.timeMultiplierInputField && style.timeMultiplierInputField.disabled) || {}
        },
        timePeriodInputField: {
          enabled: (style.timePeriodInputField && style.timePeriodInputField.enabled) || {},
          disabled: (style.timePeriodInputField && style.timePeriodInputField.disabled) || {}
        },
        aggregationMethodInputField: {
          enabled: (style.aggregationMethodInputField && style.aggregationMethodInputField.enabled) || {},
          disabled: (style.aggregationMethodInputField && style.aggregationMethodInputField.disabled) || {}
        },
        dropDown: {
          enabled: (style.dropDown && style.dropDown.enabled) || {},
          normal: (style.dropDown && style.dropDown.normal) || {},
          hover: (style.dropDown && style.dropDown.hover) || {}
        },
        applyButton: {
          enabled: (style.applyButton && style.applyButton.enabled) || {},
          disabled: (style.applyButton && style.applyButton.disabled) || {}
        },
        resetButton: {
          enabled: (style.resetButton && style.resetButton.enabled) || {},
          disabled: (style.resetButton && style.resetButton.disabled) || {}
        },
        base: {
          font: (style.base && style.base.font) || {}
        }
      };

      group.setConfig({
        fill: '#fff',
        borderThickness: 0
      });

      toolbar.setConfig({
        fill: '#fff',
        borderThickness: 0
      });

      timePeriodMenuDisableConfig = {
        disabled: {
          config: {
            disabled: style.timeMultiplierInputField.disabled
          }
        }
      };

      timeMultiplierMenuDisableConfig = {
        disabled: {
          config: {
            disabled: style.timePeriodInputField.disabled
          }
        }
      };

      aggMethodMenuDisableonfig = {
        disabled: {
          config: {
            disabled: style.aggregationMethodInputField.disabled
          }
        }
      };

      applyButtonDisableConfig = {
        disabled: {
          config: {
            disabled: style.applyButton.disabled
          }
        }
      };

      resetButtonDisableConfig = {
        disabled: {
          config: {
            disabled: style.resetButton.disabled
          }
        }
      };

      dropDownMenuStyle = {
        selected: {
          container: {
            style: {
              fill: style.dropDown.enabled.fill
            }
          },
          text: {
            style: {
              fill: style.dropDown.enabled.labelFill
            }
          }
        },
        normal: {
          container: {
            style: {
              fill: style.dropDown.normal.fill
            }
          },
          text: {
            style: {
              fill: style.dropDown.normal.labelFill
            }
          }
        },
        hover: {
          container: {
            style: {
              fill: style.dropDown.hover.fill
            }
          },
          text: {
            style: {
              fill: style.dropDown.hover.labelFill
            }
          }
        }
      };

      label = new toolbox.Label('Aggregate Data:', dependencies, {
        text: {
          style: {
            'font-size': '14',
            'fill': '#696969'
          }
        }
      });

      toolboxCompConfig.timePeriodSelectMenu = timePeriodSelectMenu = new toolbox.SelectSymbol({}, dependencies, [],
      Object.assign(style.timePeriodInputField.enabled, {
        btnTextStyle: {
          fontSize: style.base.font.fontSize
        },
        dropDownMenu: dropDownMenuStyle
      }));
      timePeriodSelectMenu.setStateConfig(timePeriodMenuDisableConfig);

      toolboxCompConfig.timeMulSelectMenu = timeMulSelectMenu = new toolbox.SelectSymbol({}, dependencies, [],
      Object.assign(style.timeMultiplierInputField.enabled, {
        btnTextStyle: {
          fontSize: style.base.font.fontSize
        },
        dropDownMenu: dropDownMenuStyle
      }));
      timeMulSelectMenu.setStateConfig(timeMultiplierMenuDisableConfig);

      toolboxCompConfig.aggMethodSelectMenu = aggMethodSelectMenu = new toolbox.SelectSymbol({}, dependencies, [],
      Object.assign(style.aggregationMethodInputField.enabled, {
        btnTextStyle: {
          fontSize: style.base.font.fontSize
        },
        dropDownMenu: dropDownMenuStyle
      }));
      aggMethodSelectMenu.setStateConfig(aggMethodMenuDisableonfig);

      toolboxCompConfig.applyButton = applyButton = new toolbox.Symbol('APPLY', true, dependencies,
        Object.assign(style.applyButton.enabled, {
          btnTextStyle: {
            fontSize: style.base.font.fontSize
          }
        }))
        .attachEventHandlers({
          click: function () {
            apply(1);
          }
        });
      applyButton.setStateConfig(applyButtonDisableConfig);

      toolboxCompConfig.resetButton = resetButton = new toolbox.Symbol('RESET', true, dependencies,
        Object.assign(style.resetButton.enabled, {
          btnTextStyle: {
            fontSize: style.base.font.fontSize
          }
        }))
        .attachEventHandlers({
          click: function () {
            apply(0);
          }
        });
      resetButton.setStateConfig(resetButtonDisableConfig);

      group.addSymbol(label);
      group.addSymbol(timeMulSelectMenu);
      group.addSymbol(timePeriodSelectMenu);
      group.addSymbol(aggMethodSelectMenu);
      group.addSymbol(applyButton);
      group.addSymbol(resetButton);

      SymbolStore.register('textBoxIcon', function (x, y, rad, w, h, padX, padY) {
        var x1 = x - w / 2 + padX / 2,
          x2 = x + w / 2 - padX / 2,
          y1 = y - h / 2 + padY / 2,
          y2 = y + h / 2 - padY / 2;

        return ['M', x1, y1, 'L', x2, y1, 'L', x2, y2, 'L', x1, y2, 'Z'];
      });

      timePeriodSelectMenu.attachEventHandlers({
        textOnChange: function () {
          timePeriodOnChange();
          onChange();
        }
      });

      timeMulSelectMenu.attachEventHandlers({
        textOnChange: function () {
          onChange();
        }
      });

      aggMethodSelectMenu.attachEventHandlers({
        textOnChange: function () {
          onChange();
        }
      });

      toolbar.addComponent(group);

      return toolbar;
    }

    getLogicalSpace (availableWidth, availableHeight) {
      var logicalSpace,
        width = 0,
        height = 0,
        i,
        ln;

      for (i = 0, ln = this.toolbars.length; i < ln; i++) {
        logicalSpace = this.toolbars[i].getLogicalSpace();
        width = Math.max(logicalSpace.width, width);
        height += logicalSpace.height;
        this.toolbars[i].width = logicalSpace.width;
        this.toolbars[i].height = logicalSpace.height;
      }
      height += this.padding;
      return {
        width: width > availableWidth ? 0 : width,
        height: height > availableHeight ? 0 : height
      };
    }

    placeInCanvas (containerInstance) {
      var self = this,
        tsObject = self.tsObject;

      self.padding = 5;
      tsObject.spaceManagerInstance.add([{
        name: function () {
          return 'DataAggregator';
        },
        ref: function (obj) {
          return obj['0'];
        },
        self: function () {
          return self;
        },
        priority: function () {
          return 2;
        },
        layout: function (obj) {
          return obj.inline;
        },
        orientation: [{
          type: function (obj) {
            return obj.horizontal;
          },
          position: [{
            type: function (obj) {
              return obj.top;
            },
            alignment: [{
              type: function (obj) {
                return obj.left;
              },
              dimensions: [function () {
                var parent = this.getParentComponentGroup();
                return self.getLogicalSpace(parent.getWidth(), parent.getHeight());
              }]
            }]
          }]
        }]
      }]);
    }

    setDrawingConfiguration (x, y, width, height, group) {
      var mes = this.measurement;
      mes.x = x;
      mes.y = y;
      mes.width = width;
      mes.height = height;

      this.parentGroup = group;

      return this;
    }

    draw (x, y, width, height, group) {
      var self = this,
        config = self.config,
        toolboxCompConfig = config.toolboxComponent.config,
        timePeriodSelectMenu = toolboxCompConfig.timePeriodSelectMenu,
        timeMulSelectMenu = toolboxCompConfig.timeMulSelectMenu,
        aggMethodSelectMenu = toolboxCompConfig.aggMethodSelectMenu,
        applyButton = toolboxCompConfig.applyButton,
        resetButton = toolboxCompConfig.resetButton,
        measurement = self.measurement,
        toolbars = self.toolbars,
        ln,
        i,
        toolbar,
        model = config.composition.reactiveModel,
        dataAgg = config.dataAgg,

        timePeriodVal,
        timePeriodSelectMenuOpt,
        validTimePeriod,
        indexOfTimeUnit,

        multiplierVal,
        timeMulSelectMenuOpt,
        validTimePeriodMultiplier,

        aggVal,
        aggMethodSelectMenuOpt,
        avlAggMethods,
        rangeOnChange = () => {
          var aggregation = self.aggregation,
            currentAggregationObj,
            timePeriod,
            timePeriodMultiplier,
            aggregationMethod;

          self.getValidAggregation();
          currentAggregationObj = self.getCurrentAggreation();
          timePeriod = currentAggregationObj.timePeriod;
          timePeriodMultiplier = currentAggregationObj.timePeriodMultiplier;
          aggregationMethod = currentAggregationObj.aggregationMethod;

          timePeriodSelectMenuOpt = [];
          timeMulSelectMenuOpt = [];
          aggMethodSelectMenuOpt = [];

          validTimePeriod = config.validTimePeriod;
          validTimePeriodMultiplier = config.validTimePeriodMultiplier;
          avlAggMethods = config.avlAggMethods;

          applyButton.updateVisual('disabled');

          if (aggregation.binSize !== model.prop('bin-size') &&
            aggregationMethod.value === config.defaultAggMethod) {
            aggregation.binSize = null;
            aggregation.aggregationMethod = null;
            resetButton.updateVisual('disabled');
          } else {
            resetButton.updateVisual('enabled');
          }

          if (!config.canAggregate) {
            timePeriodSelectMenu.updateVisual('disabled');
            timeMulSelectMenu.updateVisual('disabled');
            aggMethodSelectMenu.updateVisual('disabled');
            resetButton.updateVisual('disabled');
          } else {
            timePeriodSelectMenu.updateVisual('enabled');
            timeMulSelectMenu.updateVisual('enabled');
            aggMethodSelectMenu.updateVisual('enabled');
          }

          for (timePeriodVal of validTimePeriod) {
            timePeriodSelectMenuOpt.push({
              name: timePeriodVal,
              value: timePeriodVal
            });
          }

          timePeriodSelectMenu.updateList(timePeriodSelectMenuOpt);
          timePeriodSelectMenu.value(timePeriod);

          indexOfTimeUnit = validTimePeriod.indexOf(timePeriod);

          if (indexOfTimeUnit >= 0) {
            for (multiplierVal of validTimePeriodMultiplier[indexOfTimeUnit]) {
              timeMulSelectMenuOpt.push({
                name: multiplierVal.toString(),
                value: multiplierVal.toString()
              });
            }
          }

          timeMulSelectMenu.updateList(timeMulSelectMenuOpt);
          timeMulSelectMenu.value(timePeriodMultiplier.toString());

          for (aggVal in avlAggMethods) {
            aggMethodSelectMenuOpt.push({
              name: avlAggMethods[aggVal].formalName,
              value: avlAggMethods[aggVal].nickName
            });
          }

          aggMethodSelectMenu.updateList(aggMethodSelectMenuOpt);
          aggMethodSelectMenu.value(aggregationMethod.value);
        };

      self.getAvailablelAggreagation();

      x = x === undefined ? measurement.x : x;
      y = y === undefined ? measurement.y : y;
      width = width === undefined ? measurement.width : width;
      height = height === undefined ? measurement.height : height;
      group = group === undefined ? self.parentGroup : group;
      if (width && height) {
        for (i = 0, ln = toolbars.length; i < ln; i++) {
          toolbar = toolbars[i];
          toolbar.draw(x, y);
        }
      }
      rangeOnChange();
      applyButton.updateVisual('disabled');
      resetButton.updateVisual('disabled');
      config.defaultAggMethod = dataAgg.getDefaultAggregationMethod().nickName;

      model.onPropsChange(['bin-size', 'aggregation-fn'], rangeOnChange);
    }

    dispose () {
      // dispose extension
    }
  }
  return Aggregator;
};
