export const isObject = (object) => {
  return Object.prototype.toString.call(object) === '[object Object]'
}

export const Errors = {
  busIsRequired: () => '[obvious-vue] $bus must be provided on the root Vue instance',
  socketIsRequired: () => '[obvious-vue] $socket must be provided on the root Vue instance',
  stateIsRequired: (dataName) => `[obvious-vue] state is required in obviousData.${dataName}`,
  wrongObDataType: (dataName, type) => `[obvious-vue] obviousData.${dataName} should be a string or a object, but got ${type}`
}
