<template>
  <view class="page">
    <!-- 导航栏 -->
    <cu-custom bg-color="bg-gradual-blue" :isBack="false">
      <block slot="backText">返回</block>
      <block slot="content">消息</block>
    </cu-custom>

    <view class="cu-list menu-avatar">
      <!-- 			
				<view class="cu-item move-box-0" data-target="move-box-0"
				 @touchstart="ListTouchStart" @touchmove="ListTouchMove" 
				 @touchend="ListTouchEnd" >
					<view class="cu-avatar round lg" 
					style="backgroundImage:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big21002.jpg)">
						<view class="cu-tag badge">99+</view>
					</view>
					<view class="content">
						<view>
							<view class="text-cut">伊泽瑞尔</view>
							<view class="cu-tag round bg-orange sm">Android</view>
						</view>
						<view class="text-gray text-sm">
							<text class="cuIcon-infofill text-red  margin-right-xs"></text> 
							消息未送达
						</view>
					</view>
					<view class="action">
						<view class="text-grey text-xs">22:20</view>
						<view class="cu-tag round bg-grey sm">5</view>
					</view>
					<view class="move">
						<view class="bg-grey">置顶</view>
						<view class="bg-red">删除</view>
					</view>
				</view>			
      -->

      <view
        class="cu-item"
        :class="modalName=='move-box-'+ index?'move-cur':''"
        v-for="(item,index) in user.notices"
        :key="index"
        @touchstart="ListTouchStart"
        @touchmove="ListTouchMove"
        @touchend="ListTouchEnd"
        :data-target="'move-box-' + index"
      >
        <view
          class="cu-avatar round lg"
          @tap="MsgChat"
          :style="[{backgroundImage:'url(https://ossweb-img.qq.com/images/lol/web201310/skin/big2100'+ (index+2) +'.jpg)'}]"
        >
          <!-- <view class="cu-tag badge">99+</view> -->
        </view>
        <view class="content">
          <view class="text-grey">{{item.taskTitle}}</view>
          <view class="text-gray text-sm">
            <text :class="`cuIcon-infofill margin-right-xs ${(item.category.indexOf('成功')!=-1||item.category.indexOf('通过')!=-1) && 'text-green'}`">{{item.category}}</text>
            {{item.message}}
          </view>
        </view>
        <view class="action">
          <view class="text-grey text-xs">{{dayjs(item.created).fromNow()}}</view>
          <!-- <view class="cu-tag round bg-grey sm "></view> -->
        </view>
        <view class="move">
          <!-- <view class="bg-grey">置顶</view> -->
          <view class="bg-red">删除</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState } from "vuex";
import { dayjs } from '@/utils/tools';

export default {
  data() {
    return {
      modalName: null,
      listTouchStart: 0,
      listTouchDirection: null,
      msgMapping: {
        审核通过: "text-green",
        审核失败: "text-red"
      }
    };
  },
  computed: {
    ...mapState("user", ["user"])
  },
  methods: {
    dayjs,
    // ListTouch触摸开始
    ListTouchStart(e) {
      this.listTouchStart = e.touches[0].pageX;
    },

    // ListTouch计算方向
    ListTouchMove(e) {
      this.listTouchDirection =
        e.touches[0].pageX - this.listTouchStart > 0 ? "right" : "left";
    },

    // ListTouch计算滚动
    ListTouchEnd(e) {
      if (this.listTouchDirection == "left") {
        this.modalName = e.currentTarget.dataset.target;
      } else {
        this.modalName = null;
      }
      this.listTouchDirection = null;
    },
    MsgChat(e) {
      // uni.navigateTo({
      // 	url: '../chat/chat'
      // })
    }
  }
};
</script>

<style>
</style>
