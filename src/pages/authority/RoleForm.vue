<template>
  <v-form v-model="valid" ref="myRoleForm">
    <v-text-field v-model="role.roleName" label="请输入角色名称" required :rules="nameRules"/>
    <v-layout class="my-4" row>
      <v-spacer/>
      <v-btn @click="submit" color="primary">提交</v-btn>
      <v-btn @click="clear">重置</v-btn>
    </v-layout>
  </v-form>
</template>

<script>
  export default {
    name: "role-form",
    props: {
      oldRole: {
        type: Object
      },
      isEdit: {
        type: Boolean,
        default: false
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
    data() {
      return {
        valid: false, // 表单校验结果标记
        role: {
          roleName:''
        },
        nameRules: [
          v => !!v || "角色名称不能为空",
          v => v.length > 1 || "角色名称至少2位"
        ],
      }
    },
    methods: {
      submit() {
        // 表单校验
        if (this.$refs.myRoleForm.validate()) {
          // 定义一个请求参数对象，通过解构表达式来获取admin中的属性
          let params = this.role;
          this.$http({
            method: this.isEdit ? 'put' : 'post',
            url: '/admin/role',
            data: this.$qs.stringify(params)
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
        this.$refs.myRoleForm.reset();
        // 需要手动清空商品分类
        this.categories = [];
      }
    },
    watch: {
      oldRole: {// 监控oldAdmin的变化
        handler(val) {
          if (val) {
            // 注意不要直接复制，否则这边的修改会影响到父组件的数据，copy属性即可
            this.role = Object.deepCopy(val)
          } else {
            // 为空，初始化admin
            this.role = {roleName:''}
          }
        },
        deep: true
      }
    }
  }
</script>

<style scoped>

</style>
