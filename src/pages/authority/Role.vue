<template>
  <v-card>
    <v-card-title>
      <v-btn color="primary" @click="addRole()">新增角色</v-btn>
      <!--搜索框，与search属性关联-->
      <v-spacer/>
      <v-flex xs3>
      <v-text-field label="输入关键字搜索" v-model.lazy="search" append-icon="search" hide-details/>
      </v-flex>
    </v-card-title>
    <v-divider/>
    <v-data-table
      :headers="headers"
      :items="roles"
      :pagination.sync="pagination"
      :total-items="totalRoles"
      :loading="loading"
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <td class="text-xs-center">{{ props.item.roleId }}</td>
        <td class="text-xs-center">{{ props.item.roleName }}</td>
        <td class="justify-center layout px-0">
          <v-btn icon @click="dealRole(props.item)">
            <i class="el-icon-menu"/>
          </v-btn>
          <v-btn icon @click="editRole(props.item)">
            <i class="el-icon-edit"/>
          </v-btn>
          <v-btn icon @click="deleteRole(props)">
            <i class="el-icon-delete"/>
          </v-btn>
        </td>
      </template>
    </v-data-table>
    <!--弹出的对话框-->
    <v-dialog max-width="500" v-model="show" persistent scrollable>
      <v-card>
        <!--对话框的标题-->
        <v-toolbar dense dark color="primary">
          <v-toolbar-title>{{isEdit ? '修改' : '新增'}}角色</v-toolbar-title>
          <v-spacer/>
          <!--关闭窗口的按钮-->
          <v-btn icon @click="closeWindow"><v-icon>close</v-icon></v-btn>
        </v-toolbar>
        <!--对话框的内容，表单-->
        <v-card-text class="px-5" style="height:400px">
          <role-form @close="closeWindow" :oldRole="oldRole" :isEdit="isEdit"/>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!--弹出的对话框-->
    <v-dialog max-width="500" v-model="showDeal">
      <v-card>

        <v-toolbar dense dark color="primary">
          <v-toolbar-title>分配权限</v-toolbar-title>
          <v-spacer/>

          <v-btn icon @click="closeWindow"><v-icon>close</v-icon></v-btn>
        </v-toolbar>

        <v-card-text class="px-5" style="height:300px">
          <role-deal-form @close="closeWindow" :oldRole="oldRole"/>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
  // 导入自定义的表单组件
  import RoleForm from './RoleForm'
  import RoleDealForm from './RoleDealForm'

  export default {
    name: "role",
    data() {
      return {
        search: '', // 搜索过滤字段
        totalRoles: 0, // 总条数
        roles: [], // 当前页用户数据
        loading: true, // 是否在加载中
        pagination: {}, // 分页信息
        headers: [
          {text: 'id', align: 'center', value: 'roleId'},
          {text: '名称', align: 'center', sortable: false, value: 'roleName'},
          {text: '操作', align: 'center', value: 'roleId', sortable: false}
        ],
        oldRole: {}, // 即将被编辑的用户数据

        show: false,// 控制对话框的显示
        isEdit: false, // 是否是编辑

        showDeal: false, // 控制角色分配对话框的显示
        isEditDeal: false, // 是否是角色分配编辑
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
      // this.$http.get("/auth/verify")
      //   .then(() => { // 这里使用箭头函数
          
      //   })
      //   .catch(()=>{
      //       // 未登录
      //       this.$router.push("/login");
      //   })
    },
    methods: {
      getDataFromServer() { // 从服务的加载数的方法。
        // 发起请求
        this.$http.get("/admin/role/page", {
          params: {
            key: this.search, // 搜索条件
            page: this.pagination.page,// 当前页
            rows: this.pagination.rowsPerPage,// 每页大小
            sortBy: this.pagination.sortBy,// 排序字段
            desc: this.pagination.descending// 是否降序
          }
        }).then(resp => { // 这里使用箭头函数
          this.roles = resp.data.items;
          this.totalRoles = resp.data.total;
          // 完成赋值后，把加载状态赋值为false
          this.loading = false;
        })
      },
      addRole() {
        // 修改标记
        this.isEdit = false;
        // 控制弹窗可见：
        this.show = true;
        // 把oldRole变为null
        this.oldRole = null;
      },
      editRole(oldRole){
        // 根据用户信息查询商品分类
        this.$http.get("/admin/role/" + oldRole.roleId)
          .then(({data}) => {
            // 修改标记
            this.isEdit = true;
            // 控制弹窗可见：
            this.show = true;
            // 获取要编辑的brand
            this.oldRole = data
          })
      },
      dealRole(oldRole){
         this.$http.get("/admin/role/" + oldRole.roleId)
          .then(({data}) => {
            // 修改标记
            this.isEditDeal = true;
            // 控制弹窗可见：
            this.showDeal = true;
            // 获取要编辑的brand
            this.oldRole = data
        })
      },
      deleteRole(props){
        this.$message.confirm('此操作将永久删除数据，是否继续?', '提示', {
          confirmButtonText: '确定删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete("/admin/role/" + props.item.roleId).then(resp => {
            this.$message.info('删除成功');
            this.roles.splice(props.index, 1);
          }).catch(()=>{
            this.$message.info('删除失败');
          })
        }).catch(()=>{
          this.$message.info('已取消删除');
        })
      },
      closeWindow(){
        // 重新加载数据
        this.getDataFromServer();
        // 关闭窗口
        this.show = false;
        this.showDeal = false;
      }
    },
    components:{
        RoleForm,
        RoleDealForm
    }
  }
</script>

<style scoped>

</style>
