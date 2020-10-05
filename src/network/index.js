import axios from 'axios'
import Vue from 'vue'

axios.defaults.baseURL = `http://120.53.120.229:8888/api/private/v1/`
// axios.defaults.baseURL = `https://www.liulongbin.top:8888/api/private/v1/`
axios.interceptors.request.use(config => {
  // 添加请求头
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // console.log(config);

  // 拦截下来了 需要放行
  return config
})

Vue.prototype.$http = axios
