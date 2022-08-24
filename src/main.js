/*
 * @Author: your name
 * @Date: 2021-09-08 09:50:51
 * @LastEditTime: 2021-12-10 10:27:15
 * @LastEditors: Joker
 * @Description: main.js 
 * @FilePath: \bjbank-xcoa\src\main.js
 */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './rootRouter'
import { ToastPlugin, LoadingPlugin } from 'vux'
import './share/assets/style/mx_ui.css';
import './assets/fonts/iconfont.css'
import 'vant/lib/index.less';
import store from './store/index.js'
import './core/utils/tools'
import Components from './components/index'
//import VConsose from 'vconsole'
//Vue.use(new VConsose())
Vue.use(Components) // 全局注册组件
Vue.use(ToastPlugin)
Vue.use(LoadingPlugin)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
