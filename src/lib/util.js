export const isObject = (object) => {
  return Object.prototype.toString.call(object) === '[object Object]'
}

export const Errors = {
  busIsRequired: () => '[obvious-vue] the bus must be provided',
  socketIsRequired: () => '[obvious-vue] the socket must be provided',
  stateIsRequired: (dataName) => `[obvious-vue] state is required in obviousData.${dataName}`,
  wrongObDataType: (dataName, type) => `[obvious-vue] obviousData.${dataName} should be a string or a object, but got ${type}`
}
