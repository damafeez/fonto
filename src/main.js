import Vue from 'vue'
import VueWorker from 'vue-worker'
import VTooltip from 'v-tooltip'
import App from './App.vue'
import './polyfills'
import './styles/globals/index.scss'

Vue.use(VTooltip)
Vue.use(VueWorker)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
