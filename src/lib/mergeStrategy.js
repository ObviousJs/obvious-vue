import { Errors, isObject } from './util'
import { formatObData } from './mixin'

const formatEvents = (events, parentSocket, defaultSocket) => {
  const result = {}
  if (isObject(events)) {
    for (const key of Object.keys(events)) {
      const value = events[key]
      if (typeof value === 'function') {
        const socket = parentSocket ?? defaultSocket
        result[key] = {
          socket,
          handler: value
        }
      } else {
        const socket = value.socket ?? parentSocket ?? defaultSocket
        result[key] = {
          socket,
          handler: value.handler
        }
      }
    }
  }
  return result
}

const obviousMegrge = (merge, defaultSocket, that) => (parentVal, childVal, vm) => {
  // vm is undefined: is it a bug ? https://github.com/vuejs/vue/issues/9623
  if (parentVal && !childVal) {
    return parentVal
  }
  if (!parentVal && childVal) {
    return childVal
  }

  if (parentVal && childVal) {
    if (typeof parentVal !== 'function' || typeof childVal !== 'function') {
      throw new Error(Errors.obviousIsNotFunction())
    }
    const parentOption = parentVal.call(vm || that)
    const childOption = childVal.call(vm || that)

    // format data
    const formatedParentData = formatObData(parentOption.data)
    Object.keys(formatedParentData).forEach((dataName) => {
      const dataItem = formatedParentData[dataName]
      dataItem.socket = dataItem.socket ?? parentOption.socket ?? defaultSocket
    })

    // format broadcast
    const formatedParentBroadcast = formatEvents(parentOption.broadcast, parentOption.socket, defaultSocket)

    // format unicast
    const formatedParentUnicast = formatEvents(parentOption.unicast, parentOption.socket, defaultSocket)

    const result = {
      socket: childOption.socket,
      data: merge(formatedParentData, childOption.data),
      broadcast: merge(formatedParentBroadcast, childOption.broadcast),
      unicast: merge(formatedParentUnicast, childOption.unicast)
    }

    return function () {
      return result
    }
  }
}

export default obviousMegrge
