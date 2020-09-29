<template>
  <div class="home">
    <el-button type='info' @click="logout">退出</el-button>
  </div>
</template>

<script>

export default {
  name: 'Home',
  components: {
  },
  methods:{
    logout(){
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
      this.$message.success({
        center:true,//文字和图标居中
        message:'退出成功',
        duration:1000//显示多长时间
      })
    }
  }
}
</script>
