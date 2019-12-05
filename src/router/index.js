import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

function route (path, file, name, children) {
  return {
    exact: true,
    path,
    name,
    children,
    component: () => import('../pages' + file)
  }
}

export default new Router({
  routes: [
    route("/login",'/Login',"Login"),// /login路径，路由到登录组件
    {
      path:"/", // 根路径，路由到 Layout组件
      component: () => import('../pages/Layout'),
      redirect:"/index/dashboard",
      children:[ // 其它所有组件都是 Layout的子组件
        route("/index/dashboard","/Dashboard","Dashboard"),
        route("/item/category",'/item/Category',"Category"),
        route("/item/brand",'/item/Brand',"Brand"),
        route("/item/list",'/item/Goods',"Goods"),
        route("/item/specification",'/item/specification/Specification',"Specification"),
        route("/item/seckill",'/item/Seckill',"Seckill"),
        route("/item/seckillSpu",'/item/SeckillSpu',"SeckillSpu"),
        route("/item/seckillSku/:spuId",'/item/SeckillSku',"SeckillSku"),
        route("/user/statistics",'/user/Statistics',"Statistics"),
        route("/user/list",'/user/User',"User"),
        route("/trade/promotion",'/trade/Promotion',"Promotion"),
        route("/trade/userOrder",'/trade/UserOrder',"UserOrder"),
        route("/trade/order/:userId",'/trade/Order',"Order"),
        route("/authority/member",'/authority/Member',"Member"),
        route("/authority/role",'/authority/Role',"Role"),
        route("/authority/list",'/authority/List',"List"),
      ]
    }
  ]
})
