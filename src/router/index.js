import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 懒加载
const Login = () => import('components/Login.vue')
const Home = () => import('components/Home.vue')
const Welcome = () => import('components/Welcome.vue')
const Users = () => import('components/user/Users.vue')
const Rights = () => import('components/power/Rights.vue')
const Roles = () => import('components/power/Roles.vue')
const Cate = () => import('components/goods/Cate.vue')
const Params = () => import('components/goods/Params.vue')
const List = () => import('components/goods/List.vue')
const Add = () => import('components/goods/Add.vue')
const Order = () => import('components/order/Order.vue')
const Report = () => import('components/report/Report.vue')


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
      { path:'/welcome', component:Welcome},
      { path:'/users', component:Users},
      { path:'/rights', component:Rights},
      { path:'/roles', component:Roles},
      { path:'/categories', component:Cate},
      { path:'/params', component:Params},
      { path:'/goods',component:List},
      { path:'/goods/add',component:Add},
      { path:'/orders',component:Order},
      { path:'/reports',component:Report},
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
  // 没有token 强制跳转到登录页面
  if(!tokenStr){
    Vue.prototype.$message('请登录')
    return next('/login') 
  }
    
  next()
})

export default router
