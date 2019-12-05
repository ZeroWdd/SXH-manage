<template>
  <v-card>
    <v-card-title>
      <v-btn color="primary" @click="addSeckill">新增秒杀</v-btn>
      <!--搜索框，与search属性关联-->
      <v-spacer/>
      <v-flex xs3>
      <v-text-field label="输入关键字搜索" v-model.lazy="search" append-icon="search" hide-details/>
      </v-flex>
    </v-card-title>
    <v-divider/>
    <v-data-table
      :headers="headers"
      :items="seckills"
      :pagination.sync="pagination"
      :total-items="totalSeckills"
      :loading="loading"
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <td class="text-xs-center">{{ props.item.id }}</td>
        <td class="text-xs-center">{{ props.item.spuId }}</td>
        <td class="text-xs-center">{{ props.item.title }}</td>
        <td class="text-xs-center">{{ $format(props.item.price) }}</td>
        <td class="text-xs-center">{{ props.item.num }}</td>
        <td class="text-xs-center">{{ props.item.startTime | formatDate }}</td>
        <td class="text-xs-center">{{ props.item.endTime | formatDate }}</td>
        <td class="text-xs-center" v-if="props.item.status == 1">过期</td>
        <td class="text-xs-center" v-else>未过期</td>
        <td class="justify-center layout px-0">
          <v-btn icon @click="editBrand(props.item)">
            <i class="el-icon-edit"/>
          </v-btn>
          <v-btn icon @click="deleteBrand(props.item)">
            <i class="el-icon-delete"/>
          </v-btn>
        </td>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
  import { formatDate } from '../../components/FormatDate.js'

  export default {
    name: "seckill",
    data() {
      return {
        search: '', // 搜索过滤字段
        totalSeckills: 0, // 总条数
        seckills: [], // 当前页品牌数据
        loading: true, // 是否在加载中
        pagination: {}, // 分页信息
        headers: [
          {text: 'id', align: 'center', value: 'id'},
          {text: 'spuId', align: 'center', value: 'spuId'},
          {text: '标题', align: 'center', value: 'title', sortable: false},
          {text: '秒杀价', align: 'center', value: 'price'},
          {text: '库存', align: 'center', value: 'num'},
          {text: '开始时间', align: 'center', value: 'startTime', sortable: false},
          {text: '结束时间', align: 'center', value: 'endTime', sortable: false},
          {text: '状态', align: 'center', value: 'status', sortable: false},
          {text: '操作', align: 'center', value: 'id', sortable: false}
        ],
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
    filters: {
      formatDate(time) {
        var date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
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
        this.$http.get("/seckill/page", {
          params: {
            key: this.search, // 搜索条件
            page: this.pagination.page,// 当前页
            rows: this.pagination.rowsPerPage,// 每页大小
            sortBy: this.pagination.sortBy,// 排序字段
            desc: this.pagination.descending// 是否降序
          }
        }).then(resp => { // 这里使用箭头函数
          this.seckills = resp.data.items;
          this.totalSeckills = resp.data.total;
          // 完成赋值后，把加载状态赋值为false
          this.loading = false;
        }).catch(() => {
          this.$message.info('暂无秒杀数据');
          this.loading = false;
        })
      },
      addSeckill() {
        this.$router.push("/item/seckillSpu");
      }
    },
    components:{
    }
  }
</script>

<style scoped>

</style>
