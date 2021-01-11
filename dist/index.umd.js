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
      return '[obvious-vue] $bus must be provided on the root Vue instance';
    },
    socketIsRequired: function socketIsRequired() {
      return '[obvious-vue] $socket must be provided on the root Vue instance';
    },
    stateIsRequired: function stateIsRequired(dataName) {
      return "[obvious-vue] state is required in obviousData.".concat(dataName);
    },
    wrongObDataType: function wrongObDataType(dataName, type) {
      return "[obvious-vue] obviousData.".concat(dataName, " should be a string or a object, but got ").concat(type);
    }
  };

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  var EVENT_TYPE = {
    BROADCAST: 'Broadcast',
    UNICAST: 'Unicast'
  }; // --------------------------- state ---------------------------- //

  var formatObviousData = function formatObviousData(obData) {
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

  var initNewData = function initNewData(originalData, context) {
    var newData = {};

    if (typeof originalData === 'function') {
      newData = _objectSpread({}, originalData.call(context));
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
  }; // --------------------------- Events ---------------------------- //


  var formatEvent = function formatEvent(event, context) {
    var _context$$options$soc;

    var result = {};
    var defaultSocket = (_context$$options$soc = context.$options.socket) !== null && _context$$options$soc !== void 0 ? _context$$options$soc : context.$socket;

    if (typeof event === 'function') {
      result = {
        socket: defaultSocket,
        handler: function handler() {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          return event.call.apply(event, [context].concat(args));
        }
      };
    } else if (isObject(event) && typeof event.handler === 'function') {
      var _event$socket;

      result = {
        socket: (_event$socket = event.socket) !== null && _event$socket !== void 0 ? _event$socket : defaultSocket,
        handler: function handler() {
          var _event$handler;

          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          return (_event$handler = event.handler).call.apply(_event$handler, [context].concat(args));
        }
      };
    }

    return result;
  };

  var formatBroadcast = function formatBroadcast(broadcast, context) {
    var result = {};

    for (var _i2 = 0, _Object$keys2 = Object.keys(broadcast); _i2 < _Object$keys2.length; _i2++) {
      var key = _Object$keys2[_i2];

      if (Array.isArray(broadcast[key])) {
        result[key] = broadcast[key].map(function (event) {
          return formatEvent(event, context);
        });
      } else if (typeof broadcast[key] === 'function' || isObject(broadcast[key])) {
        result[key] = [formatEvent(broadcast[key], context)];
      }
    }

    return result;
  };

  var formatUnicast = function formatUnicast(unicast, context) {
    var result = {};

    for (var _i3 = 0, _Object$keys3 = Object.keys(unicast); _i3 < _Object$keys3.length; _i3++) {
      var key = _Object$keys3[_i3];
      result[key] = formatEvent(unicast[key], context);
    }

    return result;
  };

  var listenEvent = function listenEvent(type, eventName, option) {
    var handler = option.handler,
        socket = option.socket;

    if (socket && typeof handler === 'function') {
      socket["on".concat(type)](eventName, handler);
    }
  };

  var listenBroadcast = function listenBroadcast(events) {
    if (isObject(events)) {
      Object.keys(events).forEach(function (eventName) {
        var listenerOptions = events[eventName];
        listenerOptions.forEach(function (option) {
          listenEvent(EVENT_TYPE.BROADCAST, eventName, option);
        });
      });
    }
  };

  var listenUnicast = function listenUnicast(events) {
    if (isObject(events)) {
      Object.keys(events).forEach(function (eventName) {
        var option = events[eventName];
        listenEvent(EVENT_TYPE.UNICAST, eventName, option);
      });
    }
  };

  var mixin = {
    beforeCreate: function beforeCreate() {
      var _this = this;

      this.$socket = this.$root.$options.$socket;
      this.$bus = this.$root.$options.$bus;

      if (!this.$bus) {
        throw new Error(Errors.busIsRequired());
      }

      if (!this.$socket) {
        throw new Error(Errors.socketIsRequired());
      }

      var _this$$options = this.$options,
          obviousData = _this$$options.obviousData,
          broadcast = _this$$options.broadcast,
          unicast = _this$$options.unicast,
          componentSocket = _this$$options.socket;

      if (isObject(obviousData)) {
        this.$obStateWatcher = {};
        var _this$$options2 = this.$options,
            originalData = _this$$options2.data,
            originalWatch = _this$$options2.watch;
        var dataOption = initNewData(originalData, this);
        var watchOption = originalWatch ? _objectSpread({}, originalWatch) : {};
        var obData = formatObviousData(obviousData);
        Object.keys(obData).forEach(function (dataName) {
          var _ref;

          var _obData$dataName = obData[dataName],
              state = _obData$dataName.state,
              stateSocket = _obData$dataName.socket;
          var socket = (_ref = stateSocket !== null && stateSocket !== void 0 ? stateSocket : componentSocket) !== null && _ref !== void 0 ? _ref : _this.$socket;
          injectObData(dataOption, dataName, socket, state);
          injectObDataWatcher(watchOption, dataName, socket, state, _this);
          injectStateWatcher(dataName, socket, state, _this);

          if (isObject(originalData)) {
            _this.$options.data = dataOption;
          } else {
            _this.$options.data = function () {
              return dataOption;
            };
          }

          _this.$options.watch = watchOption;
        });
      }

      if (isObject(broadcast)) {
        this.$broadcastEvents = formatBroadcast(broadcast, this);
        listenBroadcast(this.$broadcastEvents);
      }

      if (isObject(unicast)) {
        this.$unicastEvents = formatUnicast(unicast, this);
        listenUnicast(this.$unicastEvents);
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
        var watchers = _this2.$broadcastEvents[eventName];
        watchers.forEach(function (option) {
          var handler = option.handler,
              socket = option.socket;

          if (socket && typeof handler === 'function') {
            socket.offBroadcast(eventName, handler);
          }
        });
      }); // clear unicast event handler

      isObject(this.$unicastEvents) && Object.keys(this.$unicastEvents).forEach(function (eventName) {
        var _this2$$unicastEvents = _this2.$unicastEvents[eventName],
            socket = _this2$$unicastEvents.socket,
            handler = _this2$$unicastEvents.handler;

        if (socket && typeof handler === 'function') {
          socket.offUnicast(eventName, handler);
        }
      });
      this.$obStateWatcher = null;
      this.$broadcastEvents = null;
      this.$unicastEvents = null;
    }
  };

  var broadcastMerge = function broadcastMerge(parentVal, childVal, vm) {
    if (!childVal) {
      return parentVal;
    }

    if (!parentVal) {
      return childVal;
    }

    var result = parentVal;
    Object.keys(childVal).forEach(function (eventName) {
      if (!result[eventName]) {
        result[eventName] = childVal[eventName];
      } else {
        var unflatedHandlers = [result[eventName], childVal[eventName]];
        result[eventName] = unflatedHandlers.flat();
      }
    });
    return result;
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

  var index = {
    install: function install(Vue) {
      var normalMerge = Vue.config.optionMergeStrategies.methods;
      Vue.config.optionMergeStrategies.socket = normalMerge;
      Vue.config.optionMergeStrategies.obviousData = normalMerge;
      Vue.config.optionMergeStrategies.unicast = normalMerge;
      Vue.config.optionMergeStrategies.broadcast = broadcastMerge;
      Vue.mixin(mixin);
      Vue.component('obvious-app', ObviousApp);
    }
  };

  return index;

})));
