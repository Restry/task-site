import Vue from 'vue'
import App from './App.vue'
import { BaseURL } from './utils/request';

// 引入vuex 状态库
import store from "./store";
Vue.prototype.$store = store;
Vue.prototype.$BaseURL = BaseURL;

// //检查登录
Vue.prototype.checkLogin = function (backpage: string, backtype: any) {
  var user = uni.getStorageSync('_User');
  console.info('user cache :');
  console.table(user);

  if (!user || !user._id) {
    if (backtype == 1) {
      uni.navigateTo({
        url: '../login/login?backpage=' + backpage + '&backtype=' + backtype,
      });
    } else {
      uni.redirectTo({
        url: '../login/login?backpage=' + backpage + '&backtype=' + backtype,
      });
    }

    return false;
  }
  return user;
}

// 引入自定义导航栏
import cuCustom from './colorui/components/cu-custom.vue'
Vue.component('cu-custom', cuCustom)

// 生成环境开关
Vue.config.productionTip = false


const app = new App();

store.dispatch({ type: "user/profile" }).then(() => app.$mount());

