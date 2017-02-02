'use strict';

module.exports = function (dep) {
  /**
   * Capitalize the first letter of a given string and return the string
   * @private
   */
  var capitalize = function (string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    isPlainObject = function (o) {
      return typeof o === 'object' && o.constructor === Object;
    },
    mergeRecursively = function recParsing (sink, source, lib) {
      var prop;
      for (prop in source) {
        if (prop in sink) {
          if (typeof source[prop] === 'object') {
            recParsing(sink[prop], source[prop], lib);
          }
        } else {
          if (isPlainObject(source[prop])) {
            sink[prop] = lib.extend2({}, source[prop]);
          } else {
            sink[prop] = source[prop];
          }
        }
      }
    };
  // https://tc39.github.io/ecma262/#sec-array.prototype.includes
  if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, 'includes', {
      value: function (searchElement, fromIndex) {
        // 1. Let O be ? ToObject(this value).
        if (this == null) {
          throw new TypeError('"this" is null or not defined');
        }

        var o = Object(this);

        // 2. Let len be ? ToLength(? Get(O, "length")).
        var len = o.length >>> 0;

        // 3. If len is 0, return false.
        if (len === 0) {
          return false;
        }

        // 4. Let n be ? ToInteger(fromIndex).
        //    (If fromIndex is undefined, this step produces the value 0.)
        var n = fromIndex | 0;

        // 5. If n ≥ 0, then
        //  a. Let k be n.
        // 6. Else n < 0,
        //  a. Let k be len + n.
        //  b. If k < 0, let k be 0.
        var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

        // 7. Repeat, while k < len
        while (k < len) {
          // a. Let elementK be the result of ? Get(O, ! ToString(k)).
          // b. If SameValueZero(searchElement, elementK) is true, return true.
          // c. Increase k by 1.
          // NOTE: === provides the correct "SameValueZero" comparison needed here.
          if (o[k] === searchElement) {
            return true;
          }
          k++;
        }

        // 8. Return false
        return false;
      }
    });
  }
  /**
   * Class representing the Data Aggregator.
   */
  class Aggregator {
    /**
     * Create a Aggregator.
     * @typedef {object} Aggregator.aggregation
     * @property {string} binSize - The binSize applied to aggregate.
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
     * An object representing the binSize, aggregationMethod.
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
        maxNumOfPlot = config.composition.reactiveModel.model['max-plot-point'],
        minimumConsecutiveDifference = config.composition.dataset.category.minimumConsecutiveDifference,
        multipliersArr,
        currentTimeLength,
        timePeriod,
        time,
        binSize,
        multiplier,
        globalReactiveModel = tsObject.globalReactiveModel,
        maximumAllowedTicks = globalReactiveModel.prop('x-axis-maximum-allowed-ticks'),
        minBinSize;

      config.currentTimeLength = globalReactiveModel.model['x-axis-visible-range-end'] -
        globalReactiveModel.model['x-axis-visible-range-start'];

      avlTimePeriods = config.avlTimePeriods;
      avlTimeMultiplier = config.avlTimeMultiplier;
      currentTimeLength = config.currentTimeLength;

      minBinSize = currentTimeLength / maxNumOfPlot;

      config.validTimePeriod = [];
      config.validTimePeriodMultiplier = [];
      config.avlAggMethods = dataAgg.getAllAggregationMethod();

      for (i = 0, len1 = avlTimePeriods.length; i < len1; i++) {
        timePeriod = avlTimePeriods[i].name;
        time = avlTimePeriods[i].interval;
        multipliersArr = [];

        for (j = 0, len2 = avlTimeMultiplier[i].length; j < len2; j++) {
          multiplier = avlTimeMultiplier[i][j];
          binSize = multiplier * time;

          if ((binSize >= minBinSize) && (binSize > minimumConsecutiveDifference) &&
            // Need to revisit
            (currentTimeLength > maximumAllowedTicks * binSize * 0.5)) {
            multipliersArr.push(avlTimeMultiplier[i][j]);
          }
        }
        if (multipliersArr.length > 0) {
          config.validTimePeriodMultiplier.push(multipliersArr);
          config.validTimePeriod.push(timePeriod);
        }
      }
    }

    /**
     * Returns current Aggregation applied to timeseries
     * @private
     */
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
        suitableInterval = dataAgg.timeRules.getSuitableInterval(binSize);
        currentAggMethod = model.prop('aggregation-fn');
      }

      return {
        timePeriod: suitableInterval && suitableInterval.name,
        timePeriodMultiplier: suitableInterval && suitableInterval.step,
        aggregationMethod: {
          value: currentAggMethod && currentAggMethod.nickName,
          text: currentAggMethod && currentAggMethod.formalName
        }
      };
    }

    init (require) {
      var self = this,
        config = self.config,
        tsObject,
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
          'extData',
          'parentGroup',
          'lib',
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
          }
        ];
      require(requiredParams);

      tsObject = self.tsObject;
      config.usrConfig = tsObject.extData;

      api = tsObject.chartInstance.apiInstance;
      store = api.getComponentStore();
      config.composition = composition = store.getCanvasByIndex(0).composition;
      config.dataAgg = composition.impl.getDataAggregator();

      toolboxComponent.toolbox = dep.FC.getComponent('api', 'toolbox');
      toolboxComponent.config = {};

      self.toolbars = [];

      self.measurement = {};

      self.toolbars.push(self.createToolbar());

      composition.reactiveModel.onPropsChange(['bin-size', 'aggregation-fn'], function () {
        if (config.execute) {
          config.execute = false;
          setTimeout(() => {
            self.rangeOnChange();
          }, 200);
        }
      });

      window.Aggregator = self;
      return self;
    }

    /**
     * Create toolbar components
     * @private
     */
    createToolbar () {
      var self = this,
        labelGroup,
        selectMenuGroup,
        buttonGroup,
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

        graphics = tsObject.graphics,
        paper = graphics.paper,
        d3 = paper.getInstances().d3,
        container = graphics.container,
        chart = tsObject.chart,
        smartLabel = tsObject.smartLabel,

        timeMulSelectMenuOpt,

        usrConfig,
        style,

        dependencies = {
          paper: paper,
          chart: chart,
          smartLabel: smartLabel,
          chartContainer: container
        },

        /**
         * Sets valid time multiplier on time period change from extension toolbox
         * @private
         */
        timePeriodOnChange = () => {
          var timePeriodVal = timePeriodSelectMenu.value(),
            timePeriodMultiplierVal = timeMulSelectMenu.value(),
            prevTimePeroidMulVal = timePeriodMultiplierVal,
            validTimePeriod = config.validTimePeriod,
            validTimePeriodMultiplier = config.validTimePeriodMultiplier,
            indexOfTimeUnit,
            indexOfTimeMul,
            multiplierVal,
            len,
            arr,
            i = 0;

          indexOfTimeUnit = validTimePeriod.indexOf(timePeriodVal);
          indexOfTimeMul = validTimePeriodMultiplier[indexOfTimeUnit].indexOf(Number(timePeriodMultiplierVal));

          timeMulSelectMenuOpt = [];
          arr = validTimePeriodMultiplier[indexOfTimeUnit];
          for (i = 0, len = arr.length; i < len; i++) {
            multiplierVal = arr[i];
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

        /**
         * Sets state of applyButton(active/inactive) on change in value in toolbox
         * @private
         */
        onChange = (type) => {
          var currentAgg = self.getCurrentAggreation();
          currentAgg.timePeriodMultiplier = currentAgg.timePeriodMultiplier &&
            currentAgg.timePeriodMultiplier.toString();

          if (currentAgg.timePeriodMultiplier !== timeMulSelectMenu.value() ||
            currentAgg.timePeriod !== timePeriodSelectMenu.value() ||
            currentAgg.aggregationMethod.value !== aggMethodSelectMenu.value()) {
            applyButton.removeState('disabled');
          } else {
            applyButton.setState('disabled');
          }

          if (!aggMethodSelectMenu.value()) {
            aggMethodSelectMenu.value(config.defaultAggMethod);
          }
          if (!timePeriodSelectMenu.value() && !timeMulSelectMenu.value()) {
            timePeriodSelectMenu.value(config.validTimePeriod[0]);
            timePeriodOnChange();
          }
        };

      labelGroup = new ComponentGroup(dependencies, {
        hPadding: 4
      });
      selectMenuGroup = new ComponentGroup(dependencies, {
        hPadding: 0
      });
      buttonGroup = new ComponentGroup(dependencies, {
        hPadding: 0
      });

      toolbar = new HorizontalToolbar(dependencies);
      usrConfig = config.usrConfig;

      var selectConf = {
        container: {
          style: {
            'fill': '#fff',
            'stroke': '#c8cecd',
            'stroke-width': '1'
          },
          states: {
            selected: {
              stroke: '#1e1f1f'
            },
            hover: {
              cursor: 'pointer'
            }
          }
        },
        text: {
          style: {
            fill: '#696969',
            'font-size': '11px',
            'font-family': '"Lucida Grande", sans-serif'
          }
        },
        arrow: {
          style: {
            fill: '#696969'
          }
        },
        attrs: {
          'radius': 2,
          'width': 50,
          'height': 22,
          'margin': {
            right: 3
          }
        }
      };

      var defaultStyle = {
        label: {
          container: {
            height: 22,
            style: {

            }
          },
          margin: {
            right: 2
          },
          text: {
            style: {
              'font-size': '13px',
              'font-family': '"Lucida Grande", sans-serif',
              'font-weight': 'bold',
              'fill': '#4b4b4b'
            }
          }
        },
        timeMulSelectMenu: {
          container: selectConf.container,
          text: selectConf.text,
          arrow: selectConf.arrow,
          attrs: {
            'radius': 2,
            'width': 50,
            'height': 22,
            'margin': {
              right: 3,
              left: 0
            },
            padding: {
              left: 10,
              right: 8
            }
          },
          eventListeners: [{
            type: 'change',
            cb: onChange
          }]
        },
        timePeriodSelectMenu: {
          container: selectConf.container,
          text: selectConf.text,
          arrow: selectConf.arrow,
          attrs: {
            'radius': 2,
            'width': 90,
            'height': 22,
            'margin': {
              right: 9,
              left: 0
            },
            padding: {
              left: 10,
              right: 8
            }
          },
          eventListeners: [{
            type: 'change',
            cb: function () {
              timePeriodOnChange();
              onChange();
            }
          }]
        },
        aggMethodSelectMenu: {
          container: selectConf.container,
          text: selectConf.text,
          arrow: selectConf.arrow,
          attrs: {
            'radius': 2,
            'width': 100,
            'height': 22,
            margin: {
              right: 8,
              left: 0
            },
            padding: {
              left: 10,
              right: 8
            }
          },
          eventListeners: [{
            type: 'change',
            cb: onChange
          }]
        },
        dropDown: {
          container: {
            style: {
              background: '#fff',
              'border-color': '#898b8b',
              'border-radius': '1px',
              'border-style': 'solid',
              'border-width': '2px',
              'font-size': '11px',
              'font-family': '"Lucida Grande", sans-serif'
            }
          },
          listItem: {
            style: {
            },
            states: {
              hover: {
                className: undefined,
                style: {
                  'background': '#e6e8e8',
                  'color': '#696969',
                  'cursor': 'pointer'
                }
              },
              selected: {
                className: undefined,
                style: {
                  'background': '#898b8b',
                  'color': '#fff'
                }
              }
            }
          }
        },
        applyButton: {
          container: {
            style: {
              'fill': '#555',
              'stroke': '#ced5d4',
              'stroke-width': 0
            },
            states: {
              disabled: {
                'fill': '#bebebe',
                'stroke-width': 0,
                'stroke': '#ced5d4'
              },
              hover: {
                cursor: 'pointer'
              }
            }
          },
          text: {
            style: {
              'fill': '#f3f3f3',
              'fontSize': '11px',
              'fontFamily': '"Lucida Grande", sans-serif'
            },
            states: {
              disabled: {
                'fill': '#f3f3f3'
              }
            }
          },
          attrs: {
            'radius': 1,
            'width': 54,
            'height': 22,
            margin: {
              right: 3,
              left: 0
            },
            label: 'APPLY'
          },
          eventListeners: [{
            type: 'click',
            cb: function () {
              self.apply(1);
            }
          }]
        },
        resetButton: {
          container: {
            style: {
              'fill': '#898b8b',
              'stroke': '#ced5d4',
              'strokeWidth': 0
            },
            states: {
              hover: {
                cursor: 'pointer'
              },
              disabled: {
                'fill': '#bebebe',
                'stroke-width': 0,
                'stroke': '#ced5d4',
                cursor: 'default'
              }
            }
          },
          text: {
            style: {
              fill: '#f3f3f3',
              'fontSize': '11px',
              'fontFamily': '"Lucida Grande", sans-serif'
            },
            states: {
              disabled: {
                fill: '#f3f3f3'
              }
            }
          },
          attrs: {
            'radius': 1,
            'shadow': {
              'fill': '#000',
              'opacity': 0.35
            },
            'width': 54,
            'height': 22,
            margin: {
              right: 3,
              left: 0
            },
            label: 'RESET'
          },
          eventListeners: [{
            type: 'click',
            cb: function () {
              self.apply(0);
            }
          }]
        }
      };

      style = defaultStyle;

      if (usrConfig.styles) {
        mergeRecursively(usrConfig.styles, defaultStyle, this.tsObject.lib);
        style = usrConfig.styles;
      }

      label = new toolbox.Label('Aggregation: ', dependencies, style.label);

      label.setConfig({
        className: style.label.className
      });

      applyClassName(label.getIndividualClassNames(label.getClassName()), 'label');

      var parentGroup = tsObject.parentGroup;
      var count = 0;

      function applyClassName (obj, prop, state) {
        var _style;
        for (var key in obj) {
          if (style[prop][key]) {
            if (state && style[prop][key].states && style[prop][key].states[state]) {
              _style = style[prop][key].states[state];
            } else {
              _style = style[prop][key].style;
            }
          }
          _style && paper.cssAddRule('.' + obj[key], _style);
        }
      }

      function factory (prop, cb, options) {
        var sm = toolboxCompConfig[prop] = cb(options)
        .setConfig(style[prop].attrs);

        sm.setParentGroup(parentGroup);
        sm.setConfig({
          className: style[prop].className
        });

        sm.namespace('fusioncharts');
        sm.appendSelector('ext1-' + (count++));

        applyClassName(sm.getIndividualClassNames(sm.getClassName()), prop);
        var classNames = sm.config.states;
        for (var key in classNames) {
          applyClassName(sm.getIndividualClassNames(classNames[key]), prop, key);
        }

        var dm = sm.config.dropDownMenu;
        for (var components in dm) {
          var component = dm[components];
          switch (components) {
            case 'container':
              paper.cssAddRule('.' + component.className, style.dropDown.container.style);
              break;
            case 'listItem':
              paper.cssAddRule('.' + component.className, style.dropDown.listItem.style);
              var states = component.states;
              for (var state in states) {
                paper.cssAddRule('.' + states[state], style.dropDown.listItem.states[state].style);
              }
              break;
          }
        }

        var eventListeners = style[prop].eventListeners;
        for (var i = 0, len = eventListeners.length; i < len; i += 1) {
          var event = eventListeners[i];
          var obj = {};
          obj[event.type] = event.cb;
          sm.attachEventHandlers(obj);
        }
        return sm;
      }

      function createSelectButton (prop) {
        return factory(prop, d3.selectButton, []);
      }

      function createButton (prop) {
        return factory(prop, d3.button, style[prop].attrs.label);
      }

      labelGroup.addSymbol(label);
      labelGroup.setConfig({
        margin: {
          right: 0
        }
      });

      timeMulSelectMenu = createSelectButton('timeMulSelectMenu');
      timePeriodSelectMenu = createSelectButton('timePeriodSelectMenu');
      aggMethodSelectMenu = createSelectButton('aggMethodSelectMenu');

      applyButton = createButton('applyButton');
      resetButton = createButton('resetButton');

      selectMenuGroup.addSymbol(timeMulSelectMenu);
      selectMenuGroup.addSymbol(timePeriodSelectMenu);
      selectMenuGroup.addSymbol(aggMethodSelectMenu);
      buttonGroup.addSymbol(applyButton);
      buttonGroup.addSymbol(resetButton);

      toolbar.addComponent(labelGroup);
      toolbar.addComponent(selectMenuGroup);
      toolbar.addComponent(buttonGroup);
      return toolbar;
    }

    getLogicalSpace (availableWidth, availableHeight) {
      var logicalSpace,
        width = 0,
        height = 0,
        i,
        ln;

      for (i = 0, ln = this.toolbars.length; i < ln; i++) {
        logicalSpace = this.toolbars[i].getLogicalSpace(availableWidth, availableHeight);
        width = Math.max(logicalSpace.width, width);
        height += logicalSpace.height;
        this.toolbars[i].width = logicalSpace.width;
        this.toolbars[i].height = logicalSpace.height;
      }
      height += this.padding;
      return {
        width: width,
        height: height
      };
    }

    placeInCanvas (containerInstance) {
      var self = this,
        tsObject = self.tsObject,
        usrConfig = self.config.usrConfig;

      self.padding = 5;
      tsObject.spaceManagerInstance.add([{
        name: function () {
          return 'data-aggregator';
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
          return obj[usrConfig.layout || 'inline'];
        },
        orientation: [{
          type: function (obj) {
            return obj[usrConfig.orientation || 'horizontal'];
          },
          position: [{
            type: function (obj) {
              return obj[usrConfig.position || 'bottom'];
            },
            alignment: [{
              type: function (obj) {
                return obj[usrConfig.alignment || 'right'];
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

    /**
     * Apply or Reset Aggregation applied through extension in timeseries
     * @param {number} set - Flag to set or reset. '1' to set, '0' to reset
     * @private
     */
    apply (set) {
      var self = this,
        config = self.config,
        toolboxCompConfig = config.toolboxComponent.config,
        timePeriodSelectMenu = toolboxCompConfig.timePeriodSelectMenu,
        timeMulSelectMenu = toolboxCompConfig.timeMulSelectMenu,
        aggMethodSelectMenu = toolboxCompConfig.aggMethodSelectMenu,
        applyButton = toolboxCompConfig.applyButton,
        resetButton = toolboxCompConfig.resetButton,

        aggregate = self.tsObject.extData.aggregate || {},
        validTimePeriod,
        validTimePeriodMultiplier,
        avlAggMethods,

        indexOfTimeUnit,
        validTimeBin,
        validMethod,

        model = config.composition.reactiveModel,
        timePeriodVal,
        timePeriodMultiplierVal,
        aggMethod,
        keys,
        binSize,
        timeInterval,
        aggregation = self.aggregation,
        arr,
        i,
        len,
        canvas = config.composition.impl;

      if (set) {
        if (!config.drawn) {
          timePeriodVal = aggregate.timeUnit && aggregate.timeUnit.toString().toLowerCase();
          timePeriodMultiplierVal = aggregate.timeMultiplier;
          aggMethod = aggregate.method && aggregate.method.toString();

          self.getValidAggregation();
          validTimePeriod = config.validTimePeriod;
          validTimePeriodMultiplier = config.validTimePeriodMultiplier;
          avlAggMethods = config.avlAggMethods;

          if (validTimePeriod.includes(timePeriodVal)) {
            indexOfTimeUnit = validTimePeriod.indexOf(timePeriodVal);
            if (!validTimePeriodMultiplier[indexOfTimeUnit].includes(Number(timePeriodMultiplierVal))) {
              timePeriodMultiplierVal = validTimePeriodMultiplier[indexOfTimeUnit][0];
            }
            validTimeBin = true;
          }

          if (avlAggMethods[aggMethod]) {
            validMethod = true;
          }

          if (validTimeBin || validMethod) {
            if (validTimeBin) {
              arr = config.avlTimePeriods;
              for (i = 0, len = arr.length; i < len; i++) {
                keys = arr[i];
                if (keys.name === timePeriodVal) {
                  timeInterval = keys.interval;
                  break;
                }
              }
              binSize = timeInterval * Number(timePeriodMultiplierVal);
              model
                .lock()
                .prop('bin-size-ext', binSize)
                .unlock();
              aggregation.binSize = binSize;
            }

            if (validMethod) {
              model
                .lock()
                .prop('aggregation-fn-ext', config.avlAggMethods[aggMethod])
                .unlock();
              aggregation.aggregationMethod = aggMethod;
            }
            applyButton.setState('disabled');
            resetButton.removeState('disabled');
          }
        } else {
          timePeriodVal = timePeriodSelectMenu.value();
          timePeriodMultiplierVal = timeMulSelectMenu.value();
          aggMethod = aggMethodSelectMenu.value();
          arr = config.avlTimePeriods;
          for (i = 0, len = arr.length; i < len; i++) {
            keys = arr[i];
            if (keys.name === timePeriodVal) {
              timeInterval = keys.interval;
              break;
            }
          }
          binSize = timeInterval * Number(timePeriodMultiplierVal);
          model
            .lock()
            .prop('bin-size-ext', binSize)
            .prop('aggregation-fn-ext', config.avlAggMethods[aggMethod])
            .unlock();
          aggregation.binSize = binSize;
          aggregation.aggregationMethod = aggMethod;
          applyButton.setState('disabled');
          resetButton.removeState('disabled');
        }
      } else {
        canvas.resetAggregation();
        aggregation.binSize = null;
        aggregation.aggregationMethod = null;
        resetButton.setState('disabled');
      }
    }

    /**
     * Compute and populate toolboxes with valid values on change in range of visual window
     * @private
     */
    rangeOnChange () {
      var self = this,
        config = self.config,
        toolboxCompConfig = config.toolboxComponent.config,
        timePeriodSelectMenu = toolboxCompConfig.timePeriodSelectMenu,
        timeMulSelectMenu = toolboxCompConfig.timeMulSelectMenu,
        aggMethodSelectMenu = toolboxCompConfig.aggMethodSelectMenu,
        applyButton = toolboxCompConfig.applyButton,
        resetButton = toolboxCompConfig.resetButton,
        model = config.composition.reactiveModel,

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

        aggregation = self.aggregation,
        currentAggregationObj,
        timePeriod,
        timePeriodMultiplier,
        aggregationMethod,
        i,
        len,
        arr;

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

      applyButton.setState('disabled');

      if (aggregation.binSize !== model.prop('bin-size') &&
        (aggregationMethod.value === config.defaultAggMethod || !aggregationMethod.value)) {
        aggregation.binSize = null;
        aggregation.aggregationMethod = null;
        resetButton.setState('disabled');
      } else {
        resetButton.removeState('disabled');
      }

      for (i = 0, len = validTimePeriod.length; i < len; i++) {
        timePeriodVal = validTimePeriod[i];
        timePeriodSelectMenuOpt.push({
          name: capitalize(timePeriodVal),
          value: timePeriodVal
        });
      }

      timePeriodSelectMenu.updateList(timePeriodSelectMenuOpt);
      timePeriod ? timePeriodSelectMenu.value(timePeriod) : timePeriodSelectMenu.setPlaceHolderValue('');

      indexOfTimeUnit = validTimePeriod.indexOf(timePeriod);

      if (indexOfTimeUnit >= 0) {
        arr = validTimePeriodMultiplier[indexOfTimeUnit];
        for (i = 0, len = arr.length; i < len; i++) {
          multiplierVal = arr[i];
          timeMulSelectMenuOpt.push({
            name: multiplierVal.toString(),
            value: multiplierVal.toString()
          });
        }
      }

      timeMulSelectMenu.updateList(timeMulSelectMenuOpt);
      timePeriodMultiplier ? timeMulSelectMenu.value(timePeriodMultiplier.toString())
        : timeMulSelectMenu.setPlaceHolderValue('');

      for (aggVal in avlAggMethods) {
        aggMethodSelectMenuOpt.push({
          name: capitalize(avlAggMethods[aggVal].formalName),
          value: avlAggMethods[aggVal].nickName
        });
      }

      aggMethodSelectMenu.updateList(aggMethodSelectMenuOpt);
      aggregationMethod.value ? aggMethodSelectMenu.value(aggregationMethod.value)
        : aggMethodSelectMenu.setPlaceHolderValue('');
      config.execute = true;
    }

    draw (x, y, width, height, group) {
      var self = this,
        config = self.config,
        measurement = self.measurement,
        toolbars = self.toolbars,
        ln,
        i,
        toolbar,
        dataAgg = config.dataAgg;

      self.getAvailablelAggreagation();

      x = x === undefined ? measurement.x : x;
      y = y === undefined ? measurement.y : y;
      width = width === undefined ? measurement.width : width;
      height = height === undefined ? measurement.height : height;
      group = group === undefined ? self.parentGroup : group;
      if (width && height) {
        for (i = 0, ln = toolbars.length; i < ln; i++) {
          toolbar = toolbars[i];
          toolbar.draw(x, y, group);
        }

        config.defaultAggMethod = dataAgg.getDefaultAggregationMethod().nickName;
        !config.drawn && self.apply(1);
        self.rangeOnChange();
        config.drawn = true;
      }
    }

    dispose () {
      // dispose extension
    }
  }
  return Aggregator;
};
