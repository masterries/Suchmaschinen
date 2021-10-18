import Vue from 'vue'
import VueMeta from 'vue-meta'
import { BootstrapVue, IconsPlugin , BootstrapVueIcons  } from 'bootstrap-vue'
import App from './App.vue'
import { FormCheckboxPlugin } from 'bootstrap-vue'
import { FormRadioPlugin } from 'bootstrap-vue'
Vue.use(FormCheckboxPlugin)


import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '@fortawesome/fontawesome-free/css/all.css'

Vue.config.productionTip = false

Vue.use(VueMeta)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(FormCheckboxPlugin)
Vue.use(FormRadioPlugin)
Vue.use(BootstrapVueIcons)

new Vue({
  
  render: h => h(App),

}).$mount('#app')
