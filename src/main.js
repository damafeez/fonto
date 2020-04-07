import Vue from 'vue'
import VueWorker from 'vue-worker'
import App from './App.vue'
import './styles/globals/index.scss'

Vue.use(VueWorker)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
