<template>
  <div class="cate">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加分类 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <tree-table
        class="tree-table"
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i v-if="scope.row.cat_deleted === false" class="el-icon-success" style="color:lightgreen;"></i>
          <i v-else class="el-icon-error" style="color:red;"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level == 0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level == 1" type="success">二级</el-tag>
          <el-tag v-else type="warning">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-edit" @click="editCate(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteCate(scope.row)">删除</el-button>
        </template>
      </tree-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 7,10 ]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="40%"
      @close="addCateDialogClosed"
      >
      <!-- 添加分类的表单 -->
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- v-model 把选中的值双向绑定到data中 注意只能绑定到数组 -->
          <!-- options 指定数据源 -->
          <!-- props 用来指定配置对象 -->
          <!-- @change 只要 级联选择器的选中项发生变化 就触发该函数 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentChange"
            clearable
            separator=" > "
            >
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改分类名称 -->
    <el-dialog
      title="修改分类名称"
      :visible.sync="editCateNameShowHide"
      width="40%"
      @close="clearAllEdit"
      >
      <el-form ref="editCateInfoRef" :rules="editCateInfoRules" :model="editCateInfo" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateInfo.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateNameShowHide = false">取 消</el-button>
        <el-button type="primary" @click="editCateInfoConfirm">确 定</el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script>
export default {
  name: "Cate",
  data() {
    return {
      // 商品分类的数据列表，默认为空
      cateList: [],
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1, //页码
        pagesize: 5, //每页显示多少条数据
      },
      // 总数据条数
      total: 0,
      // 为table指定列的定义
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label:'是否有效',
          // 表示将当前列定义为模板列
          type:'template',
          // 表示当前这一列使用的模板名称
          template:'isok'
        },
        {
          label: "排序",
          // 表示将当前列定义为模板列
          type:'template',
          // 表示当前这一列使用的模板名称
          template:'order'
        },
        {
          label: "操作",
          // 表示将当前列定义为模板列
          type:'template',
          // 表示当前这一列使用的模板名称
          template:'opt'
        }
      ],
      // 控制添加分类对话框的显示与隐藏 
      addCateDialogVisible:false,
      // 添加分类的表单数据对象
      addCateForm:{
        // 要添加分类的名称
        cat_name:'',
        // 要添加分类的父级id
        cat_pid:0,
        // 当前分类的等级 默认要添加的是一级分类
        cat_level:0
      },
      // 添加分类表单的验证规则
      addCateFormRules:{
        cat_name:{ required: true, message: '请输入分类名称', trigger: 'blur' },
      },
      // 父级分类数据列表
      parentCateList:[],
      // 只当级联选择器的配置对象

      cascaderProps:{
        checkStrictly:true,//开次此项 能够选中单独的父级
        expandTrigger: 'hover',//触发方式 click or  hover
        value:'cat_id',//指定选中那个值的属性
        label:'cat_name',//指定看到的是那个属性
        children:'children',//父子嵌套式使用那个属性
      },
      // 选中的父级分类的ID数组
      selectedKeys:[],
      // 当前编辑对话中的数据
      editCateInfo:{},
      // 正在编辑的分类 id 
      editCateInfoId:'',
      // 控制修改分类名称显示还是隐藏
      editCateNameShowHide:false,
      // 编辑分类名称对话框中的表单验证规则
      editCateInfoRules:{
        cat_name:{ required: true, message: '请输入分类名称', trigger: 'blur' },
      },

    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    // 获取商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类数据失败：" + res.meta.msg);
      }
      // console.log(res);

      // 把数据列表赋值为cateList
      this.cateList = res.data.result;
      this.total = res.data.total;
    },
    // 监听 pagesize(一页多少条记录) 该变的事件
    handleSizeChange(newSize){
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听 pagenum 页码的改变
    handleCurrentChange(newPage){
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    // 点击按钮显示添加分类对话框 
    showAddCateDialog(){
      // 先获取父级分类数据的列表
      this.getParentCateList()
      // 展示出对话框
      this.addCateDialogVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCateList(){
      const {data:res} = await this.$http.get('categories',{params:{
        type:2
      }})
      if(res.meta.status !== 200){
        return this.$message.error('获取分类数据失败：'+res,meta.msg)
      }
      this.parentCateList = res.data
    },
    // 选择项发生变化，触发该函数
    parentChange(){
      // 如果 selectedKeys(选中的ID) 数组中的length大于0，证明选中了至少一项
      if(this.selectedKeys.length > 0){
        // 最后一项 永远是当前项的父级分类ID
        this.addCateForm.cat_pid =  this.selectedKeys[this.selectedKeys.length-1]
        // 为当前分类的的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      }
      // 最后一项 永远是当前项的父级分类ID
      this.addCateForm.cat_pid =  0
      // 为当前分类的的等级赋值
      this.addCateForm.cat_level = 0
    },
    // 点击按钮添加新的分类
    addCate(){
      this.$refs.addCateFormRef.validate(async valid => {
        if(!valid)return
        const {data:res} = await this.$http.post('categories',this.addCateForm)

        if(res.meta.status !== 201){
          return this.$message.error('添加分类失败：'+res.meta.msg)
        }

        this.$message.success('添加分类成功!')
        this.getCateList()
        this.addCateDialogVisible = false

      })
    },
    // 监听对话框的关闭事件，重置表单数据
    addCateDialogClosed(){
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    // 删除分类
    async deleteCate(cateId){
      const deleteResult = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err);

      if(deleteResult !== 'confirm'){
        return this.$message('已取消删除')
      }
      console.log(deleteResult);
      // 发送请求删除数据
      const {data:res} = await this.$http.delete('categories/'+cateId.cat_id)
      if(res.meta.status !== 200){
        return this.$message.error('删除分类失败：'+res.meta.msg)
      }

      this.$message.success('删除成功!')
      this.getCateList()
    },
    // 编辑分类信息
    async editCate(cateId){

      const {data:res} = await this.$http.get('categories/'+cateId.cat_id)
      if(res.meta.status !== 200){
        return this.$message.error('获取分类信息失败：'+res.meta.msg)
      }

      this.editCateInfo = res.data
      this.editCateInfoId = cateId.cat_id
      this.editCateNameShowHide = true
    },
    // 确认修改表单名称
    editCateInfoConfirm(){
      this.$refs.editCateInfoRef.validate(async valid => {
        if(!valid) return this.$message.error('请输入分类名称')
        console.log('this.editCateInfoId: ', this.editCateInfoId);
        console.log(this.editCateInfo.cat_name);
        const {data:res} = await this.$http.put('categories/'+this.editCateInfoId,{cat_name:this.editCateInfo.cat_name})
        if(res.meta.status !== 200){
          return this.$message.error('修改分类名称失败：'+res.meta.msg)
        }

        this.$message.success('修改成功!')
        this.editCateNameShowHide = false
        this.getCateList()
      })
    },
    // 关闭编辑的dialog对话框时，清空不需要的数据
    clearAllEdit(){
      this.editCateInfo = {}
      this.editCateInfoId = ''
    }
  },
};
</script>

<style lang="less" scoped>
.tree-table{
  margin-top: 15px;
}
.el-cascader{
  width:100%;
}

</style>