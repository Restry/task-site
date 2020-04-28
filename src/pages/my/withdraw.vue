<template>
  <view class="withdraw page-nobar" v-if="user._id">
    <cu-custom bg-color="bg-gradual-blue" class="nav-bar" :isBack="true">
      <block slot="backText">返回</block>
      <block slot="content">提现</block>
    </cu-custom>

    <!-- 头像 -->
    <view class="cu-form-group">
      <view class="title">可用余额{{!allow?`不足${config.drawLimit}元，暂不可提现`:''}}</view>
      <view class="radius bg-red" :class="allow&&'bg-green'">￥{{user.availableBalance}}</view>
    </view>

    <form @submit="formSubmit">
      <!-- list1 -->
      <view class="cu-list menu solid-top margin-top-sm">
        <view class="cu-item">
          <view class="content">
            <text class="text-black">账号</text>
          </view>
          <view class="action">
            <input
              class="text-grey"
              placeholder="请输入"
              :value="user.drawInfo?user.drawInfo.card:''"
              name="card"
              type="number"
            />
          </view>
        </view>
        <!-- 手机号 -->
        <view class="cu-item">
          <view class="content">
            <text class="text-black">姓名</text>
          </view>
          <view class="action">
            <input
              class="text-grey"
              placeholder="请输入"
              :value="user.drawInfo?user.drawInfo.name:''"
              name="name"
            />
          </view>
        </view>
        <view class="cu-item">
          <view class="content">
            <text class="text-black">银行</text>
          </view>
          <view class="action">
            <input
              class="text-grey"
              placeholder="请输入"
              :value="user.drawInfo?user.drawInfo.bank:''"
              name="bank"
            />
          </view>
        </view>
        <view class="cu-item">
          <view class="content">
            <text class="text-black">开户行</text>
          </view>
          <view class="action">
            <input
              class="text-grey"
              placeholder="请输入"
              :value="user.drawInfo?user.drawInfo.openBank:''"
              name="openBank"
            />
          </view>
        </view>
        <view class="cu-item">
          <view class="content">
            <text class="text-black">取现金额</text>
          </view>
          <view class="action">
            <input class="text-grey" v-model="money" placeholder="0" name="money" type="number" />
          </view>
        </view>

        <view class="padding flex flex-direction">
          <button
            class="cu-btn bg-blue margin-tb-sm lg"
            :disabled="(!allow||money<=0)"
            form-type="submit"
          >提 交</button>
        </view>
      </view>
    </form>

    <!-- 相关地址 -->
    <view class="cu-bar bg-white solid-bottom margin-top-sm">
      <view class="action">
        <text class="cuIcon-title text-blue"></text>
        <text class="text-black text-bold">温馨提示</text>
      </view>
    </view>
    <view class="bg-white padding-sm padding-tb-sm" @click="copyUrl">
      <ol>
        <li>请务必填写清楚开户银行具体名称，如：中国银行北京市海淀支行</li>
        <li>最低提现 10 元，手续费 0%。</li>
        <li>提现时，系统将自动扣除2%的红利给到你的推荐人，同样，你推荐的人在提现时一样返你2%，推荐越多红利越多。</li>
        <li>每天可提现， 24 小时到账</li>
      </ol>
    </view>

    <!-- 相关地址 -->
    <view class="cu-bar bg-white solid-bottom margin-top-sm">
      <view class="action">
        <text class="cuIcon-title text-blue"></text>
        <text class="text-black text-bold">提现明细</text>
      </view>
    </view>
    <view class="bg-white padding-sm padding-tb-sm" @click="copyUrl">
      <view class="cu-list menu">
        <view class="cu-item" v-for="item in details" :key="item._id">
          {{dayjs(item.created).fromNow()}}
          <text class="text-grey">金额：</text>
          <text class="text-red">{{item.money}}</text>
          <text class="cuIcon-title text-blue">状态</text>
          {{config.payEnum[item.status]}}
          {{dayjs(item.modified).fromNow()}}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapActions, mapState } from "vuex";
import request from "../../utils/request";
import { dayjs } from "../../utils/tools";

export default {
  data() {
    return {
      details: [],
      allow: false,
      money: ""
    };
  },
  computed: {
    ...mapState("user", ["user", "config"])
  },
  methods: {
    dayjs,
    ...mapActions("user", ["withdraw"]),
    formSubmit(e) {
      if (
        !e.detail.value.name ||
        !e.detail.value.bank ||
        !e.detail.value.card ||
        !e.detail.value.openBank
      ) {
        uni.showToast({
          title: "请输入正确金额及信息!",
          icon: "none",
          duration: 3000
        });
        return;
      }
      if (e.detail.value.money > this.user.availableBalance) {
        uni.showToast({
          title: "取现金额大于余额！",
          icon: "none",
          duration: 5000
        });
        return;
      }
      uni.showLoading({ title: "处理中...", mask: true });
      this.withdraw({ userId: this.user._id, ...e.detail.value }).then(item => {
        item && this.details.splice(0, 0, item);
        uni.showToast({
          title: "提交成功",
          icon: "success",
          duration: 3000
        });
      }).finally(() => uni.hideLoading());
    },
    onReady() {
      if (!this.user.drawInfo || !this.user.drawInfo.name) {
        uni.showToast({
          title: "请输入绑定银行卡信息！",
          icon: "none",
          duration: 3000
        });
      }

      request
        .get("/api/withdraw", {
          params: { userId: this.user._id, $sortdesc: "modified" }
        })
        .then(({ data }) => {
          this.details = data;
        });

      this.allow =
        this.config._id && this.user.availableBalance >= this.config.drawLimit;
    }
  }
};
</script>

<style lang="scss" scoped>
.withdraw {
  .radius {
    padding: 0 10upx;
  }
  .cu-item {
    .action {
      flex: 4;
      .text-grey {
        text-align: right;
      }
    }
  }
}
</style>
