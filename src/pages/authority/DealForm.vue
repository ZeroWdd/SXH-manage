<template>
  <v-form v-model="valid" ref="myDealForm">
    <el-select v-model="roleIds" multiple  placeholder="请选择">
      <el-option
        v-for="role in dfRoles"
        :key="role.roleId"
        :label="role.roleName"
        :value="role.roleId">
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
      oldAdmin: {
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
        dfRoles : [],
        roleIds: [],
        roles:[],
        adminId: 0,
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
    methods: {
      submit() {
        // 表单校验
        if (this.$refs.myDealForm.validate()) {
          // 定义一个请求参数对象，通过解构表达式来获取admin中的属性
          let params = {};
          this.roles = [];
          for(let i in this.dfRoles){
            for(let j in this.roleIds){
              if(this.roleIds[j] == this.dfRoles[i].roleId){
                this.roles.push(this.dfRoles[i]);
              }
            }
          }
          params.roles = this.roles;
          params.adminId = this.adminId;
          this.$http({
            method: 'put',
            url: '/admin/admin/deal',
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
        this.roleIds = [];
      }
    },
    watch: {
      oldAdmin: {// 监控oldAdmin的变化
        handler(val) {
          if (val) {
            // 先初始化变量
            this.roleIds = []
            // 注意不要直接复制，否则这边的修改会影响到父组件的数据，copy属性即可
            this.adminId = Object.deepCopy(val.adminId);
            this.roles = Object.deepCopy(val.roles);
            
            for(let key in this.roles){
              this.roleIds.push(this.roles[key].roleId);
            }

            this.$http.get("/admin/role/list")
              .then(({data}) => {
                this.dfRoles = data;
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
