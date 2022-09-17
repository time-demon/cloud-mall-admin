import Vue from 'vue'

import VueRouter from 'vue-router'
Vue.use(VueRouter)

const routes = [
  {// 前台页面入口
    path: '',
    component: () => import("@/App"),
    children: [
      {// pc端页面入口
        path: "",
        name: "",
        redirect: "admin",
        component: () => import("@/views/pc/index"),
      },
      {// 手机端页面入口
        path: "mobile",
        component: () => import("@/views/mobile/blank"),
        children: [
          {// 首页入口
            path: "",
            component: () => import("@/views/mobile/home"),
            children: [
              {
                path: "",
                name: "首页",
                component: () => import("@/components/mobile/webPage"),
              },
              {
                path: "class",
                name: "分类",
                component: () => import("@/components/mobile/webPage/class"),
              },
              {
                path: "order",
                name: "订单",
                component: () => import("@/components/mobile/webPage/order"),
              },
              {
                path: "shopCart",
                name: "购物车",
                component: () => import("@/components/mobile/webPage/shopCart"),
              },
              {
                path: "user",
                name: "个人中心",
                component: () => import("@/components/mobile/webPage/user"),
              },
              {
                path: "login",
                name: "登录",
                component: () => import("@/components/mobile/webPage/login"),
              },
              {
                path: "register",
                name: "注册",
                component: () => import("@/components/mobile/webPage/register"),
              },
            ]
          },
          {// 商品详情页入口
            path: "goods",
            name: "商品详情",
            component: () => import("@/views/mobile/goods"),
          },
        ]
      }
    ]
  },
  {// 后台页面入口
    path: "/admin",
    component: () => import("@/App"),
    children: [
      {
        path: "",
        name: "后台",
        redirect: "/admin/home",
        component: () => import("@/views/admin"),
        children: [
          {
            path: "home",
            name: "数据中心",
            icon: "el-icon-s-marketing",
            component: () => import("@/components/admin/webPage"),
          },
          {
            path: "goods",
            name: "商品相关",
            icon: "el-icon-s-grid",
            redirect: "goods/goodsList",
            component: () => import("@/views/blank"),
            children: [
              {
                path: "goodsList",
                name: "商品列表",
                icon: "",
                component: () => import("@/components/admin/webPage/goodsList"),
              },
              {
                path: "goodsClass",
                name: "商品分类",
                icon: "",
                component: () => import("@/components/admin/webPage/goodsClass"),
              },
            ],
          },
          {
            path: "order",
            name: "订单相关",
            icon: "el-icon-s-order",
            component: () => import("@/views/blank"),
            children: [
              {
                path: "orderList",
                name: "订单列表",
                icon: "",
                component: () => import("@/components/admin/webPage/orderList"),
              },
            ]
          },
          {
            path: "webConfig",
            name: "网站配置",
            icon: "el-icon-s-tools",
            component: () => import("@/views/blank"),
            children: [
              {
                path: "basicConfig",
                name: "基本配置",
                icon: "",
                component: () => import("@/components/admin/webPage/basicConfig"),
              },
              {
                path: "quickNav",
                name: "快捷导航",
                icon: "",
                component: () => import("@/components/admin/webPage/quickNav"),
              },
            ]
          },
          {
            path: "admin_my",
            name: "个人设置",
            icon: "el-icon-user-solid",
            component: () => import("@/components/admin/webPage/admin_my"),
          },
        ]
      },
      {
        path: "",
        name: "登录注册验证",
        component: () => import("@/views/admin/verify"),
        children: [
          {
            path: "login",
            name: "管理员登录",
            component: () => import("@/components/admin/verify/login"),
          },
          {
            path: "register",
            name: "管理员注册",
            component: () => import("@/components/admin/verify/register"),
          }
        ]
      },
    ]
  }
]



// 防止路由重复点击报错

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
};

const router = new VueRouter({
  routes,
  mode: "history",
  base: process.env.BASE_URL
})

import network from '@/network';
// 导航守卫
router.beforeEach((to, from, next) => {

  // 获取 网站基本配置
  network({
    method: 'get',
    url: '/webConfig/getData',
  }).then(res => {
    if (res.code == 200) {
      to.meta.webConfig = res.data[0];// 网站基本配置赋值
      window.document.title = to.name + ' - ' + res.data[0].webName;// 标签栏文字
      next();
    } else {
      window.document.title = '未知问题，数据加载失败...';// 标签栏文字
      next();
    }
  }).catch(error => {
    if (error) {
      window.document.title = '接口异常，数据加载失败...';// 标签栏文字
      next();
    }
  })

  // 判断路由地址是否改变
  if (to.fullPath != from.fullPath) {
    // 获取网站基本配置
    if (to.path == '/admin/login' || to.path == '/admin/register') { // 如果访问的是登录 或 注册页面
      if (localStorage.getItem('Authorization') != null && localStorage.getItem('Authorization') != '') {
        next('admin');
      }
    } else if (to.path.match(/\b\w+\b/g)[0] == 'admin') {//  如果访问的是后台界面（除了后台的登录和注册界面）
      console.log('正则解析当前路由地址', to.path.match(/\b\w+\b/g));
      if (localStorage.getItem('Authorization') == null || localStorage.getItem('Authorization') == '') {
        next('admin/login');
      }
    } else {
      console.log('前台页面');
    }
  } else {
    console.log('前台首页');
  }
})

export default router;
