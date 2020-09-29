<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="~assets/logo.png" alt="" />
      </div>
      <!-- 登录表单区域 -->
      <el-form :model="loginForm" :rules="loginFormRules" ref="loginFormRef" label-width="0px" class="login_form" >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" show-password  prefix-icon="iconfont icon-password"></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="formReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      // 这是登录表单的数据绑定对象
      loginForm:{
        username:'admin',
        password:'123456'
      },
      // 这是表单的验证规则对象
      loginFormRules:{
        // 验证用户名是否合法
        username:[
          { required: true, message: '请输入登录名称~', trigger: 'blur' },
          { min: 3, max: 16, message: '长度在 3 到 16 个字符之间哦~', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password:[
          { required: true, message: '请输入登录密码~', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 3 到 18 个字符之间哦~', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    formReset(){
      this.$refs.loginFormRef.resetFields()
    },
    // 登录预验证 调用ele写好的 validate 方法验证是否符合条件
    login(){
      this.$refs.loginFormRef.validate(async valid => {
        if(!valid) return;
        // 1.1 如果某个方法的返回值是Promise是 可以用 async和await 简化这次操作  
        // 1.2 需要注意的是 await只能用在被async修饰的方法中(把紧挨着await的方法添加修饰符 async)
        // 1.3 解构赋值 把右边Promise返回值的data对象赋值给res  {config:res}这样是把返回值里边的config赋值给res
        const {data:res} = await this.$http.post('login',this.loginForm)
        console.log(res);
        if(res.meta.status !== 200) return this.$message.error({
          duration:1500,
          message:'登录失败：'+res.meta.msg
        })
        this.$message.success({
          center:true,//文字和图标居中
          message:'登录成功',
          duration:1500//显示多长时间
        })
        // 2.1 登录成功后保存token到sessionStorage
        // 2.2 项目中除了登录其他地方必须登录后访问
        // 2.2 token只应在当前网站打开期间生效，所以将token保存在sessionStorage中
        window.sessionStorage.setItem('token',res.data.token)
        this.$router.push('/home')
      })
    }
  },
};
</script>

<style lang="less" scoped>
.login_container {
  height: 100%;
  background-color: #2b4b6b;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.login_form{
  position: absolute;
  bottom: 0;
  width: 100%;
  box-sizing: border-box;
  padding: 0 20px;
}

.btns{
  display: flex;
  justify-content: flex-end;
}
</style>