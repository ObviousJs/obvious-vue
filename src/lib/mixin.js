import { Errors, isObject } from './util'

const EVENT_TYPE = {
  BROADCAST: 'Broadcast',
  UNICAST: 'Unicast'
}

// --------------------------- state ---------------------------- //
const formatObviousData = (obData) => {
  const result = {}
  for (const key of Object.keys(obData)) {
    const value = obData[key]
    if (typeof value === 'string') {
      result[key] = {
        state: value
      }
    } else if (isObject(value)) {
      if (value.state) {
        result[key] = value
      } else {
        throw new Error(Errors.stateIsRequired(key))
      }
    } else {
      throw new Error(Errors.wrongObDataType(key, typeof value))
    }
  }
  return result
}

const initNewData = (originalData) => {
  let newData = {}
  if (typeof originalData === 'function') {
    newData = {
      ...originalData()
    }
  } else if (isObject(originalData)) {
    newData = {
      ...originalData
    }
  }
  return newData
}

const injectObData = (dataOption, dataName, socket, state) => {
  const stateValue = socket.getState(state)
  const dataValue = stateValue === undefined ? null : stateValue
  dataOption[dataName] = dataValue
}

const injectObDataWatcher = (watchOption, dataName, socket, state, context) => {
  const rootStateName = state.split('.')[0]
  const handler = (newValue, oldValue) => {
    if (context.$obStateWatcher && !context.$obStateWatcher[state]?.stateChanged) {
      const { handler } = context.$obStateWatcher[state]
      socket.waitState([rootStateName]).then(() => {
        socket.unwatchState(state, handler)
        socket.setState(state, newValue)
        socket.watchState(state, handler)
      })
    }

    if (context.$obStateWatcher) {
      context.$obStateWatcher[state].stateChanged = false
    }
  }
  const newWatchOption = [{
    handler,
    deep: true
  }]
  const originalWatcher = watchOption[dataName]
  originalWatcher && newWatchOption.push(originalWatcher)
  watchOption[dataName] = newWatchOption
}

const injectStateWatcher = (dataName, socket, state, context) => {
  context.$nextTick(() => {
    const rootStateName = state.split('.')[0]
    socket.waitState([rootStateName]).then(() => {
      context[dataName] = socket.getState(state)
      const handler = (newValue) => {
        context.$obStateWatcher[state].stateChanged = true
        context[dataName] = newValue
      }
      context.$obStateWatcher[state] = {
        socket,
        handler,
        stateChanged: false
      }
      socket.watchState(state, handler)
    })
  })
}

// --------------------------- Events ---------------------------- //
const formatEvent = (event, context) => {
  let result = {}
  const defaultSocket = context.$options.socket ?? context.$socket
  if (typeof event === 'function') {
    result = {
      socket: defaultSocket,
      handler: (...args) => {
        return event.call(context, ...args)
      }
    }
  } else if (isObject(event) && typeof event.handler === 'function') {
    result = {
      socket: event.socket ?? defaultSocket,
      handler: (...args) => {
        return event.handler.call(context, ...args)
      }
    }
  }
  return result
}

const formatBroadcast = (broadcast, context) => {
  const result = {}
  for (const key of Object.keys(broadcast)) {
    if (Array.isArray(broadcast[key])) {
      result[key] = broadcast[key].map((event) => formatEvent(event, context))
    } else if (typeof broadcast[key] === 'function' || isObject(broadcast[key])) {
      result[key] = [formatEvent(broadcast[key], context)]
    }
  }
  return result
}

const formatUnicast = (unicast, context) => {
  const result = {}
  for (const key of Object.keys(unicast)) {
    result[key] = formatEvent(unicast[key], context)
  }
  return result
}

const listenEvent = (type, eventName, option) => {
  const { handler, socket } = option
  if (socket && typeof handler === 'function') {
    socket[`on${type}`](eventName, handler)
  }
}

const listenBroadcast = (events) => {
  if (isObject(events)) {
    Object.keys(events).forEach((eventName) => {
      const listenerOptions = events[eventName]
      listenerOptions.forEach((option) => {
        listenEvent(EVENT_TYPE.BROADCAST, eventName, option)
      })
    })
  }
}

const listenUnicast = (events) => {
  if (isObject(events)) {
    Object.keys(events).forEach((eventName) => {
      const option = events[eventName]
      listenEvent(EVENT_TYPE.UNICAST, eventName, option)
    })
  }
}

export default {
  beforeCreate() {
    this.$socket = this.$root.$options.$socket
    this.$bus = this.$root.$options.$bus
    if (!this.$bus) {
      throw new Error(Errors.busIsRequired())
    }
    if (!this.$socket) {
      throw new Error(Errors.socketIsRequired())
    }
    const { obviousData, broadcast, unicast, socket: componentSocket } = this.$options
    if (isObject(obviousData)) {
      this.$obStateWatcher = {}
      const { data: originalData, watch: originalWatch } = this.$options
      const dataOption = initNewData(originalData)
      const watchOption = originalWatch ? { ...originalWatch } : {}
      const obData = formatObviousData(obviousData)
      Object.keys(obData).forEach((dataName) => {
        const { state, socket: stateSocket } = obData[dataName]
        const socket = stateSocket ?? componentSocket ?? this.$socket
        injectObData(dataOption, dataName, socket, state)
        injectObDataWatcher(watchOption, dataName, socket, state, this)
        injectStateWatcher(dataName, socket, state, this)
        if (isObject(originalData)) {
          this.$options.data = dataOption
        } else {
          this.$options.data = function() {
            return dataOption
          }
        }
        this.$options.watch = watchOption
      })
    }
    if (isObject(broadcast)) {
      this.$broadcastEvents = formatBroadcast(broadcast, this)
      listenBroadcast(this.$broadcastEvents)
    }

    if (isObject(unicast)) {
      this.$unicastEvents = formatUnicast(unicast, this)
      listenUnicast(this.$unicastEvents)
    }
  },

  beforeDestroy() {
    // clear obvious state watcher
    isObject(this.$obStateWatcher) && Object.keys(this.$obStateWatcher).forEach((stateName) => {
      const { socket, handler } = this.$obStateWatcher[stateName]
      socket.unwatchState(stateName, handler)
    })
    // clear broadcast event handler
    isObject(this.$broadcastEvents) && Object.keys(this.$broadcastEvents).forEach((eventName) => {
      const watchers = this.$broadcastEvents[eventName]
      watchers.forEach((option) => {
        const { handler, socket } = option
        if (socket && typeof handler === 'function') {
          socket.offBroadcast(eventName, handler)
        }
      })
    })
    // clear unicast event handler
    isObject(this.$unicastEvents) && Object.keys(this.$unicastEvents).forEach((eventName) => {
      const { socket, handler } = this.$unicastEvents[eventName]
      if (socket && typeof handler === 'function') {
        socket.offUnicast(eventName, handler)
      }
    })
    this.$obStateWatcher = null
    this.$broadcastEvents = null
    this.$unicastEvents = null
  }
}
