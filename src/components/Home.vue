<template>
  <el-container class="home-container">

    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="~assets/img/earth.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>

    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
      <div class="toggle-button iconfont" :class="isCollapse ? 'icon-right' : 'icon-left'" @click="toggleCollapse"></div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409BFF"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + '' " v-for="item in menuList" :key="item.id">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图标和分类名 -->
              <i  :class="iconsObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item @click="saveNavState('/' + subItem.path)" :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id">
                <!-- 二级菜单模板区域 -->
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <!-- 右侧内容主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      menuList: [],
      iconsObj:{
        '125':'iconfont icon-yonghuguanli',
        '103':'iconfont icon-quanxian',
        '101':'iconfont icon-shangpin2',
        '102':'iconfont icon-dingdan2',
        '145':'iconfont icon-shujutongji1',
      },
      // 是否折叠
      isCollapse:false,
      // 被激活的链接地址
      activePath:''
    };
  },
  created() {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    // 退出
    logout() {
      // window.sessionStorage.removeItem("token");
      window.sessionStorage.clear();
      this.$router.push("/login");
      this.$message.success({
        center: true, //文字和图标居中
        message: "退出成功",
        duration: 1000, //显示多长时间
      });
    },
    // 请求左侧菜单列表
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) {
        return this.$message.error({
          message: res.meta.msg,
        });
      }
      this.menuList = res.data
      // console.log(res);
    },
    // 点击切换菜单折叠与展开
    toggleCollapse(){
      this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活状态
    saveNavState(activePath){
      window.sessionStorage.setItem('activePath',activePath)
      this.activePath = activePath
    }
  },
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 10px;
    }
  }
  img {
    width: 60px;
    padding-left: 5px;
  }
}

.el-aside {
  background-color: #333744;
  .el-menu{
    border-right: none;
  }
}

.el-main {
  background-color: #edeaf1;
}
.iconfont{
  padding-right: 10px;
}

.toggle-button{
  background-color: #4a5064;
  font-size: 16px;
  line-height: 30px;
  color: white;
  text-align: center;
  cursor: pointer;
}
</style>