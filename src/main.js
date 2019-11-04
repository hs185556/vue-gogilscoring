// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// 滑屏事件
import '@/public/vue-touch'

// 引入websql
import websql from './public/websql'
Vue.prototype.$websql = websql

// 引入mui
import Mui from 'vue-awesome-mui';
//import 'vue-awesome-mui/mui/dist/css/mui.css';
Vue.use(Mui);

// 导入图标
import './assets/iconfont/iconfont.css'
import './assets/iconfont/iconfont.js'

// 引入store
import store from '@/vuex/store'

Vue.config.productionTip = false

// 面板
import { TabContainer, TabContainerItem } from 'mint-ui';
Vue.component(TabContainer.name, TabContainer);
Vue.component(TabContainerItem.name, TabContainerItem);
// 按钮
import { Button } from 'mint-ui';
Vue.component(Button.name, Button);
// 徽章 
import { Badge } from 'mint-ui';
Vue.component(Badge.name, Badge);
// 顶部导航栏
import { Header } from 'mint-ui';
Vue.component(Header.name, Header);
// 表单编辑器 
import { Field } from 'mint-ui';
Vue.component(Field.name, Field);
// 弹出式提示框
import { MessageBox } from 'mint-ui'
Vue.prototype.$messagebox = MessageBox
// 弹出框
import { Popup } from 'mint-ui';
Vue.component(Popup.name, Popup);
// 复选框
import { Checklist } from 'mint-ui';
Vue.component(Checklist.name, Checklist);
// 单选框
import { Radio } from 'mint-ui';
Vue.component(Radio.name, Radio);
// 单元格
import { Cell } from 'mint-ui';
Vue.component(Cell.name, Cell);
// 滑动单元格
import { CellSwipe } from 'mint-ui';
Vue.component(CellSwipe.name, CellSwipe);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  store
})
