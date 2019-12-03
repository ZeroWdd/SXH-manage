<template>
  <v-form v-model="valid" ref="myOrderForm">
    <div style="margin-bottom: 20px;"><h4>订单号:</h4><span v-text="order.orderId"></span></div>
    <div style="margin-bottom: 20px;"><h4>收货人:</h4><span v-text="order.receiver"></span></div>
    <div style="margin-bottom: 20px;"><h4>收获地址:</h4><span v-text="order.receiverState + order.receiverCity + order.receiverDistrict + order.receiverAddress"></span></div>
    <div style="margin-bottom: 20px;"><h4>实付金额:</h4><span v-text="this.$format(order.actualPay)"></span></div>
    <div style="margin-bottom: 20px;"><h4>商品:</h4>
        <el-table
          :data="order.orderDetails"
          style="width: 100%">
          <el-table-column
            :formatter = "subTitle"
            prop="title"
            label="名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="ownSpec"
            label="规格"
            width="250">
          </el-table-column>
          <el-table-column
            prop="num"
            label="数量"
            width="50">
          </el-table-column>
          <el-table-column
            :formatter = "priceFormat"
            prop="price"
            label="价格"
             width="100">
          </el-table-column>
        </el-table>
    </div>
    <div style="margin-bottom: 20px;"><h4>订单状态:</h4>
      <el-select v-model="statusCode" placeholder="更改状态">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    <v-layout class="my-4" row>
      <v-spacer/>
      <v-btn @click="submit" color="primary">提交</v-btn>
    </v-layout>
  </v-form>
</template>

<script>
  import { Select,Option,Table,TableColumn,Radio } from 'element-ui';

  export default {
    name: "order-form",
    props: {
      oldOrder: {
        type: Object
      }
    },
    components: {
      elTable : Table,
      elTableColumn : TableColumn,
      elSelect : Select,
      elOption : Option
    },
    data() {
      return {
        valid: false, // 表单校验结果标记
        order: {

        },
        statusCode : 0,
        options : [
          {value:1,label:'未付款'},
          {value:2,label:'已付款'},
          {value:3,label:'已发货'},
          {value:4,label:'交易成功'},
          {value:5,label:'交易关闭'},
          {value:6,label:'已评论'}
        ]
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
      submit() {
        this.$message.confirm('更改订单状态，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.put("/order/order/" + this.order.orderId + "/" + this.statusCode).then(resp => {
            this.$message.info('更改成功');
            // 关闭窗口
            this.$emit("close");
          }).catch(()=>{
            this.$message.info('更改失败');
          })
        }).catch(()=>{
          this.$message.info('已取消更改');
        })
      },
      priceFormat(row,column){
        return this.$format(row.price)
      },
      subTitle(row,column){
        return row.title.substr(0,15) + "..."
      },
      clear() {
        // 重置表单
        this.$refs.myOrderForm.reset();
        // 需要手动清空商品分类
        this.categories = [];
      }
    },
    watch: {
      oldOrder: {// 监控oldOrder的变化
        handler(val) {
          if (val) {
            // 注意不要直接复制，否则这边的修改会影响到父组件的数据，copy属性即可
            this.order = Object.deepCopy(val)
            this.statusCode = this.order.status
          
          } else {
            // 为空，初始化brand
            this.order = {
              // name: '',
              // letter: '',
              // image: '',
              // categories: [],
            }
          }
        },
        deep: true
      }
    }
  }
</script>

<style scoped>

</style>
