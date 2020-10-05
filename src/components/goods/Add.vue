<template>
  <div class="">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item class="no-weight" to="/goods">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 消息提示 -->
      <el-alert title="添加商品信息" :closable="false"	 type="info" center show-icon> </el-alert>

      <!-- 步骤条 -->
      <el-steps  :active="activeIndex * 1" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      
      <!-- tab 栏区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
        <el-tabs :tab-position="'left'" v-model="activeIndex" :before-leave="beforeTabLeave" @tab-click="tabClicked">
          <el-tab-pane name="0" label="基本信息">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
                <el-cascader
                  v-model="addForm.goods_cat"
                  :options="cateList"
                  :props="cateProps"
                  @change="handleChange"
                  clearable>
                </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="1" label="商品参数">
            <!-- 渲染表单的 item 项 -->
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
               <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border :label="title" v-for="(title,index) in item.attr_vals" :key="index"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="2" label="商品属性">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="3" label="商品图片">
            <!-- action 表示图片要上传到的后台API地址 -->
            <!-- on-preview 点击预览时触发事件 -->
            <!-- list-type 图片展示方式 -->
            <el-upload
              :headers="headerObj"
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture-card"
              :on-success="uploadSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane name="4" label="商品内容">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <!-- 添加商品按钮 -->
            <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览 -->
    <el-dialog
      title="图片预览"
      :visible.sync="previewVisible"
      width="40%">
      <img class="previewImg" :src="previewPath" alt="">
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: "Add",
  data() {
    return {
      // 步骤条默认选中项
      activeIndex:'0',
      // 用于保存添加的商品信息
      addForm:{
        goods_name:'',
        goods_price:null,
        goods_weight:null,
        goods_number:null,
        // 商品所属的分类数组
        goods_cat:[],
        // 图片数组
        pics:[],
        // 商品的详情描述
        goods_introduce:'',
        attrs:[]
      },
      // 表单验证规则对象
      addFormRules:{
        goods_name:[
          { required:true,message:'请输入商品名称',trigger:'blur'}
        ],
        goods_price:[
          { required:true,message:'请输入商品价格',trigger:'blur'}
        ],
        goods_weight:[
          { required:true,message:'请输入商品重量',trigger:'blur'}
        ],
        goods_number:[
          { required:true,message:'请输入商品数量',trigger:'blur'}
        ],
        goods_cat:[
          { required:true,message:'请选择商品分类',trigger:'blur'}
        ]
      },
      // 商品分类列表
      cateList:[],
      // 级联选择器的 配置选项
      cateProps:{
        expandTrigger: 'hover',
        label:'cat_name',//表示看到的是那个属性
        value:'cat_id',//代表选中的是那个值
        children:'children'
      },
      // 动态参数列表数据
      manyTableData:[],
      // 静态属性列表数据
      onlyTableData:[],
      // 上传图片的url地址
      uploadUrl:'http://120.53.120.229:8888/api/private/v1/upload',
      // 图片上传的请求头
      headerObj:{
        Authorization:window.sessionStorage.getItem('token')
      },
      // 预览图片的地址
      previewPath:'',
      // 控制预览窗口是否显示
      previewVisible:false
    };
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取所有商品的分类数据
    async getCateList(){
      const {data:res} = await this.$http.get('categories')
      
      if(res.meta.status != 200){
        return this.$message.error('获取商品分类数据失败：'+res.meta.msg)
      }

      this.cateList = res.data
    },
    // 级联选择器选中项变化 触发该函数
    handleChange(){
      console.log(this.addForm.goods_cat);
      if(this.addForm.goods_cat.length === 1 || this.addForm.goods_cat.length === 2){
        this.addForm.goods_cat= []
        return this.$message('只允许设置三级分类')
      }
    },
    // 切换标签页时触发该函数
    beforeTabLeave(toActiveName,oldActiveName){
      // console.log(toActiveName,oldActiveName);
      if(oldActiveName === '0' && this.addForm.goods_cat.length !== 3){
        this.$message.error('请先选择商品分类！')
        return false
      }
    },
    // tab 被选中时触发
    async tabClicked(){
      // console.log(this.activeIndex)

      // 访问的是商品参数(动态参数)面板
      if(this.activeIndex === '1'){
        const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:'many'}})

        if(res.meta.status !== 200 ){
          return this.$message.error('获取动态参数失败：'+res.meta.msg)
        }
        
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
        })
        this.manyTableData = res.data
      }else if(this.activeIndex === '2'){
        const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:'only'}})

        if(res.meta.status !== 200 ){
          return this.$message.error('获取静态属性失败：'+res.meta.msg)
        }

        this.onlyTableData = res.data
      }
    },
    // 处理图片预览效果
    handlePreview(file){
      console.log(file);
      this.previewPath = ''
      this.previewPath = 'http://120.53.120.229:8888/'+file.response.data.tmp_path

      if(this.previewPath != ''){
        this.previewVisible = true
      }
    },
    // 处理移除图片的操作
    handleRemove(file){
      console.log(file);

      // 1.获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path
      // 2.从pics数组中，找到这个图片对应的索引值
      //  2.1 findIndex() 方法返回传入一个测试条件（函数）符合条件的数组第一个元素位置。 true停止 没找到返回-1
      const i = this.addForm.pics.findIndex(x => {
        return x.pic === filePath
      })
      // 3.调用数组的splic方法，把图片信息对象，从pics数组中移除
      this.addForm.pics.splice(i,1)

    },
    // 图片上传成功
    uploadSuccess(response){
      // console.log(response);
      // 1.拼接得到一个图片信息对象
      const picInfo = { pic:response.data.tmp_path }
      // 2.将图片信息push到 Pics数组中
      this.addForm.pics.push(picInfo)
      console.log(this.addForm);
    },
    // 添加商品
    add(){
      this.$refs.addFormRef.validate(async valid => {
        // 未通过表单预验证
        if(!valid){
          this.$message.error('请填写必要的表单项!')
          return
        }

        // 执行添加的业务逻辑

        // 处理动态参数
        this.manyTableData.forEach( item => {
          const newInfo ={
            attr_id : item.attr_id,
            attr_value : item.attr_vals.join(',')
          }
          this.addForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyTableData.forEach( item => {
          const newInfo = {
            attr_id : item.attr_id,
            attr_value : item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })

        // 处理goods_cat格式问题 使用 lodash函数库 cloneDeep(obj)  深拷贝解决冲突
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')

        console.log(form);

        // 发起请求添加商品
        // 商品的名称，必须时唯一的
        const {data:res} = await this.$http.post('goods',form)

        if(res.meta.status !== 201){
          return this.$message.error('添加商品失败：'+res.meta.msg)
        }

        this.$message.success('添加商品成功!')

        this.$router.push('/goods')
      })
    }
  },
  computed: {
    cateId(){
      if(this.addForm.goods_cat.length === 3){
        return this.addForm.goods_cat[2]
      }else{
        return null
      }
    }  
  },
};
</script>

<style lang="less" scoped>
.no-weight{
  font-weight: 500;
}
.el-steps{
  margin: 15px 0;
}
.el-step__title{
  font-size: 14px;
}
.el-form--label-top .el-form-item__label{
  padding: 0;
}
.el-checkbox{
  margin: 0 10px 0 0  !important;
}
.previewImg{
  width: 100%;
  object-fit: cover;
}
.btnAdd{
  margin-top: 15px;
}
</style>