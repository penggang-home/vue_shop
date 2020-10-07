import axios from 'axios'
import Vue from 'vue'

// 导入 Nprogress 对应的JS和CSS
import NProgress from "nprogress"
// 改用 CDN方式
// import "nprogress/nprogress.css" 

axios.defaults.baseURL = `http://120.53.120.229:8888/api/private/v1/`
// axios.defaults.baseURL = `https://www.liulongbin.top:8888/api/private/v1/`

// 添加 请求头 和 进度条 NProgress.start()
axios.interceptors.request.use(config => {
  // 添加 进度条
  NProgress.start()
  // 添加请求头
  config.headers.Authorization = window.sessionStorage.getItem('token')

  return config
})

axios.interceptors.response.use(config => {
  // 隐藏 进度条
  NProgress.done()
  return config
})

Vue.prototype.$http = axios
