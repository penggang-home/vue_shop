<template>
  <div class="">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 头部的警告区域 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数"
        :closable="false"
        type="warning"
        effect="dark"
        show-icon
      >
      </el-alert>

      <!-- 选中商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选中商品分类： </span>
          <!-- 选择商品分类的级联选择框 -->

          <!-- options 数据源 -->
          <!-- props 配置信息 -->
          <el-cascader
            v-model="selectedCateKeys"
            :options="cateList"
            :props="CateProps"
            @change="handleChange"
            separator=" > "
            clearable
          >
          </el-cascader>
        </el-col>
      </el-row>

      <!-- tab 页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabsClick">
        <!-- 添加动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            :disabled="isBtnDisabled"
            type="primary"
            size="small"
            @click="addDialogVisiable = true"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyTabData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag
                  closable
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  @close="handleClose(index, scope.row)"
                  >{{ item }}</el-tag
                >
                <!-- 输入文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="small"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  size="small"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 添加静态属性面板 -->
        <el-tab-pane label="添加属性" name="only">
          <el-button
            :disabled="isBtnDisabled"
            type="primary"
            size="small"
            @click="addDialogVisiable = true"
            >添加属性</el-button
          >
          <!-- 添加静态表格 -->
          <el-table :data="onlyTabData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag
                  closable
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  @close="handleClose(index, scope.row)"
                  >{{ item }}</el-tag
                >
                <!-- 输入文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="small"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  size="small"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数的对话框 二合一 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisiable"
      width="40%"
      @close="addDialogClosed"
    >
      <!-- 添加参数的对话框 二合一 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="80px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisiable = false">取 消</el-button>
        <el-button type="primary" @click="addConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数的对话框 二合一 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisiable"
      width="40%"
      @close="editDialogClosed"
    >
      <!-- 修改参数的对话框 二合一 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="80px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisiable = false">取 消</el-button>
        <el-button type="primary" @click="editConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Params",
  data() {
    return {
      // 商品分类列表
      cateList: [],
      // 级联选择框的配置对象
      CateProps: {
        expandTrigger: "hover", //触发方式 hover or click
        value: "cat_id", //指定选中的值
        label: "cat_name", //指定看到的值
        children: "children", //父子节点的嵌套属性
      },
      // 当前级联选择器 选中的值(ID)
      selectedCateKeys: [],
      // 被激活的 tabs页签 名称
      activeName: "many",
      // 动态参数的数据
      manyTabData: [],
      // 静态属性的数据
      onlyTabData: [],
      // 控制添加对话框的显示与隐藏
      addDialogVisiable: false,
      // 添加参数的表单数据对象
      addForm: {
        attr_name: "",
      },
      // 添加参数的验证规则
      addFormRules: {
        attr_name: {
          required: true,
          message: "请输入参数名称",
          trigger: "blur",
        },
      },
      // 控制修改对话框的显示与隐藏
      editDialogVisiable: false,
      // 修改的表单数据对象
      editForm: {},
      // 修改表单的验证规则
      editFormRules: {
        attr_name: {
          required: true,
          message: "请输入参数名称",
          trigger: "blur",
        },
      },
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    // 获取所有的商品分类列表
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败：" + res.meta.msg);
      }
      this.cateList = res.data;
      // console.log(this.cateList);
    },
    // 级联选择框变化 会触发该函数
    handleChange() {
      this.getParamsData();
    },
    // tabs 页签点击事件
    handleTabsClick() {
      console.log(this.activeName);
      this.getParamsData();
    },
    // 获取参数的列表数据
    async getParamsData() {
      // 证明不是三级分类
      if (this.selectedCateKeys.length === 0) {
        return;
      }
      if (
        this.selectedCateKeys.length === 1 ||
        this.selectedCateKeys.length === 2
      ) {
        this.selectedCateKeys = [];
        this.manyTabData = [];
        this.onlyTabData = [];
        return this.$message("当前权限只允许修改三级分类");
      }

      // 证明选中的是三级分类

      // 根据所选分类的 id和当前所处的面板，获取对应的参数
      const {
        data: res,
      } = await this.$http.get(`categories/${this.cateId}/attributes`, {
        params: { sel: this.activeName },
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取参数列表失败：" + res.meta.msg);
      }
      console.log(res.data);
      res.data.forEach((item) => {
        // 空字符串 “” split 会得到一个空数组，该空数组会渲染到界面上，不希望渲染 如下
        item.attr_vals = item.attr_vals ? item.attr_vals.split(",") : [];
        // 添加一个布尔值 用于控制文本框的显示与隐藏
        item.inputVisible = false;
        item.inputValue = "";
      });
      console.log(res.data);
      if (this.activeName === "many") {
        this.manyTabData = res.data;
      } else {
        this.onlyTabData = res.data;
      }
    },
    // 添加参数对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 点击确定按钮，添加参数
    addConfirm() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;

        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          }
        );

        if (res.meta.status !== 201) {
          return this.$message.error(`${this.titleText}失败：` + res.meta.msg);
        }

        this.$message.success(this.titleText + "成功!");
        this.addDialogVisiable = false;
        this.getParamsData();
      });
    },
    // 点击编辑按钮，展示修改对话框
    async showEditDialog(attr_id) {
      // 查询当前参数的信息
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attr_id}`,
        {
          params: {
            attr_sel: this.activeName,
          },
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("获取参数信息失败：" + res.meta.msg);
      }
      this.editForm = res.data;
      console.log(attr_id);
      console.log("this.editForm : ", this.editForm);
      this.editDialogVisiable = true;
    },
    // 编辑对话框 关闭 时触发该函数
    editDialogClosed() {
      // 重置修改的表单
      this.$refs.editFormRef.resetFields();
    },
    // 修改对话框的 确定按钮
    editConfirm() {
      this.$refs.editFormRef.validate(async (valid) => {
        // 没有校验通过
        if (!valid) return;
        console.log(this.editForm);
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName,
          }
        );

        if (res.meta.status !== 200) {
          return this.$message.error("修改参数失败：" + res.meta.msg);
        }

        this.$message.success(`修改${this.titleText}成功！`);
        this.getParamsData();
        this.editDialogVisiable = false;
      });
    },
    // 点击删除参数按钮 触发该事件
    async removeParams(attr_id) {
      const deleteResult = await this.$confirm(
        "此操作将永久删除该参数, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      // 用户取消了删除
      if (deleteResult !== "confirm") {
        return this.$message("已取消删除！");
      }

      // 发送请求 删除数据
      console.log(this.editForm);
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${attr_id}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除失败：" + res.meta.msg);
      }

      this.$message.success("删除成功!");
      this.getParamsData();
    },
    // 点击按钮 显示文本框
    showInput(row) {
      row.inputVisible = true;
      // 让文本框自动获得焦点
      // $nextTick 方法的作用就是当页面上的元素被重新渲染之后，才会指定回调函数中的代码
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 文本框失去焦点 或 按下 enter 都会触发
    handleInputConfirm(row) {
      // 如果输入的是非法 内容  全是空格 清空处理
      if (row.inputValue.trim().length === 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      }
      // 输入了有效内容 保存下来
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue = "";
      row.inputVisible = false;

      this.saveAttrVals(row, "新增成功!");
    },
    // 将对attr_vals的操作保存到数据库
    async saveAttrVals(row, str) {
      // 发起网络请求，把新增的数据保存到 数据库
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(","),
        }
      );

      // 新增失败
      if (res.meta.status !== 200) {
        return this.$message.error("新增失败：" + res.meta.msg);
      }

      this.$message.success(str);
    },
    // 删除对应的参数可选项
    handleClose(index, row) {
      row.attr_vals.splice(index, 1);
      // 调用抽离出来的函数
      this.saveAttrVals(row, "删除成功!");
    },
  },
  computed: {
    // 根据是否选择商品分类判断 按钮禁用与启用状态
    isBtnDisabled() {
      return this.selectedCateKeys.length == 3 ? false : true;
    },
    // 当前选中的三级分类ID
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2];
      }
      return null;
    },
    // 动态计算标题的文本
    titleText() {
      if (this.activeName === "many") {
        return "动态参数";
      } else {
        return "静态属性";
      }
    },
  },
};
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
.el-tag {
  margin: 8px;
}
.input-new-tag {
  width: 120px;
  margin-left: 10px;
  // vertical-align: bottom;
}
</style>