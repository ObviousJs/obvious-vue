import Vue from 'vue'
import mixin from './lib/mixin'
import ObviousApp from './component/obvious-app'

export default {
  install (option) {
    const { bus, socket } = option
    if (!bus) {
      // TODO: throw error
    }
    Vue.prototype.$bus = bus
    Vue.prototype.$socket = socket ?? bus.createSocket()
    Vue.mixin(mixin)
    Vue.component('obvious-app', ObviousApp)
  }
}
