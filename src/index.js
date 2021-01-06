import mixin from './lib/mixin'
import ObviousApp from './component/obvious-app'

export default {
  install (Vue) {
    const watcherMerge = Vue.config.optionMergeStrategies.watch

    Vue.config.optionMergeStrategies.broadcast = watcherMerge

    Vue.mixin(mixin)
    Vue.component('obvious-app', ObviousApp)
  }
}
