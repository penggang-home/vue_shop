<template>
  <div class="">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRoles">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data="roleList" border stripe>
        <!-- 展开行 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['vcenter', 'bd-bottom', index === 0 ? 'bd-top' : '']"
              v-for="(item1, index) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <!-- 通过for循环嵌套渲染二级、三级权限 -->
                <el-row 
                  :class="['vcenter', index !== 0 ? 'bd-top' : '']"
                  v-for="item2 in item1.children"
                  :key="item2.id"
                >
                  <!-- 渲染二级权限-->
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 渲染三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="primary"
              icon="el-icon-edit"
              @click="editRoles(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="small"
              type="danger"
              @click="deleteRoles(scope.row)"
              icon="el-icon-delete"
            >
              删除
            </el-button>
            <el-button
              size="small"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
            >
              分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightsDialogVisible"
      width="50%"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色对话框 -->
    <el-dialog title="编辑角色" :visible.sync="isEditShowHide" width="50%">
      <el-form
        label-width="90px"
        :model="currentEditInfo"
        :rules="editInfoRules"
        ref="currentEditInfoRef"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="currentEditInfo.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="currentEditInfo.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isEditShowHide = false">取 消</el-button>
        <el-button type="primary" @click="editRolesConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="addRolesDialog" width="50%">
      <el-form
        label-width="80px"
        :model="addRolesInfo"
        ref="addRolesInfoRef"
        :rules="editInfoRules"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesInfo.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesInfo.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesDialog = false">取 消</el-button>
        <el-button type="primary" @click="addRolesConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Roles",
  data() {
    return {
      // 所有角色列表数据
      roleList: [],
      // 控制分配角色对话框的显示与隐藏
      setRightsDialogVisible: false,
      // 获取所有权限的数据
      rightsList: [],
      // 树形控件的属性绑定对象
      treeProps: {
        children: "children",
        label: "authName",
      },
      // 默认选中的节点ID值
      defKeys: [],
      // 当前即将分配权限的角色ID
      roleId: "",
      // 控制编辑角色对话框是否显示
      isEditShowHide: false,
      // 编辑状态下的当前角色信息
      currentEditInfo: {},
      // 编辑角色信息的验证规则
      editInfoRules: {
        roleName: {
          required: true,
          message: "请输入角色名称",
          trigger: "blur",
        },
        roleDesc: {
          required: true,
          message: "请输入角色描述信息",
          trigger: "blur",
        },
      },
      // 控制添加角色显示还是隐藏
      addRolesDialog: false,
      // 保存添加角色的信息
      addRolesInfo: {
        roleName: "",
        roleDesc: "",
      },
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    // 获取所有角色的列表
    async getRoleList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败：" + res.meta.msg);
      }

      this.roleList = res.data;
    },
    // 根据id删除对应的权限
    async removeRightById(role, rightID) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      if (confirmResult != "confirm") {
        return this.$message.info("取消了删除");
      }
      // const {data:res} = await this.$http.delete(`roles/${roleID}/rights/${rightID}`)
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightID}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除权限失败：" + res.meta.msg);
      }
      // 更新当前项目的children
      role.children = res.data;
    },
    // 展示分配权限的对话框
    async showSetRightDialog(role) {
      this.roleId = role.id;
      // 获取所有权限的数据
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限数据失败");
      }
      // 把获取到的权限数据保存到data中
      this.rightsList = res.data;

      // 递归获取三级节点的id
      // 每次获取前都先清空一下
      this.defKeys = [];
      this.getLefKeys(role, this.defKeys);

      this.setRightsDialogVisible = true;
    },
    // 通过递归的形式角色下所有三级权限的id 并保存到数组
    getLefKeys(node, arr) {
      // 如果当前结点不包含 children属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id);
      }
      console.log(node);

      // 递归判断
      node.children.forEach((item) => {
        this.getLefKeys(item, arr);
      });
    },
    // 点击为角色分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      const idStr = keys.join(",");

      console.log(this.roleId, idStr);
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      );
      console.log(res);
      if (res.meta.status !== 200) {
        this.setRightsDialogVisible = false;
        return this.$message.error("分配权限失败：" + res.meta.msg);
      }

      this.$message.success("分配权限成功");
      // 刷新权限列表
      this.getRoleList();
      // 关闭对话框
      this.setRightsDialogVisible = false;
    },
    // 删除角色对话框
    async deleteRoles(roles) {
      const deleteResult = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      if (deleteResult == "cancel") {
        return this.$message("已取消删除!");
      }

      // 发送删除请求
      const { data: res } = await this.$http.delete("roles/" + roles.id);
      if (res.meta.status !== 200) {
        return this.$message.error("删除角色失败：" + res.meta.msg);
      }

      this.$message.success("删除角色成功!");
      this.getRoleList();
    },
    // 点击编辑按钮显示 编辑角色对话框
    async editRoles(editId) {
      const { data: res } = await this.$http.get("roles/" + editId.id);
      if (res.meta.status != 200) {
        return this.$message.error("获取角色信息失败：" + res.meta.msg);
      }
      this.currentEditInfo = res.data;
      this.isEditShowHide = true;
    },
    // 确认编辑角色信息
    editRolesConfirm() {
      this.$refs.currentEditInfoRef.validate(async valid => {
        if(!valid) return
        const { data: res } = await this.$http.put(
          "roles/" + this.currentEditInfo.roleId,
          {
            roleName: this.currentEditInfo.roleName,
            roleDesc: this.currentEditInfo.roleDesc,
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("更新角色信息失败：" + res.meta.msg);
        }

        this.$message.success("更新角色信息成功!");
        this.isEditShowHide = false;
        this.getRoleList();
      });
    },
    // 点击添加角色按钮 显示Dialog对话框
    addRoles() {
      this.addRolesDialog = true;
    },
    // 点击Dialog里的确认按钮  发送添加角色请求
    addRolesConfirm() {
      this.$refs.addRolesInfoRef.validate(async valid => {
        if(!valid)return
        const { data: res } = await this.$http.post("roles", this.addRolesInfo);
        if (res.meta.status !== 201) {
          return this.$message.error("添加角色失败：" + res.meta.msg);
        }

        this.$message.success("添加角色成功!");
        this.getRoleList();
        this.addRolesDialog = false;
      })
    },
  },
};
</script>

<style lang="less" scoped>
.bd-top {
  border-top: 1px solid #eee;
}
.bd-bottom {
  border-bottom: 1px solid #eee;
}
.el-tag {
  margin: 7px;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>