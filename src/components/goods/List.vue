<template>
  <div class="list">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索框 及 添加商品 按钮 -->
      <el-row :gutter="10">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- table 表格区域 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" width="105px" prop="goods_price"></el-table-column>
        <el-table-column label="商品重量" width="80px" prop="goods_weight"></el-table-column>
        <el-table-column label="创建时间" width="170px" prop="add_time">
          <template slot-scope="scope">
            {{ dataFormat(scope.row.add_time) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button size="small" type="primary" icon="el-icon-edit" circle></el-button>
            <el-button size="small" type="danger" icon="el-icon-delete" @click="removeByID(scope.row.goods_id)" circle></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页功能区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "List",
  data() {
    return {
      // 查询参数对象
      queryInfo: {
        // 搜索关键字
        query: "",
        // 当前页码值
        pagenum: 1,
        // 每页显示条数
        pagesize: 10,
      },
      // 商品列表
      goodsList: [],
      // 总数据条数
      total: 0,
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    // 格式化日期
    dataFormat(originVal) {
      const newDate = new Date(originVal);

      const Year = newDate.getFullYear();
      const Month = (newDate.getMonth() + 1 + "").padStart(2, "0"); //padStart() 字符串不够长 从头部补齐指定的字符串 padEnd() 尾部补齐
      const Day = (newDate.getDate() + "").padStart(2, "0");

      const Hours = (newDate.getHours() + "").padStart(2, "0");
      const Minutes = (newDate.getMinutes() + "").padStart(2, "0");
      const Seconds = (newDate.getSeconds() + "").padStart(2, "0");

      return `${Year}-${Month}-${Day} ${Hours}:${Minutes}:${Seconds}`;
    },
    // 根据分页获取所有商品列表
    async getGoodsList() {
      // get 请求都需要使用 params 来指定请求参数
      const { data: res } = await this.$http.get("goods", {
        params: this.queryInfo,
      });

      if (res.meta.status !== 200) {
        return this.$message.error("获取商品列表失败：" + res.meta.msg);
      }

      // 数据获取成功，保存下来
      // this.$message.success('获取商品列表成功!')
      this.goodsList = res.data.goods;
      this.total = res.data.total;
      console.log(res.data);
    },
    // pagesize 改变触发该事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodsList();
    },
    // 当前页码值发生变化，触发该事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getGoodsList();
    },
    // 点击删除按钮，删除该商品
    async removeByID(Id){
      const deleteResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err);

      // 取消删除 
      if(deleteResult !== 'confirm'){
        return this.$message('已取消删除！')
      }

      const {data:res} = await this.$http.delete('goods/'+Id)

      if(res.meta.status !== 200){
        return this.$message.error('删除失败：'+res.meta.msg)
      }

      this.$message.success('删除成功!')
      this.getGoodsList()
    },
    // 点击添加商品 按钮 触发该函数
    goAddPage(){
      this.$router.push('/goods/add')
    }
  },
};
</script>

<style lang="less" scoped>
</style>