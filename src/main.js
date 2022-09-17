import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

// ElementUI 框架
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// import 'element-ui/lib/theme-chalk/display.css';// 尺寸断点
Vue.use(ElementUI);

// 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)

// Vant移动端组件库
import Vant from 'vant';
import 'vant/lib/index.css';
Vue.use(Vant);

// 移动端适配
import 'amfe-flexible';

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
