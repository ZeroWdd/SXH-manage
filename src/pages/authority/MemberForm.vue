<template>
  <v-form v-model="valid" ref="myMemberForm">
    <v-text-field v-model="admin.name" label="请输入管理员名称" required :rules="nameRules"/>
    <v-text-field v-model="admin.phone" label="请输入管理员电话" required :rules="phoneRules"/>
    <v-text-field v-model="admin.email" label="请输入管理员邮箱" required :rules="emailRules"/>
    <v-text-field v-model="admin.password" label="默认管理员密码: admin" disabled/>
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
      oldAdmin: {
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
        admin: {
          name: '', // 管理员名称
          phone: '', // 管理员电话
          email: '', // 管理员邮箱
          password: 'admin', // 管理员密码默认为admin
          roles: []
        },
        nameRules: [
          v => !!v || "管理员名称不能为空",
          v => v.length > 1 || "品牌名称至少2位"
        ],
        phoneRules: [
          v => !!v || "管理员电话不能为空",
          v => /^1[35678]\d{9}$/.test(v) || "请输入有效管理员电话"
        ],
        emailRules: [
          v => !!v || "管理员邮箱不能为空",
          v => /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(v) || "请输入有效管理员邮箱"
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
        // 表单校验
        if (this.$refs.myMemberForm.validate()) {
          // 定义一个请求参数对象，通过解构表达式来获取admin中的属性
          let params = this.admin;
          params.password = "admin";
          params.roles = [];
          this.$http({
            method: this.isEdit ? 'put' : 'post',
            url: '/admin/admin',
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
      oldAdmin: {// 监控oldAdmin的变化
        handler(val) {
          if (val) {
            // 注意不要直接复制，否则这边的修改会影响到父组件的数据，copy属性即可
            this.admin = Object.deepCopy(val)
          } else {
            // 为空，初始化admin
            this.admin = {
              name: '',
              phone: '',
              email: '',
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
