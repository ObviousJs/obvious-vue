import mixin from './lib/mixin'
import ObviousApp from './component/obvious-app'
import { Errors } from './lib/util'

export default {
  install (Vue, option) {
    const { bus } = option
    if (!bus) {
      throw new Error(Errors.busIsRequired())
    }
    Vue.prototype.$bus = bus
    Vue.prototype.$socket = bus.createSocket()
    Vue.mixin(mixin)
    Vue.component('obvious-app', ObviousApp)
  }
}
