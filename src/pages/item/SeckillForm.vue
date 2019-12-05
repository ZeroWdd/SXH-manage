<template>
  <v-stepper v-model="step">
    <v-stepper-header>
      <v-stepper-step :complete="step > 1" step="1">基本信息</v-stepper-step>
      <v-divider/>
      <v-stepper-step :complete="step > 2" step="2">商品描述</v-stepper-step>
    </v-stepper-header>
    <v-stepper-items>
      <!--1、商品描述-->
      <v-stepper-content step="1">
        <v-editor v-model="seckill.introduction"/>
      </v-stepper-content>
      <!--2、基本信息-->
      <v-stepper-content step="2">
        <v-flex class="xs10 mx-auto">
          <v-text-field v-model="seckill.title" label="秒杀标题" required/>
          <v-text-field v-model="seckill.price" label="秒杀价格" required/>
          <v-text-field v-model="seckill.num" label="秒杀库存" required/>
          <el-date-picker
            v-model="seckill.startTime"
            type="datetime"
            placeholder="开始时间">
          </el-date-picker>
          <el-date-picker
            v-model="seckill.endTime"
            type="datetime"
            placeholder="结束时间">
          </el-date-picker>
        </v-flex>
        <!--提交按钮-->
        <v-flex xs3 offset-xs9>
          <v-btn color="info" @click="add" >保存秒杀商品</v-btn>
        </v-flex>
      </v-stepper-content>
      
    </v-stepper-items>
  </v-stepper>
</template>

<script>

import { FormItem,Col,DatePicker,TimePicker,Form } from 'element-ui';

export default {
  name: "seckill-form",
  props: {
    step: {
      type: Number,
      default: 1
    },
    skuId: {
      type: Number,
    },
    spuId: {
      
    }
  },
  data() {
    return {
      seckill : {
        title : "",
        introduction : "",
        spuId : 0,
        skuId : 0,
        startTime : "",
        endTime : ""
      }
    };
  },
  methods: {
    add(){
      this.seckill.spuId = this.spuId;
      this.seckill.skuId = this.skuId;
      this.seckill.startTime = new Date(this.seckill.startTime);
      this.seckill.endTime = new Date(this.seckill.endTime);
      this.seckill.price = this.seckill.price * 100;
      this.$http.post("/seckill",this.seckill)
      .then(() => { // 这里使用箭头函数
        
      })
      .catch(()=>{
          // 未登录
          //this.$router.push("/login");
      })
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
  watch: {
    skuId: {// 监控oldBrand的变化
      handler(val) {
        this.seckill = {
            
        }
      },
      deep: true
    }
  },
  computed: {
  

  },
  components:{
    // FormItem,Col,DatePicker,TimePicker
    elFormItem : FormItem,
    elCol : Col,
    elDatePicker : DatePicker,
    elTimePicker : TimePicker,
    elForm : Form
  }
};
</script>

<style scoped>
</style>
