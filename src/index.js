import mixin from './lib/mixin'
import broadcastMerge from './lib/broadcastMergeStrategy'
import ObviousApp from './component/obvious-app'

export default {
  install(Vue) {
    const normalMerge = Vue.config.optionMergeStrategies.methods
    Vue.config.optionMergeStrategies.socket = normalMerge
    Vue.config.optionMergeStrategies.obviousData = normalMerge
    Vue.config.optionMergeStrategies.unicast = normalMerge
    Vue.config.optionMergeStrategies.broadcast = broadcastMerge
    Vue.mixin(mixin)
    Vue.component('obvious-app', ObviousApp)
  }
}
