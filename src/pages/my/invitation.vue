<template>
  <view class="page-nobar">
    <!-- 导航栏 -->
    <cu-custom bg-color="bg-gradual-blue" :isBack="true">
      <block slot="backText">返回</block>
      <block slot="content">邀请</block>
    </cu-custom>
    <view class="invitation">
      <h1 class="title">邀请好友注册得现金</h1>

      <view class="message">
        成功邀请一位好友注册我们， 双方各得
        <text class="price">1元现金</text>上不封顶，快去邀请吧
      </view>

      <view class="money">
        <image src="../../static/home/money.jpeg" />
      </view>

      <button class="cu-btn bg-grey shadow">邀请好友</button>
      <button class="cu-btn bg-blue shadow" @click="copyUrl">复制链接</button>

      <text class="link">{{user.invitationLink}}</text>
    </view>
    <!-- 下线 -->
    <view class="cu-bar bg-white solid-bottom margin-top-sm">
      <view class="action">
        <text class="cuIcon-title text-blue"></text>
        <text class="text-black text-bold">上线</text>
      </view>
    </view>
    <view class="bg-white padding-xs platform-cut">
      <user-list :users="user.parents" />
    </view>

    <!-- 下线 -->
    <view class="cu-bar bg-white solid-bottom margin-top-sm">
      <view class="action">
        <text class="cuIcon-title text-blue"></text>
        <text class="text-black text-bold">下线</text>
      </view>
    </view>
    <view class="bg-white padding-xs platform-cut">
      <user-list :users="user.subs" />
    </view>
  </view>
</template>

<script>
import h5Copy from "@/js_sdk/junyi-h5-copy/junyi-h5-copy.js";
import { mapState, mapActions, mapMutations } from "vuex";
import userList from "../../components/user-list";

export default {
  components: {
    userList
  },
  computed: {
    ...mapState("user", ["user"])
  },
  data() {
    return {};
  },
  onReady() {
    this.initUserReleation();
  },
  methods: {
    ...mapActions("user", ["initUserReleation"]),
    copyUrl() {
      const result = h5Copy(this.user.invitationLink);
      if (result === true) {
        uni.showToast({
          title: "复制成功"
        });
      } else {
        uni.showToast({
          title: "复制失败",
          icon: "none"
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.page-nobar {
  background-color: #fff;
  .invitation {
    text-align: center;
    .title {
      margin: 100upx 0;
    }
    .message {
      padding: 0 80upx;
      color: #ccc;

      .price {
        color: red;
      }
    }

    .cu-btn {
      margin: 20upx;
      padding: 40upx;
      font-size: 32upx;
    }
  }
}
</style>
