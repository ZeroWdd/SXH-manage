<template>
  <v-card>
    <v-card-title>
      <v-btn color="primary" @click="statusCode=1;getDataFromServer()">未付款</v-btn>
      <v-btn color="primary" @click="statusCode=2;getDataFromServer()">已付款</v-btn>
      <v-btn color="primary" @click="statusCode=3;getDataFromServer()">未发货</v-btn>
      <v-btn color="primary" @click="statusCode=4;getDataFromServer()">交易成功</v-btn>
      <v-btn color="primary" @click="statusCode=5;getDataFromServer()">交易关闭</v-btn>
      <v-btn color="primary" @click="statusCode=6;getDataFromServer()">已评论</v-btn>
      <v-btn color="primary" @click="statusCode=null;getDataFromServer()">全部</v-btn>
      <!--搜索框，与search属性关联-->
      <v-spacer/>
      <v-flex xs3>
      <v-text-field label="输入关键字搜索" v-model.lazy="search" append-icon="search" hide-details/>
      </v-flex>
    </v-card-title>
    <v-divider/>
    <v-data-table
      :headers="headers"
      :items="orders"
      :pagination.sync="pagination"
      :total-items="totalOrders"
      :loading="loading"
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <td class="text-xs-center">{{ props.item.orderId }}</td>
        <td class="text-xs-center">{{ props.item.userId }}</td>
        <td class="text-xs-center" v-if="props.item.status == 1">未付款</td>
        <td class="text-xs-center" v-if="props.item.status == 2">已付款</td>
        <td class="text-xs-center" v-if="props.item.status == 3">已发货</td>
        <td class="text-xs-center" v-if="props.item.status == 4">交易成功</td>
        <td class="text-xs-center" v-if="props.item.status == 5">交易关闭</td>
        <td class="text-xs-center" v-if="props.item.status == 6">已评价</td>
        
        <td class="justify-center layout px-0">
          <v-btn icon @click="deleteOrder(props)">
            <i class="el-icon-delete"/>
          </v-btn>
        </td>
      </template>
    </v-data-table>
    <!--弹出的对话框-->
  </v-card>
</template>

<script>
  // 导入自定义的表单组件
  // import BrandForm from '../item/BrandForm'

  export default {
    name: "order",
    data() {
      return {
        search: '', // 搜索过滤字段
        totalOrders: 0, // 总条数
        orders: [], // 当前页用户数据
        loading: true, // 是否在加载中
        pagination: {}, // 分页信息
        headers: [
          {text: '订单id', align: 'center', value: 'orderId'},
          {text: '用户id', align: 'center', sortable: false, value: 'userId'},
          {text: '订单状态', align: 'center', sortable: false, value: 'status'},
          {text: '操作', align: 'center', value: 'id', sortable: false}
        ],
        show: false,// 控制对话框的显示
        oldBrand: {}, // 即将被编辑的用户数据
        isEdit: false, // 是否是编辑
        userId : 0,
        statusCode : null,
      }
    },
    mounted() { // 渲染后执行
      // 查询数据
      this.getDataFromServer();
    },
    watch: {
      pagination: { // 监视pagination属性的变化
        deep: true, // deep为true，会监视pagination的属性及属性中的对象属性变化
        handler() {
          // 变化后的回调函数，这里我们再次调用getDataFromServer即可
          this.getDataFromServer();
        }
      },
      search: { // 监视搜索字段
        handler() {
          this.getDataFromServer();
        }
      }
    },
    created(){
      this.$http.get("/auth/verify")
        .then(() => { // 这里使用箭头函数
          // this.userId = this.$route.params.userId;
          // console.log(this.userId)
        })
        .catch(()=>{
            // 未登录
            this.$router.push("/login");
        })
    },
    methods: {
      getDataFromServer() { // 从服务的加载数的方法。
        // 发起请求
        this.userId = this.$route.params.userId;
        this.$http.get("/order/order/page", {
          params: {
            key: this.search, // 搜索条件
            page: this.pagination.page,// 当前页
            rows: this.pagination.rowsPerPage,// 每页大小
            sortBy: this.pagination.sortBy,// 排序字段
            desc: this.pagination.descending,// 是否降序
            userId : this.userId,
            statusCode : this.statusCode
          }
        }).then(resp => { // 这里使用箭头函数
          this.orders = resp.data.items;
          this.totalOrders = resp.data.total;
          // 完成赋值后，把加载状态赋值为false
          this.loading = false;
        }).catch(() => {
            this.orders = [];
        })
      },
      deleteOrder(props){
        this.$message.confirm('此操作将永久删除数据，是否继续?', '提示', {
          confirmButtonText: '确定删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete("/order/order/" + props.item.orderId).then(resp => {
            this.$message.info('删除成功');
            this.orders.splice(props.index, 1);
          }).catch(()=>{
            this.$message.info('删除失败');
          })
        }).catch(()=>{
          this.$message.info('已取消删除');
        })
      },
      closeWindow(){
        // 重新加载数据
        this.getDataFromServer();
        // 关闭窗口
        this.show = false;
      },
      showStatus(status){
        this.$http.get("/order/order/status/" + status + "/" + this.userId).then(resp => {

        }).catch(()=>{
          
        })
      }
    },
    components:{
        // BrandForm
    }
  }
</script>

<style scoped>

</style>
