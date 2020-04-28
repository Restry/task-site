<template>
  <view class="cu-list menu-avatar">
    <view class="cu-item move-box-0" v-for="(user,index) in usersObj" :key="user._id">
      <view class="cu-avatar round lg" :style="`backgroundImage:url(${user.avatar})`">
        <view class="cu-tag badge">99+</view>
      </view>
      <view class="content">
        <view>
          <view class="text-cut">{{user.name}}</view>
        </view>
        <view class="text-gray text-sm">
          余额：{{user.balance}} 保证金：{{user.bail}}
          {{dayjs(user.created).format('YYYY/MM/DD')}}
          <text class="cuIcon-infofill text-red margin-right-xs"></text>
          {{user.points}}
        </view>
      </view>
      <view class="action">
        <view class="cu-tag round bg-orange sm">{{user.location}}</view>
        <view class="cu-tag round bg-grey sm">{{user.sex}}</view>
      </view>
      <view class="move">
        <view class="bg-grey">置顶</view>
        <view class="bg-red">删除</view>
      </view>
    </view>
  </view>
</template>

<script>
import { User } from "../store/user";
import { mapState } from 'vuex'
import { dayjs } from '@/utils/tools';

export default {
  computed: {
    ...mapState('user',['config']),
    usersObj() {
      return Array.isArray(this.users)
        ? this.users.map(user => new User(user, this.config))
        : [];
    }
  },
  props: {
    users: {
      type: Array,
      default: {}
    }
  },
  methods: {
    dayjs
  }
};
</script>

<style>
</style>
