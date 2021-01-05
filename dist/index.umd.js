(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.ObviousVue = factory());
}(this, (function () { 'use strict';

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var defineProperty = _defineProperty;

  function createCommonjsModule(fn) {
    var module = { exports: {} };
  	return fn(module, module.exports), module.exports;
  }

  var _typeof_1 = createCommonjsModule(function (module) {
  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      module.exports = _typeof = function _typeof(obj) {
        return typeof obj;
      };
    } else {
      module.exports = _typeof = function _typeof(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  module.exports = _typeof;
  });

  var isObject = function isObject(object) {
    return Object.prototype.toString.call(object) === '[object Object]';
  };
  var Errors = {
    busIsRequired: function busIsRequired() {
      return '[obvious-vue] the bus must be provided when using ObviousVue';
    },
    obviousIsNotFunction: function obviousIsNotFunction() {
      return '[obvious-vue] the option obvious must be a function';
    },
    stateIsRequired: function stateIsRequired(dataName) {
      return "[obvious-vue] state is required in obvious.data.".concat(dataName);
    },
    wrongObDataType: function wrongObDataType(dataName, type) {
      return "[obvious-vue] obvious.data.".concat(dataName, " should be a string or a object, but got ").concat(type);
    }
  };

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  var EVENT_TYPE = {
    BROADCAST: 'Broadcast',
    UNICAST: 'Unicast'
  };
  var formatObData = function formatObData(obData) {
    var result = {};

    for (var _i = 0, _Object$keys = Object.keys(obData); _i < _Object$keys.length; _i++) {
      var key = _Object$keys[_i];
      var value = obData[key];

      if (typeof value === 'string') {
        result[key] = {
          state: value
        };
      } else if (isObject(value)) {
        if (value.state) {
          result[key] = value;
        } else {
          throw new Error(Errors.stateIsRequired(key));
        }
      } else {
        throw new Error(Errors.wrongObDataType(key, _typeof_1(value)));
      }
    }

    return result;
  };

  var formatEvents = function formatEvents(events, context) {
    var result = {};

    var _loop = function _loop() {
      var key = _Object$keys2[_i2];
      var value = events[key];

      if (typeof value === 'function') {
        var _context$$options$obv;

        var socket = (_context$$options$obv = context.$options.obvious.socket) !== null && _context$$options$obv !== void 0 ? _context$$options$obv : context.$socket;
        result[key] = {
          socket: socket,
          handler: function handler() {
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            var result = value.call.apply(value, [context].concat(args));
            return result;
          }
        };
      } else {
        var _ref, _value$socket;

        var _socket = (_ref = (_value$socket = value.socket) !== null && _value$socket !== void 0 ? _value$socket : context.$options.obvious.socket) !== null && _ref !== void 0 ? _ref : context.$socket;

        result[key] = {
          socket: _socket,
          handler: function handler() {
            var _value$handler;

            for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
              args[_key2] = arguments[_key2];
            }

            return (_value$handler = value.handler).call.apply(_value$handler, [context].concat(args));
          }
        };
      }
    };

    for (var _i2 = 0, _Object$keys2 = Object.keys(events); _i2 < _Object$keys2.length; _i2++) {
      _loop();
    }

    return result;
  };

  var initNewData = function initNewData(originalData) {
    var newData = {};

    if (typeof originalData === 'function') {
      newData = _objectSpread({}, originalData());
    } else if (isObject(originalData)) {
      newData = _objectSpread({}, originalData);
    }

    return newData;
  };

  var injectObData = function injectObData(dataOption, dataName, socket, state) {
    var stateValue = socket.getState(state);
    var dataValue = stateValue === undefined ? null : stateValue;
    dataOption[dataName] = dataValue;
  };

  var injectObDataWatcher = function injectObDataWatcher(watchOption, dataName, socket, state, context) {
    var rootStateName = state.split('.')[0];

    var handler = function handler(newValue, oldValue) {
      var _context$$obStateWatc;

      if (context.$obStateWatcher && !((_context$$obStateWatc = context.$obStateWatcher[state]) !== null && _context$$obStateWatc !== void 0 && _context$$obStateWatc.stateChanged)) {
        var _handler = context.$obStateWatcher[state].handler;
        socket.waitState([rootStateName]).then(function () {
          socket.unwatchState(state, _handler);
          socket.setState(state, newValue);
          socket.watchState(state, _handler);
        });
      }

      if (context.$obStateWatcher) {
        context.$obStateWatcher[state].stateChanged = false;
      }
    };

    var newWatchOption = [{
      handler: handler,
      deep: true
    }];
    var originalWatcher = watchOption[dataName];
    originalWatcher && newWatchOption.push(originalWatcher);
    watchOption[dataName] = newWatchOption;
  };

  var injectStateWatcher = function injectStateWatcher(dataName, socket, state, context) {
    context.$nextTick(function () {
      var rootStateName = state.split('.')[0];
      socket.waitState([rootStateName]).then(function () {
        context[dataName] = socket.getState(state);

        var handler = function handler(newValue) {
          context.$obStateWatcher[state].stateChanged = true;
          context[dataName] = newValue;
        };

        context.$obStateWatcher[state] = {
          socket: socket,
          handler: handler,
          stateChanged: false
        };
        socket.watchState(state, handler);
      });
    });
  };

  var listenEvents = function listenEvents(type, events) {
    Object.keys(events).forEach(function (eventName) {
      var _events$eventName = events[eventName],
          handler = _events$eventName.handler,
          socket = _events$eventName.socket;
      socket["on".concat(type)](eventName, handler);
    });
  };

  var mixin = {
    beforeCreate: function beforeCreate() {
      var _this = this;

      this.$obStateWatcher = {};
      var _this$$options = this.$options,
          originalData = _this$$options.data,
          originalWatch = _this$$options.watch,
          _obvious = _this$$options.obvious;

      if (_obvious && typeof _obvious !== 'function') {
        throw new Error(Errors.obviousIsNotFunction());
      }

      var obvious = _obvious && _obvious.call(this);

      if (isObject(obvious)) {
        var dataOption = initNewData(originalData);
        var watchOption = originalWatch ? _objectSpread({}, originalWatch) : {};
        var componentSocket = obvious.socket,
            originalObData = obvious.data,
            broadcast = obvious.broadcast,
            unicast = obvious.unicast; // inject data and watch

        if (isObject(originalObData)) {
          var obData = formatObData(originalObData);
          Object.keys(obData).forEach(function (dataName) {
            var _ref2;

            var _obData$dataName = obData[dataName],
                state = _obData$dataName.state,
                stateSocket = _obData$dataName.socket;
            var socket = (_ref2 = stateSocket !== null && stateSocket !== void 0 ? stateSocket : componentSocket) !== null && _ref2 !== void 0 ? _ref2 : _this.$socket;
            injectObData(dataOption, dataName, socket, state);
            injectObDataWatcher(watchOption, dataName, socket, state, _this);
            injectStateWatcher(dataName, socket, state, _this);
          });

          if (isObject(originalData)) {
            this.$options.data = dataOption;
          } else {
            this.$options.data = function () {
              return dataOption;
            };
          }

          this.$options.watch = watchOption;
        } // listen broadcast


        if (isObject(broadcast)) {
          this.$broadcastEvents = formatEvents(broadcast, this);
          listenEvents(EVENT_TYPE.BROADCAST, this.$broadcastEvents);
        } // listen unicast


        if (isObject(unicast)) {
          this.$unicastEvents = formatEvents(unicast, this);
          listenEvents(EVENT_TYPE.UNICAST, this.$unicastEvents);
        }
      }
    },
    beforeDestroy: function beforeDestroy() {
      var _this2 = this;

      // clear obvious state watcher
      isObject(this.$obStateWatcher) && Object.keys(this.$obStateWatcher).forEach(function (stateName) {
        var _this2$$obStateWatche = _this2.$obStateWatcher[stateName],
            socket = _this2$$obStateWatche.socket,
            handler = _this2$$obStateWatche.handler;
        socket.unwatchState(stateName, handler);
      }); // clear broadcast event handler

      isObject(this.$broadcastEvents) && Object.keys(this.$broadcastEvents).forEach(function (eventName) {
        var _this2$$broadcastEven = _this2.$broadcastEvents[eventName],
            socket = _this2$$broadcastEven.socket,
            handler = _this2$$broadcastEven.handler;
        socket.offBroadcast(eventName, handler);
      }); // clear unicast event handler

      isObject(this.$unicastEvents) && Object.keys(this.$unicastEvents).forEach(function (eventName) {
        var _this2$$unicastEvents = _this2.$unicastEvents[eventName],
            socket = _this2$$unicastEvents.socket,
            handler = _this2$$unicastEvents.handler;
        socket.offUnicast(eventName, handler);
      });
      this.$obStateWatcher = null;
      this.$broadcastEvents = null;
      this.$unicastEvents = null;
    }
  };

  function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  var ObviousApp = {
    name: 'obvious-app',
    props: {
      bus: {
        type: Object,
        required: false
      },
      name: {
        type: String,
        required: true
      },
      activateConfig: {
        type: Object,
        "default": function _default() {}
      },
      destroyConfig: {
        type: Object,
        "default": function _default() {}
      }
    },
    data: function data() {
      return {
        _bus_: null
      };
    },
    watch: {
      bus: function bus(value) {
        this._bus_ = value;
      },
      activateConfig: {
        handler: function handler(value) {
          this._bus_.activateApp(this.name, _objectSpread$1(_objectSpread$1({}, value), {}, {
            mountPoint: this.$refs.mountPoint
          }));
        },
        deep: true
      }
    },
    created: function created() {
      var _this$bus;

      this._bus_ = (_this$bus = this.bus) !== null && _this$bus !== void 0 ? _this$bus : this.$bus;
    },
    mounted: function mounted() {
      var _this = this;

      this._bus_.activateApp(this.name, _objectSpread$1(_objectSpread$1({}, this.activateConfig), {}, {
        mountPoint: this.$refs.mountPoint
      })).then(function () {
        _this.$emit('activated');
      })["catch"](function (err) {
        _this.$emit('error', err);
      });
    },
    beforeDestroy: function beforeDestroy() {
      var _this2 = this;

      this._bus_.destroyApp(this.name, _objectSpread$1(_objectSpread$1({}, this.destroyConfig), {}, {
        mountPoint: this.$refs.mountPoint
      })).then(function () {
        _this2.$emit('destroyed');
      })["catch"](function (err) {
        _this2.$emit('error', err);
      });
    },
    render: function render(h) {
      return h('div', {
        ref: 'mountPoint'
      });
    }
  };

  var formatEvents$1 = function formatEvents(events, parentSocket, defaultSocket) {
    var result = {};

    if (isObject(events)) {
      for (var _i = 0, _Object$keys = Object.keys(events); _i < _Object$keys.length; _i++) {
        var key = _Object$keys[_i];
        var value = events[key];

        if (typeof value === 'function') {
          var socket = parentSocket !== null && parentSocket !== void 0 ? parentSocket : defaultSocket;
          result[key] = {
            socket: socket,
            handler: value
          };
        } else {
          var _ref, _value$socket;

          var _socket = (_ref = (_value$socket = value.socket) !== null && _value$socket !== void 0 ? _value$socket : parentSocket) !== null && _ref !== void 0 ? _ref : defaultSocket;

          result[key] = {
            socket: _socket,
            handler: value.handler
          };
        }
      }
    }

    return result;
  };

  var obviousMegrge = function obviousMegrge(merge, defaultSocket, that) {
    return function (parentVal, childVal, vm) {
      // vm is undefined: is it a bug ? https://github.com/vuejs/vue/issues/9623
      if (parentVal && !childVal) {
        return parentVal;
      }

      if (!parentVal && childVal) {
        return childVal;
      }

      if (parentVal && childVal) {
        if (typeof parentVal !== 'function' || typeof childVal !== 'function') {
          throw new Error(Errors.obviousIsNotFunction());
        }

        var parentOption = parentVal.call(vm || that);
        var childOption = childVal.call(vm || that); // format data

        var formatedParentData = formatObData(parentOption.data);
        Object.keys(formatedParentData).forEach(function (dataName) {
          var _ref2, _dataItem$socket;

          var dataItem = formatedParentData[dataName];
          dataItem.socket = (_ref2 = (_dataItem$socket = dataItem.socket) !== null && _dataItem$socket !== void 0 ? _dataItem$socket : parentOption.socket) !== null && _ref2 !== void 0 ? _ref2 : defaultSocket;
        }); // format broadcast

        var formatedParentBroadcast = formatEvents$1(parentOption.broadcast, parentOption.socket, defaultSocket); // format unicast

        var formatedParentUnicast = formatEvents$1(parentOption.unicast, parentOption.socket, defaultSocket);
        var result = {
          socket: childOption.socket,
          data: merge(formatedParentData, childOption.data),
          broadcast: merge(formatedParentBroadcast, childOption.broadcast),
          unicast: merge(formatedParentUnicast, childOption.unicast)
        };
        return function () {
          return result;
        };
      }
    };
  };

  var index = {
    install: function install(Vue, option) {
      var bus = option.bus;

      if (!bus) {
        throw new Error(Errors.busIsRequired());
      }

      var defaultSocket = bus.createSocket();
      Vue.prototype.$bus = bus;
      Vue.prototype.$socket = defaultSocket;
      var merge = Vue.config.optionMergeStrategies.methods;
      Vue.config.optionMergeStrategies.obvious = obviousMegrge(merge, defaultSocket, Vue.prototype);
      Vue.mixin(mixin);
      Vue.component('obvious-app', ObviousApp);
    }
  };

  return index;

})));
