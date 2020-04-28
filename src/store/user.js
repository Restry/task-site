import request from "../utils/request";
import { findLastIndex } from '../utils/tools';

export class User {
  constructor(item = {}, config = {}) {
    Object.assign(this, {
      name: "",
      _id: 0,
      id: 0,
      points: 0,
      mobile: 0,
      username: 0,
      avatar: 0,
      location: 0,
      email: 0,
      balance: 0,
      notices: [],
      role: '',
      parents: [],
      subs: [],
    }, item);

    const levelIndex = findLastIndex(config.levels, a => this.points >= a.points) || 0;
    // debugger;
    this.levelIndex = levelIndex;
    this.level = config.levels[levelIndex];
    this.nextLevel = config.levels[levelIndex + 1];
    this.levelPercent = parseInt(this.points / this.nextLevel.points * 100);
    this.levelPercentStyle = `width:${this.levelPercent}%`;
    this.isAdmin = this.role === 'admin';

    this.avatar = this.level.icon;
    this.invitationLink = `${location && location.origin}/#/pages/login/login?inviter=${this.mobile}`;

    this.availableBalance = this.balance * 1;// parseFloat((this.balance * 1 + (this.invitationBounty && this.invitationBounty * 1)).toFixed(2));
  }

  /**
   * 1-5
   * '初级','进阶','中级','中进阶','高级'
   * 青铜, 白银 黄金 铂金 钻石 星耀 王者
   */
  // static levelDef = [
  //   { id: 0, name: '青铜', points: 0, icon: require(`../static/level/0.png`), bail: 0 },
  //   { id: 1, name: '白银', points: 50, icon: require(`../static/level/1.png`), bail: 100 },
  //   { id: 2, name: '黄金', points: 100, icon: require(`../static/level/2.png`), bail: 200 },
  //   { id: 3, name: '铂金', points: 150, icon: require(`../static/level/3.png`), bail: 300 },
  //   { id: 4, name: '钻石', points: 300, icon: require(`../static/level/4.png`), bail: 400 },
  //   { id: 5, name: '星耀', points: 1000, icon: require(`../static/level/5.png`), bail: 500 },
  //   { id: 6, name: '王者', points: 2000, icon: require(`../static/level/6.png`), bail: 600 },
  //   { id: 7, name: '王者Plus', points: 8000, icon: require(`../static/level/7.png`), bail: 1000 }
  // ]

  // getLevelPoint() {
  //   const index = User.levelDef.findIndex(a => this.points >= a.points);
  //   return index > 0 ? index : 0;
  // }
}

export default {
  namespaced: true,
  state: {
    user_address: {
      province: "",
      city: "",
      district: ""
    },
    msgId: "",
    user: {}, //uni.getStorageSync("_User"),

    config: { levels: [] }
  },
  getters: {
    getLevelString: (state) => (index) => {
      return state.config.levels[index] && state.config.levels[index].name;
    }
  },
  mutations: {
    commit_address(state, data) {
      state.user_address = data;
    },

    updateState(state, { payload }) {
      Object.assign(state, payload);
    },
    loginSuccess(state, { payload }) {

      uni.setStorageSync("_User", payload);
      state.user = payload;
    },

    enrollSuccess(state, { payload }) {
      state.user.points += parseInt(payload);
      state.user = new User(state.user);
    },

    userSetup({ user }, { payload }) {

      // 设置角标
      if (user.notices && user.notices.length > 0) {
        uni.setTabBarBadge({
          index: 2,
          text: '' + user.notices.length
        })
      }
    },
  },
  actions: {
    async profile({ commit, state }, payload) {
      try {
        if (state.user._id && state.config._id) return Promise.resolve();

        // 获取配置信息
        const { data: configResult } = await request.get("/api/config");
        let user = {}, config = {};

        if (configResult && configResult.length) {
          config = configResult[0];
          commit({ type: "updateState", payload: { config } });
        } else {
          throw new Error('后台未正确配置');
        }

        const { data } = await request.get("/profile", payload);

        if (data.success) {
          user = new User(data.user, config);
        } else {
          user = new User(uni.getStorageSync("_User"), config); // 未成功登陆 使用本地缓存
        }
        commit({ type: "updateState", payload: { user } });

      } catch (error) {
        console.log('user.profile error:', error.message);
      }
    },
    async refreshUser({ commit, state }, payload) {
      const { data } = await request.get("/profile", payload);

      let user = {};
      if (data.success) {
        user = new User(data.user, state.config);
        if (user.notices && user.notices.length > 0) {
          uni.setTabBarBadge({
            index: 2,
            text: '' + user.notices.length
          })
        }
      } else {
        user = new User(uni.getStorageSync("_User"), config); // 未成功登陆 使用本地缓存
      }
      commit({ type: "updateState", payload: { user } });
    },

    async initUserReleation({ commit, state }, payload) {
      const { data } = await request.get("/utils/relationship", { params: { mobile: state.user.mobile } });

      if (data.success) {
        commit({ type: "updateState", payload: { user: new User(data.result, state.config) } });
      }
    },
    async login({ commit, state }, payload) {
      const { data } = await request.post("/login", payload);

      if (data.success) {
        uni.showModal({
          title: "登陆成功",
          showCancel: false,
          success: () => uni.navigateBack({
            delta: 1
          })
        });

        commit({ type: "loginSuccess", payload: new User(data.user, state.config) });

      } else {
        uni.showModal({
          title: "登陆失败：" + data.message,
          showCancel: false
        });
      }
    },
    async logout({ commit }, payload) {
      const { data } = await request.post("/logout", payload);
      if (data.success) {
        commit({ type: "loginSuccess", payload: {} });
        return true;
      }
      return false;
    },
    async signup({ commit, state }, payload) {
      const { data } = await request.post("/signup", payload);
      if (data.success) {

        uni.showModal({
          title: "注册成功",
          showCancel: false,
          success: () => uni.switchTab({
            url: "../index/index"
          })
        });
        commit({ type: "loginSuccess", payload: new User(data.user, state.config) });
      } else {

        uni.showModal({
          title: "注册失败：" + data.message,
          showCancel: false
        });
      }
    },
    async getVerifyCode({ commit }, payload) {
      const { data } = await request.post("/utils/sms", payload);

      if (data.msg_id) {
        uni.showModal({
          title: "发送成功",
          // content: JSON.stringify(payload),
          showCancel: false
        });
        commit({ type: "updateState", payload: { msgId: data.msg_id } });

        return true;
      }
      return false;
    },

    async updateUserInfo({ commit, state }, payload) {

      const { data } = await request.put("/api/users?_id=" + state.user._id, payload);
      if (data.ok) {

        uni.showModal({
          title: "更新成功",
          content: '',//JSON.stringify(payload),
          showCancel: false,
          success: () => uni.navigateBack()
        });

        commit({ type: "updateState", payload: { user: { ...state.user, ...payload } } });
      }
    },

    async withdraw({ commit, state }, payload) {
      const { data } = await request.post("/utils/withdraw", payload);

      // 更新用户信息
      await request.put('/api/users?_id=' + state.user._id, { drawInfo: payload });

      if (data.withdrawRes.ok) {
        uni.showModal({
          title: "提交成功",
          content: '请耐心等待！',//JSON.stringify(payload),
          showCancel: false,
          success: () => uni.navigateBack()
        });
        const newUserInfo = Object.assign({}, state.user, { drawInfo: payload, balance: state.user.balance - payload.money });

        commit({ type: "updateState", payload: { user: new User(newUserInfo, state.config) } });

        return data.withdrawRes.ops[0];
      }
      return null;
    }
  }
};
