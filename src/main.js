import Vue from 'vue'
import VueMeta from 'vue-meta'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import App from './App.vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '@fortawesome/fontawesome-free/css/all.css'

Vue.config.productionTip = false

Vue.use(VueMeta)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

new Vue({
  
  render: h => h(App),

}).$mount('#app')
