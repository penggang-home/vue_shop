import Vue from 'vue'
import App from './App.vue'
import router from './router'

//  按需导入的 element ui 组件  改用CDN方式全局加载 element ui
// import './plugins/element.js'

// 引入 axios
import './network/index.js'
// 引入 树状表格
import TreeTable from 'vue-table-with-tree-grid'

// 引入 VueQuillEditor  富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 富文文编辑器样式  改用 CDN方式
// import 'quill/dist/quill.core.css' // import styles
// import 'quill/dist/quill.snow.css' // for snow theme
// import 'quill/dist/quill.bubble.css' // for bubble theme

// 导入字体图标
// import './assets/fonts/iconfont.css'

// 导入自定义的全局样式表
import './assets/css/global.css'

// 挂载树状表格
Vue.component('tree-table',TreeTable)

// 将富文本编辑器注册为全局组件
Vue.use(VueQuillEditor)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
