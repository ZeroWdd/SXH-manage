<template>
  <v-card>
      <v-flex xs12 sm10>
        <v-tree url="/item/category/list"
                :isEdit="isEdit"
                @handleAdd="handleAdd"
                @handleEdit="handleEdit"
                @handleDelete="handleDelete"
                @handleClick="handleClick"
        />
      </v-flex>
  </v-card>
</template>

<script>
  export default {
    name: "category",
    data() {
      return {
        isEdit:true
      }
    },
    methods: {
      handleAdd(node) {
        this.$http.post("/item/category/", node)
          .then(() => {window.location.reload();});
      },
      handleEdit(id, name) {
        let node = {id,name}
        this.$http.put("/item/category/", node)
          .then(() => {});
      },
      handleDelete(id) {
        this.$http.delete("/item/category/" + id)
          .then(() => {
            window.location.reload();
          })
          .catch((error) => {
            if(error.response.status = 403){
              this.$message.error("分类存在子节点");
            }
          });
      },
      handleClick(node) {
        //console.log(node)
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
  };
</script>

<style scoped>

</style>
