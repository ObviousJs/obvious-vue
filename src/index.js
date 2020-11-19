import Vue from 'vue'

export default {
  install (option) {
    const { bus, socket } = option
    if (!bus) {
      // TODO: throw error
    }
    Vue.prototype.$bus = bus
    Vue.prototype.$socket = socket ?? bus.createSocket()
  }
}
