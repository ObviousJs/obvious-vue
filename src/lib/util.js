export const isObject = (object) => {
  return Object.prototype.toString.call(object) === '[object Object]'
}

export const Errors = {
  busIsRequired: () => 'the bus must be provided when using ObviousVue',
  stateIsRequired: (dataName) => `state is required in obvious.data.${dataName}`,
  wrongObDataType: (dataName, type) => `obvious.data.${dataName} should be a string or a object, but got ${type}`
}
