/* eslint-disable */ 
import Vue from 'vue';
import App from './App.vue';
import ObviousVue from '../../../src/index'

Vue.config.productionTip = false;
const $bus = window.__Bus__.host;
const $socket = $bus.createSocket();

Vue.use(ObviousVue)

$bus.createApp('vue-app')
  .bootstrap(async (config) => {
    new Vue({
      render: h => h(App),
      $bus,
      $socket
    }).$mount(config.mountPoint);
  });
