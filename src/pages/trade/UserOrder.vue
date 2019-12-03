<template>
  <v-card>
    <v-card-title>
      <!--搜索框，与search属性关联-->
      <v-spacer/>
      <v-flex xs3>
      <v-text-field label="输入关键字搜索" v-model.lazy="search" append-icon="search" hide-details/>
      </v-flex>
    </v-card-title>
    <v-divider/>
    <v-data-table
      :headers="headers"
      :items="users"
      :pagination.sync="pagination"
      :total-items="totalUsers"
      :loading="loading"
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <td class="text-xs-center">{{ props.item.id }}</td>
        <td class="text-xs-center">{{ props.item.username }}</td>
        <td class="text-xs-center">{{ props.item.phone }}</td>
        <td class="justify-center layout px-0">
          <v-btn icon @click="showOrder(props)">
            <i class="el-icon-menu"/>
          </v-btn>
        </td>
      </template>
    </v-data-table>
    <!--弹出的对话框-->
    <!--  -->
  </v-card>
</template>

<script>
  // 导入自定义的表单组件
  // import BrandForm from '../item/BrandForm'

  export default {
    name: "brand",
    data() {
      return {
        search: '', // 搜索过滤字段
        totalUsers: 0, // 总条数
        users: [], // 当前页用户数据
        loading: true, // 是否在加载中
        pagination: {}, // 分页信息
        headers: [
          {text: 'id', align: 'center', value: 'id'},
          {text: '名称', align: 'center', sortable: false, value: 'username'},
          {text: '电话', align: 'center', sortable: false, value: 'phone'},
          {text: '操作', align: 'center', value: 'id', sortable: false}
        ],
        show: false,// 控制对话框的显示
        oldBrand: {}, // 即将被编辑的用户数据
        isEdit: false, // 是否是编辑
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
          
        })
        .catch(()=>{
            // 未登录
            this.$router.push("/login");
        })
    },
    methods: {
      getDataFromServer() { // 从服务的加载数的方法。
        // 发起请求
        this.$http.get("/user/page", {
          params: {
            key: this.search, // 搜索条件
            page: this.pagination.page,// 当前页
            rows: this.pagination.rowsPerPage,// 每页大小
            sortBy: this.pagination.sortBy,// 排序字段
            desc: this.pagination.descending// 是否降序
          }
        }).then(resp => { // 这里使用箭头函数
          this.users = resp.data.items;
          this.totalUsers = resp.data.total;
          // 完成赋值后，把加载状态赋值为false
          this.loading = false;
        })
      },
      showOrder(props){
        this.$router.push({path:`/trade/order/${props.item.id}`});
      },
      closeWindow(){
        // 重新加载数据
        this.getDataFromServer();
        // 关闭窗口
        this.show = false;
      }
    },
    components:{
        // BrandForm
    }
  }
</script>

<style scoped>

</style>
