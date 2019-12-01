<template>
  <v-form v-model="valid" ref="myMemberForm">
    <v-text-field v-model="permission.permissionName" label="请输入权限名称" required :rules="nameRules"/>
    <v-text-field v-model="permission.url" label="请输入权限地址" required/>
    <v-layout class="my-4" row>
      <v-spacer/>
      <v-btn @click="submit" color="primary">提交</v-btn>
      <v-btn @click="clear">重置</v-btn>
    </v-layout>
  </v-form>
</template>

<script>
  export default {
    name: "member-form",
    props: {
      oldPermission: {
        type: Object
      },
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    components: {
      
    },
    data() {
      return {
        valid: false, // 表单校验结果标记
        permission: {
          permissionName: '', 
          url:'',
        },
        nameRules: [
          v => !!v || "权限名称不能为空",
          v => v.length > 1 || "权限名称至少2位"
        ],
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
        if (this.$refs.myMemberForm.validate()) {
          // 定义一个请求参数对象，通过解构表达式来获取admin中的属性
          let params = this.permission;
          this.$http({
            method: this.isEdit ? 'put' : 'post',
            url: '/admin/permission',
            data: this.$qs.stringify(params)
          }).then(() => {
            // 关闭窗口
            this.$emit("close");
            this.$message.success("保存成功！");
          })
            .catch(() => {
              this.$message.error("保存失败！");
            });
        }
      },
      clear() {
        // 重置表单
        this.$refs.myMemberForm.reset();
        // 需要手动清空商品分类
        this.categories = [];
      }
    },
    watch: {
      oldPermission: {// 监控oldAdmin的变化
        handler(val) {
          if (val) {
            // 注意不要直接复制，否则这边的修改会影响到父组件的数据，copy属性即可
            this.permission = Object.deepCopy(val)
          } else {
            // 为空，初始化admin
            this.permission = {
              permissionName: '', 
              url:'',
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
