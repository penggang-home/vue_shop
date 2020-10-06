<template>
  <div class="">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡皮视图区域 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 订单列表数据 -->
      <el-table :data="orderList" bordre stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pay_status === '1'" type="success"
              >已付款</el-tag
            >
            <el-tag v-else type="danger">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间">
          <template slot-scope="scope">
            {{ dataFormat(scope.row.create_time) }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-edit"
              circle
              @click="showBox"
            ></el-button>
            <el-button
              type="success"
              size="small"
              icon="el-icon-location"
              circle
              @click="showProgressBox"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 修改地址的对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="addressVisible"
      width="50%"
      @close="addressDialogClosed">
      <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader clearable :options="cityData" v-model="addressForm.address1" :props="{ expandTrigger: 'hover' }"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 展示物流进度对话框 -->
    <el-dialog
      title="物流进度"
      :visible.sync="progressVisible"
      width="50%">
      <!-- 时间先 -->
      <el-timeline >
        <el-timeline-item
          v-for="(item, index) in progressInfo"
          :key="index"
          :timestamp="item.time">
          {{item.context}}
        </el-timeline-item>
      </el-timeline>
      
    </el-dialog>
  </div>
</template>

<script>
// 省市区县 数据
import cityData from "./citydata"

export default {
  name: "Order",
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      total: 0,
      orderList: [],
      // 是否显示修改地址对话框
      addressVisible: false,
      // 修改地址表单数据对象
      addressForm:{
        // 省市区/县
        address1:[],
        // 详细地址
        address2:'',
      },
      addressFormRules:{
        address1:[
          {required:true,message:'请选择省市区县',trigger:'blur'},
        ],
        address2:[
          {required:true,message:'请填写详细地址',trigger:'blur'},
        ]
      },
      // 省市区 数据
      cityData:cityData,
      progressVisible:false,
      // 物流信息
      progressInfo:[]
    };
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
    // 获取订单列表
    async getOrderList() {
      const { data: res } = await this.$http.get("orders", {
        params: this.queryInfo,
      });

      if (res.meta.status !== 200) {
        return this.$message.error("获取订单列表失败：" + res.meta.msg);
      }

      console.log(res);
      this.total = res.data.total;
      this.orderList = res.data.goods;
      console.log(this.orderList);
    },
    // 页面大小改变时触发
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrderList();
    },
    // 当前页面发生改变时触发
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getOrderList();
    },
    // 展示修改地址的对话框
    showBox() {
      this.addressVisible = true;
      console.log(this.cityData);
    },
    // 修改地址对话框 关闭触发
    addressDialogClosed(){
      this.$refs.addressFormRef.resetFields()
    },
    // 当前位置
    async showProgressBox(){
      const {data:res} = await this.$http.get('/kuaidi/1106975712662')

      if(res.meta.status !== 200){
        return this.$message.error('获取物流信息失败：'+res.meta.msg)
      }

      this.progressInfo = res.data
      console.log('this.progressInfo: ', this.progressInfo);
      this.progressVisible = true
    }
  },
  created() {
    this.getOrderList();
  },
};
</script>

<style lang="less" scoped>
.el-cascader{
  width: 100%;
}
</style>