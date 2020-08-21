import Vue from 'vue';
import App from './App.vue';
import router from './router';
import 'element-ui/lib/theme-chalk/index.css';
import { Select, Option, Switch, InputNumber, Button, Message } from 'element-ui';

Vue.use(Select);
Vue.use(Option);
Vue.use(Switch);
Vue.use(InputNumber);
Vue.use(Button);
Vue.prototype.$message = Message;

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
