import { Errors } from './util'
import { formatObData } from './mixin'

const formatEvents = (events, parentSocket, defaultSocket) => {
  const result = {}
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
  return result
}

const obviousMegrge = (merge, defaultSocket) => (parentVal, childVal, vm) => {
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
    const parentOption = parentVal.call(vm)
    const childOption = childVal.call(vm)
    // format data
    const originalParentData = parentOption.data
    const formatedParentData = formatObData(originalParentData)
    Object.keys(formatedParentData).forEach((dataItem) => {
      dataItem.socket = parentOption.socket || defaultSocket
    })

    // format broadcast
    const formatedParentBroadcast = formatEvents(parentOption.broadcast, parentOption.socket, defaultSocket)

    // format unicast
    const formateParentUnicast = formatEvents(parentOption.unicast, parentOption.socket, defaultSocket)

    const result = {
      socket: childOption.socket,
      data: merge(formatedParentData, childOption.data),
      broadcast: merge(formatedParentBroadcast, childOption.broadcast),
      unicast: merge(formateParentUnicast, childOption.unicast)
    }

    console.table(result)
    return function () {
      return result
    }
  }
}

export default obviousMegrge
