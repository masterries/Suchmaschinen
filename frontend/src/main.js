import Vue from 'vue'
import VueMeta from 'vue-meta'
import { BootstrapVue, IconsPlugin , BootstrapVueIcons  } from 'bootstrap-vue'
import App from './App.vue'
import { FormCheckboxPlugin } from 'bootstrap-vue'
import { FormRadioPlugin } from 'bootstrap-vue'
import DateRangePicker from 'vue2-daterange-picker'



import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '@fortawesome/fontawesome-free/css/all.css'
import './assets/reset.css';
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'

Vue.config.productionTip = false

Vue.use(VueMeta)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(FormCheckboxPlugin)
Vue.use(FormRadioPlugin)
Vue.use(BootstrapVueIcons)
Vue.use(FormCheckboxPlugin)

export default {
  components: { DateRangePicker },
}

new Vue({
  
  render: h => h(App),

}).$mount('#app')