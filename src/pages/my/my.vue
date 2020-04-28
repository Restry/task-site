<template>
  <view class="page-nobar">
    <!-- 导航栏 -->
    <cu-custom bg-color="bg-gradual-blue" class="nav-bar" :isBack="false">
      <block slot="backText">返回</block>
      <block slot="content">我的</block>
    </cu-custom>

    <view class="my-center" v-if="user._id">
      <view class="grid col-1">
        <!-- 头像 -->
        <view class="padding-lr-lg bg-gradual-blue padding-top-lg padding-bottom-sm logo-box">
          <!-- list -->
          <view class="cu-list menu-avatar">
            <view class="cu-item">
              <view class="cu-avatar round lg" :style="`background-image:url(${user.avatar});`">
                <view class="cu-tag badge">Lv{{user.level.id}}</view>
              </view>
              <view class="content">
                <view class="text-grey">
                  <view class="text-cut text-black text-bold">{{user.name}}</view>
                  <view class="cu-tag round bg-orange sm">{{user.level.name}}</view>
                </view>

                <view class="text-gray text-md flex">
                  <view class="text-cut">ID：{{user.id}}</view>
                </view>
                <view class="text-gray text-md flex">
                  <view class="cu-tag">{{user.points}}分</view>
                  <view class="cu-tag">{{user.sex}}</view>
                  <view class="cu-tag">{{user.location}}</view>
                </view>
              </view>
              <view class="action" @tap="intro">
                <!-- <view class="text-grey text-xs">22:20</view> -->
                <view class="cuIcon-right text-gray"></view>
              </view>
            </view>
          </view>
          <!-- end list -->

          <view class="padding-sm bg-white">
            <view class="flex">
              <text
                class="cuIcon-roundcheckfill text-green margin-left-sm"
              >Lv{{user.level.id}} {{user.level.name}}</text>
            </view>
            <view class="flex margin-top-xs">
              <view class="cu-progress round">
                <view class="bg-green" :style="user.levelPercentStyle"></view>
              </view>
              <text class="margin-left">{{user.levelPercent}}%</text>
            </view>
          </view>
        </view>

        <!-- 我的钱包 -->
        <view class="cu-bar wallet-bar bg-white solid-bottom margin-top-xs">
          <view class="action">
            <text class="cuIcon-title text-blue"></text>我的钱包
          </view>
        </view>
        <view class="padding bg-white">
          <view class="flex">
            <view class="flex-sub padding-xs text-center solid-right">
              <view
                class="text-lg text-bold margin-bottom-xs"
              >{{fixedIntger(user.availableBalance,2)}}</view>
              <text class="text-sm text-gray">余额</text>
            </view>
            <view class="flex-sub padding-xs text-center solid-right">
              <view
                class="text-lg text-bold margin-bottom-xs"
              >{{(user.bounty&&user.bounty.total)||0}}</view>
              <text class="text-sm text-gray">进行中</text>
            </view>
            <view class="flex-sub padding-xs text-center solid-right">
              <view
                class="text-lg text-bold margin-bottom-xs"
              >{{(fixedIntger(user.bounty&&user.bounty.amount,2))||0}}</view>
              <text class="text-sm text-gray">任务金</text>
            </view>
            <view class="flex-sub padding-xs text-center solid-right">
              <view class="text-lg text-bold margin-bottom-xs">{{fixedIntger(user.freezeBail)}}</view>
              <text class="text-sm text-gray">冻结</text>
            </view>
            <!-- <view class="flex-sub padding-xs text-center text-sm">
              <view class="text-lg text-bold margin-bottom-xs">{{user.bail||0}}</view>
              <text class="text-sm text-gray">保证金</text>
            </view>-->
          </view>
        </view>
      </view>

      <!-- list -->
      <view class="cu-list menu solid-top margin-top-xs">
        <!-- <view class="cu-item" v-if="user.isAdmin">
          <navigator url="../plus/plus" class="content"> 
            <text class="cuIcon-circlefill text-grey"></text>
            <text class="text-grey">发布任务</text>
          </navigator>
          <view class="action">
            <text class="text-grey text-sm cuIcon-right"></text>
          </view>
        </view>

        <view class="cu-item" v-if="user.isAdmin">
          <navigator url="manager" class="content">
            <text class="cuIcon-discoverfill text-orange"></text>
            <text class="text-grey">管理中心</text>
          </navigator>
          <view class="action">
            <text class="text-grey text-sm cuIcon-right"></text>
          </view>
        </view> -->

        <view class="cu-item">
          <navigator url="invitation" class="content">
            <text class="cuIcon-discoverfill text-orange"></text>
            <text class="text-grey">我的邀请</text>
          </navigator>
          <view class="action">
            <text class="text-grey text-sm cuIcon-right"></text>
          </view>
        </view>

        <view class="cu-item">
          <navigator url="myTask" class="content">
            <text class="cuIcon-discoverfill text-orange"></text>
            <text class="text-grey">我的报名</text>
          </navigator>
          <view class="action">
            <text class="text-grey text-sm cuIcon-right"></text>
          </view>
        </view>

        <view class="cu-item" v-if="user.isAdmin">
          <navigator url="myTask?audit=1" class="content">
            <text class="cuIcon-discoverfill text-orange"></text>
            <text class="text-grey">我的审核</text>
          </navigator>
          <view class="action">
            <text class="text-grey text-sm cuIcon-right"></text>
          </view>
        </view>

        <view class="cu-item" @click="recharge">
          <navigator url="recharge" class="content">
            <text class="cuIcon-circlefill text-grey"></text>
            <text class="text-grey">充值</text>
          </navigator>
          <view class="action">
            <text class="text-grey text-sm cuIcon-right"></text>
          </view>
        </view>

        <view class="cu-item">
          <navigator url="withdraw" class="content">
            <text class="cuIcon-circlefill text-grey"></text>
            <text class="text-grey">提现</text>
          </navigator>
          <view class="action">
            <text class="text-grey text-sm cuIcon-right"></text>
          </view>
        </view>
        <view class="cu-item">
          <a :href="config.serviceUrl" class="content">
            <text class="cuIcon-circlefill text-grey"></text>
            <text class="text-grey">联系客服</text>
          </a>
          <view class="action">
            <text class="text-grey text-sm cuIcon-right"></text>
          </view>
        </view>

        <view class="cu-item" @click="logoutSystem">
          <view class="content">
            <text class="cuIcon-circlefill text-grey"></text>
            <text class="text-grey">注销登陆</text>
          </view>
          <view class="action">
            <text class="text-grey text-sm cuIcon-right"></text>
          </view>
        </view>
      </view>
    </view>

    <view v-else class="unauthorized" @click="gotoLogin">
      <text class="cuIcon-people text-blue"></text>
      <view class="h2 text-grey">点击这里登陆</view>
    </view>
  </view>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { fixedIntger } from "@/utils/tools";
var loginRes;
export default {
  data() {
    return {};
  },
  // mounted() {
  //   console.log('mounted');
  // },
  onReady: function() {
    this.profile();
    loginRes = this.checkLogin("../my/my", 1);

    if (!loginRes._id) {
      return;
    }
  },
  computed: {
    ...mapState("user", ["user", "config"])
  },
  methods: {
    ...mapActions("user", ["profile", "logout"]),
    recharge() {},
    fixedIntger,
    logoutSystem() {
      uni.showModal({
        title: "是否注销",
        content: "注销后需要重新登陆",
        success: res => {
          if (res.confirm) {
            this.logout().then(() => {
              this.gotoLogin();
              uni.clearStorageSync();
            });
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    },
    withdraw() {
      uni.showActionSheet({
        itemList: ["100", "500", "1000"],
        success: function(res) {
          console.log("选中了第" + (res.tapIndex + 1) + "个按钮");
        },
        fail: function(res) {
          console.log(res.errMsg);
        }
      });
    },
    intro() {
      uni.navigateTo({
        url: "../intro/intro"
      });
    },
    gotoLogin() {
      uni.navigateTo({
        url: "../login/login"
      });
    },
    contact() {
      uni.showModal({
        title: "联系客服",
        content: "请加QQ：1342432432423"
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.logo-box {
  /* min-height: 180upx; */
}
.logo-box .cu-item {
  min-height: 180upx;
}
.wallet-bar {
  min-height: 80upx;
}
.content {
  text-decoration: none;
}
.unauthorized {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  flex-direction: column;

  .cuIcon-people {
    font-size: 128px;
  }
  .h2 {
    font-size: 48upx;
  }
}
</style>
