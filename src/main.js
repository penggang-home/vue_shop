import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './network/index.js'

Vue.config.productionTip = false

// 导入字体图标
// import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'



new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
