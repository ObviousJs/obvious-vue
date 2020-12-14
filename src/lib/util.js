export const isObject = (object) => {
  return Object.prototype.toString.call(object) === '[object Object]'
}

export const Errors = {
  busIsRequired: () => '[obvious-vue] the bus must be provided when using ObviousVue',
  obviousIsNotFunction: () => '[obvious-vue] the option obvious must be a function',
  stateIsRequired: (dataName) => `[obvious-vue] state is required in obvious.data.${dataName}`,
  wrongObDataType: (dataName, type) => `[obvious-vue] obvious.data.${dataName} should be a string or a object, but got ${type}`
}
