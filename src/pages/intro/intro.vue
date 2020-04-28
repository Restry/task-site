<template>
  <view class="intro">
    <cu-custom bg-color="bg-gradual-blue" class="nav-bar" :isBack="true">
      <block slot="backText">返回</block>
      <block slot="content">编辑资料</block>
    </cu-custom>

    <!-- 头像 -->
    <!-- <view class="cu-form-group">
      <view class="title">头像</view>
      <view class="cu-avatar radius bg-gray">
        <image src="../../static/logo.png" mode="widthFix" />
      </view>
    </view> -->

    <form @submit="formSubmit">
      <!-- list1 -->
      <view class="cu-list menu solid-top margin-top-sm">
        <view class="cu-item">
          <view class="content">
            <text class="text-black">ID</text>
          </view>
          <view class="action">
            <text class="text-grey">{{user.id}}</text>
          </view>
        </view>
        <!-- 手机号 -->
        <view class="cu-item">
          <view class="content">
            <text class="text-black">手机号</text>
          </view>
          <view class="action">
            <text class="text-grey">{{user.mobile}}</text>
          </view>
        </view>

        <view class="cu-item">
          <view class="content">
            <text class="text-black">昵称</text>
          </view>
          <view class="action">
            <input class="text-grey" :value="user.name" name="name" />
          </view>
        </view>

        <!-- 性别 -->
        <view class="cu-item">
          <view class="content">
            <text class="text-black">性别</text>
          </view>
          <view class="action">
            <input class="text-grey" :value="user.sex" name="sex" />
          </view>
        </view>

        <!-- 生日 -->
        <!-- <view class="cu-item">
          <view class="content">
            <text class="text-black">生日</text>
          </view>
          <view class="action">
            <text class="text-grey">1993-08-09</text>
          </view>
        </view> -->

        <!-- 邮箱 -->
        <view class="cu-item">
          <view class="content">
            <text class="text-black">邮箱</text>
          </view>
          <view class="action">
            <input class="text-grey" :value="user.email" name="email" />
          </view>
        </view>


        <!-- 居住地 -->
        <view class="cu-item">
          <view class="content">
            <text class="text-black">居住地</text>
          </view>
          <view class="action">
            <input class="text-grey" :value="user.location" name="location" />
          </view>
        </view>

        <view class="padding flex flex-direction">
          <button class="cu-btn bg-blue margin-tb-sm lg" form-type="submit">提 交</button>
        </view>
      </view>
    </form>
  </view>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  data() {
    return {
      imgList: ["https://ossweb-img.qq.com/images/lol/img/champion/Taric.png"]
    };
  },
  computed: {
    ...mapState("user", ["user"])
  },
  methods: {
    ...mapActions("user", ["updateUserInfo"]),
    formSubmit(e) {
      console.log(
        "form发生了submit事件，携带数据为：" + JSON.stringify(e.detail.value)
      );

      this.updateUserInfo(e.detail.value);
    },
    ViewImage(e) {
      uni.previewImage({
        urls: this.imgList,
        current: e.currentTarget.dataset.url
      });
    },
    DelImg(e) {
      uni.showModal({
        title: "召唤师",
        content: "确定要删除这段回忆吗？",
        cancelText: "再看看",
        confirmText: "再见",
        success: res => {
          if (res.confirm) {
            this.imgList.splice(e.currentTarget.dataset.index, 1);
          }
        }
      });
    },
    ChooseImage() {
      uni.chooseImage({
        count: 4, //默认9
        sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album"], //从相册选择
        success: res => {
          if (this.imgList.length != 0) {
            this.imgList = this.imgList.concat(res.tempFilePaths);
          } else {
            this.imgList = res.tempFilePaths;
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.page {
  padding-bottom: 100upx;
}
.intro {
  .cu-item {
    .action {
      .text-grey {
        text-align: right;
      }
    }
  }
}
</style>
