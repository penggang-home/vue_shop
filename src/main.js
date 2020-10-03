import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 引入 axios
import './network/index.js'
// 引入树状表格
import TreeTable from 'vue-table-with-tree-grid'

Vue.config.productionTip = false

// 导入字体图标
// import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'

Vue.component('tree-table',TreeTable)


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
