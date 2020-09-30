import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 懒加载
const Login = () => import('components/Login.vue')
const Home = () => import('components/Home.vue')
const Welcome = () => import('components/Welcome.vue')
const Users = () => import('components/user/Users.vue')

const routes = [
  {
    path: '/',
    redirect: "/login"
  },
  {
    path: '/login',
    component: Login
  },
  {
    path:'/home',
    component:Home,
    redirect:'/welcome',
    children:[
      {
        path:'/welcome',
        component:Welcome
      },
      {
        path:'/users',
        component:Users
      }
    ]
  },
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 挂载路由导航守卫

router.beforeEach((to, from, next) => {
  // from 从哪儿来
  // to 到哪儿去
  // 放行函数  next()放行   next('/login')强制跳转
  
  if(to.path === '/login')return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr){
    // console.log(Vue.prototype.$message);
    Vue.prototype.$message('请登录')
    return next('/login') 
  }
    
  next()
})

export default router
