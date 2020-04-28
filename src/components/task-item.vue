<template>
  <view class="task-item" @click="showTaskInfo">
    <view class="content">
      <view class="text-grey">
        <view class="text-cut">{{task.title}}</view>
      </view>
      <!-- <view class="text-gray text-sm flex">
              <view class="text-cut">
                37 人 已赚，剩余 7 个
              </view>
      </view>-->
      <!-- <view class="platform-cut">
                <image class="cu-platform round sm" src="../../static/platform/android.png" mode=""/>
                <image class="cu-platform round sm" src="../../static/platform/iphone.png" mode=""/>
                <image class="cu-platform round sm" src="../../static/platform/h5.png" mode=""/>
      </view>-->

      <view class="flex text-gray">
        <view class="cu-progress round">
          <view class="bg-green" :style="task.remainingStyle"></view>
        </view>
        <text class="margin-left">{{task.remaining}}%</text>
      </view>

      <view class="text-gray text-sm flex">
        <!-- <view class="cu-tag cu-cate bg-orange">{{task.category}}</view> -->
        <view class="cu-tag cu-cate bg-blue light">{{getLevelString(task.level)}}会员</view>
        <view class="cu-tag cu-cate bg-olive">{{task.earnPoint}}积分</view>
        <view class="cu-tag cu-cate bg-gradual-green">商户保金:{{task.trusteeship}}万</view>
      </view>
    </view>
    <view class="action text-right">
      <view class="text-grey text-sm text-cut">{{task.merchant}}</view>
      <view class="text-grey text-sm">剩{{task.total-task.useup}}</view>
      <view class="text-red text-lg">￥{{task.reward}}</view>
    </view>
  </view>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {
    task: {
      type: Object,
      default: {}
    }
  },
  computed:{
    ...mapGetters("user", ["getLevelString"]),
  },
  methods: {
    // 跳到任务详情
    showTaskInfo: function() {
      uni.navigateTo({
        url: "../taskInfo/taskInfo?id=" + this.task._id
      });
    }
  },
    mounted() { 
      // console.log("getters getLevelString", this.$store.getters.user.getLevelString(0));
    }
};
</script>

<style>
.cu-progress {
  height: 18upx;
}
.cu-list.menu-avatar .cu-item .text-right {
  text-align: right;
}
</style>
