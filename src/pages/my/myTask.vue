<template>
  <view class="page-nobar">
    <!-- 导航栏 -->
    <cu-custom bg-color="bg-gradual-blue" class="nav-bar" :isBack="true">
      <block slot="backText">返回</block>
      <block slot="content">我的任务</block>
    </cu-custom>

    <view class="cu-list menu solid-top margin-top-xs">
      <view v-for="item in list" :key="item._id">
        <view class="cu-item">
          <navigator :url="`../taskInfo/taskInfo?id=${item.taskId}`">
            <view class="content">
              <text class="cuIcon-circlefill text-grey"></text>
              <text class="text-grey">{{item.taskTitle}}</text>
              
              <text class="text-grey text-sm cuIcon-right"></text>
              <text class="text-grey">{{dayjs(item.created).fromNow()}}</text>
              <text
                class="text-green"
                v-if="!audit && (item.stage==4)"
              >已完成</text>
            </view>
          </navigator>
        </view>

        <view class="cu-sub-list" v-if="audit">
          <view
            class="cu-sub-list-item"
            v-for="registry in item.registration"
            v-if="registry.stage==3"
            :key="registry.userId"
            @click="taskInfoAudit(item._id,registry.userId )"
          >
            <text class="text-grey">{{registry.name}}</text>
            <text class="text-green">已上传完成</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import request from "../../utils/request";
import { mapState } from "vuex";
import { dayjs } from '@/utils/tools'

export default {
  data() {
    return {
      list: [],
      audit: false
    };
  },
  computed: {
    ...mapState("user", ["user"])
  },
  methods: {
    dayjs,
    taskInfoAudit(taskId, userId) {
      uni.navigateTo({
        url: `../taskInfo/taskInfo?id=${taskId}&userId=${userId}`
      });
    }
  },
  onReady(){
    console.log('onReady');
  },
  onLoad(option) {
    const { _id } = this.user;
    this.audit = typeof option.audit !== "undefined";

    const params = {
      $sortdesc: "modified",
      userId: _id
    };
    // option.audit
    //   ? (params["registration.stage"] = 3)
    //   : (params["registration.userId"] = _id);

    request
      .get("/api/registration", { params })
      .then(({ data }) => {
        this.list = data;
      })
      .catch(err => {
        console.log(err);
      });
  }
};
</script>

<style lang="scss" scoped>
.cu-sub-list {
  padding-left: 40upx;
  background-color: #fff;
  .cu-sub-list-item {
    min-height: 80upx;
    line-height: 80upx;
    border-bottom: 2upx solid #ccc;
  }
}
</style>
