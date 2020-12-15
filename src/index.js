import mixin from './lib/mixin'
import ObviousApp from './component/obvious-app'
import mergeStrategy from './lib/mergeStrategy'
import { Errors } from './lib/util'

export default {
  install (Vue, option) {
    const { bus } = option
    if (!bus) {
      throw new Error(Errors.busIsRequired())
    }
    const defaultSocket = bus.createSocket()

    Vue.prototype.$bus = bus
    Vue.prototype.$socket = defaultSocket

    const merge = Vue.config.optionMergeStrategies.methods

    Vue.config.optionMergeStrategies.obvious = mergeStrategy(merge, defaultSocket, Vue.prototype)

    Vue.mixin(mixin)
    Vue.component('obvious-app', ObviousApp)
  }
}
