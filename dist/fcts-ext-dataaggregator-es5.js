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
	            label: {
	              'font-size': '13',
	              'fill': '#696969'
	            },
	            timeMultiplierInputField: {
	              active: {
	                'fill': '#fff',
	                'labelFill': '#696969',
	                'stroke': '#c8cecd',
	                'strokeWidth': 1,
	                'hoverStroke': '#1e1f1f',
	                'hoverStrokeWidth': 1,
	                'radius': 1,
	                'width': 45,
	                'height': 22
	              },
	              inactive: {
	                'fill': '#fff',
	                'stroke-width': 1,
	                'stroke': '#ced5d4',
	                'labelFill': '#000'
	              }
	            },
	            timePeriodInputField: {
	              active: {
	                'fill': '#fff',
	                'labelFill': '#696969',
	                'stroke': '#c8cecd',
	                'strokeWidth': 1,
	                'hoverStroke': '#1e1f1f',
	                'hoverStrokeWidth': 1,
	                'radius': 1,
	                'width': 75,
	                'height': 22
	              },
	              inactive: {
	                'fill': '#fff',
	                'stroke-width': 1,
	                'stroke': '#ced5d4',
	                'labelFill': '#000'
	              }
	            },
	            aggregationMethodInputField: {
	              active: {
	                'fill': '#fff',
	                'labelFill': '#696969',
	                'stroke': '#c8cecd',
	                'strokeWidth': 1,
	                'hoverStroke': '#1e1f1f',
	                'hoverStrokeWidth': 1,
	                'radius': 1,
	                'width': 100,
	                'height': 22
	              },
	              inactive: {
	                'fill': '#fff',
	                'stroke-width': 1,
	                'stroke': '#ced5d4',
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
	                'stroke': '#898b8b',
	                'radius': 1,
	                'labelFill': '#000',
	                'hoverFill': '#e6e8e8',
	                'hoverLabelFill': '#000'
	              }
	            },
	            applyButton: {
	              active: {
	                'fill': '#555',
	                'labelFill': '#f3f3f3',
	                'stroke': '#ced5d4',
	                'strokeWidth': 1,
	                'hoverFill': '#555',
	                'hoverStrokeWidth': 1,
	                'hoverStroke': '',
	                'radius': 1,
	                'width': 54,
	                'height': 22
	              },
	              inactive: {
	                'fill': '#bebebe',
	                'stroke-width': 1,
	                'stroke': '#ced5d4',
	                'labelFill': '#f3f3f3'
	              }
	            },
	            resetButton: {
	              active: {
	                'fill': '#898b8b',
	                'labelFill': '#f3f3f3',
	                'stroke': '#ced5d4',
	                'strokeWidth': 1,
	                'hoverFill': '#898b8b',
	                'hoverStrokeWidth': 1,
	                'hoverStroke': '',
	                'radius': 1,
	                'width': 54,
	                'height': 22
	              },
	              inactive: {
	                'fill': '#bebebe',
	                'stroke-width': 1,
	                'stroke': '#ced5d4',
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
	          label: style.label || {},
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
	                fill: style.dropDown.normal.fill,
	                stroke: style.dropDown.normal.stroke,
	                radius: style.dropDown.normal.radius
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
	            style: style.label
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYjIxMGRlMmNkZDU4ODYzYzcxOTEiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8od2VicGFjaykvYnVpbGRpbi9tb2R1bGUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2ZjdHMtZXh0LWFnZ3JlZ2F0b3IuanMiXSwibmFtZXMiOlsiQWdncmVnYXRvckdldHRlciIsInJlcXVpcmUiLCJlbnYiLCJmYWN0b3J5IiwibW9kdWxlIiwiZXhwb3J0cyIsImRvY3VtZW50Iiwid2luIiwiRXJyb3IiLCJBZ2dyZWdhdG9yIiwid2luZG93IiwiX3dpbmRvdyIsIndpbmRvd0V4aXN0cyIsIkZDIiwiRnVzaW9uQ2hhcnRzIiwicmVnaXN0ZXIiLCJyZWdpc3RlckNvbXBvbmVudCIsImRlcCIsImFwcGxpZWRBZ2dyZWdhdGlvbiIsImJpblNpemUiLCJhZ2dyZWdhdGlvbk1ldGhvZCIsImNvbmZpZyIsImRhdGFBZ2ciLCJhdmxUaW1lUGVyaW9kcyIsImdldEFnZ3JlZ2F0aW9uVGltZVJ1bGVzIiwiaSIsImxlbiIsImF2bFRpbWVNdWx0aXBsaWVyIiwibGVuZ3RoIiwicHVzaCIsInBvc3NpYmxlRmFjdG9ycyIsInNlbGYiLCJ0c09iamVjdCIsImoiLCJsZW4xIiwibGVuMiIsIm1heE51bU9mUGxvdCIsImNvbXBvc2l0aW9uIiwicmVhY3RpdmVNb2RlbCIsIm1vZGVsIiwibXVsdGlwbGllcnNBcnIiLCJjdXJyZW50VGltZUxlbmd0aCIsInRpbWVQZXJpb2QiLCJ0aW1lIiwibXVsdGlwbGllciIsIm1pbkJpblNpemUiLCJnbG9iYWxSZWFjdGl2ZU1vZGVsIiwidmFsaWRUaW1lUGVyaW9kIiwidmFsaWRUaW1lUGVyaW9kTXVsdGlwbGllciIsImF2bEFnZ01ldGhvZHMiLCJnZXRBbGxBZ2dyZWdhdGlvbk1ldGhvZCIsIm5hbWUiLCJpbnRlcnZhbCIsImN1cnJlbnRBZ2dNZXRob2QiLCJzdWl0YWJsZUludGVydmFsIiwicHJvcCIsImlzRmluaXRlIiwiY2FuQWdncmVnYXRlIiwidGltZVJ1bGVzIiwiZ2V0U3VpdGFibGVJbnRlcnZhbCIsInN0ZXAiLCJmb3JtYWxOYW1lIiwibmlja05hbWUiLCJ0aW1lUGVyaW9kTXVsdGlwbGllciIsInZhbHVlIiwidGV4dCIsInRvb2xib3hDb21wb25lbnQiLCJhcGkiLCJzdG9yZSIsInNhdmVUbyIsInJlcXVpcmVkUGFyYW1zIiwiYWNxdWlyZSIsImlpIiwicGFyYW0iLCJhcmd1bWVudHMiLCJjaGFydEluc3RhbmNlIiwiYXBpSW5zdGFuY2UiLCJnZXRDb21wb25lbnRTdG9yZSIsImdldENhbnZhc0J5SW5kZXgiLCJpbXBsIiwiZ2V0RGF0YUFnZ3JlZ2F0b3IiLCJ0b29sYm94IiwiZ2V0Q29tcG9uZW50IiwidG9vbGJhcnMiLCJtZWFzdXJlbWVudCIsImNyZWF0ZVRvb2xiYXIiLCJncm91cDEiLCJncm91cDIiLCJncm91cDMiLCJ0b29sYmFyIiwidGltZU11bFNlbGVjdE1lbnUiLCJ0aW1lUGVyaW9kU2VsZWN0TWVudSIsImFnZ01ldGhvZFNlbGVjdE1lbnUiLCJyZXNldEJ1dHRvbiIsImFwcGx5QnV0dG9uIiwibGFiZWwiLCJ0b29sYm94Q29tcENvbmZpZyIsIkhvcml6b250YWxUb29sYmFyIiwiQ29tcG9uZW50R3JvdXAiLCJTeW1ib2xTdG9yZSIsImdyYXBoaWNzIiwicGFwZXIiLCJjb250YWluZXIiLCJjaGFydCIsInNtYXJ0TGFiZWwiLCJtdWx0aXBsaWVyVmFsIiwidGltZU11bFNlbGVjdE1lbnVPcHQiLCJ0aW1lUGVyaW9kTWVudURpc2FibGVDb25maWciLCJ0aW1lTXVsdGlwbGllck1lbnVEaXNhYmxlQ29uZmlnIiwiYWdnTWV0aG9kTWVudURpc2FibGVvbmZpZyIsImRyb3BEb3duTWVudVN0eWxlIiwiYXBwbHlCdXR0b25EaXNhYmxlQ29uZmlnIiwicmVzZXRCdXR0b25EaXNhYmxlQ29uZmlnIiwic3R5bGUiLCJkZXBlbmRlbmNpZXMiLCJjaGFydENvbnRhaW5lciIsImFwcGx5Iiwic2V0IiwidGltZVBlcmlvZFZhbCIsInRpbWVQZXJpb2RNdWx0aXBsaWVyVmFsIiwiYWdnTWV0aG9kU2VsZWN0TWVudVZhbCIsImtleXMiLCJ0aW1lSW50ZXJ2YWwiLCJhZ2dyZWdhdGlvbiIsImNhbnZhcyIsIk51bWJlciIsImxvY2siLCJ1bmxvY2siLCJ1cGRhdGVWaXN1YWwiLCJyZXNldEFnZ3JlZ2F0aW9uIiwidGltZVBlcmlvZE9uQ2hhbmdlIiwicHJldlRpbWVQZXJvaWRNdWxWYWwiLCJpbmRleE9mVGltZVVuaXQiLCJpbmRleE9mVGltZU11bCIsImluZGV4T2YiLCJ0b1N0cmluZyIsInVwZGF0ZUxpc3QiLCJvbkNoYW5nZSIsInR5cGUiLCJjdXJyZW50QWdnIiwiZ2V0Q3VycmVudEFnZ3JlYXRpb24iLCJ1c3JDb25maWciLCJlbmFibGVkIiwicG9zV3J0Q2FudmFzIiwiYWxpZ25tZW50Iiwib3JpZW50YXRpb24iLCJzdHlsZXMiLCJ0aW1lTXVsdGlwbGllcklucHV0RmllbGQiLCJhY3RpdmUiLCJpbmFjdGl2ZSIsInRpbWVQZXJpb2RJbnB1dEZpZWxkIiwiYWdncmVnYXRpb25NZXRob2RJbnB1dEZpZWxkIiwiZHJvcERvd24iLCJub3JtYWwiLCJiYXNlIiwiZm9udCIsInNldENvbmZpZyIsImZpbGwiLCJib3JkZXJUaGlja25lc3MiLCJkaXNhYmxlZCIsInNlbGVjdGVkIiwibGFiZWxGaWxsIiwic3Ryb2tlIiwicmFkaXVzIiwiaG92ZXIiLCJob3ZlckZpbGwiLCJob3ZlckxhYmVsRmlsbCIsIkxhYmVsIiwiU2VsZWN0U3ltYm9sIiwiT2JqZWN0IiwiYXNzaWduIiwiYnRuVGV4dFN0eWxlIiwiZHJvcERvd25NZW51Iiwic2V0U3RhdGVDb25maWciLCJTeW1ib2wiLCJhdHRhY2hFdmVudEhhbmRsZXJzIiwiY2xpY2siLCJhZGRTeW1ib2wiLCJ4IiwieSIsInJhZCIsInciLCJoIiwicGFkWCIsInBhZFkiLCJ4MSIsIngyIiwieTEiLCJ5MiIsInRleHRPbkNoYW5nZSIsImFkZENvbXBvbmVudCIsImF2YWlsYWJsZVdpZHRoIiwiYXZhaWxhYmxlSGVpZ2h0IiwibG9naWNhbFNwYWNlIiwid2lkdGgiLCJoZWlnaHQiLCJsbiIsImdldExvZ2ljYWxTcGFjZSIsIk1hdGgiLCJtYXgiLCJwYWRkaW5nIiwiY29udGFpbmVySW5zdGFuY2UiLCJzcGFjZU1hbmFnZXJJbnN0YW5jZSIsImFkZCIsInJlZiIsIm9iaiIsInByaW9yaXR5IiwibGF5b3V0IiwiaW5saW5lIiwiaG9yaXpvbnRhbCIsInBvc2l0aW9uIiwidG9wIiwibGVmdCIsImRpbWVuc2lvbnMiLCJwYXJlbnQiLCJnZXRQYXJlbnRDb21wb25lbnRHcm91cCIsImdldFdpZHRoIiwiZ2V0SGVpZ2h0IiwiZ3JvdXAiLCJtZXMiLCJwYXJlbnRHcm91cCIsInRpbWVQZXJpb2RTZWxlY3RNZW51T3B0IiwiYWdnVmFsIiwiYWdnTWV0aG9kU2VsZWN0TWVudU9wdCIsInJhbmdlT25DaGFuZ2UiLCJjdXJyZW50QWdncmVnYXRpb25PYmoiLCJnZXRWYWxpZEFnZ3JlZ2F0aW9uIiwiZGVmYXVsdEFnZ01ldGhvZCIsImdldEF2YWlsYWJsZWxBZ2dyZWFnYXRpb24iLCJ1bmRlZmluZWQiLCJkcmF3IiwiZ2V0RGVmYXVsdEFnZ3JlZ2F0aW9uTWV0aG9kIiwib25Qcm9wc0NoYW5nZSJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUN0Q0E7Ozs7QUFDQSxLQUFNQSxtQkFBbUIsbUJBQUFDLENBQVEsQ0FBUixDQUF6Qjs7QUFFQSxFQUFDLENBQUMsVUFBVUMsR0FBVixFQUFlQyxPQUFmLEVBQXdCO0FBQ3hCLE9BQUksZ0NBQU9DLE1BQVAsT0FBa0IsUUFBbEIsSUFBOEJBLE9B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a0JBQVo7QUFDRCxRQTVCMkI7QUFBQSx5QkE4QlgyTCxHQTlCVyxFQThCTjtBQUNwQixjQUFLM0wsa0JBQUwsQ0FBd0J3QixVQUF4QixHQUFxQ21LLElBQUluSyxVQUF6QztBQUNBLGNBQUt4QixrQkFBTCxDQUF3QjZDLG9CQUF4QixHQUErQzhJLElBQUk5SSxvQkFBbkQ7QUFDQSxjQUFLN0Msa0JBQUwsQ0FBd0JFLGlCQUF4QixHQUE0Q3lMLElBQUl6TCxpQkFBaEQ7QUFDRDtBQWxDMkI7O0FBQUE7QUFBQTs7QUF1NUI5QixVQUFPWCxVQUFQO0FBQ0QsRUF4NUJELEMiLCJmaWxlIjoiZmN0cy1leHQtZGF0YWFnZ3JlZ2F0b3ItZXM1LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgYjIxMGRlMmNkZDU4ODYzYzcxOTEiLCIndXNlIHN0cmljdCc7XG5jb25zdCBBZ2dyZWdhdG9yR2V0dGVyID0gcmVxdWlyZSgnLi9mY3RzLWV4dC1hZ2dyZWdhdG9yJyk7XG5cbjsoZnVuY3Rpb24gKGVudiwgZmFjdG9yeSkge1xuICBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGVudi5kb2N1bWVudFxuICAgICAgID8gZmFjdG9yeShlbnYpIDogZnVuY3Rpb24gKHdpbikge1xuICAgICAgICAgaWYgKCF3aW4uZG9jdW1lbnQpIHtcbiAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdXaW5kb3cgd2l0aCBkb2N1bWVudCBub3QgcHJlc2VudCcpO1xuICAgICAgICAgfVxuICAgICAgICAgcmV0dXJuIGZhY3Rvcnkod2luLCB0cnVlKTtcbiAgICAgICB9O1xuICB9IGVsc2Uge1xuICAgIGVudi5BZ2dyZWdhdG9yID0gZmFjdG9yeShlbnYsIHRydWUpO1xuICB9XG59KSh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyA/IHdpbmRvdyA6IHRoaXMsIGZ1bmN0aW9uIChfd2luZG93LCB3aW5kb3dFeGlzdHMpIHtcbiAgdmFyIEZDID0gX3dpbmRvdy5GdXNpb25DaGFydHM7XG5cbiAgRkMucmVnaXN0ZXIoJ2V4dGVuc2lvbicsIFsncHJpdmF0ZScsICdkYXRhLWFnZ3JlZ2F0b3InLCBmdW5jdGlvbiAoKSB7XG4gICAgRkMucmVnaXN0ZXJDb21wb25lbnQoJ2V4dGVuc2lvbnMnLCAnZGF0YS1hZ2dyZWdhdG9yJywgQWdncmVnYXRvckdldHRlcih7RkM6IEZDfSkpO1xuICB9XSk7XG59KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9pbmRleC5qcyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obW9kdWxlKSB7XG5cdGlmKCFtb2R1bGUud2VicGFja1BvbHlmaWxsKSB7XG5cdFx0bW9kdWxlLmRlcHJlY2F0ZSA9IGZ1bmN0aW9uKCkge307XG5cdFx0bW9kdWxlLnBhdGhzID0gW107XG5cdFx0Ly8gbW9kdWxlLnBhcmVudCA9IHVuZGVmaW5lZCBieSBkZWZhdWx0XG5cdFx0bW9kdWxlLmNoaWxkcmVuID0gW107XG5cdFx0bW9kdWxlLndlYnBhY2tQb2x5ZmlsbCA9IDE7XG5cdH1cblx0cmV0dXJuIG1vZHVsZTtcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vICh3ZWJwYWNrKS9idWlsZGluL21vZHVsZS5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGRlcCkge1xuICAvKipcbiAgICogQ2xhc3MgcmVwcmVzZW50aW5nIHRoZSBEYXRhIEFnZ3JlZ2F0b3IuXG4gICAqL1xuICBjbGFzcyBBZ2dyZWdhdG9yIHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBBZ2dyZWdhdG9yLlxuICAgICAqIEB0eXBlZGVmIHtvYmplY3R9IEFnZ3JlZ2F0b3IuYWdncmVnYXRpb25cbiAgICAgKiBAcHJvcGVydHkge3N0cmluZ30gYmluU2l6ZSAtIFRoZSBiaW5TaXplIGFwcGxpZWQgdG8gYWdncmVnYXRlLlxuICAgICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBhZ2dyZWdhdGlvbk1ldGhvZCAtIFRoZSBtZXRob2QgYXBwbGllZCB0byBhZ2dyZWdhdGUuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgLyoqXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgICB0aGlzLmFwcGxpZWRBZ2dyZWdhdGlvbiA9IHtcbiAgICAgICAgYmluU2l6ZTogbnVsbCxcbiAgICAgICAgYWdncmVnYXRpb25NZXRob2Q6IG51bGxcbiAgICAgIH07XG4gICAgICB0aGlzLmNvbmZpZyA9IHt9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFuIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIGJpblNpemUsIGFnZ3JlZ2F0aW9uTWV0aG9kLlxuICAgICAqIEB0eXBlIHtBZ2dyZWdhdG9yLmFnZ3JlZ2F0aW9ufVxuICAgICAqL1xuICAgIGdldCBhZ2dyZWdhdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5hcHBsaWVkQWdncmVnYXRpb247XG4gICAgfVxuXG4gICAgc2V0IGFnZ3JlZ2F0aW9uIChvYmopIHtcbiAgICAgIHRoaXMuYXBwbGllZEFnZ3JlZ2F0aW9uLnRpbWVQZXJpb2QgPSBvYmoudGltZVBlcmlvZDtcbiAgICAgIHRoaXMuYXBwbGllZEFnZ3JlZ2F0aW9uLnRpbWVQZXJpb2RNdWx0aXBsaWVyID0gb2JqLnRpbWVQZXJpb2RNdWx0aXBsaWVyO1xuICAgICAgdGhpcy5hcHBsaWVkQWdncmVnYXRpb24uYWdncmVnYXRpb25NZXRob2QgPSBvYmouYWdncmVnYXRpb25NZXRob2Q7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0cyBhdmFpbGFibGUgYWdncmVnYXRpb24gb3B0aW9ucyBpbiBjb25maWd1cmF0aW9uIG9mIGV4dGVuc2lvblxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgZ2V0QXZhaWxhYmxlbEFnZ3JlYWdhdGlvbiAoKSB7XG4gICAgICB2YXIgY29uZmlnID0gdGhpcy5jb25maWcsXG4gICAgICAgIGRhdGFBZ2cgPSBjb25maWcuZGF0YUFnZyxcbiAgICAgICAgYXZsVGltZVBlcmlvZHMgPSBjb25maWcuYXZsVGltZVBlcmlvZHMgPSBkYXRhQWdnLmdldEFnZ3JlZ2F0aW9uVGltZVJ1bGVzKCksXG4gICAgICAgIGksXG4gICAgICAgIGxlbjtcblxuICAgICAgY29uZmlnLmF2bFRpbWVNdWx0aXBsaWVyID0gW107XG4gICAgICBsZW4gPSBhdmxUaW1lUGVyaW9kcy5sZW5ndGg7XG5cbiAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBjb25maWcuYXZsVGltZU11bHRpcGxpZXIucHVzaChhdmxUaW1lUGVyaW9kc1tpXS5wb3NzaWJsZUZhY3RvcnMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENhbGN1bGF0ZXMgdmFsaWQgYWdncmVnYXRpb24gdGltZSBwZXJpb2RzIGFuZCBjb3JyZXNwb25kaW5nIG11bHRpcGxpZXJzXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBnZXRWYWxpZEFnZ3JlZ2F0aW9uICgpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgY29uZmlnID0gc2VsZi5jb25maWcsXG4gICAgICAgIHRzT2JqZWN0ID0gc2VsZi50c09iamVjdCxcbiAgICAgICAgZGF0YUFnZyA9IGNvbmZpZy5kYXRhQWdnLFxuICAgICAgICBpLFxuICAgICAgICBqLFxuICAgICAgICBsZW4xLFxuICAgICAgICBsZW4yLFxuICAgICAgICBhdmxUaW1lUGVyaW9kcyxcbiAgICAgICAgYXZsVGltZU11bHRpcGxpZXIsXG4gICAgICAgIG1heE51bU9mUGxvdCA9IGNvbmZpZy5jb21wb3NpdGlvbi5yZWFjdGl2ZU1vZGVsLm1vZGVsWydtYXgtcGxvdC1wb2ludCddLFxuICAgICAgICBtdWx0aXBsaWVyc0FycixcbiAgICAgICAgY3VycmVudFRpbWVMZW5ndGgsXG4gICAgICAgIHRpbWVQZXJpb2QsXG4gICAgICAgIHRpbWUsXG4gICAgICAgIGJpblNpemUsXG4gICAgICAgIG11bHRpcGxpZXIsXG4gICAgICAgIG1pbkJpblNpemU7XG5cbiAgICAgIGNvbmZpZy5jdXJyZW50VGltZUxlbmd0aCA9IHRzT2JqZWN0Lmdsb2JhbFJlYWN0aXZlTW9kZWwubW9kZWxbJ3gtYXhpcy12aXNpYmxlLXJhbmdlLWVuZCddIC1cbiAgICAgICAgdHNPYmplY3QuZ2xvYmFsUmVhY3RpdmVNb2RlbC5tb2RlbFsneC1heGlzLXZpc2libGUtcmFuZ2Utc3RhcnQnXTtcblxuICAgICAgYXZsVGltZVBlcmlvZHMgPSBjb25maWcuYXZsVGltZVBlcmlvZHM7XG4gICAgICBhdmxUaW1lTXVsdGlwbGllciA9IGNvbmZpZy5hdmxUaW1lTXVsdGlwbGllcjtcbiAgICAgIGN1cnJlbnRUaW1lTGVuZ3RoID0gY29uZmlnLmN1cnJlbnRUaW1lTGVuZ3RoO1xuXG4gICAgICBjb25maWcubWluQmluU2l6ZSA9IG1pbkJpblNpemUgPSBjdXJyZW50VGltZUxlbmd0aCAvIG1heE51bU9mUGxvdDtcblxuICAgICAgY29uZmlnLnZhbGlkVGltZVBlcmlvZCA9IFtdO1xuICAgICAgY29uZmlnLnZhbGlkVGltZVBlcmlvZE11bHRpcGxpZXIgPSBbXTtcbiAgICAgIGNvbmZpZy5hdmxBZ2dNZXRob2RzID0gZGF0YUFnZy5nZXRBbGxBZ2dyZWdhdGlvbk1ldGhvZCgpO1xuXG4gICAgICBmb3IgKGkgPSAwLCBsZW4xID0gYXZsVGltZVBlcmlvZHMubGVuZ3RoOyBpIDwgbGVuMTsgaSsrKSB7XG4gICAgICAgIHRpbWVQZXJpb2QgPSBhdmxUaW1lUGVyaW9kc1tpXS5uYW1lO1xuICAgICAgICB0aW1lID0gYXZsVGltZVBlcmlvZHNbaV0uaW50ZXJ2YWw7XG4gICAgICAgIG11bHRpcGxpZXJzQXJyID0gW107XG5cbiAgICAgICAgZm9yIChqID0gMCwgbGVuMiA9IGF2bFRpbWVNdWx0aXBsaWVyW2ldLmxlbmd0aDsgaiA8IGxlbjI7IGorKykge1xuICAgICAgICAgIG11bHRpcGxpZXIgPSBhdmxUaW1lTXVsdGlwbGllcltpXVtqXTtcbiAgICAgICAgICBiaW5TaXplID0gbXVsdGlwbGllciAqIHRpbWU7XG5cbiAgICAgICAgICBpZiAoKGJpblNpemUgPj0gbWluQmluU2l6ZSkpIHtcbiAgICAgICAgICAgIG11bHRpcGxpZXJzQXJyLnB1c2goYXZsVGltZU11bHRpcGxpZXJbaV1bal0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobXVsdGlwbGllcnNBcnIubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGNvbmZpZy52YWxpZFRpbWVQZXJpb2RNdWx0aXBsaWVyLnB1c2gobXVsdGlwbGllcnNBcnIpO1xuICAgICAgICAgIGNvbmZpZy52YWxpZFRpbWVQZXJpb2QucHVzaCh0aW1lUGVyaW9kKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgY3VycmVudCBBZ2dyZWdhdGlvbiBhcHBsaWVkIHRvIHRpbWVzZXJpZXNcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGdldEN1cnJlbnRBZ2dyZWF0aW9uICgpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgY29uZmlnID0gc2VsZi5jb25maWcsXG4gICAgICAgIGRhdGFBZ2cgPSBjb25maWcuZGF0YUFnZyxcbiAgICAgICAgY29tcG9zaXRpb24gPSBjb25maWcuY29tcG9zaXRpb24sXG4gICAgICAgIG1vZGVsID0gY29tcG9zaXRpb24ucmVhY3RpdmVNb2RlbCxcbiAgICAgICAgY3VycmVudEFnZ01ldGhvZCxcbiAgICAgICAgc3VpdGFibGVJbnRlcnZhbCxcbiAgICAgICAgYmluU2l6ZTtcblxuICAgICAgYmluU2l6ZSA9IG1vZGVsLnByb3AoJ2Jpbi1zaXplJykgLSAxO1xuXG4gICAgICBpZiAoaXNGaW5pdGUoYmluU2l6ZSkpIHtcbiAgICAgICAgY29uZmlnLmNhbkFnZ3JlZ2F0ZSA9IHRydWU7XG4gICAgICAgIHN1aXRhYmxlSW50ZXJ2YWwgPSBkYXRhQWdnLnRpbWVSdWxlcy5nZXRTdWl0YWJsZUludGVydmFsKGJpblNpemUpO1xuICAgICAgICBjdXJyZW50QWdnTWV0aG9kID0gbW9kZWwucHJvcCgnYWdncmVnYXRpb24tZm4nKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbmZpZy5jYW5BZ2dyZWdhdGUgPSBmYWxzZTtcbiAgICAgICAgc3VpdGFibGVJbnRlcnZhbCA9IHtcbiAgICAgICAgICBuYW1lOiAnJyxcbiAgICAgICAgICBzdGVwOiAnJ1xuICAgICAgICB9O1xuICAgICAgICBjb25maWcudmFsaWRUaW1lUGVyaW9kID0gW3N1aXRhYmxlSW50ZXJ2YWwubmFtZV07XG4gICAgICAgIGNvbmZpZy52YWxpZFRpbWVQZXJpb2RNdWx0aXBsaWVyID0gW1tzdWl0YWJsZUludGVydmFsLnN0ZXBdXTtcbiAgICAgICAgY29uZmlnLmF2bEFnZ01ldGhvZHMgPSB7XG4gICAgICAgICAgJ2ludmFsaWQnOiB7XG4gICAgICAgICAgICBmb3JtYWxOYW1lOiAnJyxcbiAgICAgICAgICAgIG5pY2tOYW1lOiAnJ1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgY3VycmVudEFnZ01ldGhvZCA9IGNvbmZpZy5hdmxBZ2dNZXRob2RzWydpbnZhbGlkJ107XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRpbWVQZXJpb2Q6IHN1aXRhYmxlSW50ZXJ2YWwubmFtZSxcbiAgICAgICAgdGltZVBlcmlvZE11bHRpcGxpZXI6IHN1aXRhYmxlSW50ZXJ2YWwuc3RlcCxcbiAgICAgICAgYWdncmVnYXRpb25NZXRob2Q6IHtcbiAgICAgICAgICB2YWx1ZTogY3VycmVudEFnZ01ldGhvZC5uaWNrTmFtZSxcbiAgICAgICAgICB0ZXh0OiBjdXJyZW50QWdnTWV0aG9kLmZvcm1hbE5hbWVcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG5cbiAgICBpbml0IChyZXF1aXJlKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgIGNvbmZpZyA9IHNlbGYuY29uZmlnLFxuICAgICAgICB0b29sYm94Q29tcG9uZW50ID0gY29uZmlnLnRvb2xib3hDb21wb25lbnQgPSB7fSxcbiAgICAgICAgYXBpLFxuICAgICAgICBzdG9yZSxcbiAgICAgICAgY29tcG9zaXRpb24sXG4gICAgICAgIHNhdmVUbyA9ICd0c09iamVjdCcsXG4gICAgICAgIHJlcXVpcmVkUGFyYW1zID0gW1xuICAgICAgICAgICdncmFwaGljcycsXG4gICAgICAgICAgJ2dsb2JhbFJlYWN0aXZlTW9kZWwnLFxuICAgICAgICAgICdjaGFydCcsXG4gICAgICAgICAgJ3NwYWNlTWFuYWdlckluc3RhbmNlJyxcbiAgICAgICAgICAnY2hhcnRJbnN0YW5jZScsXG4gICAgICAgICAgJ3NtYXJ0TGFiZWwnLFxuICAgICAgICAgIGZ1bmN0aW9uIGFjcXVpcmUgKCkge1xuICAgICAgICAgICAgbGV0IGkgPSAwLFxuICAgICAgICAgICAgICBpaSA9IHJlcXVpcmVkUGFyYW1zLmxlbmd0aCAtIDEsXG4gICAgICAgICAgICAgIHBhcmFtID0gJyc7XG4gICAgICAgICAgICBzZWxmW3NhdmVUb10gPSBzZWxmW3NhdmVUb10gfHwge307XG4gICAgICAgICAgICBzZWxmLnJlcXVpcmVkUGFyYW1zID0ge307XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgaWk7ICsraSkge1xuICAgICAgICAgICAgICBwYXJhbSA9IHJlcXVpcmVkUGFyYW1zW2ldO1xuICAgICAgICAgICAgICBzZWxmW3NhdmVUb11bcGFyYW1dID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXTtcbiAgICAgIHJlcXVpcmUocmVxdWlyZWRQYXJhbXMpO1xuXG4gICAgICBhcGkgPSBzZWxmLnRzT2JqZWN0LmNoYXJ0SW5zdGFuY2UuYXBpSW5zdGFuY2U7XG4gICAgICBzdG9yZSA9IGFwaS5nZXRDb21wb25lbnRTdG9yZSgpO1xuICAgICAgY29uZmlnLmNvbXBvc2l0aW9uID0gY29tcG9zaXRpb24gPSBzdG9yZS5nZXRDYW52YXNCeUluZGV4KDApLmNvbXBvc2l0aW9uO1xuICAgICAgY29uZmlnLmRhdGFBZ2cgPSBjb21wb3NpdGlvbi5pbXBsLmdldERhdGFBZ2dyZWdhdG9yKCk7XG5cbiAgICAgIHRvb2xib3hDb21wb25lbnQudG9vbGJveCA9IGRlcC5GQy5nZXRDb21wb25lbnQoJ2FwaScsICd0b29sYm94Jyk7XG4gICAgICB0b29sYm94Q29tcG9uZW50LmNvbmZpZyA9IHt9O1xuXG4gICAgICBzZWxmLnRvb2xiYXJzID0gW107XG5cbiAgICAgIHNlbGYubWVhc3VyZW1lbnQgPSB7fTtcblxuICAgICAgc2VsZi50b29sYmFycy5wdXNoKHNlbGYuY3JlYXRlVG9vbGJhcigpKTtcblxuICAgICAgd2luZG93LkFnZ3JlZ2F0b3IgPSBzZWxmO1xuICAgICAgcmV0dXJuIHNlbGY7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIHRvb2xiYXIgY29tcG9uZW50c1xuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgY3JlYXRlVG9vbGJhciAoKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgIGdyb3VwMSxcbiAgICAgICAgZ3JvdXAyLFxuICAgICAgICBncm91cDMsXG4gICAgICAgIHRvb2xiYXIsXG4gICAgICAgIHRpbWVNdWxTZWxlY3RNZW51LFxuICAgICAgICB0aW1lUGVyaW9kU2VsZWN0TWVudSxcbiAgICAgICAgYWdnTWV0aG9kU2VsZWN0TWVudSxcbiAgICAgICAgcmVzZXRCdXR0b24sXG4gICAgICAgIGFwcGx5QnV0dG9uLFxuICAgICAgICBjb25maWcgPSBzZWxmLmNvbmZpZyxcbiAgICAgICAgdHNPYmplY3QgPSBzZWxmLnRzT2JqZWN0LFxuICAgICAgICBsYWJlbCxcblxuICAgICAgICB0b29sYm94Q29tcG9uZW50ID0gY29uZmlnLnRvb2xib3hDb21wb25lbnQsXG4gICAgICAgIHRvb2xib3ggPSB0b29sYm94Q29tcG9uZW50LnRvb2xib3gsXG4gICAgICAgIHRvb2xib3hDb21wQ29uZmlnID0gdG9vbGJveENvbXBvbmVudC5jb25maWcsXG4gICAgICAgIEhvcml6b250YWxUb29sYmFyID0gdG9vbGJveC5Ib3Jpem9udGFsVG9vbGJhcixcbiAgICAgICAgQ29tcG9uZW50R3JvdXAgPSB0b29sYm94LkNvbXBvbmVudEdyb3VwLFxuICAgICAgICBTeW1ib2xTdG9yZSA9IHRvb2xib3guU3ltYm9sU3RvcmUsXG5cbiAgICAgICAgZ3JhcGhpY3MgPSB0c09iamVjdC5ncmFwaGljcyxcbiAgICAgICAgcGFwZXIgPSBncmFwaGljcy5wYXBlcixcbiAgICAgICAgY29udGFpbmVyID0gZ3JhcGhpY3MuY29udGFpbmVyLFxuICAgICAgICBjaGFydCA9IHRzT2JqZWN0LmNoYXJ0LFxuICAgICAgICBzbWFydExhYmVsID0gdHNPYmplY3Quc21hcnRMYWJlbCxcblxuICAgICAgICBtdWx0aXBsaWVyVmFsLFxuICAgICAgICB0aW1lTXVsU2VsZWN0TWVudU9wdCxcbiAgICAgICAgdGltZVBlcmlvZE1lbnVEaXNhYmxlQ29uZmlnLFxuICAgICAgICB0aW1lTXVsdGlwbGllck1lbnVEaXNhYmxlQ29uZmlnLFxuICAgICAgICBhZ2dNZXRob2RNZW51RGlzYWJsZW9uZmlnLFxuICAgICAgICBkcm9wRG93bk1lbnVTdHlsZSxcbiAgICAgICAgYXBwbHlCdXR0b25EaXNhYmxlQ29uZmlnLFxuICAgICAgICByZXNldEJ1dHRvbkRpc2FibGVDb25maWcsXG5cbiAgICAgICAgc3R5bGUsXG5cbiAgICAgICAgZGVwZW5kZW5jaWVzID0ge1xuICAgICAgICAgIHBhcGVyOiBwYXBlcixcbiAgICAgICAgICBjaGFydDogY2hhcnQsXG4gICAgICAgICAgc21hcnRMYWJlbDogc21hcnRMYWJlbCxcbiAgICAgICAgICBjaGFydENvbnRhaW5lcjogY29udGFpbmVyXG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBcHBseSBvciBSZXNldCBBZ2dyZWdhdGlvbiBhcHBsaWVkIHRocm91Z2ggZXh0ZW5zaW9uIGluIHRpbWVzZXJpZXNcbiAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IHNldCAtIEZsYWcgdG8gc2V0IG9yIHJlc2V0LiAnMScgdG8gc2V0LCAnMCcgdG8gcmVzZXRcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIGFwcGx5ID0gKHNldCkgPT4ge1xuICAgICAgICAgIHZhciBtb2RlbCA9IGNvbmZpZy5jb21wb3NpdGlvbi5yZWFjdGl2ZU1vZGVsLFxuICAgICAgICAgICAgdGltZVBlcmlvZFZhbCA9IHRpbWVQZXJpb2RTZWxlY3RNZW51LnZhbHVlKCksXG4gICAgICAgICAgICB0aW1lUGVyaW9kTXVsdGlwbGllclZhbCA9IHRpbWVNdWxTZWxlY3RNZW51LnZhbHVlKCksXG4gICAgICAgICAgICBhZ2dNZXRob2RTZWxlY3RNZW51VmFsID0gYWdnTWV0aG9kU2VsZWN0TWVudS52YWx1ZSgpLFxuICAgICAgICAgICAga2V5cyxcbiAgICAgICAgICAgIGJpblNpemUsXG4gICAgICAgICAgICB0aW1lSW50ZXJ2YWwsXG4gICAgICAgICAgICBhZ2dyZWdhdGlvbiA9IHNlbGYuYWdncmVnYXRpb24sXG4gICAgICAgICAgICBjYW52YXMgPSBjb25maWcuY29tcG9zaXRpb24uaW1wbDtcblxuICAgICAgICAgIGZvciAoa2V5cyBvZiBjb25maWcuYXZsVGltZVBlcmlvZHMpIHtcbiAgICAgICAgICAgIGlmIChrZXlzLm5hbWUgPT09IHRpbWVQZXJpb2RWYWwpIHtcbiAgICAgICAgICAgICAgdGltZUludGVydmFsID0ga2V5cy5pbnRlcnZhbDtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGJpblNpemUgPSB0aW1lSW50ZXJ2YWwgKiBOdW1iZXIodGltZVBlcmlvZE11bHRpcGxpZXJWYWwpO1xuICAgICAgICAgIGlmIChzZXQgJiYgaXNGaW5pdGUobW9kZWwucHJvcCgnYmluLXNpemUnKSkpIHtcbiAgICAgICAgICAgIG1vZGVsXG4gICAgICAgICAgICAgIC5sb2NrKClcbiAgICAgICAgICAgICAgLnByb3AoJ2Jpbi1zaXplLWV4dCcsIGJpblNpemUpXG4gICAgICAgICAgICAgIC5wcm9wKCdhZ2dyZWdhdGlvbi1mbi1leHQnLCBjb25maWcuYXZsQWdnTWV0aG9kc1thZ2dNZXRob2RTZWxlY3RNZW51VmFsXSlcbiAgICAgICAgICAgICAgLnVubG9jaygpO1xuICAgICAgICAgICAgYWdncmVnYXRpb24uYmluU2l6ZSA9IGJpblNpemU7XG4gICAgICAgICAgICBhZ2dyZWdhdGlvbi5hZ2dyZWdhdGlvbk1ldGhvZCA9IGFnZ01ldGhvZFNlbGVjdE1lbnVWYWw7XG4gICAgICAgICAgICBhcHBseUJ1dHRvbi51cGRhdGVWaXN1YWwoJ2Rpc2FibGVkJyk7XG4gICAgICAgICAgICByZXNldEJ1dHRvbi51cGRhdGVWaXN1YWwoJ2VuYWJsZWQnKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FudmFzLnJlc2V0QWdncmVnYXRpb24oKTtcbiAgICAgICAgICAgIGFnZ3JlZ2F0aW9uLmJpblNpemUgPSBudWxsO1xuICAgICAgICAgICAgYWdncmVnYXRpb24uYWdncmVnYXRpb25NZXRob2QgPSBudWxsO1xuICAgICAgICAgICAgcmVzZXRCdXR0b24udXBkYXRlVmlzdWFsKCdkaXNhYmxlZCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogU2V0cyB2YWxpZCB0aW1lIG11bHRpcGxpZXIgb24gdGltZSBwZXJpb2QgY2hhbmdlIGZyb20gZXh0ZW5zaW9uIHRvb2xib3hcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRpbWVQZXJpb2RPbkNoYW5nZSA9ICgpID0+IHtcbiAgICAgICAgICB2YXIgdGltZVBlcmlvZFZhbCA9IHRpbWVQZXJpb2RTZWxlY3RNZW51LnZhbHVlKCksXG4gICAgICAgICAgICB0aW1lUGVyaW9kTXVsdGlwbGllclZhbCA9IHRpbWVNdWxTZWxlY3RNZW51LnZhbHVlKCksXG4gICAgICAgICAgICBwcmV2VGltZVBlcm9pZE11bFZhbCA9IHRpbWVQZXJpb2RNdWx0aXBsaWVyVmFsLFxuICAgICAgICAgICAgdmFsaWRUaW1lUGVyaW9kID0gY29uZmlnLnZhbGlkVGltZVBlcmlvZCxcbiAgICAgICAgICAgIHZhbGlkVGltZVBlcmlvZE11bHRpcGxpZXIgPSBjb25maWcudmFsaWRUaW1lUGVyaW9kTXVsdGlwbGllcixcbiAgICAgICAgICAgIGluZGV4T2ZUaW1lVW5pdCxcbiAgICAgICAgICAgIGluZGV4T2ZUaW1lTXVsO1xuXG4gICAgICAgICAgaW5kZXhPZlRpbWVVbml0ID0gdmFsaWRUaW1lUGVyaW9kLmluZGV4T2YodGltZVBlcmlvZFZhbCk7XG4gICAgICAgICAgaW5kZXhPZlRpbWVNdWwgPSB2YWxpZFRpbWVQZXJpb2RNdWx0aXBsaWVyW2luZGV4T2ZUaW1lVW5pdF0uaW5kZXhPZihOdW1iZXIodGltZVBlcmlvZE11bHRpcGxpZXJWYWwpKTtcblxuICAgICAgICAgIHRpbWVNdWxTZWxlY3RNZW51T3B0ID0gW107XG4gICAgICAgICAgZm9yIChtdWx0aXBsaWVyVmFsIG9mIHZhbGlkVGltZVBlcmlvZE11bHRpcGxpZXJbaW5kZXhPZlRpbWVVbml0XSkge1xuICAgICAgICAgICAgdGltZU11bFNlbGVjdE1lbnVPcHQucHVzaCh7XG4gICAgICAgICAgICAgIG5hbWU6IG11bHRpcGxpZXJWYWwudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgdmFsdWU6IG11bHRpcGxpZXJWYWwudG9TdHJpbmcoKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGltZU11bFNlbGVjdE1lbnUudXBkYXRlTGlzdCh0aW1lTXVsU2VsZWN0TWVudU9wdCk7XG5cbiAgICAgICAgICBpZiAoaW5kZXhPZlRpbWVNdWwgPCAwKSB7XG4gICAgICAgICAgICB0aW1lTXVsU2VsZWN0TWVudS52YWx1ZSh2YWxpZFRpbWVQZXJpb2RNdWx0aXBsaWVyW2luZGV4T2ZUaW1lVW5pdF1bMF0udG9TdHJpbmcoKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRpbWVNdWxTZWxlY3RNZW51LnZhbHVlKHByZXZUaW1lUGVyb2lkTXVsVmFsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldHMgc3RhdGUgb2YgYXBwbHlCdXR0b24oYWN0aXZlL2luYWN0aXZlKSBvbiBjaGFuZ2UgaW4gdmFsdWUgaW4gdG9vbGJveFxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgb25DaGFuZ2UgPSAodHlwZSkgPT4ge1xuICAgICAgICAgIHZhciBjdXJyZW50QWdnID0gc2VsZi5nZXRDdXJyZW50QWdncmVhdGlvbigpO1xuXG4gICAgICAgICAgaWYgKGN1cnJlbnRBZ2cudGltZVBlcmlvZE11bHRpcGxpZXIudG9TdHJpbmcoKSAhPT0gdGltZU11bFNlbGVjdE1lbnUudmFsdWUoKSB8fFxuICAgICAgICAgICAgY3VycmVudEFnZy50aW1lUGVyaW9kICE9PSB0aW1lUGVyaW9kU2VsZWN0TWVudS52YWx1ZSgpIHx8XG4gICAgICAgICAgICBjdXJyZW50QWdnLmFnZ3JlZ2F0aW9uTWV0aG9kLnZhbHVlICE9PSBhZ2dNZXRob2RTZWxlY3RNZW51LnZhbHVlKCkpIHtcbiAgICAgICAgICAgIGFwcGx5QnV0dG9uLnVwZGF0ZVZpc3VhbCgnZW5hYmxlZCcpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhcHBseUJ1dHRvbi51cGRhdGVWaXN1YWwoJ2Rpc2FibGVkJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICBncm91cDEgPSBuZXcgQ29tcG9uZW50R3JvdXAoZGVwZW5kZW5jaWVzKTtcbiAgICAgIGdyb3VwMiA9IG5ldyBDb21wb25lbnRHcm91cChkZXBlbmRlbmNpZXMpO1xuICAgICAgZ3JvdXAzID0gbmV3IENvbXBvbmVudEdyb3VwKGRlcGVuZGVuY2llcyk7XG5cbiAgICAgIHRvb2xiYXIgPSBuZXcgSG9yaXpvbnRhbFRvb2xiYXIoZGVwZW5kZW5jaWVzKTtcblxuICAgICAgY29uZmlnLnVzckNvbmZpZyA9IHtcbiAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgcG9zV3J0Q2FudmFzOiAndG9wJyxcbiAgICAgICAgYWxpZ25tZW50OiAnbGVmdCcsXG4gICAgICAgIG9yaWVudGF0aW9uOiAnaG9yaXpvbnRhbCcsXG4gICAgICAgIHN0eWxlczoge1xuICAgICAgICAgIGxhYmVsOiB7XG4gICAgICAgICAgICAnZm9udC1zaXplJzogJzEzJyxcbiAgICAgICAgICAgICdmaWxsJzogJyM2OTY5NjknXG4gICAgICAgICAgfSxcbiAgICAgICAgICB0aW1lTXVsdGlwbGllcklucHV0RmllbGQ6IHtcbiAgICAgICAgICAgIGFjdGl2ZToge1xuICAgICAgICAgICAgICAnZmlsbCc6ICcjZmZmJyxcbiAgICAgICAgICAgICAgJ2xhYmVsRmlsbCc6ICcjNjk2OTY5JyxcbiAgICAgICAgICAgICAgJ3N0cm9rZSc6ICcjYzhjZWNkJyxcbiAgICAgICAgICAgICAgJ3N0cm9rZVdpZHRoJzogMSxcbiAgICAgICAgICAgICAgJ2hvdmVyU3Ryb2tlJzogJyMxZTFmMWYnLFxuICAgICAgICAgICAgICAnaG92ZXJTdHJva2VXaWR0aCc6IDEsXG4gICAgICAgICAgICAgICdyYWRpdXMnOiAxLFxuICAgICAgICAgICAgICAnd2lkdGgnOiA0NSxcbiAgICAgICAgICAgICAgJ2hlaWdodCc6IDIyXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaW5hY3RpdmU6IHtcbiAgICAgICAgICAgICAgJ2ZpbGwnOiAnI2ZmZicsXG4gICAgICAgICAgICAgICdzdHJva2Utd2lkdGgnOiAxLFxuICAgICAgICAgICAgICAnc3Ryb2tlJzogJyNjZWQ1ZDQnLFxuICAgICAgICAgICAgICAnbGFiZWxGaWxsJzogJyMwMDAnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB0aW1lUGVyaW9kSW5wdXRGaWVsZDoge1xuICAgICAgICAgICAgYWN0aXZlOiB7XG4gICAgICAgICAgICAgICdmaWxsJzogJyNmZmYnLFxuICAgICAgICAgICAgICAnbGFiZWxGaWxsJzogJyM2OTY5NjknLFxuICAgICAgICAgICAgICAnc3Ryb2tlJzogJyNjOGNlY2QnLFxuICAgICAgICAgICAgICAnc3Ryb2tlV2lkdGgnOiAxLFxuICAgICAgICAgICAgICAnaG92ZXJTdHJva2UnOiAnIzFlMWYxZicsXG4gICAgICAgICAgICAgICdob3ZlclN0cm9rZVdpZHRoJzogMSxcbiAgICAgICAgICAgICAgJ3JhZGl1cyc6IDEsXG4gICAgICAgICAgICAgICd3aWR0aCc6IDc1LFxuICAgICAgICAgICAgICAnaGVpZ2h0JzogMjJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBpbmFjdGl2ZToge1xuICAgICAgICAgICAgICAnZmlsbCc6ICcjZmZmJyxcbiAgICAgICAgICAgICAgJ3N0cm9rZS13aWR0aCc6IDEsXG4gICAgICAgICAgICAgICdzdHJva2UnOiAnI2NlZDVkNCcsXG4gICAgICAgICAgICAgICdsYWJlbEZpbGwnOiAnIzAwMCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGFnZ3JlZ2F0aW9uTWV0aG9kSW5wdXRGaWVsZDoge1xuICAgICAgICAgICAgYWN0aXZlOiB7XG4gICAgICAgICAgICAgICdmaWxsJzogJyNmZmYnLFxuICAgICAgICAgICAgICAnbGFiZWxGaWxsJzogJyM2OTY5NjknLFxuICAgICAgICAgICAgICAnc3Ryb2tlJzogJyNjOGNlY2QnLFxuICAgICAgICAgICAgICAnc3Ryb2tlV2lkdGgnOiAxLFxuICAgICAgICAgICAgICAnaG92ZXJTdHJva2UnOiAnIzFlMWYxZicsXG4gICAgICAgICAgICAgICdob3ZlclN0cm9rZVdpZHRoJzogMSxcbiAgICAgICAgICAgICAgJ3JhZGl1cyc6IDEsXG4gICAgICAgICAgICAgICd3aWR0aCc6IDEwMCxcbiAgICAgICAgICAgICAgJ2hlaWdodCc6IDIyXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaW5hY3RpdmU6IHtcbiAgICAgICAgICAgICAgJ2ZpbGwnOiAnI2ZmZicsXG4gICAgICAgICAgICAgICdzdHJva2Utd2lkdGgnOiAxLFxuICAgICAgICAgICAgICAnc3Ryb2tlJzogJyNjZWQ1ZDQnLFxuICAgICAgICAgICAgICAnbGFiZWxGaWxsJzogJyMwMDAnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBkcm9wRG93bjoge1xuICAgICAgICAgICAgYWN0aXZlOiB7XG4gICAgICAgICAgICAgICdmaWxsJzogJyM4OThiOGInLFxuICAgICAgICAgICAgICAnbGFiZWxGaWxsJzogJyNmZmYnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbm9ybWFsOiB7XG4gICAgICAgICAgICAgICdmaWxsJzogJyNmZmYnLFxuICAgICAgICAgICAgICAnc3Ryb2tlJzogJyM4OThiOGInLFxuICAgICAgICAgICAgICAncmFkaXVzJzogMSxcbiAgICAgICAgICAgICAgJ2xhYmVsRmlsbCc6ICcjMDAwJyxcbiAgICAgICAgICAgICAgJ2hvdmVyRmlsbCc6ICcjZTZlOGU4JyxcbiAgICAgICAgICAgICAgJ2hvdmVyTGFiZWxGaWxsJzogJyMwMDAnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBhcHBseUJ1dHRvbjoge1xuICAgICAgICAgICAgYWN0aXZlOiB7XG4gICAgICAgICAgICAgICdmaWxsJzogJyM1NTUnLFxuICAgICAgICAgICAgICAnbGFiZWxGaWxsJzogJyNmM2YzZjMnLFxuICAgICAgICAgICAgICAnc3Ryb2tlJzogJyNjZWQ1ZDQnLFxuICAgICAgICAgICAgICAnc3Ryb2tlV2lkdGgnOiAxLFxuICAgICAgICAgICAgICAnaG92ZXJGaWxsJzogJyM1NTUnLFxuICAgICAgICAgICAgICAnaG92ZXJTdHJva2VXaWR0aCc6IDEsXG4gICAgICAgICAgICAgICdob3ZlclN0cm9rZSc6ICcnLFxuICAgICAgICAgICAgICAncmFkaXVzJzogMSxcbiAgICAgICAgICAgICAgJ3dpZHRoJzogNTQsXG4gICAgICAgICAgICAgICdoZWlnaHQnOiAyMlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGluYWN0aXZlOiB7XG4gICAgICAgICAgICAgICdmaWxsJzogJyNiZWJlYmUnLFxuICAgICAgICAgICAgICAnc3Ryb2tlLXdpZHRoJzogMSxcbiAgICAgICAgICAgICAgJ3N0cm9rZSc6ICcjY2VkNWQ0JyxcbiAgICAgICAgICAgICAgJ2xhYmVsRmlsbCc6ICcjZjNmM2YzJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgcmVzZXRCdXR0b246IHtcbiAgICAgICAgICAgIGFjdGl2ZToge1xuICAgICAgICAgICAgICAnZmlsbCc6ICcjODk4YjhiJyxcbiAgICAgICAgICAgICAgJ2xhYmVsRmlsbCc6ICcjZjNmM2YzJyxcbiAgICAgICAgICAgICAgJ3N0cm9rZSc6ICcjY2VkNWQ0JyxcbiAgICAgICAgICAgICAgJ3N0cm9rZVdpZHRoJzogMSxcbiAgICAgICAgICAgICAgJ2hvdmVyRmlsbCc6ICcjODk4YjhiJyxcbiAgICAgICAgICAgICAgJ2hvdmVyU3Ryb2tlV2lkdGgnOiAxLFxuICAgICAgICAgICAgICAnaG92ZXJTdHJva2UnOiAnJyxcbiAgICAgICAgICAgICAgJ3JhZGl1cyc6IDEsXG4gICAgICAgICAgICAgICd3aWR0aCc6IDU0LFxuICAgICAgICAgICAgICAnaGVpZ2h0JzogMjJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBpbmFjdGl2ZToge1xuICAgICAgICAgICAgICAnZmlsbCc6ICcjYmViZWJlJyxcbiAgICAgICAgICAgICAgJ3N0cm9rZS13aWR0aCc6IDEsXG4gICAgICAgICAgICAgICdzdHJva2UnOiAnI2NlZDVkNCcsXG4gICAgICAgICAgICAgICdsYWJlbEZpbGwnOiAnI2YzZjNmMydcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGJhc2U6IHtcbiAgICAgICAgICAgIGZvbnQ6IHtcbiAgICAgICAgICAgICAgJ2ZvbnRTaXplJzogMTFcbiAgICAgICAgICAgICAgLy8gJ2ZvbnRXZWlnaHQnOiAnYm9sZCcsXG4gICAgICAgICAgICAgIC8vICdmb250RmFtaWx5JzogJ3NhbnMtc2VyaWYnLFxuICAgICAgICAgICAgICAvLyAnZm9udFN0eWxlJzogJ2l0YWxpYydcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHN0eWxlID0gY29uZmlnLnVzckNvbmZpZy5zdHlsZXMgfHwge307XG5cbiAgICAgIHN0eWxlID0ge1xuICAgICAgICBsYWJlbDogc3R5bGUubGFiZWwgfHwge30sXG4gICAgICAgIHRpbWVNdWx0aXBsaWVySW5wdXRGaWVsZDoge1xuICAgICAgICAgIGFjdGl2ZTogKHN0eWxlLnRpbWVNdWx0aXBsaWVySW5wdXRGaWVsZCAmJiBzdHlsZS50aW1lTXVsdGlwbGllcklucHV0RmllbGQuYWN0aXZlKSB8fCB7fSxcbiAgICAgICAgICBpbmFjdGl2ZTogKHN0eWxlLnRpbWVNdWx0aXBsaWVySW5wdXRGaWVsZCAmJiBzdHlsZS50aW1lTXVsdGlwbGllcklucHV0RmllbGQuaW5hY3RpdmUpIHx8IHt9XG4gICAgICAgIH0sXG4gICAgICAgIHRpbWVQZXJpb2RJbnB1dEZpZWxkOiB7XG4gICAgICAgICAgYWN0aXZlOiAoc3R5bGUudGltZVBlcmlvZElucHV0RmllbGQgJiYgc3R5bGUudGltZVBlcmlvZElucHV0RmllbGQuYWN0aXZlKSB8fCB7fSxcbiAgICAgICAgICBpbmFjdGl2ZTogKHN0eWxlLnRpbWVQZXJpb2RJbnB1dEZpZWxkICYmIHN0eWxlLnRpbWVQZXJpb2RJbnB1dEZpZWxkLmluYWN0aXZlKSB8fCB7fVxuICAgICAgICB9LFxuICAgICAgICBhZ2dyZWdhdGlvbk1ldGhvZElucHV0RmllbGQ6IHtcbiAgICAgICAgICBhY3RpdmU6IChzdHlsZS5hZ2dyZWdhdGlvbk1ldGhvZElucHV0RmllbGQgJiYgc3R5bGUuYWdncmVnYXRpb25NZXRob2RJbnB1dEZpZWxkLmFjdGl2ZSkgfHwge30sXG4gICAgICAgICAgaW5hY3RpdmU6IChzdHlsZS5hZ2dyZWdhdGlvbk1ldGhvZElucHV0RmllbGQgJiYgc3R5bGUuYWdncmVnYXRpb25NZXRob2RJbnB1dEZpZWxkLmluYWN0aXZlKSB8fCB7fVxuICAgICAgICB9LFxuICAgICAgICBkcm9wRG93bjoge1xuICAgICAgICAgIGFjdGl2ZTogKHN0eWxlLmRyb3BEb3duICYmIHN0eWxlLmRyb3BEb3duLmFjdGl2ZSkgfHwge30sXG4gICAgICAgICAgbm9ybWFsOiAoc3R5bGUuZHJvcERvd24gJiYgc3R5bGUuZHJvcERvd24ubm9ybWFsKSB8fCB7fVxuICAgICAgICB9LFxuICAgICAgICBhcHBseUJ1dHRvbjoge1xuICAgICAgICAgIGFjdGl2ZTogKHN0eWxlLmFwcGx5QnV0dG9uICYmIHN0eWxlLmFwcGx5QnV0dG9uLmFjdGl2ZSkgfHwge30sXG4gICAgICAgICAgaW5hY3RpdmU6IChzdHlsZS5hcHBseUJ1dHRvbiAmJiBzdHlsZS5hcHBseUJ1dHRvbi5pbmFjdGl2ZSkgfHwge31cbiAgICAgICAgfSxcbiAgICAgICAgcmVzZXRCdXR0b246IHtcbiAgICAgICAgICBhY3RpdmU6IChzdHlsZS5yZXNldEJ1dHRvbiAmJiBzdHlsZS5yZXNldEJ1dHRvbi5hY3RpdmUpIHx8IHt9LFxuICAgICAgICAgIGluYWN0aXZlOiAoc3R5bGUucmVzZXRCdXR0b24gJiYgc3R5bGUucmVzZXRCdXR0b24uaW5hY3RpdmUpIHx8IHt9XG4gICAgICAgIH0sXG4gICAgICAgIGJhc2U6IHtcbiAgICAgICAgICBmb250OiAoc3R5bGUuYmFzZSAmJiBzdHlsZS5iYXNlLmZvbnQpIHx8IHt9XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGdyb3VwMS5zZXRDb25maWcoe1xuICAgICAgICBmaWxsOiAnI2ZmZicsXG4gICAgICAgIGJvcmRlclRoaWNrbmVzczogMFxuICAgICAgfSk7XG4gICAgICBncm91cDIuc2V0Q29uZmlnKHtcbiAgICAgICAgZmlsbDogJyNmZmYnLFxuICAgICAgICBib3JkZXJUaGlja25lc3M6IDBcbiAgICAgIH0pO1xuICAgICAgZ3JvdXAzLnNldENvbmZpZyh7XG4gICAgICAgIGZpbGw6ICcjZmZmJyxcbiAgICAgICAgYm9yZGVyVGhpY2tuZXNzOiAwXG4gICAgICB9KTtcblxuICAgICAgdG9vbGJhci5zZXRDb25maWcoe1xuICAgICAgICBmaWxsOiAnI2ZmZicsXG4gICAgICAgIGJvcmRlclRoaWNrbmVzczogMFxuICAgICAgfSk7XG5cbiAgICAgIHRpbWVQZXJpb2RNZW51RGlzYWJsZUNvbmZpZyA9IHtcbiAgICAgICAgZGlzYWJsZWQ6IHtcbiAgICAgICAgICBjb25maWc6IHtcbiAgICAgICAgICAgIGRpc2FibGVkOiBzdHlsZS50aW1lTXVsdGlwbGllcklucHV0RmllbGQuaW5hY3RpdmVcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHRpbWVNdWx0aXBsaWVyTWVudURpc2FibGVDb25maWcgPSB7XG4gICAgICAgIGRpc2FibGVkOiB7XG4gICAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgICBkaXNhYmxlZDogc3R5bGUudGltZVBlcmlvZElucHV0RmllbGQuaW5hY3RpdmVcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGFnZ01ldGhvZE1lbnVEaXNhYmxlb25maWcgPSB7XG4gICAgICAgIGRpc2FibGVkOiB7XG4gICAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgICBkaXNhYmxlZDogc3R5bGUuYWdncmVnYXRpb25NZXRob2RJbnB1dEZpZWxkLmluYWN0aXZlXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBhcHBseUJ1dHRvbkRpc2FibGVDb25maWcgPSB7XG4gICAgICAgIGRpc2FibGVkOiB7XG4gICAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgICBkaXNhYmxlZDogc3R5bGUuYXBwbHlCdXR0b24uaW5hY3RpdmVcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHJlc2V0QnV0dG9uRGlzYWJsZUNvbmZpZyA9IHtcbiAgICAgICAgZGlzYWJsZWQ6IHtcbiAgICAgICAgICBjb25maWc6IHtcbiAgICAgICAgICAgIGRpc2FibGVkOiBzdHlsZS5yZXNldEJ1dHRvbi5pbmFjdGl2ZVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgZHJvcERvd25NZW51U3R5bGUgPSB7XG4gICAgICAgIHNlbGVjdGVkOiB7XG4gICAgICAgICAgY29udGFpbmVyOiB7XG4gICAgICAgICAgICBzdHlsZToge1xuICAgICAgICAgICAgICBmaWxsOiBzdHlsZS5kcm9wRG93bi5hY3RpdmUuZmlsbFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgdGV4dDoge1xuICAgICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgICAgZmlsbDogc3R5bGUuZHJvcERvd24uYWN0aXZlLmxhYmVsRmlsbFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgbm9ybWFsOiB7XG4gICAgICAgICAgY29udGFpbmVyOiB7XG4gICAgICAgICAgICBzdHlsZToge1xuICAgICAgICAgICAgICBmaWxsOiBzdHlsZS5kcm9wRG93bi5ub3JtYWwuZmlsbCxcbiAgICAgICAgICAgICAgc3Ryb2tlOiBzdHlsZS5kcm9wRG93bi5ub3JtYWwuc3Ryb2tlLFxuICAgICAgICAgICAgICByYWRpdXM6IHN0eWxlLmRyb3BEb3duLm5vcm1hbC5yYWRpdXNcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHRleHQ6IHtcbiAgICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICAgIGZpbGw6IHN0eWxlLmRyb3BEb3duLm5vcm1hbC5sYWJlbEZpbGxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGhvdmVyOiB7XG4gICAgICAgICAgY29udGFpbmVyOiB7XG4gICAgICAgICAgICBzdHlsZToge1xuICAgICAgICAgICAgICBmaWxsOiBzdHlsZS5kcm9wRG93bi5ub3JtYWwuaG92ZXJGaWxsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB0ZXh0OiB7XG4gICAgICAgICAgICBzdHlsZToge1xuICAgICAgICAgICAgICBmaWxsOiBzdHlsZS5kcm9wRG93bi5ub3JtYWwuaG92ZXJMYWJlbEZpbGxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGxhYmVsID0gbmV3IHRvb2xib3guTGFiZWwoJ0FnZ3JlZ2F0ZSBEYXRhOicsIGRlcGVuZGVuY2llcywge1xuICAgICAgICB0ZXh0OiB7XG4gICAgICAgICAgc3R5bGU6IHN0eWxlLmxhYmVsXG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICB0b29sYm94Q29tcENvbmZpZy50aW1lUGVyaW9kU2VsZWN0TWVudSA9IHRpbWVQZXJpb2RTZWxlY3RNZW51ID0gbmV3IHRvb2xib3guU2VsZWN0U3ltYm9sKHt9LCBkZXBlbmRlbmNpZXMsIFtdLFxuICAgICAgT2JqZWN0LmFzc2lnbihzdHlsZS50aW1lUGVyaW9kSW5wdXRGaWVsZC5hY3RpdmUsIHtcbiAgICAgICAgYnRuVGV4dFN0eWxlOiBzdHlsZS5iYXNlLmZvbnQsXG4gICAgICAgIGRyb3BEb3duTWVudTogZHJvcERvd25NZW51U3R5bGVcbiAgICAgIH0pKTtcbiAgICAgIHRpbWVQZXJpb2RTZWxlY3RNZW51LnNldFN0YXRlQ29uZmlnKHRpbWVQZXJpb2RNZW51RGlzYWJsZUNvbmZpZyk7XG5cbiAgICAgIHRvb2xib3hDb21wQ29uZmlnLnRpbWVNdWxTZWxlY3RNZW51ID0gdGltZU11bFNlbGVjdE1lbnUgPSBuZXcgdG9vbGJveC5TZWxlY3RTeW1ib2woe30sIGRlcGVuZGVuY2llcywgW10sXG4gICAgICBPYmplY3QuYXNzaWduKHN0eWxlLnRpbWVNdWx0aXBsaWVySW5wdXRGaWVsZC5hY3RpdmUsIHtcbiAgICAgICAgYnRuVGV4dFN0eWxlOiBzdHlsZS5iYXNlLmZvbnQsXG4gICAgICAgIGRyb3BEb3duTWVudTogZHJvcERvd25NZW51U3R5bGVcbiAgICAgIH0pKTtcbiAgICAgIHRpbWVNdWxTZWxlY3RNZW51LnNldFN0YXRlQ29uZmlnKHRpbWVNdWx0aXBsaWVyTWVudURpc2FibGVDb25maWcpO1xuXG4gICAgICB0b29sYm94Q29tcENvbmZpZy5hZ2dNZXRob2RTZWxlY3RNZW51ID0gYWdnTWV0aG9kU2VsZWN0TWVudSA9IG5ldyB0b29sYm94LlNlbGVjdFN5bWJvbCh7fSwgZGVwZW5kZW5jaWVzLCBbXSxcbiAgICAgIE9iamVjdC5hc3NpZ24oc3R5bGUuYWdncmVnYXRpb25NZXRob2RJbnB1dEZpZWxkLmFjdGl2ZSwge1xuICAgICAgICBidG5UZXh0U3R5bGU6IHN0eWxlLmJhc2UuZm9udCxcbiAgICAgICAgZHJvcERvd25NZW51OiBkcm9wRG93bk1lbnVTdHlsZVxuICAgICAgfSkpO1xuICAgICAgYWdnTWV0aG9kU2VsZWN0TWVudS5zZXRTdGF0ZUNvbmZpZyhhZ2dNZXRob2RNZW51RGlzYWJsZW9uZmlnKTtcblxuICAgICAgdG9vbGJveENvbXBDb25maWcuYXBwbHlCdXR0b24gPSBhcHBseUJ1dHRvbiA9IG5ldyB0b29sYm94LlN5bWJvbCgnQVBQTFknLCB0cnVlLCBkZXBlbmRlbmNpZXMsXG4gICAgICAgIE9iamVjdC5hc3NpZ24oc3R5bGUuYXBwbHlCdXR0b24uYWN0aXZlLCB7XG4gICAgICAgICAgYnRuVGV4dFN0eWxlOiBzdHlsZS5iYXNlLmZvbnRcbiAgICAgICAgfSkpXG4gICAgICAgIC5hdHRhY2hFdmVudEhhbmRsZXJzKHtcbiAgICAgICAgICBjbGljazogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgYXBwbHkoMSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIGFwcGx5QnV0dG9uLnNldFN0YXRlQ29uZmlnKGFwcGx5QnV0dG9uRGlzYWJsZUNvbmZpZyk7XG5cbiAgICAgIHRvb2xib3hDb21wQ29uZmlnLnJlc2V0QnV0dG9uID0gcmVzZXRCdXR0b24gPSBuZXcgdG9vbGJveC5TeW1ib2woJ1JFU0VUJywgdHJ1ZSwgZGVwZW5kZW5jaWVzLFxuICAgICAgICBPYmplY3QuYXNzaWduKHN0eWxlLnJlc2V0QnV0dG9uLmFjdGl2ZSwge1xuICAgICAgICAgIGJ0blRleHRTdHlsZTogc3R5bGUuYmFzZS5mb250XG4gICAgICAgIH0pKVxuICAgICAgICAuYXR0YWNoRXZlbnRIYW5kbGVycyh7XG4gICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGFwcGx5KDApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICByZXNldEJ1dHRvbi5zZXRTdGF0ZUNvbmZpZyhyZXNldEJ1dHRvbkRpc2FibGVDb25maWcpO1xuXG4gICAgICBncm91cDEuYWRkU3ltYm9sKGxhYmVsKTtcbiAgICAgIGdyb3VwMi5hZGRTeW1ib2wodGltZU11bFNlbGVjdE1lbnUpO1xuICAgICAgZ3JvdXAyLmFkZFN5bWJvbCh0aW1lUGVyaW9kU2VsZWN0TWVudSk7XG4gICAgICBncm91cDIuYWRkU3ltYm9sKGFnZ01ldGhvZFNlbGVjdE1lbnUpO1xuICAgICAgZ3JvdXAzLmFkZFN5bWJvbChhcHBseUJ1dHRvbik7XG4gICAgICBncm91cDMuYWRkU3ltYm9sKHJlc2V0QnV0dG9uKTtcblxuICAgICAgU3ltYm9sU3RvcmUucmVnaXN0ZXIoJ3RleHRCb3hJY29uJywgZnVuY3Rpb24gKHgsIHksIHJhZCwgdywgaCwgcGFkWCwgcGFkWSkge1xuICAgICAgICB2YXIgeDEgPSB4IC0gdyAvIDIgKyBwYWRYIC8gMixcbiAgICAgICAgICB4MiA9IHggKyB3IC8gMiAtIHBhZFggLyAyLFxuICAgICAgICAgIHkxID0geSAtIGggLyAyICsgcGFkWSAvIDIsXG4gICAgICAgICAgeTIgPSB5ICsgaCAvIDIgLSBwYWRZIC8gMjtcblxuICAgICAgICByZXR1cm4gWydNJywgeDEsIHkxLCAnTCcsIHgyLCB5MSwgJ0wnLCB4MiwgeTIsICdMJywgeDEsIHkyLCAnWiddO1xuICAgICAgfSk7XG5cbiAgICAgIHRpbWVQZXJpb2RTZWxlY3RNZW51LmF0dGFjaEV2ZW50SGFuZGxlcnMoe1xuICAgICAgICB0ZXh0T25DaGFuZ2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB0aW1lUGVyaW9kT25DaGFuZ2UoKTtcbiAgICAgICAgICBvbkNoYW5nZSgpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdGltZU11bFNlbGVjdE1lbnUuYXR0YWNoRXZlbnRIYW5kbGVycyh7XG4gICAgICAgIHRleHRPbkNoYW5nZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIG9uQ2hhbmdlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBhZ2dNZXRob2RTZWxlY3RNZW51LmF0dGFjaEV2ZW50SGFuZGxlcnMoe1xuICAgICAgICB0ZXh0T25DaGFuZ2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBvbkNoYW5nZSgpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdG9vbGJhci5hZGRDb21wb25lbnQoZ3JvdXAxKTtcbiAgICAgIHRvb2xiYXIuYWRkQ29tcG9uZW50KGdyb3VwMik7XG4gICAgICB0b29sYmFyLmFkZENvbXBvbmVudChncm91cDMpO1xuXG4gICAgICByZXR1cm4gdG9vbGJhcjtcbiAgICB9XG5cbiAgICBnZXRMb2dpY2FsU3BhY2UgKGF2YWlsYWJsZVdpZHRoLCBhdmFpbGFibGVIZWlnaHQpIHtcbiAgICAgIHZhciBsb2dpY2FsU3BhY2UsXG4gICAgICAgIHdpZHRoID0gMCxcbiAgICAgICAgaGVpZ2h0ID0gMCxcbiAgICAgICAgaSxcbiAgICAgICAgbG47XG5cbiAgICAgIGZvciAoaSA9IDAsIGxuID0gdGhpcy50b29sYmFycy5sZW5ndGg7IGkgPCBsbjsgaSsrKSB7XG4gICAgICAgIGxvZ2ljYWxTcGFjZSA9IHRoaXMudG9vbGJhcnNbaV0uZ2V0TG9naWNhbFNwYWNlKGF2YWlsYWJsZVdpZHRoLCBhdmFpbGFibGVIZWlnaHQpO1xuICAgICAgICB3aWR0aCA9IE1hdGgubWF4KGxvZ2ljYWxTcGFjZS53aWR0aCwgd2lkdGgpO1xuICAgICAgICBoZWlnaHQgKz0gbG9naWNhbFNwYWNlLmhlaWdodDtcbiAgICAgICAgdGhpcy50b29sYmFyc1tpXS53aWR0aCA9IGxvZ2ljYWxTcGFjZS53aWR0aDtcbiAgICAgICAgdGhpcy50b29sYmFyc1tpXS5oZWlnaHQgPSBsb2dpY2FsU3BhY2UuaGVpZ2h0O1xuICAgICAgfVxuICAgICAgaGVpZ2h0ICs9IHRoaXMucGFkZGluZztcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHdpZHRoOiB3aWR0aCxcbiAgICAgICAgaGVpZ2h0OiBoZWlnaHRcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcGxhY2VJbkNhbnZhcyAoY29udGFpbmVySW5zdGFuY2UpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgdHNPYmplY3QgPSBzZWxmLnRzT2JqZWN0O1xuXG4gICAgICBzZWxmLnBhZGRpbmcgPSA1O1xuICAgICAgdHNPYmplY3Quc3BhY2VNYW5hZ2VySW5zdGFuY2UuYWRkKFt7XG4gICAgICAgIG5hbWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gJ2RhdGEtYWdncmVnYXRvcic7XG4gICAgICAgIH0sXG4gICAgICAgIHJlZjogZnVuY3Rpb24gKG9iaikge1xuICAgICAgICAgIHJldHVybiBvYmpbJzAnXTtcbiAgICAgICAgfSxcbiAgICAgICAgc2VsZjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBzZWxmO1xuICAgICAgICB9LFxuICAgICAgICBwcmlvcml0eTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiAyO1xuICAgICAgICB9LFxuICAgICAgICBsYXlvdXQ6IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgICByZXR1cm4gb2JqLmlubGluZTtcbiAgICAgICAgfSxcbiAgICAgICAgb3JpZW50YXRpb246IFt7XG4gICAgICAgICAgdHlwZTogZnVuY3Rpb24gKG9iaikge1xuICAgICAgICAgICAgcmV0dXJuIG9iai5ob3Jpem9udGFsO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgcG9zaXRpb246IFt7XG4gICAgICAgICAgICB0eXBlOiBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgICAgICAgIHJldHVybiBvYmoudG9wO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFsaWdubWVudDogW3tcbiAgICAgICAgICAgICAgdHlwZTogZnVuY3Rpb24gKG9iaikge1xuICAgICAgICAgICAgICAgIHJldHVybiBvYmoubGVmdDtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgZGltZW5zaW9uczogW2Z1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgcGFyZW50ID0gdGhpcy5nZXRQYXJlbnRDb21wb25lbnRHcm91cCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmdldExvZ2ljYWxTcGFjZShwYXJlbnQuZ2V0V2lkdGgoKSwgcGFyZW50LmdldEhlaWdodCgpKTtcbiAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgIH1dXG4gICAgICAgICAgfV1cbiAgICAgICAgfV1cbiAgICAgIH1dKTtcbiAgICB9XG5cbiAgICBzZXREcmF3aW5nQ29uZmlndXJhdGlvbiAoeCwgeSwgd2lkdGgsIGhlaWdodCwgZ3JvdXApIHtcbiAgICAgIHZhciBtZXMgPSB0aGlzLm1lYXN1cmVtZW50O1xuICAgICAgbWVzLnggPSB4O1xuICAgICAgbWVzLnkgPSB5O1xuICAgICAgbWVzLndpZHRoID0gd2lkdGg7XG4gICAgICBtZXMuaGVpZ2h0ID0gaGVpZ2h0O1xuXG4gICAgICB0aGlzLnBhcmVudEdyb3VwID0gZ3JvdXA7XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGRyYXcgKHgsIHksIHdpZHRoLCBoZWlnaHQsIGdyb3VwKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgIGNvbmZpZyA9IHNlbGYuY29uZmlnLFxuICAgICAgICB0b29sYm94Q29tcENvbmZpZyA9IGNvbmZpZy50b29sYm94Q29tcG9uZW50LmNvbmZpZyxcbiAgICAgICAgdGltZVBlcmlvZFNlbGVjdE1lbnUgPSB0b29sYm94Q29tcENvbmZpZy50aW1lUGVyaW9kU2VsZWN0TWVudSxcbiAgICAgICAgdGltZU11bFNlbGVjdE1lbnUgPSB0b29sYm94Q29tcENvbmZpZy50aW1lTXVsU2VsZWN0TWVudSxcbiAgICAgICAgYWdnTWV0aG9kU2VsZWN0TWVudSA9IHRvb2xib3hDb21wQ29uZmlnLmFnZ01ldGhvZFNlbGVjdE1lbnUsXG4gICAgICAgIGFwcGx5QnV0dG9uID0gdG9vbGJveENvbXBDb25maWcuYXBwbHlCdXR0b24sXG4gICAgICAgIHJlc2V0QnV0dG9uID0gdG9vbGJveENvbXBDb25maWcucmVzZXRCdXR0b24sXG4gICAgICAgIG1lYXN1cmVtZW50ID0gc2VsZi5tZWFzdXJlbWVudCxcbiAgICAgICAgdG9vbGJhcnMgPSBzZWxmLnRvb2xiYXJzLFxuICAgICAgICBsbixcbiAgICAgICAgaSxcbiAgICAgICAgdG9vbGJhcixcbiAgICAgICAgbW9kZWwgPSBjb25maWcuY29tcG9zaXRpb24ucmVhY3RpdmVNb2RlbCxcbiAgICAgICAgZGF0YUFnZyA9IGNvbmZpZy5kYXRhQWdnLFxuXG4gICAgICAgIHRpbWVQZXJpb2RWYWwsXG4gICAgICAgIHRpbWVQZXJpb2RTZWxlY3RNZW51T3B0LFxuICAgICAgICB2YWxpZFRpbWVQZXJpb2QsXG4gICAgICAgIGluZGV4T2ZUaW1lVW5pdCxcblxuICAgICAgICBtdWx0aXBsaWVyVmFsLFxuICAgICAgICB0aW1lTXVsU2VsZWN0TWVudU9wdCxcbiAgICAgICAgdmFsaWRUaW1lUGVyaW9kTXVsdGlwbGllcixcblxuICAgICAgICBhZ2dWYWwsXG4gICAgICAgIGFnZ01ldGhvZFNlbGVjdE1lbnVPcHQsXG4gICAgICAgIGF2bEFnZ01ldGhvZHMsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENvbXB1dGUgYW5kIHBvcHVsYXRlIHRvb2xib3hlcyB3aXRoIHZhbGlkIHZhbHVlcyBvbiBjaGFuZ2UgaW4gcmFuZ2Ugb2YgdmlzdWFsIHdpbmRvd1xuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgcmFuZ2VPbkNoYW5nZSA9ICgpID0+IHtcbiAgICAgICAgICB2YXIgYWdncmVnYXRpb24gPSBzZWxmLmFnZ3JlZ2F0aW9uLFxuICAgICAgICAgICAgY3VycmVudEFnZ3JlZ2F0aW9uT2JqLFxuICAgICAgICAgICAgdGltZVBlcmlvZCxcbiAgICAgICAgICAgIHRpbWVQZXJpb2RNdWx0aXBsaWVyLFxuICAgICAgICAgICAgYWdncmVnYXRpb25NZXRob2Q7XG5cbiAgICAgICAgICBzZWxmLmdldFZhbGlkQWdncmVnYXRpb24oKTtcbiAgICAgICAgICBjdXJyZW50QWdncmVnYXRpb25PYmogPSBzZWxmLmdldEN1cnJlbnRBZ2dyZWF0aW9uKCk7XG4gICAgICAgICAgdGltZVBlcmlvZCA9IGN1cnJlbnRBZ2dyZWdhdGlvbk9iai50aW1lUGVyaW9kO1xuICAgICAgICAgIHRpbWVQZXJpb2RNdWx0aXBsaWVyID0gY3VycmVudEFnZ3JlZ2F0aW9uT2JqLnRpbWVQZXJpb2RNdWx0aXBsaWVyO1xuICAgICAgICAgIGFnZ3JlZ2F0aW9uTWV0aG9kID0gY3VycmVudEFnZ3JlZ2F0aW9uT2JqLmFnZ3JlZ2F0aW9uTWV0aG9kO1xuXG4gICAgICAgICAgdGltZVBlcmlvZFNlbGVjdE1lbnVPcHQgPSBbXTtcbiAgICAgICAgICB0aW1lTXVsU2VsZWN0TWVudU9wdCA9IFtdO1xuICAgICAgICAgIGFnZ01ldGhvZFNlbGVjdE1lbnVPcHQgPSBbXTtcblxuICAgICAgICAgIHZhbGlkVGltZVBlcmlvZCA9IGNvbmZpZy52YWxpZFRpbWVQZXJpb2Q7XG4gICAgICAgICAgdmFsaWRUaW1lUGVyaW9kTXVsdGlwbGllciA9IGNvbmZpZy52YWxpZFRpbWVQZXJpb2RNdWx0aXBsaWVyO1xuICAgICAgICAgIGF2bEFnZ01ldGhvZHMgPSBjb25maWcuYXZsQWdnTWV0aG9kcztcblxuICAgICAgICAgIGFwcGx5QnV0dG9uLnVwZGF0ZVZpc3VhbCgnZGlzYWJsZWQnKTtcblxuICAgICAgICAgIGlmIChhZ2dyZWdhdGlvbi5iaW5TaXplICE9PSBtb2RlbC5wcm9wKCdiaW4tc2l6ZScpICYmXG4gICAgICAgICAgICBhZ2dyZWdhdGlvbk1ldGhvZC52YWx1ZSA9PT0gY29uZmlnLmRlZmF1bHRBZ2dNZXRob2QpIHtcbiAgICAgICAgICAgIGFnZ3JlZ2F0aW9uLmJpblNpemUgPSBudWxsO1xuICAgICAgICAgICAgYWdncmVnYXRpb24uYWdncmVnYXRpb25NZXRob2QgPSBudWxsO1xuICAgICAgICAgICAgcmVzZXRCdXR0b24udXBkYXRlVmlzdWFsKCdkaXNhYmxlZCcpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXNldEJ1dHRvbi51cGRhdGVWaXN1YWwoJ2VuYWJsZWQnKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoIWNvbmZpZy5jYW5BZ2dyZWdhdGUpIHtcbiAgICAgICAgICAgIHRpbWVQZXJpb2RTZWxlY3RNZW51LnVwZGF0ZVZpc3VhbCgnZGlzYWJsZWQnKTtcbiAgICAgICAgICAgIHRpbWVNdWxTZWxlY3RNZW51LnVwZGF0ZVZpc3VhbCgnZGlzYWJsZWQnKTtcbiAgICAgICAgICAgIGFnZ01ldGhvZFNlbGVjdE1lbnUudXBkYXRlVmlzdWFsKCdkaXNhYmxlZCcpO1xuICAgICAgICAgICAgcmVzZXRCdXR0b24udXBkYXRlVmlzdWFsKCdkaXNhYmxlZCcpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aW1lUGVyaW9kU2VsZWN0TWVudS51cGRhdGVWaXN1YWwoJ2VuYWJsZWQnKTtcbiAgICAgICAgICAgIHRpbWVNdWxTZWxlY3RNZW51LnVwZGF0ZVZpc3VhbCgnZW5hYmxlZCcpO1xuICAgICAgICAgICAgYWdnTWV0aG9kU2VsZWN0TWVudS51cGRhdGVWaXN1YWwoJ2VuYWJsZWQnKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBmb3IgKHRpbWVQZXJpb2RWYWwgb2YgdmFsaWRUaW1lUGVyaW9kKSB7XG4gICAgICAgICAgICB0aW1lUGVyaW9kU2VsZWN0TWVudU9wdC5wdXNoKHtcbiAgICAgICAgICAgICAgbmFtZTogdGltZVBlcmlvZFZhbCxcbiAgICAgICAgICAgICAgdmFsdWU6IHRpbWVQZXJpb2RWYWxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRpbWVQZXJpb2RTZWxlY3RNZW51LnVwZGF0ZUxpc3QodGltZVBlcmlvZFNlbGVjdE1lbnVPcHQpO1xuICAgICAgICAgIHRpbWVQZXJpb2RTZWxlY3RNZW51LnZhbHVlKHRpbWVQZXJpb2QpO1xuXG4gICAgICAgICAgaW5kZXhPZlRpbWVVbml0ID0gdmFsaWRUaW1lUGVyaW9kLmluZGV4T2YodGltZVBlcmlvZCk7XG5cbiAgICAgICAgICBpZiAoaW5kZXhPZlRpbWVVbml0ID49IDApIHtcbiAgICAgICAgICAgIGZvciAobXVsdGlwbGllclZhbCBvZiB2YWxpZFRpbWVQZXJpb2RNdWx0aXBsaWVyW2luZGV4T2ZUaW1lVW5pdF0pIHtcbiAgICAgICAgICAgICAgdGltZU11bFNlbGVjdE1lbnVPcHQucHVzaCh7XG4gICAgICAgICAgICAgICAgbmFtZTogbXVsdGlwbGllclZhbC50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBtdWx0aXBsaWVyVmFsLnRvU3RyaW5nKClcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGltZU11bFNlbGVjdE1lbnUudXBkYXRlTGlzdCh0aW1lTXVsU2VsZWN0TWVudU9wdCk7XG4gICAgICAgICAgdGltZU11bFNlbGVjdE1lbnUudmFsdWUodGltZVBlcmlvZE11bHRpcGxpZXIudG9TdHJpbmcoKSk7XG5cbiAgICAgICAgICBmb3IgKGFnZ1ZhbCBpbiBhdmxBZ2dNZXRob2RzKSB7XG4gICAgICAgICAgICBhZ2dNZXRob2RTZWxlY3RNZW51T3B0LnB1c2goe1xuICAgICAgICAgICAgICBuYW1lOiBhdmxBZ2dNZXRob2RzW2FnZ1ZhbF0uZm9ybWFsTmFtZSxcbiAgICAgICAgICAgICAgdmFsdWU6IGF2bEFnZ01ldGhvZHNbYWdnVmFsXS5uaWNrTmFtZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYWdnTWV0aG9kU2VsZWN0TWVudS51cGRhdGVMaXN0KGFnZ01ldGhvZFNlbGVjdE1lbnVPcHQpO1xuICAgICAgICAgIGFnZ01ldGhvZFNlbGVjdE1lbnUudmFsdWUoYWdncmVnYXRpb25NZXRob2QudmFsdWUpO1xuICAgICAgICB9O1xuXG4gICAgICBzZWxmLmdldEF2YWlsYWJsZWxBZ2dyZWFnYXRpb24oKTtcblxuICAgICAgeCA9IHggPT09IHVuZGVmaW5lZCA/IG1lYXN1cmVtZW50LnggOiB4O1xuICAgICAgeSA9IHkgPT09IHVuZGVmaW5lZCA/IG1lYXN1cmVtZW50LnkgOiB5O1xuICAgICAgd2lkdGggPSB3aWR0aCA9PT0gdW5kZWZpbmVkID8gbWVhc3VyZW1lbnQud2lkdGggOiB3aWR0aDtcbiAgICAgIGhlaWdodCA9IGhlaWdodCA9PT0gdW5kZWZpbmVkID8gbWVhc3VyZW1lbnQuaGVpZ2h0IDogaGVpZ2h0O1xuICAgICAgZ3JvdXAgPSBncm91cCA9PT0gdW5kZWZpbmVkID8gc2VsZi5wYXJlbnRHcm91cCA6IGdyb3VwO1xuICAgICAgaWYgKHdpZHRoICYmIGhlaWdodCkge1xuICAgICAgICBmb3IgKGkgPSAwLCBsbiA9IHRvb2xiYXJzLmxlbmd0aDsgaSA8IGxuOyBpKyspIHtcbiAgICAgICAgICB0b29sYmFyID0gdG9vbGJhcnNbaV07XG4gICAgICAgICAgdG9vbGJhci5kcmF3KHgsIHksIGdyb3VwKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmFuZ2VPbkNoYW5nZSgpO1xuICAgICAgYXBwbHlCdXR0b24udXBkYXRlVmlzdWFsKCdkaXNhYmxlZCcpO1xuICAgICAgcmVzZXRCdXR0b24udXBkYXRlVmlzdWFsKCdkaXNhYmxlZCcpO1xuICAgICAgY29uZmlnLmRlZmF1bHRBZ2dNZXRob2QgPSBkYXRhQWdnLmdldERlZmF1bHRBZ2dyZWdhdGlvbk1ldGhvZCgpLm5pY2tOYW1lO1xuXG4gICAgICBtb2RlbC5vblByb3BzQ2hhbmdlKFsnYmluLXNpemUnLCAnYWdncmVnYXRpb24tZm4nXSwgcmFuZ2VPbkNoYW5nZSk7XG4gICAgfVxuXG4gICAgZGlzcG9zZSAoKSB7XG4gICAgICAvLyBkaXNwb3NlIGV4dGVuc2lvblxuICAgIH1cbiAgfVxuICByZXR1cm4gQWdncmVnYXRvcjtcbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvZmN0cy1leHQtYWdncmVnYXRvci5qcyJdLCJzb3VyY2VSb290IjoiIn0=