const broadcastMerge = (parentVal, childVal, vm) => {
  if (!childVal) {
    return parentVal
  }
  if (!parentVal) {
    return childVal
  }
  const result = parentVal
  Object.keys(childVal).forEach((eventName) => {
    if (!result[eventName]) {
      result[eventName] = childVal[eventName]
    } else {
      const unflatedHandlers = [result[eventName], childVal[eventName]]
      result[eventName] = unflatedHandlers.flat()
    }
  })
  return result
}

export default broadcastMerge
