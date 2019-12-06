<template>
  <v-card>
    <el-button type="primary" @click="goSeckill" style="margin-top: 10px;margin-bottom: 10px;margin-left:10px">返回秒杀页</el-button>
    <el-button type="primary" @click="goSeckillSpu" style="margin-top: 10px;margin-bottom: 10px;margin-left:10px">返回上一层</el-button>
    <el-table
      :data="goodsList"
      style="width: 100%">
      <el-table-column
        :formatter = "subTitle"
        prop="title"
        label="标题">
      </el-table-column>
      <el-table-column
        prop="ownSpec"
        label="规格">
      </el-table-column>
      <el-table-column
        :formatter = "priceFormat"
        prop="price"
        label="价格">
      </el-table-column>
      <el-table-column
        prop="stock"
        label="库存">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button type="primary" @click.native.prevent="addSeckill(scope.$index, goodsList)"  icon="el-icon-check" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--弹出的对话框-->
    <v-dialog max-width="800" v-model="show" persistent scrollable>
      <v-card>
        <!--对话框的标题-->
        <v-toolbar dense dark color="primary">
          <v-toolbar-title>添加秒杀商品</v-toolbar-title>
          <v-spacer/>
          <!--关闭窗口的按钮-->
          <v-btn icon @click="closeWindow">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <!--对话框的内容，表单-->
        <v-card-text class="px-3" style="height: 600px">
          <seckill-form :skuId="skuId" :spuId="spuId" :step="step" @close="closeWindow" ref="seckillForm"/>
        </v-card-text>
        <!--底部按钮，用来操作步骤线-->
        <v-card-actions class="elevation-10">
          <v-flex class="xs3 mx-auto">
            <v-btn @click="previous" color="primary" :disabled="step === 1">上一步</v-btn>
            <v-btn @click="next" color="primary" :disabled="step === 2">下一步</v-btn>
          </v-flex>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-card>
</template>

<script>

  import { Select,Option,Table,TableColumn,Radio,Icon,Button } from 'element-ui';
  import 'element-ui/lib/theme-chalk/index.css';
  import SeckillForm from './SeckillForm'

  export default {
    name: "goods",
    data() {
      return {
        goodsList: [], // 当前页品牌数据
        headers: [
          {text: 'id', align: 'center', sortable: false, value: 'id'},
          {text: '标题', align: 'center', sortable: false, value: 'title'},
          {text: '价格', align: 'center', sortable: false, value: 'price'},
          {text: '规格', align: 'center', value: 'ownSpec', sortable: false,},
          {text: '操作', align: 'center', sortable: false}
        ],
        spuId : 0,
        skuId : 0,
        show: false,// 控制对话框的显示
        step: 1, // 子组件中的步骤线索引，默认为1
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
      filter: {// 监视搜索字段
        handler() {
          this.getDataFromServer();
        },
        deep: true
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
        this.spuId = this.$route.params.spuId;
        // 发起请求
        this.$http.get("/seckill/sku/"+this.spuId).then(resp => { // 这里使用箭头函数
          this.goodsList = resp.data;
        })
      },
      subTitle(row,column){
        return row.title.substr(0,15) + "..."
      },
      priceFormat(row,column){
        return this.$format(row.price)
      },
      addSeckill(index, rows){
        // 控制弹窗可见：
        
        this.skuId = rows[index].id;
        this.show = true;
        // rows.splice(index, 1);
      },
      closeWindow() {
        // 重新加载数据
        this.getDataFromServer();
        // 关闭窗口
        this.show = false;
        // 将步骤调整到1
        this.step = 1;
      },
      previous(){
        if(this.step > 1){
          this.step--
        }
      },
      next(){
        if(this.step < 2 ){
          this.step++
        }
      },
      goSeckill(){
        this.$router.push("/item/seckill");
      },
      goSeckillSpu(){
        this.$router.push("/item/seckillSpu");
      }
    },
    components: {
      elTable : Table,
      elTableColumn : TableColumn,
      elSelect : Select,
      elOption : Option,
      elIcon : Icon,
      elButton : Button,
      SeckillForm
    },
  }
</script>

<style scoped>

</style>
