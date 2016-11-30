/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var AggregatorGetter = __webpack_require__(2);
	
	;(function (env, factory) {
	  if (( false ? 'undefined' : _typeof(module)) === 'object' && module.exports) {
	    module.exports = env.document ? factory(env) : function (win) {
	      if (!win.document) {
	        throw new Error('Window with document not present');
	      }
	      return factory(win, true);
	    };
	  } else {
	    env.Aggregator = factory(env, true);
	  }
	})(typeof window !== 'undefined' ? window : undefined, function (_window, windowExists) {
	  var FC = _window.FusionCharts;
	
	  FC.register('extension', ['private', 'data-aggregator', function () {
	    FC.registerComponent('extensions', 'data-aggregator', AggregatorGetter({ FC: FC }));
	  }]);
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	module.exports = function (dep) {
	  /**
	   * Class representing the Data Aggregator.
	   */
	  var Aggregator = function () {
	    /**
	     * Create a Aggregator.
	     * @typedef {object} Aggregator.aggregation
	     * @property {string} binSize - The binSize applied to aggregate.
	     * @property {string} aggregationMethod - The method applied to aggregate.
	     */
	    function Aggregator() {
	      _classCallCheck(this, Aggregator);
	
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
	
	
	    _createClass(Aggregator, [{
	      key: 'getAvailablelAggreagation',
	
	
	      /**
	       * Sets available aggregation options in configuration of extension
	       * @private
	       */
	      value: function getAvailablelAggreagation() {
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
	
	    }, {
	      key: 'getValidAggregation',
	      value: function getValidAggregation() {
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
	            multipliersArr,
	            currentTimeLength,
	            timePeriod,
	            time,
	            binSize,
	            multiplier,
	            minBinSize;
	
	        config.currentTimeLength = tsObject.globalReactiveModel.model['x-axis-visible-range-end'] - tsObject.globalReactiveModel.model['x-axis-visible-range-start'];
	
	        avlTimePeriods = config.avlTimePeriods;
	        avlTimeMultiplier = config.avlTimeMultiplier;
	        currentTimeLength = config.currentTimeLength;
	
	        config.minBinSize = minBinSize = currentTimeLength / maxNumOfPlot;
	
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
	
	            if (binSize >= minBinSize) {
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
	
	    }, {
	      key: 'getCurrentAggreation',
	      value: function getCurrentAggreation() {
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
	    }, {
	      key: 'init',
	      value: function init(require) {
	        var self = this,
	            config = self.config,
	            toolboxComponent = config.toolboxComponent = {},
	            api,
	            store,
	            composition,
	            saveTo = 'tsObject',
	            requiredParams = ['graphics', 'globalReactiveModel', 'chart', 'spaceManagerInstance', 'chartInstance', 'smartLabel', function acquire() {
	          var i = 0,
	              ii = requiredParams.length - 1,
	              param = '';
	          self[saveTo] = self[saveTo] || {};
	          self.requiredParams = {};
	          for (i = 0; i < ii; ++i) {
	            param = requiredParams[i];
	            self[saveTo][param] = arguments[i];
	          }
	        }];
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
	
	      /**
	       * Create toolbar components
	       * @private
	       */
	
	    }, {
	      key: 'createToolbar',
	      value: function createToolbar() {
	        var self = this,
	            group1,
	            group2,
	            group3,
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
	
	        /**
	         * Apply or Reset Aggregation applied through extension in timeseries
	         * @param {number} set - Flag to set or reset. '1' to set, '0' to reset
	         * @private
	         */
	        apply = function apply(set) {
	          var model = config.composition.reactiveModel,
	              timePeriodVal = timePeriodSelectMenu.value(),
	              timePeriodMultiplierVal = timeMulSelectMenu.value(),
	              aggMethodSelectMenuVal = aggMethodSelectMenu.value(),
	              keys,
	              binSize,
	              timeInterval,
	              aggregation = self.aggregation,
	              canvas = config.composition.impl;
	
	          var _iteratorNormalCompletion = true;
	          var _didIteratorError = false;
	          var _iteratorError = undefined;
	
	          try {
	            for (var _iterator = config.avlTimePeriods[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	              keys = _step.value;
	
	              if (keys.name === timePeriodVal) {
	                timeInterval = keys.interval;
	                break;
	              }
	            }
	          } catch (err) {
	            _didIteratorError = true;
	            _iteratorError = err;
	          } finally {
	            try {
	              if (!_iteratorNormalCompletion && _iterator.return) {
	                _iterator.return();
	              }
	            } finally {
	              if (_didIteratorError) {
	                throw _iteratorError;
	              }
	            }
	          }
	
	          binSize = timeInterval * Number(timePeriodMultiplierVal);
	          if (set && isFinite(model.prop('bin-size'))) {
	            model.lock().prop('bin-size-ext', binSize).prop('aggregation-fn-ext', config.avlAggMethods[aggMethodSelectMenuVal]).unlock();
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
	
	
	        /**
	         * Sets valid time multiplier on time period change from extension toolbox
	         * @private
	         */
	        timePeriodOnChange = function timePeriodOnChange() {
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
	          var _iteratorNormalCompletion2 = true;
	          var _didIteratorError2 = false;
	          var _iteratorError2 = undefined;
	
	          try {
	            for (var _iterator2 = validTimePeriodMultiplier[indexOfTimeUnit][Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	              multiplierVal = _step2.value;
	
	              timeMulSelectMenuOpt.push({
	                name: multiplierVal.toString(),
	                value: multiplierVal.toString()
	              });
	            }
	          } catch (err) {
	            _didIteratorError2 = true;
	            _iteratorError2 = err;
	          } finally {
	            try {
	              if (!_iteratorNormalCompletion2 && _iterator2.return) {
	                _iterator2.return();
	              }
	            } finally {
	              if (_didIteratorError2) {
	                throw _iteratorError2;
	              }
	            }
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
	        onChange = function onChange(type) {
	          var currentAgg = self.getCurrentAggreation();
	
	          if (currentAgg.timePeriodMultiplier.toString() !== timeMulSelectMenu.value() || currentAgg.timePeriod !== timePeriodSelectMenu.value() || currentAgg.aggregationMethod.value !== aggMethodSelectMenu.value()) {
	            applyButton.updateVisual('enabled');
	          } else {
	            applyButton.updateVisual('disabled');
	          }
	        };
	
	        group1 = new ComponentGroup(dependencies);
	        group2 = new ComponentGroup(dependencies);
	        group3 = new ComponentGroup(dependencies);
	
	        toolbar = new HorizontalToolbar(dependencies);
	
	        config.usrConfig = {
	          enabled: true,
	          posWrtCanvas: 'top',
	          alignment: 'left',
	          orientation: 'horizontal',
	          styles: {
	            timeMultiplierInputField: {
	              active: {
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
	              inactive: {
	                'fill': '#fff',
	                'stroke-width': 1,
	                'stroke': 'rgb(192, 192, 192)',
	                'labelFill': '#000'
	              }
	            },
	            timePeriodInputField: {
	              active: {
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
	              inactive: {
	                'fill': '#fff',
	                'stroke-width': 1,
	                'stroke': 'rgb(192, 192, 192)',
	                'labelFill': '#000'
	              }
	            },
	            aggregationMethodInputField: {
	              active: {
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
	              inactive: {
	                'fill': '#fff',
	                'stroke-width': 1,
	                'stroke': 'rgb(192, 192, 192)',
	                'labelFill': '#000'
	              }
	            },
	            dropDown: {
	              active: {
	                'fill': '#898b8b',
	                'labelFill': '#fff'
	              },
	              normal: {
	                'fill': '#fff',
	                'labelFill': '#000',
	                'hoverFill': '#e6e8e8',
	                'hoverLabelFill': '#000'
	              }
	            },
	            applyButton: {
	              active: {
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
	              inactive: {
	                'fill': '#bebebe',
	                'stroke-width': 1,
	                'stroke': 'rgb(192, 192, 192)',
	                'labelFill': '#f3f3f3'
	              }
	            },
	            resetButton: {
	              active: {
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
	              inactive: {
	                'fill': '#bebebe',
	                'stroke-width': 1,
	                'stroke': 'rgb(192, 192, 192)',
	                'labelFill': '#f3f3f3'
	              }
	            },
	            base: {
	              font: {
	                'fontSize': 11
	                // 'fontWeight': 'bold',
	                // 'fontFamily': 'sans-serif',
	                // 'fontStyle': 'italic'
	              }
	            }
	          }
	        };
	
	        style = config.usrConfig.styles || {};
	
	        style = {
	          timeMultiplierInputField: {
	            active: style.timeMultiplierInputField && style.timeMultiplierInputField.active || {},
	            inactive: style.timeMultiplierInputField && style.timeMultiplierInputField.inactive || {}
	          },
	          timePeriodInputField: {
	            active: style.timePeriodInputField && style.timePeriodInputField.active || {},
	            inactive: style.timePeriodInputField && style.timePeriodInputField.inactive || {}
	          },
	          aggregationMethodInputField: {
	            active: style.aggregationMethodInputField && style.aggregationMethodInputField.active || {},
	            inactive: style.aggregationMethodInputField && style.aggregationMethodInputField.inactive || {}
	          },
	          dropDown: {
	            active: style.dropDown && style.dropDown.active || {},
	            normal: style.dropDown && style.dropDown.normal || {}
	          },
	          applyButton: {
	            active: style.applyButton && style.applyButton.active || {},
	            inactive: style.applyButton && style.applyButton.inactive || {}
	          },
	          resetButton: {
	            active: style.resetButton && style.resetButton.active || {},
	            inactive: style.resetButton && style.resetButton.inactive || {}
	          },
	          base: {
	            font: style.base && style.base.font || {}
	          }
	        };
	
	        group1.setConfig({
	          fill: '#fff',
	          borderThickness: 0
	        });
	        group2.setConfig({
	          fill: '#fff',
	          borderThickness: 0
	        });
	        group3.setConfig({
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
	              disabled: style.timeMultiplierInputField.inactive
	            }
	          }
	        };
	
	        timeMultiplierMenuDisableConfig = {
	          disabled: {
	            config: {
	              disabled: style.timePeriodInputField.inactive
	            }
	          }
	        };
	
	        aggMethodMenuDisableonfig = {
	          disabled: {
	            config: {
	              disabled: style.aggregationMethodInputField.inactive
	            }
	          }
	        };
	
	        applyButtonDisableConfig = {
	          disabled: {
	            config: {
	              disabled: style.applyButton.inactive
	            }
	          }
	        };
	
	        resetButtonDisableConfig = {
	          disabled: {
	            config: {
	              disabled: style.resetButton.inactive
	            }
	          }
	        };
	
	        dropDownMenuStyle = {
	          selected: {
	            container: {
	              style: {
	                fill: style.dropDown.active.fill
	              }
	            },
	            text: {
	              style: {
	                fill: style.dropDown.active.labelFill
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
	                fill: style.dropDown.normal.hoverFill
	              }
	            },
	            text: {
	              style: {
	                fill: style.dropDown.normal.hoverLabelFill
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
	
	        toolboxCompConfig.timePeriodSelectMenu = timePeriodSelectMenu = new toolbox.SelectSymbol({}, dependencies, [], Object.assign(style.timePeriodInputField.active, {
	          btnTextStyle: style.base.font,
	          dropDownMenu: dropDownMenuStyle
	        }));
	        timePeriodSelectMenu.setStateConfig(timePeriodMenuDisableConfig);
	
	        toolboxCompConfig.timeMulSelectMenu = timeMulSelectMenu = new toolbox.SelectSymbol({}, dependencies, [], Object.assign(style.timeMultiplierInputField.active, {
	          btnTextStyle: style.base.font,
	          dropDownMenu: dropDownMenuStyle
	        }));
	        timeMulSelectMenu.setStateConfig(timeMultiplierMenuDisableConfig);
	
	        toolboxCompConfig.aggMethodSelectMenu = aggMethodSelectMenu = new toolbox.SelectSymbol({}, dependencies, [], Object.assign(style.aggregationMethodInputField.active, {
	          btnTextStyle: style.base.font,
	          dropDownMenu: dropDownMenuStyle
	        }));
	        aggMethodSelectMenu.setStateConfig(aggMethodMenuDisableonfig);
	
	        toolboxCompConfig.applyButton = applyButton = new toolbox.Symbol('APPLY', true, dependencies, Object.assign(style.applyButton.active, {
	          btnTextStyle: style.base.font
	        })).attachEventHandlers({
	          click: function click() {
	            apply(1);
	          }
	        });
	        applyButton.setStateConfig(applyButtonDisableConfig);
	
	        toolboxCompConfig.resetButton = resetButton = new toolbox.Symbol('RESET', true, dependencies, Object.assign(style.resetButton.active, {
	          btnTextStyle: style.base.font
	        })).attachEventHandlers({
	          click: function click() {
	            apply(0);
	          }
	        });
	        resetButton.setStateConfig(resetButtonDisableConfig);
	
	        group1.addSymbol(label);
	        group2.addSymbol(timeMulSelectMenu);
	        group2.addSymbol(timePeriodSelectMenu);
	        group2.addSymbol(aggMethodSelectMenu);
	        group3.addSymbol(applyButton);
	        group3.addSymbol(resetButton);
	
	        SymbolStore.register('textBoxIcon', function (x, y, rad, w, h, padX, padY) {
	          var x1 = x - w / 2 + padX / 2,
	              x2 = x + w / 2 - padX / 2,
	              y1 = y - h / 2 + padY / 2,
	              y2 = y + h / 2 - padY / 2;
	
	          return ['M', x1, y1, 'L', x2, y1, 'L', x2, y2, 'L', x1, y2, 'Z'];
	        });
	
	        timePeriodSelectMenu.attachEventHandlers({
	          textOnChange: function textOnChange() {
	            timePeriodOnChange();
	            onChange();
	          }
	        });
	
	        timeMulSelectMenu.attachEventHandlers({
	          textOnChange: function textOnChange() {
	            onChange();
	          }
	        });
	
	        aggMethodSelectMenu.attachEventHandlers({
	          textOnChange: function textOnChange() {
	            onChange();
	          }
	        });
	
	        toolbar.addComponent(group1);
	        toolbar.addComponent(group2);
	        toolbar.addComponent(group3);
	
	        return toolbar;
	      }
	    }, {
	      key: 'getLogicalSpace',
	      value: function getLogicalSpace(availableWidth, availableHeight) {
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
	    }, {
	      key: 'placeInCanvas',
	      value: function placeInCanvas(containerInstance) {
	        var _self = this,
	            tsObject = _self.tsObject;
	
	        _self.padding = 5;
	        tsObject.spaceManagerInstance.add([{
	          name: function name() {
	            return 'data-aggregator';
	          },
	          ref: function ref(obj) {
	            return obj['0'];
	          },
	          self: function self() {
	            return _self;
	          },
	          priority: function priority() {
	            return 2;
	          },
	          layout: function layout(obj) {
	            return obj.inline;
	          },
	          orientation: [{
	            type: function type(obj) {
	              return obj.horizontal;
	            },
	            position: [{
	              type: function type(obj) {
	                return obj.top;
	              },
	              alignment: [{
	                type: function type(obj) {
	                  return obj.left;
	                },
	                dimensions: [function () {
	                  var parent = this.getParentComponentGroup();
	                  return _self.getLogicalSpace(parent.getWidth(), parent.getHeight());
	                }]
	              }]
	            }]
	          }]
	        }]);
	      }
	    }, {
	      key: 'setDrawingConfiguration',
	      value: function setDrawingConfiguration(x, y, width, height, group) {
	        var mes = this.measurement;
	        mes.x = x;
	        mes.y = y;
	        mes.width = width;
	        mes.height = height;
	
	        this.parentGroup = group;
	
	        return this;
	      }
	    }, {
	      key: 'draw',
	      value: function draw(x, y, width, height, group) {
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
	
	
	        /**
	         * Compute and populate toolboxes with valid values on change in range of visual window
	         * @private
	         */
	        rangeOnChange = function rangeOnChange() {
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
	
	          if (aggregation.binSize !== model.prop('bin-size') && aggregationMethod.value === config.defaultAggMethod) {
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
	
	          var _iteratorNormalCompletion3 = true;
	          var _didIteratorError3 = false;
	          var _iteratorError3 = undefined;
	
	          try {
	            for (var _iterator3 = validTimePeriod[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	              timePeriodVal = _step3.value;
	
	              timePeriodSelectMenuOpt.push({
	                name: timePeriodVal,
	                value: timePeriodVal
	              });
	            }
	          } catch (err) {
	            _didIteratorError3 = true;
	            _iteratorError3 = err;
	          } finally {
	            try {
	              if (!_iteratorNormalCompletion3 && _iterator3.return) {
	                _iterator3.return();
	              }
	            } finally {
	              if (_didIteratorError3) {
	                throw _iteratorError3;
	              }
	            }
	          }
	
	          timePeriodSelectMenu.updateList(timePeriodSelectMenuOpt);
	          timePeriodSelectMenu.value(timePeriod);
	
	          indexOfTimeUnit = validTimePeriod.indexOf(timePeriod);
	
	          if (indexOfTimeUnit >= 0) {
	            var _iteratorNormalCompletion4 = true;
	            var _didIteratorError4 = false;
	            var _iteratorError4 = undefined;
	
	            try {
	              for (var _iterator4 = validTimePeriodMultiplier[indexOfTimeUnit][Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
	                multiplierVal = _step4.value;
	
	                timeMulSelectMenuOpt.push({
	                  name: multiplierVal.toString(),
	                  value: multiplierVal.toString()
	                });
	              }
	            } catch (err) {
	              _didIteratorError4 = true;
	              _iteratorError4 = err;
	            } finally {
	              try {
	                if (!_iteratorNormalCompletion4 && _iterator4.return) {
	                  _iterator4.return();
	                }
	              } finally {
	                if (_didIteratorError4) {
	                  throw _iteratorError4;
	                }
	              }
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
	            toolbar.draw(x, y, group);
	          }
	        }
	        rangeOnChange();
	        applyButton.updateVisual('disabled');
	        resetButton.updateVisual('disabled');
	        config.defaultAggMethod = dataAgg.getDefaultAggregationMethod().nickName;
	
	        model.onPropsChange(['bin-size', 'aggregation-fn'], rangeOnChange);
	      }
	    }, {
	      key: 'dispose',
	      value: function dispose() {
	        // dispose extension
	      }
	    }, {
	      key: 'aggregation',
	      get: function get() {
	        return this.appliedAggregation;
	      },
	      set: function set(obj) {
	        this.appliedAggregation.timePeriod = obj.timePeriod;
	        this.appliedAggregation.timePeriodMultiplier = obj.timePeriodMultiplier;
	        this.appliedAggregation.aggregationMethod = obj.aggregationMethod;
	      }
	    }]);
	
	    return Aggregator;
	  }();
	
	  return Aggregator;
	};

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMGNhYWViOGY4OGFhY2QwZGVjZDEiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8od2VicGFjaykvYnVpbGRpbi9tb2R1bGUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2ZjdHMtZXh0LWFnZ3JlZ2F0b3IuanMiXSwibmFtZXMiOlsiQWdncmVnYXRvckdldHRlciIsInJlcXVpcmUiLCJlbnYiLCJmYWN0b3J5IiwibW9kdWxlIiwiZXhwb3J0cyIsImRvY3VtZW50Iiwid2luIiwiRXJyb3IiLCJBZ2dyZWdhdG9yIiwid2luZG93IiwiX3dpbmRvdyIsIndpbmRvd0V4aXN0cyIsIkZDIiwiRnVzaW9uQ2hhcnRzIiwicmVnaXN0ZXIiLCJyZWdpc3RlckNvbXBvbmVudCIsImRlcCIsImFwcGxpZWRBZ2dyZWdhdGlvbiIsImJpblNpemUiLCJhZ2dyZWdhdGlvbk1ldGhvZCIsImNvbmZpZyIsImRhdGFBZ2ciLCJhdmxUaW1lUGVyaW9kcyIsImdldEFnZ3JlZ2F0aW9uVGltZVJ1bGVzIiwiaSIsImxlbiIsImF2bFRpbWVNdWx0aXBsaWVyIiwibGVuZ3RoIiwicHVzaCIsInBvc3NpYmxlRmFjdG9ycyIsInNlbGYiLCJ0c09iamVjdCIsImoiLCJsZW4xIiwibGVuMiIsIm1heE51bU9mUGxvdCIsImNvbXBvc2l0aW9uIiwicmVhY3RpdmVNb2RlbCIsIm1vZGVsIiwibXVsdGlwbGllcnNBcnIiLCJjdXJyZW50VGltZUxlbmd0aCIsInRpbWVQZXJpb2QiLCJ0aW1lIiwibXVsdGlwbGllciIsIm1pbkJpblNpemUiLCJnbG9iYWxSZWFjdGl2ZU1vZGVsIiwidmFsaWRUaW1lUGVyaW9kIiwidmFsaWRUaW1lUGVyaW9kTXVsdGlwbGllciIsImF2bEFnZ01ldGhvZHMiLCJnZXRBbGxBZ2dyZWdhdGlvbk1ldGhvZCIsIm5hbWUiLCJpbnRlcnZhbCIsImN1cnJlbnRBZ2dNZXRob2QiLCJzdWl0YWJsZUludGVydmFsIiwicHJvcCIsImlzRmluaXRlIiwiY2FuQWdncmVnYXRlIiwidGltZVJ1bGVzIiwiZ2V0U3VpdGFibGVJbnRlcnZhbCIsInN0ZXAiLCJmb3JtYWxOYW1lIiwibmlja05hbWUiLCJ0aW1lUGVyaW9kTXVsdGlwbGllciIsInZhbHVlIiwidGV4dCIsInRvb2xib3hDb21wb25lbnQiLCJhcGkiLCJzdG9yZSIsInNhdmVUbyIsInJlcXVpcmVkUGFyYW1zIiwiYWNxdWlyZSIsImlpIiwicGFyYW0iLCJhcmd1bWVudHMiLCJjaGFydEluc3RhbmNlIiwiYXBpSW5zdGFuY2UiLCJnZXRDb21wb25lbnRTdG9yZSIsImdldENhbnZhc0J5SW5kZXgiLCJpbXBsIiwiZ2V0RGF0YUFnZ3JlZ2F0b3IiLCJ0b29sYm94IiwiZ2V0Q29tcG9uZW50IiwidG9vbGJhcnMiLCJtZWFzdXJlbWVudCIsImNyZWF0ZVRvb2xiYXIiLCJncm91cDEiLCJncm91cDIiLCJncm91cDMiLCJ0b29sYmFyIiwidGltZU11bFNlbGVjdE1lbnUiLCJ0aW1lUGVyaW9kU2VsZWN0TWVudSIsImFnZ01ldGhvZFNlbGVjdE1lbnUiLCJyZXNldEJ1dHRvbiIsImFwcGx5QnV0dG9uIiwibGFiZWwiLCJ0b29sYm94Q29tcENvbmZpZyIsIkhvcml6b250YWxUb29sYmFyIiwiQ29tcG9uZW50R3JvdXAiLCJTeW1ib2xTdG9yZSIsImdyYXBoaWNzIiwicGFwZXIiLCJjb250YWluZXIiLCJjaGFydCIsInNtYXJ0TGFiZWwiLCJtdWx0aXBsaWVyVmFsIiwidGltZU11bFNlbGVjdE1lbnVPcHQiLCJ0aW1lUGVyaW9kTWVudURpc2FibGVDb25maWciLCJ0aW1lTXVsdGlwbGllck1lbnVEaXNhYmxlQ29uZmlnIiwiYWdnTWV0aG9kTWVudURpc2FibGVvbmZpZyIsImRyb3BEb3duTWVudVN0eWxlIiwiYXBwbHlCdXR0b25EaXNhYmxlQ29uZmlnIiwicmVzZXRCdXR0b25EaXNhYmxlQ29uZmlnIiwic3R5bGUiLCJkZXBlbmRlbmNpZXMiLCJjaGFydENvbnRhaW5lciIsImFwcGx5Iiwic2V0IiwidGltZVBlcmlvZFZhbCIsInRpbWVQZXJpb2RNdWx0aXBsaWVyVmFsIiwiYWdnTWV0aG9kU2VsZWN0TWVudVZhbCIsImtleXMiLCJ0aW1lSW50ZXJ2YWwiLCJhZ2dyZWdhdGlvbiIsImNhbnZhcyIsIk51bWJlciIsImxvY2siLCJ1bmxvY2siLCJ1cGRhdGVWaXN1YWwiLCJyZXNldEFnZ3JlZ2F0aW9uIiwidGltZVBlcmlvZE9uQ2hhbmdlIiwicHJldlRpbWVQZXJvaWRNdWxWYWwiLCJpbmRleE9mVGltZVVuaXQiLCJpbmRleE9mVGltZU11bCIsImluZGV4T2YiLCJ0b1N0cmluZyIsInVwZGF0ZUxpc3QiLCJvbkNoYW5nZSIsInR5cGUiLCJjdXJyZW50QWdnIiwiZ2V0Q3VycmVudEFnZ3JlYXRpb24iLCJ1c3JDb25maWciLCJlbmFibGVkIiwicG9zV3J0Q2FudmFzIiwiYWxpZ25tZW50Iiwib3JpZW50YXRpb24iLCJzdHlsZXMiLCJ0aW1lTXVsdGlwbGllcklucHV0RmllbGQiLCJhY3RpdmUiLCJpbmFjdGl2ZSIsInRpbWVQZXJpb2RJbnB1dEZpZWxkIiwiYWdncmVnYXRpb25NZXRob2RJbnB1dEZpZWxkIiwiZHJvcERvd24iLCJub3JtYWwiLCJiYXNlIiwiZm9udCIsInNldENvbmZpZyIsImZpbGwiLCJib3JkZXJUaGlja25lc3MiLCJkaXNhYmxlZCIsInNlbGVjdGVkIiwibGFiZWxGaWxsIiwiaG92ZXIiLCJob3ZlckZpbGwiLCJob3ZlckxhYmVsRmlsbCIsIkxhYmVsIiwiU2VsZWN0U3ltYm9sIiwiT2JqZWN0IiwiYXNzaWduIiwiYnRuVGV4dFN0eWxlIiwiZHJvcERvd25NZW51Iiwic2V0U3RhdGVDb25maWciLCJTeW1ib2wiLCJhdHRhY2hFdmVudEhhbmRsZXJzIiwiY2xpY2siLCJhZGRTeW1ib2wiLCJ4IiwieSIsInJhZCIsInciLCJoIiwicGFkWCIsInBhZFkiLCJ4MSIsIngyIiwieTEiLCJ5MiIsInRleHRPbkNoYW5nZSIsImFkZENvbXBvbmVudCIsImF2YWlsYWJsZVdpZHRoIiwiYXZhaWxhYmxlSGVpZ2h0IiwibG9naWNhbFNwYWNlIiwid2lkdGgiLCJoZWlnaHQiLCJsbiIsImdldExvZ2ljYWxTcGFjZSIsIk1hdGgiLCJtYXgiLCJwYWRkaW5nIiwiY29udGFpbmVySW5zdGFuY2UiLCJzcGFjZU1hbmFnZXJJbnN0YW5jZSIsImFkZCIsInJlZiIsIm9iaiIsInByaW9yaXR5IiwibGF5b3V0IiwiaW5saW5lIiwiaG9yaXpvbnRhbCIsInBvc2l0aW9uIiwidG9wIiwibGVmdCIsImRpbWVuc2lvbnMiLCJwYXJlbnQiLCJnZXRQYXJlbnRDb21wb25lbnRHcm91cCIsImdldFdpZHRoIiwiZ2V0SGVpZ2h0IiwiZ3JvdXAiLCJtZXMiLCJwYXJlbnRHcm91cCIsInRpbWVQZXJpb2RTZWxlY3RNZW51T3B0IiwiYWdnVmFsIiwiYWdnTWV0aG9kU2VsZWN0TWVudU9wdCIsInJhbmdlT25DaGFuZ2UiLCJjdXJyZW50QWdncmVnYXRpb25PYmoiLCJnZXRWYWxpZEFnZ3JlZ2F0aW9uIiwiZGVmYXVsdEFnZ01ldGhvZCIsImdldEF2YWlsYWJsZWxBZ2dyZWFnYXRpb24iLCJ1bmRlZmluZWQiLCJkcmF3IiwiZ2V0RGVmYXVsdEFnZ3JlZ2F0aW9uTWV0aG9kIiwib25Qcm9wc0NoYW5nZSJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUN0Q0E7Ozs7QUFDQSxLQUFNQSxtQkFBbUIsbUJBQUFDLENBQVEsQ0FBUixDQUF6Qjs7QUFFQSxFQUFDLENBQUMsVUFBVUMsR0FBVixFQUFlQyxPQUFmLEVBQXdCO0FBQ3hCLE9BQUksZ0NBQU9DLE1BQVAsT0FBa0IsUUFBbEIsSUFBOEJBLE9BQU9DLE9BQXpDLEVBQWtEO0FB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QUFsQzJCOztBQUFBO0FBQUE7O0FBaTVCOUIsVUFBT1gsVUFBUDtBQUNELEVBbDVCRCxDIiwiZmlsZSI6ImZjdHMtZXh0LWRhdGFhZ2dyZWdhdG9yLWVzNS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDBjYWFlYjhmODhhYWNkMGRlY2QxIiwiJ3VzZSBzdHJpY3QnO1xuY29uc3QgQWdncmVnYXRvckdldHRlciA9IHJlcXVpcmUoJy4vZmN0cy1leHQtYWdncmVnYXRvcicpO1xuXG47KGZ1bmN0aW9uIChlbnYsIGZhY3RvcnkpIHtcbiAgaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBlbnYuZG9jdW1lbnRcbiAgICAgICA/IGZhY3RvcnkoZW52KSA6IGZ1bmN0aW9uICh3aW4pIHtcbiAgICAgICAgIGlmICghd2luLmRvY3VtZW50KSB7XG4gICAgICAgICAgIHRocm93IG5ldyBFcnJvcignV2luZG93IHdpdGggZG9jdW1lbnQgbm90IHByZXNlbnQnKTtcbiAgICAgICAgIH1cbiAgICAgICAgIHJldHVybiBmYWN0b3J5KHdpbiwgdHJ1ZSk7XG4gICAgICAgfTtcbiAgfSBlbHNlIHtcbiAgICBlbnYuQWdncmVnYXRvciA9IGZhY3RvcnkoZW52LCB0cnVlKTtcbiAgfVxufSkodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cgOiB0aGlzLCBmdW5jdGlvbiAoX3dpbmRvdywgd2luZG93RXhpc3RzKSB7XG4gIHZhciBGQyA9IF93aW5kb3cuRnVzaW9uQ2hhcnRzO1xuXG4gIEZDLnJlZ2lzdGVyKCdleHRlbnNpb24nLCBbJ3ByaXZhdGUnLCAnZGF0YS1hZ2dyZWdhdG9yJywgZnVuY3Rpb24gKCkge1xuICAgIEZDLnJlZ2lzdGVyQ29tcG9uZW50KCdleHRlbnNpb25zJywgJ2RhdGEtYWdncmVnYXRvcicsIEFnZ3JlZ2F0b3JHZXR0ZXIoe0ZDOiBGQ30pKTtcbiAgfV0pO1xufSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvaW5kZXguanMiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuXHRpZighbW9kdWxlLndlYnBhY2tQb2x5ZmlsbCkge1xuXHRcdG1vZHVsZS5kZXByZWNhdGUgPSBmdW5jdGlvbigpIHt9O1xuXHRcdG1vZHVsZS5wYXRocyA9IFtdO1xuXHRcdC8vIG1vZHVsZS5wYXJlbnQgPSB1bmRlZmluZWQgYnkgZGVmYXVsdFxuXHRcdG1vZHVsZS5jaGlsZHJlbiA9IFtdO1xuXHRcdG1vZHVsZS53ZWJwYWNrUG9seWZpbGwgPSAxO1xuXHR9XG5cdHJldHVybiBtb2R1bGU7XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAod2VicGFjaykvYnVpbGRpbi9tb2R1bGUuanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChkZXApIHtcbiAgLyoqXG4gICAqIENsYXNzIHJlcHJlc2VudGluZyB0aGUgRGF0YSBBZ2dyZWdhdG9yLlxuICAgKi9cbiAgY2xhc3MgQWdncmVnYXRvciB7XG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgQWdncmVnYXRvci5cbiAgICAgKiBAdHlwZWRlZiB7b2JqZWN0fSBBZ2dyZWdhdG9yLmFnZ3JlZ2F0aW9uXG4gICAgICogQHByb3BlcnR5IHtzdHJpbmd9IGJpblNpemUgLSBUaGUgYmluU2l6ZSBhcHBsaWVkIHRvIGFnZ3JlZ2F0ZS5cbiAgICAgKiBAcHJvcGVydHkge3N0cmluZ30gYWdncmVnYXRpb25NZXRob2QgLSBUaGUgbWV0aG9kIGFwcGxpZWQgdG8gYWdncmVnYXRlLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgIC8qKlxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgICAgdGhpcy5hcHBsaWVkQWdncmVnYXRpb24gPSB7XG4gICAgICAgIGJpblNpemU6IG51bGwsXG4gICAgICAgIGFnZ3JlZ2F0aW9uTWV0aG9kOiBudWxsXG4gICAgICB9O1xuICAgICAgdGhpcy5jb25maWcgPSB7fTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBbiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBiaW5TaXplLCBhZ2dyZWdhdGlvbk1ldGhvZC5cbiAgICAgKiBAdHlwZSB7QWdncmVnYXRvci5hZ2dyZWdhdGlvbn1cbiAgICAgKi9cbiAgICBnZXQgYWdncmVnYXRpb24gKCkge1xuICAgICAgcmV0dXJuIHRoaXMuYXBwbGllZEFnZ3JlZ2F0aW9uO1xuICAgIH1cblxuICAgIHNldCBhZ2dyZWdhdGlvbiAob2JqKSB7XG4gICAgICB0aGlzLmFwcGxpZWRBZ2dyZWdhdGlvbi50aW1lUGVyaW9kID0gb2JqLnRpbWVQZXJpb2Q7XG4gICAgICB0aGlzLmFwcGxpZWRBZ2dyZWdhdGlvbi50aW1lUGVyaW9kTXVsdGlwbGllciA9IG9iai50aW1lUGVyaW9kTXVsdGlwbGllcjtcbiAgICAgIHRoaXMuYXBwbGllZEFnZ3JlZ2F0aW9uLmFnZ3JlZ2F0aW9uTWV0aG9kID0gb2JqLmFnZ3JlZ2F0aW9uTWV0aG9kO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHMgYXZhaWxhYmxlIGFnZ3JlZ2F0aW9uIG9wdGlvbnMgaW4gY29uZmlndXJhdGlvbiBvZiBleHRlbnNpb25cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGdldEF2YWlsYWJsZWxBZ2dyZWFnYXRpb24gKCkge1xuICAgICAgdmFyIGNvbmZpZyA9IHRoaXMuY29uZmlnLFxuICAgICAgICBkYXRhQWdnID0gY29uZmlnLmRhdGFBZ2csXG4gICAgICAgIGF2bFRpbWVQZXJpb2RzID0gY29uZmlnLmF2bFRpbWVQZXJpb2RzID0gZGF0YUFnZy5nZXRBZ2dyZWdhdGlvblRpbWVSdWxlcygpLFxuICAgICAgICBpLFxuICAgICAgICBsZW47XG5cbiAgICAgIGNvbmZpZy5hdmxUaW1lTXVsdGlwbGllciA9IFtdO1xuICAgICAgbGVuID0gYXZsVGltZVBlcmlvZHMubGVuZ3RoO1xuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgY29uZmlnLmF2bFRpbWVNdWx0aXBsaWVyLnB1c2goYXZsVGltZVBlcmlvZHNbaV0ucG9zc2libGVGYWN0b3JzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDYWxjdWxhdGVzIHZhbGlkIGFnZ3JlZ2F0aW9uIHRpbWUgcGVyaW9kcyBhbmQgY29ycmVzcG9uZGluZyBtdWx0aXBsaWVyc1xuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgZ2V0VmFsaWRBZ2dyZWdhdGlvbiAoKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgIGNvbmZpZyA9IHNlbGYuY29uZmlnLFxuICAgICAgICB0c09iamVjdCA9IHNlbGYudHNPYmplY3QsXG4gICAgICAgIGRhdGFBZ2cgPSBjb25maWcuZGF0YUFnZyxcbiAgICAgICAgaSxcbiAgICAgICAgaixcbiAgICAgICAgbGVuMSxcbiAgICAgICAgbGVuMixcbiAgICAgICAgYXZsVGltZVBlcmlvZHMsXG4gICAgICAgIGF2bFRpbWVNdWx0aXBsaWVyLFxuICAgICAgICBtYXhOdW1PZlBsb3QgPSBjb25maWcuY29tcG9zaXRpb24ucmVhY3RpdmVNb2RlbC5tb2RlbFsnbWF4LXBsb3QtcG9pbnQnXSxcbiAgICAgICAgbXVsdGlwbGllcnNBcnIsXG4gICAgICAgIGN1cnJlbnRUaW1lTGVuZ3RoLFxuICAgICAgICB0aW1lUGVyaW9kLFxuICAgICAgICB0aW1lLFxuICAgICAgICBiaW5TaXplLFxuICAgICAgICBtdWx0aXBsaWVyLFxuICAgICAgICBtaW5CaW5TaXplO1xuXG4gICAgICBjb25maWcuY3VycmVudFRpbWVMZW5ndGggPSB0c09iamVjdC5nbG9iYWxSZWFjdGl2ZU1vZGVsLm1vZGVsWyd4LWF4aXMtdmlzaWJsZS1yYW5nZS1lbmQnXSAtXG4gICAgICAgIHRzT2JqZWN0Lmdsb2JhbFJlYWN0aXZlTW9kZWwubW9kZWxbJ3gtYXhpcy12aXNpYmxlLXJhbmdlLXN0YXJ0J107XG5cbiAgICAgIGF2bFRpbWVQZXJpb2RzID0gY29uZmlnLmF2bFRpbWVQZXJpb2RzO1xuICAgICAgYXZsVGltZU11bHRpcGxpZXIgPSBjb25maWcuYXZsVGltZU11bHRpcGxpZXI7XG4gICAgICBjdXJyZW50VGltZUxlbmd0aCA9IGNvbmZpZy5jdXJyZW50VGltZUxlbmd0aDtcblxuICAgICAgY29uZmlnLm1pbkJpblNpemUgPSBtaW5CaW5TaXplID0gY3VycmVudFRpbWVMZW5ndGggLyBtYXhOdW1PZlBsb3Q7XG5cbiAgICAgIGNvbmZpZy52YWxpZFRpbWVQZXJpb2QgPSBbXTtcbiAgICAgIGNvbmZpZy52YWxpZFRpbWVQZXJpb2RNdWx0aXBsaWVyID0gW107XG4gICAgICBjb25maWcuYXZsQWdnTWV0aG9kcyA9IGRhdGFBZ2cuZ2V0QWxsQWdncmVnYXRpb25NZXRob2QoKTtcblxuICAgICAgZm9yIChpID0gMCwgbGVuMSA9IGF2bFRpbWVQZXJpb2RzLmxlbmd0aDsgaSA8IGxlbjE7IGkrKykge1xuICAgICAgICB0aW1lUGVyaW9kID0gYXZsVGltZVBlcmlvZHNbaV0ubmFtZTtcbiAgICAgICAgdGltZSA9IGF2bFRpbWVQZXJpb2RzW2ldLmludGVydmFsO1xuICAgICAgICBtdWx0aXBsaWVyc0FyciA9IFtdO1xuXG4gICAgICAgIGZvciAoaiA9IDAsIGxlbjIgPSBhdmxUaW1lTXVsdGlwbGllcltpXS5sZW5ndGg7IGogPCBsZW4yOyBqKyspIHtcbiAgICAgICAgICBtdWx0aXBsaWVyID0gYXZsVGltZU11bHRpcGxpZXJbaV1bal07XG4gICAgICAgICAgYmluU2l6ZSA9IG11bHRpcGxpZXIgKiB0aW1lO1xuXG4gICAgICAgICAgaWYgKChiaW5TaXplID49IG1pbkJpblNpemUpKSB7XG4gICAgICAgICAgICBtdWx0aXBsaWVyc0Fyci5wdXNoKGF2bFRpbWVNdWx0aXBsaWVyW2ldW2pdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG11bHRpcGxpZXJzQXJyLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBjb25maWcudmFsaWRUaW1lUGVyaW9kTXVsdGlwbGllci5wdXNoKG11bHRpcGxpZXJzQXJyKTtcbiAgICAgICAgICBjb25maWcudmFsaWRUaW1lUGVyaW9kLnB1c2godGltZVBlcmlvZCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGN1cnJlbnQgQWdncmVnYXRpb24gYXBwbGllZCB0byB0aW1lc2VyaWVzXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBnZXRDdXJyZW50QWdncmVhdGlvbiAoKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgIGNvbmZpZyA9IHNlbGYuY29uZmlnLFxuICAgICAgICBkYXRhQWdnID0gY29uZmlnLmRhdGFBZ2csXG4gICAgICAgIGNvbXBvc2l0aW9uID0gY29uZmlnLmNvbXBvc2l0aW9uLFxuICAgICAgICBtb2RlbCA9IGNvbXBvc2l0aW9uLnJlYWN0aXZlTW9kZWwsXG4gICAgICAgIGN1cnJlbnRBZ2dNZXRob2QsXG4gICAgICAgIHN1aXRhYmxlSW50ZXJ2YWwsXG4gICAgICAgIGJpblNpemU7XG5cbiAgICAgIGJpblNpemUgPSBtb2RlbC5wcm9wKCdiaW4tc2l6ZScpIC0gMTtcblxuICAgICAgaWYgKGlzRmluaXRlKGJpblNpemUpKSB7XG4gICAgICAgIGNvbmZpZy5jYW5BZ2dyZWdhdGUgPSB0cnVlO1xuICAgICAgICBzdWl0YWJsZUludGVydmFsID0gZGF0YUFnZy50aW1lUnVsZXMuZ2V0U3VpdGFibGVJbnRlcnZhbChiaW5TaXplKTtcbiAgICAgICAgY3VycmVudEFnZ01ldGhvZCA9IG1vZGVsLnByb3AoJ2FnZ3JlZ2F0aW9uLWZuJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25maWcuY2FuQWdncmVnYXRlID0gZmFsc2U7XG4gICAgICAgIHN1aXRhYmxlSW50ZXJ2YWwgPSB7XG4gICAgICAgICAgbmFtZTogJycsXG4gICAgICAgICAgc3RlcDogJydcbiAgICAgICAgfTtcbiAgICAgICAgY29uZmlnLnZhbGlkVGltZVBlcmlvZCA9IFtzdWl0YWJsZUludGVydmFsLm5hbWVdO1xuICAgICAgICBjb25maWcudmFsaWRUaW1lUGVyaW9kTXVsdGlwbGllciA9IFtbc3VpdGFibGVJbnRlcnZhbC5zdGVwXV07XG4gICAgICAgIGNvbmZpZy5hdmxBZ2dNZXRob2RzID0ge1xuICAgICAgICAgICdpbnZhbGlkJzoge1xuICAgICAgICAgICAgZm9ybWFsTmFtZTogJycsXG4gICAgICAgICAgICBuaWNrTmFtZTogJydcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGN1cnJlbnRBZ2dNZXRob2QgPSBjb25maWcuYXZsQWdnTWV0aG9kc1snaW52YWxpZCddO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICB0aW1lUGVyaW9kOiBzdWl0YWJsZUludGVydmFsLm5hbWUsXG4gICAgICAgIHRpbWVQZXJpb2RNdWx0aXBsaWVyOiBzdWl0YWJsZUludGVydmFsLnN0ZXAsXG4gICAgICAgIGFnZ3JlZ2F0aW9uTWV0aG9kOiB7XG4gICAgICAgICAgdmFsdWU6IGN1cnJlbnRBZ2dNZXRob2Qubmlja05hbWUsXG4gICAgICAgICAgdGV4dDogY3VycmVudEFnZ01ldGhvZC5mb3JtYWxOYW1lXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuXG4gICAgaW5pdCAocmVxdWlyZSkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICBjb25maWcgPSBzZWxmLmNvbmZpZyxcbiAgICAgICAgdG9vbGJveENvbXBvbmVudCA9IGNvbmZpZy50b29sYm94Q29tcG9uZW50ID0ge30sXG4gICAgICAgIGFwaSxcbiAgICAgICAgc3RvcmUsXG4gICAgICAgIGNvbXBvc2l0aW9uLFxuICAgICAgICBzYXZlVG8gPSAndHNPYmplY3QnLFxuICAgICAgICByZXF1aXJlZFBhcmFtcyA9IFtcbiAgICAgICAgICAnZ3JhcGhpY3MnLFxuICAgICAgICAgICdnbG9iYWxSZWFjdGl2ZU1vZGVsJyxcbiAgICAgICAgICAnY2hhcnQnLFxuICAgICAgICAgICdzcGFjZU1hbmFnZXJJbnN0YW5jZScsXG4gICAgICAgICAgJ2NoYXJ0SW5zdGFuY2UnLFxuICAgICAgICAgICdzbWFydExhYmVsJyxcbiAgICAgICAgICBmdW5jdGlvbiBhY3F1aXJlICgpIHtcbiAgICAgICAgICAgIGxldCBpID0gMCxcbiAgICAgICAgICAgICAgaWkgPSByZXF1aXJlZFBhcmFtcy5sZW5ndGggLSAxLFxuICAgICAgICAgICAgICBwYXJhbSA9ICcnO1xuICAgICAgICAgICAgc2VsZltzYXZlVG9dID0gc2VsZltzYXZlVG9dIHx8IHt9O1xuICAgICAgICAgICAgc2VsZi5yZXF1aXJlZFBhcmFtcyA9IHt9O1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGlpOyArK2kpIHtcbiAgICAgICAgICAgICAgcGFyYW0gPSByZXF1aXJlZFBhcmFtc1tpXTtcbiAgICAgICAgICAgICAgc2VsZltzYXZlVG9dW3BhcmFtXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF07XG4gICAgICByZXF1aXJlKHJlcXVpcmVkUGFyYW1zKTtcblxuICAgICAgYXBpID0gc2VsZi50c09iamVjdC5jaGFydEluc3RhbmNlLmFwaUluc3RhbmNlO1xuICAgICAgc3RvcmUgPSBhcGkuZ2V0Q29tcG9uZW50U3RvcmUoKTtcbiAgICAgIGNvbmZpZy5jb21wb3NpdGlvbiA9IGNvbXBvc2l0aW9uID0gc3RvcmUuZ2V0Q2FudmFzQnlJbmRleCgwKS5jb21wb3NpdGlvbjtcbiAgICAgIGNvbmZpZy5kYXRhQWdnID0gY29tcG9zaXRpb24uaW1wbC5nZXREYXRhQWdncmVnYXRvcigpO1xuXG4gICAgICB0b29sYm94Q29tcG9uZW50LnRvb2xib3ggPSBkZXAuRkMuZ2V0Q29tcG9uZW50KCdhcGknLCAndG9vbGJveCcpO1xuICAgICAgdG9vbGJveENvbXBvbmVudC5jb25maWcgPSB7fTtcblxuICAgICAgc2VsZi50b29sYmFycyA9IFtdO1xuXG4gICAgICBzZWxmLm1lYXN1cmVtZW50ID0ge307XG5cbiAgICAgIHNlbGYudG9vbGJhcnMucHVzaChzZWxmLmNyZWF0ZVRvb2xiYXIoKSk7XG5cbiAgICAgIHdpbmRvdy5BZ2dyZWdhdG9yID0gc2VsZjtcbiAgICAgIHJldHVybiBzZWxmO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSB0b29sYmFyIGNvbXBvbmVudHNcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGNyZWF0ZVRvb2xiYXIgKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICBncm91cDEsXG4gICAgICAgIGdyb3VwMixcbiAgICAgICAgZ3JvdXAzLFxuICAgICAgICB0b29sYmFyLFxuICAgICAgICB0aW1lTXVsU2VsZWN0TWVudSxcbiAgICAgICAgdGltZVBlcmlvZFNlbGVjdE1lbnUsXG4gICAgICAgIGFnZ01ldGhvZFNlbGVjdE1lbnUsXG4gICAgICAgIHJlc2V0QnV0dG9uLFxuICAgICAgICBhcHBseUJ1dHRvbixcbiAgICAgICAgY29uZmlnID0gc2VsZi5jb25maWcsXG4gICAgICAgIHRzT2JqZWN0ID0gc2VsZi50c09iamVjdCxcbiAgICAgICAgbGFiZWwsXG5cbiAgICAgICAgdG9vbGJveENvbXBvbmVudCA9IGNvbmZpZy50b29sYm94Q29tcG9uZW50LFxuICAgICAgICB0b29sYm94ID0gdG9vbGJveENvbXBvbmVudC50b29sYm94LFxuICAgICAgICB0b29sYm94Q29tcENvbmZpZyA9IHRvb2xib3hDb21wb25lbnQuY29uZmlnLFxuICAgICAgICBIb3Jpem9udGFsVG9vbGJhciA9IHRvb2xib3guSG9yaXpvbnRhbFRvb2xiYXIsXG4gICAgICAgIENvbXBvbmVudEdyb3VwID0gdG9vbGJveC5Db21wb25lbnRHcm91cCxcbiAgICAgICAgU3ltYm9sU3RvcmUgPSB0b29sYm94LlN5bWJvbFN0b3JlLFxuXG4gICAgICAgIGdyYXBoaWNzID0gdHNPYmplY3QuZ3JhcGhpY3MsXG4gICAgICAgIHBhcGVyID0gZ3JhcGhpY3MucGFwZXIsXG4gICAgICAgIGNvbnRhaW5lciA9IGdyYXBoaWNzLmNvbnRhaW5lcixcbiAgICAgICAgY2hhcnQgPSB0c09iamVjdC5jaGFydCxcbiAgICAgICAgc21hcnRMYWJlbCA9IHRzT2JqZWN0LnNtYXJ0TGFiZWwsXG5cbiAgICAgICAgbXVsdGlwbGllclZhbCxcbiAgICAgICAgdGltZU11bFNlbGVjdE1lbnVPcHQsXG4gICAgICAgIHRpbWVQZXJpb2RNZW51RGlzYWJsZUNvbmZpZyxcbiAgICAgICAgdGltZU11bHRpcGxpZXJNZW51RGlzYWJsZUNvbmZpZyxcbiAgICAgICAgYWdnTWV0aG9kTWVudURpc2FibGVvbmZpZyxcbiAgICAgICAgZHJvcERvd25NZW51U3R5bGUsXG4gICAgICAgIGFwcGx5QnV0dG9uRGlzYWJsZUNvbmZpZyxcbiAgICAgICAgcmVzZXRCdXR0b25EaXNhYmxlQ29uZmlnLFxuXG4gICAgICAgIHN0eWxlLFxuXG4gICAgICAgIGRlcGVuZGVuY2llcyA9IHtcbiAgICAgICAgICBwYXBlcjogcGFwZXIsXG4gICAgICAgICAgY2hhcnQ6IGNoYXJ0LFxuICAgICAgICAgIHNtYXJ0TGFiZWw6IHNtYXJ0TGFiZWwsXG4gICAgICAgICAgY2hhcnRDb250YWluZXI6IGNvbnRhaW5lclxuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgICAgICogQXBwbHkgb3IgUmVzZXQgQWdncmVnYXRpb24gYXBwbGllZCB0aHJvdWdoIGV4dGVuc2lvbiBpbiB0aW1lc2VyaWVzXG4gICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzZXQgLSBGbGFnIHRvIHNldCBvciByZXNldC4gJzEnIHRvIHNldCwgJzAnIHRvIHJlc2V0XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBhcHBseSA9IChzZXQpID0+IHtcbiAgICAgICAgICB2YXIgbW9kZWwgPSBjb25maWcuY29tcG9zaXRpb24ucmVhY3RpdmVNb2RlbCxcbiAgICAgICAgICAgIHRpbWVQZXJpb2RWYWwgPSB0aW1lUGVyaW9kU2VsZWN0TWVudS52YWx1ZSgpLFxuICAgICAgICAgICAgdGltZVBlcmlvZE11bHRpcGxpZXJWYWwgPSB0aW1lTXVsU2VsZWN0TWVudS52YWx1ZSgpLFxuICAgICAgICAgICAgYWdnTWV0aG9kU2VsZWN0TWVudVZhbCA9IGFnZ01ldGhvZFNlbGVjdE1lbnUudmFsdWUoKSxcbiAgICAgICAgICAgIGtleXMsXG4gICAgICAgICAgICBiaW5TaXplLFxuICAgICAgICAgICAgdGltZUludGVydmFsLFxuICAgICAgICAgICAgYWdncmVnYXRpb24gPSBzZWxmLmFnZ3JlZ2F0aW9uLFxuICAgICAgICAgICAgY2FudmFzID0gY29uZmlnLmNvbXBvc2l0aW9uLmltcGw7XG5cbiAgICAgICAgICBmb3IgKGtleXMgb2YgY29uZmlnLmF2bFRpbWVQZXJpb2RzKSB7XG4gICAgICAgICAgICBpZiAoa2V5cy5uYW1lID09PSB0aW1lUGVyaW9kVmFsKSB7XG4gICAgICAgICAgICAgIHRpbWVJbnRlcnZhbCA9IGtleXMuaW50ZXJ2YWw7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBiaW5TaXplID0gdGltZUludGVydmFsICogTnVtYmVyKHRpbWVQZXJpb2RNdWx0aXBsaWVyVmFsKTtcbiAgICAgICAgICBpZiAoc2V0ICYmIGlzRmluaXRlKG1vZGVsLnByb3AoJ2Jpbi1zaXplJykpKSB7XG4gICAgICAgICAgICBtb2RlbFxuICAgICAgICAgICAgICAubG9jaygpXG4gICAgICAgICAgICAgIC5wcm9wKCdiaW4tc2l6ZS1leHQnLCBiaW5TaXplKVxuICAgICAgICAgICAgICAucHJvcCgnYWdncmVnYXRpb24tZm4tZXh0JywgY29uZmlnLmF2bEFnZ01ldGhvZHNbYWdnTWV0aG9kU2VsZWN0TWVudVZhbF0pXG4gICAgICAgICAgICAgIC51bmxvY2soKTtcbiAgICAgICAgICAgIGFnZ3JlZ2F0aW9uLmJpblNpemUgPSBiaW5TaXplO1xuICAgICAgICAgICAgYWdncmVnYXRpb24uYWdncmVnYXRpb25NZXRob2QgPSBhZ2dNZXRob2RTZWxlY3RNZW51VmFsO1xuICAgICAgICAgICAgYXBwbHlCdXR0b24udXBkYXRlVmlzdWFsKCdkaXNhYmxlZCcpO1xuICAgICAgICAgICAgcmVzZXRCdXR0b24udXBkYXRlVmlzdWFsKCdlbmFibGVkJyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhbnZhcy5yZXNldEFnZ3JlZ2F0aW9uKCk7XG4gICAgICAgICAgICBhZ2dyZWdhdGlvbi5iaW5TaXplID0gbnVsbDtcbiAgICAgICAgICAgIGFnZ3JlZ2F0aW9uLmFnZ3JlZ2F0aW9uTWV0aG9kID0gbnVsbDtcbiAgICAgICAgICAgIHJlc2V0QnV0dG9uLnVwZGF0ZVZpc3VhbCgnZGlzYWJsZWQnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldHMgdmFsaWQgdGltZSBtdWx0aXBsaWVyIG9uIHRpbWUgcGVyaW9kIGNoYW5nZSBmcm9tIGV4dGVuc2lvbiB0b29sYm94XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aW1lUGVyaW9kT25DaGFuZ2UgPSAoKSA9PiB7XG4gICAgICAgICAgdmFyIHRpbWVQZXJpb2RWYWwgPSB0aW1lUGVyaW9kU2VsZWN0TWVudS52YWx1ZSgpLFxuICAgICAgICAgICAgdGltZVBlcmlvZE11bHRpcGxpZXJWYWwgPSB0aW1lTXVsU2VsZWN0TWVudS52YWx1ZSgpLFxuICAgICAgICAgICAgcHJldlRpbWVQZXJvaWRNdWxWYWwgPSB0aW1lUGVyaW9kTXVsdGlwbGllclZhbCxcbiAgICAgICAgICAgIHZhbGlkVGltZVBlcmlvZCA9IGNvbmZpZy52YWxpZFRpbWVQZXJpb2QsXG4gICAgICAgICAgICB2YWxpZFRpbWVQZXJpb2RNdWx0aXBsaWVyID0gY29uZmlnLnZhbGlkVGltZVBlcmlvZE11bHRpcGxpZXIsXG4gICAgICAgICAgICBpbmRleE9mVGltZVVuaXQsXG4gICAgICAgICAgICBpbmRleE9mVGltZU11bDtcblxuICAgICAgICAgIGluZGV4T2ZUaW1lVW5pdCA9IHZhbGlkVGltZVBlcmlvZC5pbmRleE9mKHRpbWVQZXJpb2RWYWwpO1xuICAgICAgICAgIGluZGV4T2ZUaW1lTXVsID0gdmFsaWRUaW1lUGVyaW9kTXVsdGlwbGllcltpbmRleE9mVGltZVVuaXRdLmluZGV4T2YoTnVtYmVyKHRpbWVQZXJpb2RNdWx0aXBsaWVyVmFsKSk7XG5cbiAgICAgICAgICB0aW1lTXVsU2VsZWN0TWVudU9wdCA9IFtdO1xuICAgICAgICAgIGZvciAobXVsdGlwbGllclZhbCBvZiB2YWxpZFRpbWVQZXJpb2RNdWx0aXBsaWVyW2luZGV4T2ZUaW1lVW5pdF0pIHtcbiAgICAgICAgICAgIHRpbWVNdWxTZWxlY3RNZW51T3B0LnB1c2goe1xuICAgICAgICAgICAgICBuYW1lOiBtdWx0aXBsaWVyVmFsLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgIHZhbHVlOiBtdWx0aXBsaWVyVmFsLnRvU3RyaW5nKClcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRpbWVNdWxTZWxlY3RNZW51LnVwZGF0ZUxpc3QodGltZU11bFNlbGVjdE1lbnVPcHQpO1xuXG4gICAgICAgICAgaWYgKGluZGV4T2ZUaW1lTXVsIDwgMCkge1xuICAgICAgICAgICAgdGltZU11bFNlbGVjdE1lbnUudmFsdWUodmFsaWRUaW1lUGVyaW9kTXVsdGlwbGllcltpbmRleE9mVGltZVVuaXRdWzBdLnRvU3RyaW5nKCkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aW1lTXVsU2VsZWN0TWVudS52YWx1ZShwcmV2VGltZVBlcm9pZE11bFZhbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZXRzIHN0YXRlIG9mIGFwcGx5QnV0dG9uKGFjdGl2ZS9pbmFjdGl2ZSkgb24gY2hhbmdlIGluIHZhbHVlIGluIHRvb2xib3hcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIG9uQ2hhbmdlID0gKHR5cGUpID0+IHtcbiAgICAgICAgICB2YXIgY3VycmVudEFnZyA9IHNlbGYuZ2V0Q3VycmVudEFnZ3JlYXRpb24oKTtcblxuICAgICAgICAgIGlmIChjdXJyZW50QWdnLnRpbWVQZXJpb2RNdWx0aXBsaWVyLnRvU3RyaW5nKCkgIT09IHRpbWVNdWxTZWxlY3RNZW51LnZhbHVlKCkgfHxcbiAgICAgICAgICAgIGN1cnJlbnRBZ2cudGltZVBlcmlvZCAhPT0gdGltZVBlcmlvZFNlbGVjdE1lbnUudmFsdWUoKSB8fFxuICAgICAgICAgICAgY3VycmVudEFnZy5hZ2dyZWdhdGlvbk1ldGhvZC52YWx1ZSAhPT0gYWdnTWV0aG9kU2VsZWN0TWVudS52YWx1ZSgpKSB7XG4gICAgICAgICAgICBhcHBseUJ1dHRvbi51cGRhdGVWaXN1YWwoJ2VuYWJsZWQnKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYXBwbHlCdXR0b24udXBkYXRlVmlzdWFsKCdkaXNhYmxlZCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgZ3JvdXAxID0gbmV3IENvbXBvbmVudEdyb3VwKGRlcGVuZGVuY2llcyk7XG4gICAgICBncm91cDIgPSBuZXcgQ29tcG9uZW50R3JvdXAoZGVwZW5kZW5jaWVzKTtcbiAgICAgIGdyb3VwMyA9IG5ldyBDb21wb25lbnRHcm91cChkZXBlbmRlbmNpZXMpO1xuXG4gICAgICB0b29sYmFyID0gbmV3IEhvcml6b250YWxUb29sYmFyKGRlcGVuZGVuY2llcyk7XG5cbiAgICAgIGNvbmZpZy51c3JDb25maWcgPSB7XG4gICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgIHBvc1dydENhbnZhczogJ3RvcCcsXG4gICAgICAgIGFsaWdubWVudDogJ2xlZnQnLFxuICAgICAgICBvcmllbnRhdGlvbjogJ2hvcml6b250YWwnLFxuICAgICAgICBzdHlsZXM6IHtcbiAgICAgICAgICB0aW1lTXVsdGlwbGllcklucHV0RmllbGQ6IHtcbiAgICAgICAgICAgIGFjdGl2ZToge1xuICAgICAgICAgICAgICAnZmlsbCc6ICcjZmZmJyxcbiAgICAgICAgICAgICAgJ2xhYmVsRmlsbCc6ICcjNjk2OTY5JyxcbiAgICAgICAgICAgICAgJ3N0cm9rZSc6ICcjYzhjZWNkJyxcbiAgICAgICAgICAgICAgJ3N0cm9rZVdpZHRoJzogMSxcbiAgICAgICAgICAgICAgJ2hvdmVyU3Ryb2tlJzogJyM2OTY5NjknLFxuICAgICAgICAgICAgICAnaG92ZXJTdHJva2VXaWR0aCc6IDEsXG4gICAgICAgICAgICAgICdyYWRpdXMnOiAxLFxuICAgICAgICAgICAgICAnd2lkdGgnOiA0NSxcbiAgICAgICAgICAgICAgJ2hlaWdodCc6IDIyXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaW5hY3RpdmU6IHtcbiAgICAgICAgICAgICAgJ2ZpbGwnOiAnI2ZmZicsXG4gICAgICAgICAgICAgICdzdHJva2Utd2lkdGgnOiAxLFxuICAgICAgICAgICAgICAnc3Ryb2tlJzogJ3JnYigxOTIsIDE5MiwgMTkyKScsXG4gICAgICAgICAgICAgICdsYWJlbEZpbGwnOiAnIzAwMCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHRpbWVQZXJpb2RJbnB1dEZpZWxkOiB7XG4gICAgICAgICAgICBhY3RpdmU6IHtcbiAgICAgICAgICAgICAgJ2ZpbGwnOiAnI2ZmZicsXG4gICAgICAgICAgICAgICdsYWJlbEZpbGwnOiAnIzY5Njk2OScsXG4gICAgICAgICAgICAgICdzdHJva2UnOiAnI2M4Y2VjZCcsXG4gICAgICAgICAgICAgICdzdHJva2VXaWR0aCc6IDEsXG4gICAgICAgICAgICAgICdob3ZlclN0cm9rZSc6ICcjNjk2OTY5JyxcbiAgICAgICAgICAgICAgJ2hvdmVyU3Ryb2tlV2lkdGgnOiAxLFxuICAgICAgICAgICAgICAncmFkaXVzJzogMSxcbiAgICAgICAgICAgICAgJ3dpZHRoJzogNzUsXG4gICAgICAgICAgICAgICdoZWlnaHQnOiAyMlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGluYWN0aXZlOiB7XG4gICAgICAgICAgICAgICdmaWxsJzogJyNmZmYnLFxuICAgICAgICAgICAgICAnc3Ryb2tlLXdpZHRoJzogMSxcbiAgICAgICAgICAgICAgJ3N0cm9rZSc6ICdyZ2IoMTkyLCAxOTIsIDE5MiknLFxuICAgICAgICAgICAgICAnbGFiZWxGaWxsJzogJyMwMDAnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBhZ2dyZWdhdGlvbk1ldGhvZElucHV0RmllbGQ6IHtcbiAgICAgICAgICAgIGFjdGl2ZToge1xuICAgICAgICAgICAgICAnZmlsbCc6ICcjZmZmJyxcbiAgICAgICAgICAgICAgJ2xhYmVsRmlsbCc6ICcjNjk2OTY5JyxcbiAgICAgICAgICAgICAgJ3N0cm9rZSc6ICcjYzhjZWNkJyxcbiAgICAgICAgICAgICAgJ3N0cm9rZVdpZHRoJzogMSxcbiAgICAgICAgICAgICAgJ2hvdmVyU3Ryb2tlJzogJyM2OTY5NjknLFxuICAgICAgICAgICAgICAnaG92ZXJTdHJva2VXaWR0aCc6IDEsXG4gICAgICAgICAgICAgICdyYWRpdXMnOiAxLFxuICAgICAgICAgICAgICAnd2lkdGgnOiAxMDAsXG4gICAgICAgICAgICAgICdoZWlnaHQnOiAyMlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGluYWN0aXZlOiB7XG4gICAgICAgICAgICAgICdmaWxsJzogJyNmZmYnLFxuICAgICAgICAgICAgICAnc3Ryb2tlLXdpZHRoJzogMSxcbiAgICAgICAgICAgICAgJ3N0cm9rZSc6ICdyZ2IoMTkyLCAxOTIsIDE5MiknLFxuICAgICAgICAgICAgICAnbGFiZWxGaWxsJzogJyMwMDAnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBkcm9wRG93bjoge1xuICAgICAgICAgICAgYWN0aXZlOiB7XG4gICAgICAgICAgICAgICdmaWxsJzogJyM4OThiOGInLFxuICAgICAgICAgICAgICAnbGFiZWxGaWxsJzogJyNmZmYnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbm9ybWFsOiB7XG4gICAgICAgICAgICAgICdmaWxsJzogJyNmZmYnLFxuICAgICAgICAgICAgICAnbGFiZWxGaWxsJzogJyMwMDAnLFxuICAgICAgICAgICAgICAnaG92ZXJGaWxsJzogJyNlNmU4ZTgnLFxuICAgICAgICAgICAgICAnaG92ZXJMYWJlbEZpbGwnOiAnIzAwMCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGFwcGx5QnV0dG9uOiB7XG4gICAgICAgICAgICBhY3RpdmU6IHtcbiAgICAgICAgICAgICAgJ2ZpbGwnOiAnIzU1NScsXG4gICAgICAgICAgICAgICdsYWJlbEZpbGwnOiAnI2YzZjNmMycsXG4gICAgICAgICAgICAgICdzdHJva2UnOiAnI2M4Y2VjZCcsXG4gICAgICAgICAgICAgICdzdHJva2VXaWR0aCc6IDEsXG4gICAgICAgICAgICAgICdob3ZlckZpbGwnOiAnIzU1NScsXG4gICAgICAgICAgICAgICdob3ZlclN0cm9rZVdpZHRoJzogMSxcbiAgICAgICAgICAgICAgJ2hvdmVyU3Ryb2tlJzogJycsXG4gICAgICAgICAgICAgICdyYWRpdXMnOiAxLFxuICAgICAgICAgICAgICAnd2lkdGgnOiAzMCxcbiAgICAgICAgICAgICAgJ2hlaWdodCc6IDIwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaW5hY3RpdmU6IHtcbiAgICAgICAgICAgICAgJ2ZpbGwnOiAnI2JlYmViZScsXG4gICAgICAgICAgICAgICdzdHJva2Utd2lkdGgnOiAxLFxuICAgICAgICAgICAgICAnc3Ryb2tlJzogJ3JnYigxOTIsIDE5MiwgMTkyKScsXG4gICAgICAgICAgICAgICdsYWJlbEZpbGwnOiAnI2YzZjNmMydcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHJlc2V0QnV0dG9uOiB7XG4gICAgICAgICAgICBhY3RpdmU6IHtcbiAgICAgICAgICAgICAgJ2ZpbGwnOiAnIzg5OGI4YicsXG4gICAgICAgICAgICAgICdsYWJlbEZpbGwnOiAnI2YzZjNmMycsXG4gICAgICAgICAgICAgICdzdHJva2UnOiAnI2M4Y2VjZCcsXG4gICAgICAgICAgICAgICdzdHJva2VXaWR0aCc6IDEsXG4gICAgICAgICAgICAgICdob3ZlckZpbGwnOiAnIzg5OGI4YicsXG4gICAgICAgICAgICAgICdob3ZlclN0cm9rZVdpZHRoJzogMSxcbiAgICAgICAgICAgICAgJ2hvdmVyU3Ryb2tlJzogJycsXG4gICAgICAgICAgICAgICdyYWRpdXMnOiAxLFxuICAgICAgICAgICAgICAnd2lkdGgnOiAzMCxcbiAgICAgICAgICAgICAgJ2hlaWdodCc6IDIwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaW5hY3RpdmU6IHtcbiAgICAgICAgICAgICAgJ2ZpbGwnOiAnI2JlYmViZScsXG4gICAgICAgICAgICAgICdzdHJva2Utd2lkdGgnOiAxLFxuICAgICAgICAgICAgICAnc3Ryb2tlJzogJ3JnYigxOTIsIDE5MiwgMTkyKScsXG4gICAgICAgICAgICAgICdsYWJlbEZpbGwnOiAnI2YzZjNmMydcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGJhc2U6IHtcbiAgICAgICAgICAgIGZvbnQ6IHtcbiAgICAgICAgICAgICAgJ2ZvbnRTaXplJzogMTFcbiAgICAgICAgICAgICAgLy8gJ2ZvbnRXZWlnaHQnOiAnYm9sZCcsXG4gICAgICAgICAgICAgIC8vICdmb250RmFtaWx5JzogJ3NhbnMtc2VyaWYnLFxuICAgICAgICAgICAgICAvLyAnZm9udFN0eWxlJzogJ2l0YWxpYydcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHN0eWxlID0gY29uZmlnLnVzckNvbmZpZy5zdHlsZXMgfHwge307XG5cbiAgICAgIHN0eWxlID0ge1xuICAgICAgICB0aW1lTXVsdGlwbGllcklucHV0RmllbGQ6IHtcbiAgICAgICAgICBhY3RpdmU6IChzdHlsZS50aW1lTXVsdGlwbGllcklucHV0RmllbGQgJiYgc3R5bGUudGltZU11bHRpcGxpZXJJbnB1dEZpZWxkLmFjdGl2ZSkgfHwge30sXG4gICAgICAgICAgaW5hY3RpdmU6IChzdHlsZS50aW1lTXVsdGlwbGllcklucHV0RmllbGQgJiYgc3R5bGUudGltZU11bHRpcGxpZXJJbnB1dEZpZWxkLmluYWN0aXZlKSB8fCB7fVxuICAgICAgICB9LFxuICAgICAgICB0aW1lUGVyaW9kSW5wdXRGaWVsZDoge1xuICAgICAgICAgIGFjdGl2ZTogKHN0eWxlLnRpbWVQZXJpb2RJbnB1dEZpZWxkICYmIHN0eWxlLnRpbWVQZXJpb2RJbnB1dEZpZWxkLmFjdGl2ZSkgfHwge30sXG4gICAgICAgICAgaW5hY3RpdmU6IChzdHlsZS50aW1lUGVyaW9kSW5wdXRGaWVsZCAmJiBzdHlsZS50aW1lUGVyaW9kSW5wdXRGaWVsZC5pbmFjdGl2ZSkgfHwge31cbiAgICAgICAgfSxcbiAgICAgICAgYWdncmVnYXRpb25NZXRob2RJbnB1dEZpZWxkOiB7XG4gICAgICAgICAgYWN0aXZlOiAoc3R5bGUuYWdncmVnYXRpb25NZXRob2RJbnB1dEZpZWxkICYmIHN0eWxlLmFnZ3JlZ2F0aW9uTWV0aG9kSW5wdXRGaWVsZC5hY3RpdmUpIHx8IHt9LFxuICAgICAgICAgIGluYWN0aXZlOiAoc3R5bGUuYWdncmVnYXRpb25NZXRob2RJbnB1dEZpZWxkICYmIHN0eWxlLmFnZ3JlZ2F0aW9uTWV0aG9kSW5wdXRGaWVsZC5pbmFjdGl2ZSkgfHwge31cbiAgICAgICAgfSxcbiAgICAgICAgZHJvcERvd246IHtcbiAgICAgICAgICBhY3RpdmU6IChzdHlsZS5kcm9wRG93biAmJiBzdHlsZS5kcm9wRG93bi5hY3RpdmUpIHx8IHt9LFxuICAgICAgICAgIG5vcm1hbDogKHN0eWxlLmRyb3BEb3duICYmIHN0eWxlLmRyb3BEb3duLm5vcm1hbCkgfHwge31cbiAgICAgICAgfSxcbiAgICAgICAgYXBwbHlCdXR0b246IHtcbiAgICAgICAgICBhY3RpdmU6IChzdHlsZS5hcHBseUJ1dHRvbiAmJiBzdHlsZS5hcHBseUJ1dHRvbi5hY3RpdmUpIHx8IHt9LFxuICAgICAgICAgIGluYWN0aXZlOiAoc3R5bGUuYXBwbHlCdXR0b24gJiYgc3R5bGUuYXBwbHlCdXR0b24uaW5hY3RpdmUpIHx8IHt9XG4gICAgICAgIH0sXG4gICAgICAgIHJlc2V0QnV0dG9uOiB7XG4gICAgICAgICAgYWN0aXZlOiAoc3R5bGUucmVzZXRCdXR0b24gJiYgc3R5bGUucmVzZXRCdXR0b24uYWN0aXZlKSB8fCB7fSxcbiAgICAgICAgICBpbmFjdGl2ZTogKHN0eWxlLnJlc2V0QnV0dG9uICYmIHN0eWxlLnJlc2V0QnV0dG9uLmluYWN0aXZlKSB8fCB7fVxuICAgICAgICB9LFxuICAgICAgICBiYXNlOiB7XG4gICAgICAgICAgZm9udDogKHN0eWxlLmJhc2UgJiYgc3R5bGUuYmFzZS5mb250KSB8fCB7fVxuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBncm91cDEuc2V0Q29uZmlnKHtcbiAgICAgICAgZmlsbDogJyNmZmYnLFxuICAgICAgICBib3JkZXJUaGlja25lc3M6IDBcbiAgICAgIH0pO1xuICAgICAgZ3JvdXAyLnNldENvbmZpZyh7XG4gICAgICAgIGZpbGw6ICcjZmZmJyxcbiAgICAgICAgYm9yZGVyVGhpY2tuZXNzOiAwXG4gICAgICB9KTtcbiAgICAgIGdyb3VwMy5zZXRDb25maWcoe1xuICAgICAgICBmaWxsOiAnI2ZmZicsXG4gICAgICAgIGJvcmRlclRoaWNrbmVzczogMFxuICAgICAgfSk7XG5cbiAgICAgIHRvb2xiYXIuc2V0Q29uZmlnKHtcbiAgICAgICAgZmlsbDogJyNmZmYnLFxuICAgICAgICBib3JkZXJUaGlja25lc3M6IDBcbiAgICAgIH0pO1xuXG4gICAgICB0aW1lUGVyaW9kTWVudURpc2FibGVDb25maWcgPSB7XG4gICAgICAgIGRpc2FibGVkOiB7XG4gICAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgICBkaXNhYmxlZDogc3R5bGUudGltZU11bHRpcGxpZXJJbnB1dEZpZWxkLmluYWN0aXZlXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICB0aW1lTXVsdGlwbGllck1lbnVEaXNhYmxlQ29uZmlnID0ge1xuICAgICAgICBkaXNhYmxlZDoge1xuICAgICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgICAgZGlzYWJsZWQ6IHN0eWxlLnRpbWVQZXJpb2RJbnB1dEZpZWxkLmluYWN0aXZlXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBhZ2dNZXRob2RNZW51RGlzYWJsZW9uZmlnID0ge1xuICAgICAgICBkaXNhYmxlZDoge1xuICAgICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgICAgZGlzYWJsZWQ6IHN0eWxlLmFnZ3JlZ2F0aW9uTWV0aG9kSW5wdXRGaWVsZC5pbmFjdGl2ZVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgYXBwbHlCdXR0b25EaXNhYmxlQ29uZmlnID0ge1xuICAgICAgICBkaXNhYmxlZDoge1xuICAgICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgICAgZGlzYWJsZWQ6IHN0eWxlLmFwcGx5QnV0dG9uLmluYWN0aXZlXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICByZXNldEJ1dHRvbkRpc2FibGVDb25maWcgPSB7XG4gICAgICAgIGRpc2FibGVkOiB7XG4gICAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgICBkaXNhYmxlZDogc3R5bGUucmVzZXRCdXR0b24uaW5hY3RpdmVcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGRyb3BEb3duTWVudVN0eWxlID0ge1xuICAgICAgICBzZWxlY3RlZDoge1xuICAgICAgICAgIGNvbnRhaW5lcjoge1xuICAgICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgICAgZmlsbDogc3R5bGUuZHJvcERvd24uYWN0aXZlLmZpbGxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHRleHQ6IHtcbiAgICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICAgIGZpbGw6IHN0eWxlLmRyb3BEb3duLmFjdGl2ZS5sYWJlbEZpbGxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIG5vcm1hbDoge1xuICAgICAgICAgIGNvbnRhaW5lcjoge1xuICAgICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgICAgZmlsbDogc3R5bGUuZHJvcERvd24ubm9ybWFsLmZpbGxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHRleHQ6IHtcbiAgICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICAgIGZpbGw6IHN0eWxlLmRyb3BEb3duLm5vcm1hbC5sYWJlbEZpbGxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGhvdmVyOiB7XG4gICAgICAgICAgY29udGFpbmVyOiB7XG4gICAgICAgICAgICBzdHlsZToge1xuICAgICAgICAgICAgICBmaWxsOiBzdHlsZS5kcm9wRG93bi5ub3JtYWwuaG92ZXJGaWxsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB0ZXh0OiB7XG4gICAgICAgICAgICBzdHlsZToge1xuICAgICAgICAgICAgICBmaWxsOiBzdHlsZS5kcm9wRG93bi5ub3JtYWwuaG92ZXJMYWJlbEZpbGxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGxhYmVsID0gbmV3IHRvb2xib3guTGFiZWwoJ0FnZ3JlZ2F0ZSBEYXRhOicsIGRlcGVuZGVuY2llcywge1xuICAgICAgICB0ZXh0OiB7XG4gICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgICdmb250LXNpemUnOiAnMTQnLFxuICAgICAgICAgICAgJ2ZpbGwnOiAnIzY5Njk2OSdcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICB0b29sYm94Q29tcENvbmZpZy50aW1lUGVyaW9kU2VsZWN0TWVudSA9IHRpbWVQZXJpb2RTZWxlY3RNZW51ID0gbmV3IHRvb2xib3guU2VsZWN0U3ltYm9sKHt9LCBkZXBlbmRlbmNpZXMsIFtdLFxuICAgICAgT2JqZWN0LmFzc2lnbihzdHlsZS50aW1lUGVyaW9kSW5wdXRGaWVsZC5hY3RpdmUsIHtcbiAgICAgICAgYnRuVGV4dFN0eWxlOiBzdHlsZS5iYXNlLmZvbnQsXG4gICAgICAgIGRyb3BEb3duTWVudTogZHJvcERvd25NZW51U3R5bGVcbiAgICAgIH0pKTtcbiAgICAgIHRpbWVQZXJpb2RTZWxlY3RNZW51LnNldFN0YXRlQ29uZmlnKHRpbWVQZXJpb2RNZW51RGlzYWJsZUNvbmZpZyk7XG5cbiAgICAgIHRvb2xib3hDb21wQ29uZmlnLnRpbWVNdWxTZWxlY3RNZW51ID0gdGltZU11bFNlbGVjdE1lbnUgPSBuZXcgdG9vbGJveC5TZWxlY3RTeW1ib2woe30sIGRlcGVuZGVuY2llcywgW10sXG4gICAgICBPYmplY3QuYXNzaWduKHN0eWxlLnRpbWVNdWx0aXBsaWVySW5wdXRGaWVsZC5hY3RpdmUsIHtcbiAgICAgICAgYnRuVGV4dFN0eWxlOiBzdHlsZS5iYXNlLmZvbnQsXG4gICAgICAgIGRyb3BEb3duTWVudTogZHJvcERvd25NZW51U3R5bGVcbiAgICAgIH0pKTtcbiAgICAgIHRpbWVNdWxTZWxlY3RNZW51LnNldFN0YXRlQ29uZmlnKHRpbWVNdWx0aXBsaWVyTWVudURpc2FibGVDb25maWcpO1xuXG4gICAgICB0b29sYm94Q29tcENvbmZpZy5hZ2dNZXRob2RTZWxlY3RNZW51ID0gYWdnTWV0aG9kU2VsZWN0TWVudSA9IG5ldyB0b29sYm94LlNlbGVjdFN5bWJvbCh7fSwgZGVwZW5kZW5jaWVzLCBbXSxcbiAgICAgIE9iamVjdC5hc3NpZ24oc3R5bGUuYWdncmVnYXRpb25NZXRob2RJbnB1dEZpZWxkLmFjdGl2ZSwge1xuICAgICAgICBidG5UZXh0U3R5bGU6IHN0eWxlLmJhc2UuZm9udCxcbiAgICAgICAgZHJvcERvd25NZW51OiBkcm9wRG93bk1lbnVTdHlsZVxuICAgICAgfSkpO1xuICAgICAgYWdnTWV0aG9kU2VsZWN0TWVudS5zZXRTdGF0ZUNvbmZpZyhhZ2dNZXRob2RNZW51RGlzYWJsZW9uZmlnKTtcblxuICAgICAgdG9vbGJveENvbXBDb25maWcuYXBwbHlCdXR0b24gPSBhcHBseUJ1dHRvbiA9IG5ldyB0b29sYm94LlN5bWJvbCgnQVBQTFknLCB0cnVlLCBkZXBlbmRlbmNpZXMsXG4gICAgICAgIE9iamVjdC5hc3NpZ24oc3R5bGUuYXBwbHlCdXR0b24uYWN0aXZlLCB7XG4gICAgICAgICAgYnRuVGV4dFN0eWxlOiBzdHlsZS5iYXNlLmZvbnRcbiAgICAgICAgfSkpXG4gICAgICAgIC5hdHRhY2hFdmVudEhhbmRsZXJzKHtcbiAgICAgICAgICBjbGljazogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgYXBwbHkoMSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIGFwcGx5QnV0dG9uLnNldFN0YXRlQ29uZmlnKGFwcGx5QnV0dG9uRGlzYWJsZUNvbmZpZyk7XG5cbiAgICAgIHRvb2xib3hDb21wQ29uZmlnLnJlc2V0QnV0dG9uID0gcmVzZXRCdXR0b24gPSBuZXcgdG9vbGJveC5TeW1ib2woJ1JFU0VUJywgdHJ1ZSwgZGVwZW5kZW5jaWVzLFxuICAgICAgICBPYmplY3QuYXNzaWduKHN0eWxlLnJlc2V0QnV0dG9uLmFjdGl2ZSwge1xuICAgICAgICAgIGJ0blRleHRTdHlsZTogc3R5bGUuYmFzZS5mb250XG4gICAgICAgIH0pKVxuICAgICAgICAuYXR0YWNoRXZlbnRIYW5kbGVycyh7XG4gICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGFwcGx5KDApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICByZXNldEJ1dHRvbi5zZXRTdGF0ZUNvbmZpZyhyZXNldEJ1dHRvbkRpc2FibGVDb25maWcpO1xuXG4gICAgICBncm91cDEuYWRkU3ltYm9sKGxhYmVsKTtcbiAgICAgIGdyb3VwMi5hZGRTeW1ib2wodGltZU11bFNlbGVjdE1lbnUpO1xuICAgICAgZ3JvdXAyLmFkZFN5bWJvbCh0aW1lUGVyaW9kU2VsZWN0TWVudSk7XG4gICAgICBncm91cDIuYWRkU3ltYm9sKGFnZ01ldGhvZFNlbGVjdE1lbnUpO1xuICAgICAgZ3JvdXAzLmFkZFN5bWJvbChhcHBseUJ1dHRvbik7XG4gICAgICBncm91cDMuYWRkU3ltYm9sKHJlc2V0QnV0dG9uKTtcblxuICAgICAgU3ltYm9sU3RvcmUucmVnaXN0ZXIoJ3RleHRCb3hJY29uJywgZnVuY3Rpb24gKHgsIHksIHJhZCwgdywgaCwgcGFkWCwgcGFkWSkge1xuICAgICAgICB2YXIgeDEgPSB4IC0gdyAvIDIgKyBwYWRYIC8gMixcbiAgICAgICAgICB4MiA9IHggKyB3IC8gMiAtIHBhZFggLyAyLFxuICAgICAgICAgIHkxID0geSAtIGggLyAyICsgcGFkWSAvIDIsXG4gICAgICAgICAgeTIgPSB5ICsgaCAvIDIgLSBwYWRZIC8gMjtcblxuICAgICAgICByZXR1cm4gWydNJywgeDEsIHkxLCAnTCcsIHgyLCB5MSwgJ0wnLCB4MiwgeTIsICdMJywgeDEsIHkyLCAnWiddO1xuICAgICAgfSk7XG5cbiAgICAgIHRpbWVQZXJpb2RTZWxlY3RNZW51LmF0dGFjaEV2ZW50SGFuZGxlcnMoe1xuICAgICAgICB0ZXh0T25DaGFuZ2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB0aW1lUGVyaW9kT25DaGFuZ2UoKTtcbiAgICAgICAgICBvbkNoYW5nZSgpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdGltZU11bFNlbGVjdE1lbnUuYXR0YWNoRXZlbnRIYW5kbGVycyh7XG4gICAgICAgIHRleHRPbkNoYW5nZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIG9uQ2hhbmdlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBhZ2dNZXRob2RTZWxlY3RNZW51LmF0dGFjaEV2ZW50SGFuZGxlcnMoe1xuICAgICAgICB0ZXh0T25DaGFuZ2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBvbkNoYW5nZSgpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdG9vbGJhci5hZGRDb21wb25lbnQoZ3JvdXAxKTtcbiAgICAgIHRvb2xiYXIuYWRkQ29tcG9uZW50KGdyb3VwMik7XG4gICAgICB0b29sYmFyLmFkZENvbXBvbmVudChncm91cDMpO1xuXG4gICAgICByZXR1cm4gdG9vbGJhcjtcbiAgICB9XG5cbiAgICBnZXRMb2dpY2FsU3BhY2UgKGF2YWlsYWJsZVdpZHRoLCBhdmFpbGFibGVIZWlnaHQpIHtcbiAgICAgIHZhciBsb2dpY2FsU3BhY2UsXG4gICAgICAgIHdpZHRoID0gMCxcbiAgICAgICAgaGVpZ2h0ID0gMCxcbiAgICAgICAgaSxcbiAgICAgICAgbG47XG5cbiAgICAgIGZvciAoaSA9IDAsIGxuID0gdGhpcy50b29sYmFycy5sZW5ndGg7IGkgPCBsbjsgaSsrKSB7XG4gICAgICAgIGxvZ2ljYWxTcGFjZSA9IHRoaXMudG9vbGJhcnNbaV0uZ2V0TG9naWNhbFNwYWNlKGF2YWlsYWJsZVdpZHRoLCBhdmFpbGFibGVIZWlnaHQpO1xuICAgICAgICB3aWR0aCA9IE1hdGgubWF4KGxvZ2ljYWxTcGFjZS53aWR0aCwgd2lkdGgpO1xuICAgICAgICBoZWlnaHQgKz0gbG9naWNhbFNwYWNlLmhlaWdodDtcbiAgICAgICAgdGhpcy50b29sYmFyc1tpXS53aWR0aCA9IGxvZ2ljYWxTcGFjZS53aWR0aDtcbiAgICAgICAgdGhpcy50b29sYmFyc1tpXS5oZWlnaHQgPSBsb2dpY2FsU3BhY2UuaGVpZ2h0O1xuICAgICAgfVxuICAgICAgaGVpZ2h0ICs9IHRoaXMucGFkZGluZztcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHdpZHRoOiB3aWR0aCxcbiAgICAgICAgaGVpZ2h0OiBoZWlnaHRcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcGxhY2VJbkNhbnZhcyAoY29udGFpbmVySW5zdGFuY2UpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgdHNPYmplY3QgPSBzZWxmLnRzT2JqZWN0O1xuXG4gICAgICBzZWxmLnBhZGRpbmcgPSA1O1xuICAgICAgdHNPYmplY3Quc3BhY2VNYW5hZ2VySW5zdGFuY2UuYWRkKFt7XG4gICAgICAgIG5hbWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gJ2RhdGEtYWdncmVnYXRvcic7XG4gICAgICAgIH0sXG4gICAgICAgIHJlZjogZnVuY3Rpb24gKG9iaikge1xuICAgICAgICAgIHJldHVybiBvYmpbJzAnXTtcbiAgICAgICAgfSxcbiAgICAgICAgc2VsZjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBzZWxmO1xuICAgICAgICB9LFxuICAgICAgICBwcmlvcml0eTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiAyO1xuICAgICAgICB9LFxuICAgICAgICBsYXlvdXQ6IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgICByZXR1cm4gb2JqLmlubGluZTtcbiAgICAgICAgfSxcbiAgICAgICAgb3JpZW50YXRpb246IFt7XG4gICAgICAgICAgdHlwZTogZnVuY3Rpb24gKG9iaikge1xuICAgICAgICAgICAgcmV0dXJuIG9iai5ob3Jpem9udGFsO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgcG9zaXRpb246IFt7XG4gICAgICAgICAgICB0eXBlOiBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgICAgICAgIHJldHVybiBvYmoudG9wO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFsaWdubWVudDogW3tcbiAgICAgICAgICAgICAgdHlwZTogZnVuY3Rpb24gKG9iaikge1xuICAgICAgICAgICAgICAgIHJldHVybiBvYmoubGVmdDtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgZGltZW5zaW9uczogW2Z1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgcGFyZW50ID0gdGhpcy5nZXRQYXJlbnRDb21wb25lbnRHcm91cCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmdldExvZ2ljYWxTcGFjZShwYXJlbnQuZ2V0V2lkdGgoKSwgcGFyZW50LmdldEhlaWdodCgpKTtcbiAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgIH1dXG4gICAgICAgICAgfV1cbiAgICAgICAgfV1cbiAgICAgIH1dKTtcbiAgICB9XG5cbiAgICBzZXREcmF3aW5nQ29uZmlndXJhdGlvbiAoeCwgeSwgd2lkdGgsIGhlaWdodCwgZ3JvdXApIHtcbiAgICAgIHZhciBtZXMgPSB0aGlzLm1lYXN1cmVtZW50O1xuICAgICAgbWVzLnggPSB4O1xuICAgICAgbWVzLnkgPSB5O1xuICAgICAgbWVzLndpZHRoID0gd2lkdGg7XG4gICAgICBtZXMuaGVpZ2h0ID0gaGVpZ2h0O1xuXG4gICAgICB0aGlzLnBhcmVudEdyb3VwID0gZ3JvdXA7XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGRyYXcgKHgsIHksIHdpZHRoLCBoZWlnaHQsIGdyb3VwKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgIGNvbmZpZyA9IHNlbGYuY29uZmlnLFxuICAgICAgICB0b29sYm94Q29tcENvbmZpZyA9IGNvbmZpZy50b29sYm94Q29tcG9uZW50LmNvbmZpZyxcbiAgICAgICAgdGltZVBlcmlvZFNlbGVjdE1lbnUgPSB0b29sYm94Q29tcENvbmZpZy50aW1lUGVyaW9kU2VsZWN0TWVudSxcbiAgICAgICAgdGltZU11bFNlbGVjdE1lbnUgPSB0b29sYm94Q29tcENvbmZpZy50aW1lTXVsU2VsZWN0TWVudSxcbiAgICAgICAgYWdnTWV0aG9kU2VsZWN0TWVudSA9IHRvb2xib3hDb21wQ29uZmlnLmFnZ01ldGhvZFNlbGVjdE1lbnUsXG4gICAgICAgIGFwcGx5QnV0dG9uID0gdG9vbGJveENvbXBDb25maWcuYXBwbHlCdXR0b24sXG4gICAgICAgIHJlc2V0QnV0dG9uID0gdG9vbGJveENvbXBDb25maWcucmVzZXRCdXR0b24sXG4gICAgICAgIG1lYXN1cmVtZW50ID0gc2VsZi5tZWFzdXJlbWVudCxcbiAgICAgICAgdG9vbGJhcnMgPSBzZWxmLnRvb2xiYXJzLFxuICAgICAgICBsbixcbiAgICAgICAgaSxcbiAgICAgICAgdG9vbGJhcixcbiAgICAgICAgbW9kZWwgPSBjb25maWcuY29tcG9zaXRpb24ucmVhY3RpdmVNb2RlbCxcbiAgICAgICAgZGF0YUFnZyA9IGNvbmZpZy5kYXRhQWdnLFxuXG4gICAgICAgIHRpbWVQZXJpb2RWYWwsXG4gICAgICAgIHRpbWVQZXJpb2RTZWxlY3RNZW51T3B0LFxuICAgICAgICB2YWxpZFRpbWVQZXJpb2QsXG4gICAgICAgIGluZGV4T2ZUaW1lVW5pdCxcblxuICAgICAgICBtdWx0aXBsaWVyVmFsLFxuICAgICAgICB0aW1lTXVsU2VsZWN0TWVudU9wdCxcbiAgICAgICAgdmFsaWRUaW1lUGVyaW9kTXVsdGlwbGllcixcblxuICAgICAgICBhZ2dWYWwsXG4gICAgICAgIGFnZ01ldGhvZFNlbGVjdE1lbnVPcHQsXG4gICAgICAgIGF2bEFnZ01ldGhvZHMsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENvbXB1dGUgYW5kIHBvcHVsYXRlIHRvb2xib3hlcyB3aXRoIHZhbGlkIHZhbHVlcyBvbiBjaGFuZ2UgaW4gcmFuZ2Ugb2YgdmlzdWFsIHdpbmRvd1xuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgcmFuZ2VPbkNoYW5nZSA9ICgpID0+IHtcbiAgICAgICAgICB2YXIgYWdncmVnYXRpb24gPSBzZWxmLmFnZ3JlZ2F0aW9uLFxuICAgICAgICAgICAgY3VycmVudEFnZ3JlZ2F0aW9uT2JqLFxuICAgICAgICAgICAgdGltZVBlcmlvZCxcbiAgICAgICAgICAgIHRpbWVQZXJpb2RNdWx0aXBsaWVyLFxuICAgICAgICAgICAgYWdncmVnYXRpb25NZXRob2Q7XG5cbiAgICAgICAgICBzZWxmLmdldFZhbGlkQWdncmVnYXRpb24oKTtcbiAgICAgICAgICBjdXJyZW50QWdncmVnYXRpb25PYmogPSBzZWxmLmdldEN1cnJlbnRBZ2dyZWF0aW9uKCk7XG4gICAgICAgICAgdGltZVBlcmlvZCA9IGN1cnJlbnRBZ2dyZWdhdGlvbk9iai50aW1lUGVyaW9kO1xuICAgICAgICAgIHRpbWVQZXJpb2RNdWx0aXBsaWVyID0gY3VycmVudEFnZ3JlZ2F0aW9uT2JqLnRpbWVQZXJpb2RNdWx0aXBsaWVyO1xuICAgICAgICAgIGFnZ3JlZ2F0aW9uTWV0aG9kID0gY3VycmVudEFnZ3JlZ2F0aW9uT2JqLmFnZ3JlZ2F0aW9uTWV0aG9kO1xuXG4gICAgICAgICAgdGltZVBlcmlvZFNlbGVjdE1lbnVPcHQgPSBbXTtcbiAgICAgICAgICB0aW1lTXVsU2VsZWN0TWVudU9wdCA9IFtdO1xuICAgICAgICAgIGFnZ01ldGhvZFNlbGVjdE1lbnVPcHQgPSBbXTtcblxuICAgICAgICAgIHZhbGlkVGltZVBlcmlvZCA9IGNvbmZpZy52YWxpZFRpbWVQZXJpb2Q7XG4gICAgICAgICAgdmFsaWRUaW1lUGVyaW9kTXVsdGlwbGllciA9IGNvbmZpZy52YWxpZFRpbWVQZXJpb2RNdWx0aXBsaWVyO1xuICAgICAgICAgIGF2bEFnZ01ldGhvZHMgPSBjb25maWcuYXZsQWdnTWV0aG9kcztcblxuICAgICAgICAgIGFwcGx5QnV0dG9uLnVwZGF0ZVZpc3VhbCgnZGlzYWJsZWQnKTtcblxuICAgICAgICAgIGlmIChhZ2dyZWdhdGlvbi5iaW5TaXplICE9PSBtb2RlbC5wcm9wKCdiaW4tc2l6ZScpICYmXG4gICAgICAgICAgICBhZ2dyZWdhdGlvbk1ldGhvZC52YWx1ZSA9PT0gY29uZmlnLmRlZmF1bHRBZ2dNZXRob2QpIHtcbiAgICAgICAgICAgIGFnZ3JlZ2F0aW9uLmJpblNpemUgPSBudWxsO1xuICAgICAgICAgICAgYWdncmVnYXRpb24uYWdncmVnYXRpb25NZXRob2QgPSBudWxsO1xuICAgICAgICAgICAgcmVzZXRCdXR0b24udXBkYXRlVmlzdWFsKCdkaXNhYmxlZCcpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXNldEJ1dHRvbi51cGRhdGVWaXN1YWwoJ2VuYWJsZWQnKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoIWNvbmZpZy5jYW5BZ2dyZWdhdGUpIHtcbiAgICAgICAgICAgIHRpbWVQZXJpb2RTZWxlY3RNZW51LnVwZGF0ZVZpc3VhbCgnZGlzYWJsZWQnKTtcbiAgICAgICAgICAgIHRpbWVNdWxTZWxlY3RNZW51LnVwZGF0ZVZpc3VhbCgnZGlzYWJsZWQnKTtcbiAgICAgICAgICAgIGFnZ01ldGhvZFNlbGVjdE1lbnUudXBkYXRlVmlzdWFsKCdkaXNhYmxlZCcpO1xuICAgICAgICAgICAgcmVzZXRCdXR0b24udXBkYXRlVmlzdWFsKCdkaXNhYmxlZCcpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aW1lUGVyaW9kU2VsZWN0TWVudS51cGRhdGVWaXN1YWwoJ2VuYWJsZWQnKTtcbiAgICAgICAgICAgIHRpbWVNdWxTZWxlY3RNZW51LnVwZGF0ZVZpc3VhbCgnZW5hYmxlZCcpO1xuICAgICAgICAgICAgYWdnTWV0aG9kU2VsZWN0TWVudS51cGRhdGVWaXN1YWwoJ2VuYWJsZWQnKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBmb3IgKHRpbWVQZXJpb2RWYWwgb2YgdmFsaWRUaW1lUGVyaW9kKSB7XG4gICAgICAgICAgICB0aW1lUGVyaW9kU2VsZWN0TWVudU9wdC5wdXNoKHtcbiAgICAgICAgICAgICAgbmFtZTogdGltZVBlcmlvZFZhbCxcbiAgICAgICAgICAgICAgdmFsdWU6IHRpbWVQZXJpb2RWYWxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRpbWVQZXJpb2RTZWxlY3RNZW51LnVwZGF0ZUxpc3QodGltZVBlcmlvZFNlbGVjdE1lbnVPcHQpO1xuICAgICAgICAgIHRpbWVQZXJpb2RTZWxlY3RNZW51LnZhbHVlKHRpbWVQZXJpb2QpO1xuXG4gICAgICAgICAgaW5kZXhPZlRpbWVVbml0ID0gdmFsaWRUaW1lUGVyaW9kLmluZGV4T2YodGltZVBlcmlvZCk7XG5cbiAgICAgICAgICBpZiAoaW5kZXhPZlRpbWVVbml0ID49IDApIHtcbiAgICAgICAgICAgIGZvciAobXVsdGlwbGllclZhbCBvZiB2YWxpZFRpbWVQZXJpb2RNdWx0aXBsaWVyW2luZGV4T2ZUaW1lVW5pdF0pIHtcbiAgICAgICAgICAgICAgdGltZU11bFNlbGVjdE1lbnVPcHQucHVzaCh7XG4gICAgICAgICAgICAgICAgbmFtZTogbXVsdGlwbGllclZhbC50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBtdWx0aXBsaWVyVmFsLnRvU3RyaW5nKClcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGltZU11bFNlbGVjdE1lbnUudXBkYXRlTGlzdCh0aW1lTXVsU2VsZWN0TWVudU9wdCk7XG4gICAgICAgICAgdGltZU11bFNlbGVjdE1lbnUudmFsdWUodGltZVBlcmlvZE11bHRpcGxpZXIudG9TdHJpbmcoKSk7XG5cbiAgICAgICAgICBmb3IgKGFnZ1ZhbCBpbiBhdmxBZ2dNZXRob2RzKSB7XG4gICAgICAgICAgICBhZ2dNZXRob2RTZWxlY3RNZW51T3B0LnB1c2goe1xuICAgICAgICAgICAgICBuYW1lOiBhdmxBZ2dNZXRob2RzW2FnZ1ZhbF0uZm9ybWFsTmFtZSxcbiAgICAgICAgICAgICAgdmFsdWU6IGF2bEFnZ01ldGhvZHNbYWdnVmFsXS5uaWNrTmFtZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYWdnTWV0aG9kU2VsZWN0TWVudS51cGRhdGVMaXN0KGFnZ01ldGhvZFNlbGVjdE1lbnVPcHQpO1xuICAgICAgICAgIGFnZ01ldGhvZFNlbGVjdE1lbnUudmFsdWUoYWdncmVnYXRpb25NZXRob2QudmFsdWUpO1xuICAgICAgICB9O1xuXG4gICAgICBzZWxmLmdldEF2YWlsYWJsZWxBZ2dyZWFnYXRpb24oKTtcblxuICAgICAgeCA9IHggPT09IHVuZGVmaW5lZCA/IG1lYXN1cmVtZW50LnggOiB4O1xuICAgICAgeSA9IHkgPT09IHVuZGVmaW5lZCA/IG1lYXN1cmVtZW50LnkgOiB5O1xuICAgICAgd2lkdGggPSB3aWR0aCA9PT0gdW5kZWZpbmVkID8gbWVhc3VyZW1lbnQud2lkdGggOiB3aWR0aDtcbiAgICAgIGhlaWdodCA9IGhlaWdodCA9PT0gdW5kZWZpbmVkID8gbWVhc3VyZW1lbnQuaGVpZ2h0IDogaGVpZ2h0O1xuICAgICAgZ3JvdXAgPSBncm91cCA9PT0gdW5kZWZpbmVkID8gc2VsZi5wYXJlbnRHcm91cCA6IGdyb3VwO1xuICAgICAgaWYgKHdpZHRoICYmIGhlaWdodCkge1xuICAgICAgICBmb3IgKGkgPSAwLCBsbiA9IHRvb2xiYXJzLmxlbmd0aDsgaSA8IGxuOyBpKyspIHtcbiAgICAgICAgICB0b29sYmFyID0gdG9vbGJhcnNbaV07XG4gICAgICAgICAgdG9vbGJhci5kcmF3KHgsIHksIGdyb3VwKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmFuZ2VPbkNoYW5nZSgpO1xuICAgICAgYXBwbHlCdXR0b24udXBkYXRlVmlzdWFsKCdkaXNhYmxlZCcpO1xuICAgICAgcmVzZXRCdXR0b24udXBkYXRlVmlzdWFsKCdkaXNhYmxlZCcpO1xuICAgICAgY29uZmlnLmRlZmF1bHRBZ2dNZXRob2QgPSBkYXRhQWdnLmdldERlZmF1bHRBZ2dyZWdhdGlvbk1ldGhvZCgpLm5pY2tOYW1lO1xuXG4gICAgICBtb2RlbC5vblByb3BzQ2hhbmdlKFsnYmluLXNpemUnLCAnYWdncmVnYXRpb24tZm4nXSwgcmFuZ2VPbkNoYW5nZSk7XG4gICAgfVxuXG4gICAgZGlzcG9zZSAoKSB7XG4gICAgICAvLyBkaXNwb3NlIGV4dGVuc2lvblxuICAgIH1cbiAgfVxuICByZXR1cm4gQWdncmVnYXRvcjtcbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvZmN0cy1leHQtYWdncmVnYXRvci5qcyJdLCJzb3VyY2VSb290IjoiIn0=