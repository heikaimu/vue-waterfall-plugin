/*
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-10-19 17:44:24
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2022-03-24 11:24:53
 */
import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './index.css'
import 'animate.css'

Vue.use(ElementUI)

new Vue({
  el: '#app',
  render: h => h(App)
});
