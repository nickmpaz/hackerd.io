import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import Amplify from 'aws-amplify';
import '@aws-amplify/ui-vue';
import aws_exports from './aws-exports';

Vue.config.productionTip = false
Amplify.configure(aws_exports);

var settings = require('./settings')
Vue.prototype.$settings = settings
Vue.prototype.$api = {
  ping: settings.baseUrl + 'ping',
  pingAuth: settings.baseUrl + 'ping_auth',
  createNote: settings.baseUrl + 'notes',
  getNotes: settings.baseUrl + 'notes',
  getNote: settings.baseUrl + 'notes/',
  updateNote: settings.baseUrl + 'notes/'
}


new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
