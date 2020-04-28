<template>
  <view class="login">
    <!-- 导航栏 -->
    <cu-custom bg-color="bg-gradual-blue" :isBack="true">
      <block slot="backText">返回</block>
      <block slot="content">登录</block>
    </cu-custom>

    <view class="grid margin-bottom text-center col-1">
      <view class="padding logo-box">
        <view
          class="cu-avatar radius lg margin-left"
          :style="`background-image: url('../../static/level/0.png');`"
        >
          <!-- <view class="cu-tag badge cuIcon-female bg-pink" ></view> -->
          <!-- <view class="cu-tag badge cuIcon-male bg-blue" ></view> -->
        </view>
      </view>
    </view>

    <form @submit="formSubmit">
      <view class="cu-form-group">
        <view class="title">
          <text class="cuIcon-mobile text-orange"></text>
        </view>
        <input placeholder="请输入手机号" v-model="mobile" name="mobile" />
        <view class="cu-capsule radius">
          <view class="cu-tag bg-blue">+86</view>
          <view class="cu-tag line-blue">中国大陆</view>
        </view>
      </view>

      <view class="cu-form-group">
        <view class="title">
          <text class="cuIcon-mobile text-orange"></text>
        </view>
        <input placeholder="密码/字母加数字至少6位" type="password" name="password" />
      </view>

      <view class="cu-form-group" v-if="register">
        <view class="title">
          <text class="cuIcon-peoplelist text-orange"></text>
        </view>
        <input placeholder="请输入验证码" name="verifyCode" />
        <button
          class="cu-btn bg-blue shadow"
          :disabled="!unsend || !mobile"
          @click="sendSMS"
        >验证码{{!unsend?'(60s)':''}}</button>
      </view>

      <view class="solid-bottom text-md padding text-center" v-if="register">
        <text class="text-grey">未注册手机验证后自动登录</text>
      </view>

      <view class="cu-form-group">
        <checkbox class="round checked" :checked="true" value="B"></checkbox>
        <view class="title">
          已同意并阅读
          <text class="agreement text-blue">《用户协议和隐私政策》</text>
        </view>
      </view>

      <view class="padding flex flex-direction">
        <button
          class="cu-btn bg-blue margin-tb-sm lg"
          form-type="submit"
        >{{register ? '注 册' : '登 录'}}</button>
        <button class="cu-btn margin-tb-sm lg" v-if="!register" @click="setRegister">注 册</button>
      </view>
    </form>
  </view>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  data() {
    return {
      unsend: true,
      mobile: "",
      register: false,
      inviter: uni.getStorageSync("__inviter") || 0
    };
  },
  computed: {
    ...mapState("user", ["msgId"])
  },
  onLoad: function(options) {
    this.profile();
    if (options.inviter) {
      this.inviter = options.inviter;
      this.register = true;
      uni.setStorageSync("__inviter", options.inviter);
    }

    uni.hideTabBar();
  },
  onReady() {
    if (this.inviter) {
      uni.setStorageSync("__inviter", this.inviter);
    }
  },
  methods: {
    ...mapActions("user", ["login", "signup", "getVerifyCode", "profile"]),
    formSubmit(e) {
      if (this.register && !this.msgId) {
        uni.showToast({
          title: "请获取验证码",
          duration: 5000
        });
        return;
      }
      const { value } = e.detail;
      const regExp = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,21}$/;
      if (
        value.password == "" ||
        value.mobile == "" ||
        (this.register && value.verifyCode == "")
      ) {
        uni.showToast({
          title: "手机号或密码不能为空",
          duration: 5000
        });
        return;
      } else if (!regExp.test(value.password)) {
        uni.showToast({
          title: "密码格式有误",
          duration: 5000
        });
        return;
      }
      if (this.inviter) {
        value.inviter = this.inviter;
      }

      uni.showLoading({ title: "加载中", mask: true });
      const action = this.register ? this.signup : this.login;
      action({
        ...value,
        verifyCode: `${this.msgId}|${value.verifyCode}`
      }).then(msg => {
        uni.hideLoading();

        uni.removeStorageSync("__inviter");
      });
    },
    sendSMS() {
      if (!this.unsend) return;

      uni.showLoading({ title: "加载中", mask: true });
      this.unsend = false;
      setTimeout(() => (this.unsend = true), 60000);
      this.getVerifyCode({ mobile: this.mobile }).finally(() =>
        uni.hideLoading()
      );
    },
    setRegister() {
      this.register = true;
    }
  }
};
</script>

<style>
.login {
  height: 100vh;
  width: 100vw;
  background: #ffffff;
}
.logo-box .cu-avatar {
  margin: 80upx auto;
  width: 180upx;
  height: 180upx;
}
.cu-form-group {
  background: #fff0f0;
  border-radius: 50upx;
  border: none;
  width: 90vw;
  margin: 20upx auto;
  min-height: 80upx;
}
.agreement {
}
</style>
