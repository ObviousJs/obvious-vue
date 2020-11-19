export const isObject = (object) => {
  return Object.prototype.toString.call(object) === '[object Object]'
}
