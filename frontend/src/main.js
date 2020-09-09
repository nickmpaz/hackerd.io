import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import Amplify from 'aws-amplify'
import aws_exports from './aws-exports'
import variables from './variables.js'
import {store} from './store.js'
import utils from './utils.js'
import api from './api.js'

Vue.prototype.$variables = variables
Vue.prototype.$utils = utils
Vue.prototype.$api = api
Vue.config.productionTip = false
Amplify.configure(aws_exports)

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')