<template>
  <v-form v-model="valid" ref="myDealForm">
    <el-select v-model="permissionIds" multiple  placeholder="请选择">
      <el-option
        v-for="per in dfPermissions"
        :key="per.permissionId"
        :label="per.permissionName"
        :value="per.permissionId">
      </el-option>
    </el-select>
    <v-layout class="my-4" row>
      <v-spacer/>
      <v-btn @click="submit" color="primary">提交</v-btn>
      <v-btn @click="clear">重置</v-btn>
    </v-layout>
  </v-form>
</template>

<script>
  import { Select,Option } from 'element-ui';

  export default {
    name: "deal-form",
    props: {
      oldRole: {
        type: Object
      },
    },
    components: {
      elSelect : Select,
      elOption : Option
    },
    data() {
      return {
        valid: false, // 表单校验结果标记
        dfPermissions : [],
        permissionIds: [],
        permissions:[],
        roleId: 0,
      }
    },
    methods: {
      submit() {
        // 表单校验
        if (this.$refs.myDealForm.validate()) {
          // 定义一个请求参数对象，通过解构表达式来获取admin中的属性
          let params = {};
          this.permissions = [];
          for(let i in this.dfPermissions){
            for(let j in this.permissionIds){
              if(this.permissionIds[j] == this.dfPermissions[i].permissionId){
                this.permissions.push(this.dfPermissions[i]);
              }
            }
          }
          params.permissions = this.permissions;
          params.roleId = this.roleId;
          // console.log(this.permissions);
          // console.log(this.dfPermissions);
          // console.log(this.permissionIds);
          this.$http({
            method: 'put',
            url: '/admin/role/deal',
            data: params
          }).then(() => {
            // 关闭窗口
            this.$emit("close");
            this.$message.success("保存成功！");
          }).catch(() => {
            this.$message.error("保存失败！");
          });
        }
      },
      clear() {
        // 重置表单
        this.$refs.myDealForm.reset();
        // 需要手动清空商品分类
        this.permissionIds = [];
      }
    },
    created(){
      // this.$http.get("/auth/verify")
      //   .then(() => { // 这里使用箭头函数
          
      //   })
      //   .catch(()=>{
      //       // 未登录
      //       this.$router.push("/login");
      //   })
    },
    watch: {
      oldRole: {// 监控oldRole的变化
        handler(val) {
          if (val) {
            // 先初始化变量
            this.permissionIds = []
            // 注意不要直接复制，否则这边的修改会影响到父组件的数据，copy属性即可
            this.roleId = Object.deepCopy(val.roleId);
            this.permissions = Object.deepCopy(val.permissions);
            
            for(let key in this.permissions){
              this.permissionIds.push(this.permissions[key].permissionId);
            }

            this.$http.get("/admin/permission/list")
              .then(({data}) => {
                this.dfPermissions = data;
              }
            )
          }
        },
        deep: true
      }
    }
  }
</script>

<style scoped>

</style>
