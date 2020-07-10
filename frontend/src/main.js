import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import Amplify from 'aws-amplify';
import '@aws-amplify/ui-vue';
import aws_exports from './aws-exports';

Vue.config.productionTip = false
Amplify.configure(aws_exports);

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
