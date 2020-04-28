<template>
  <view v-if="config._id" class="page">
    <!-- <view class="cu-bar bg-gradual-blue search fixed nav-bar">
      <view class="action" @tap="BackPage">
        <text class="cuIcon-back"></text>返回
      </view>
      <view class="content">任务详情</view>
      <view class="action" @tap="shareInfo">
        <text class="cuIcon-more"></text>
      </view>
    </view>-->

    <!-- 导航栏 -->
    <cu-custom bg-color="bg-gradual-blue" :isBack="true">
      <block slot="backText">返回</block>
      <block slot="content">任务详情</block>
    </cu-custom>

    <!-- <view class="cu-bar nav-bar"></view> -->

    <!-- 标题 -->
    <view class="cu-bar bg-white solid-bottom">
      <view class="action">
        <!-- <text class="cuIcon-title text-blue"></text> -->
        <text class="text-black text-bold text-lg">{{item.title}}</text>
      </view>
      <view class="action">
        <a :href="config.serviceUrl" target="_blank" style="text-decoration: none;">
          <text class="cuIcon-service text-green text-xs">客服</text>
        </a>
      </view>
    </view>

    <!-- 信息 -->
    <view class="cu-list menu-avatar">
      <view class="cu-item no-avatar user-box">
        <!-- <view
          class="cu-avatar radius lg"
          style="background-image:url(https://ossweb-img.qq.com/images/lol/img/champion/Taric.png);"
        >
          <view class="cu-tag badge">v1</view>
        </view>-->
        <view class="content">
          <view class="text-grey">
            <view class="cu-tag cu-cate bg-orange">{{item.category}}</view>
            <view class="cu-tag cu-cate bg-blue light">{{getLevelString(item.level)}}会员</view>
            <view class="cu-tag cu-cate bg-olive">{{item.earnPoint}}积分</view>
            <view class="cu-tag cu-cate bg-gradual-green">商户保金{{item.trusteeship}}万</view>
          </view>

          <view class="text-gray text-sm flex">
            <view class="text-grey">{{item.useup}} 人 已赚，剩余 {{item.remain}} 个</view>

            <view class="text-cut text-sm">【{{item.merchant}}】</view>
            <!-- <view class="text-cut text-sm">[{{new Date( item.created).toLocaleString()}}]</view> -->
          </view>

          <view class="flex text-gray">
            <view class="cu-progress round">
              <view class="bg-green" :style="item.remainingStyle"></view>
            </view>
            <text class="margin-left">{{item.remaining}}%</text>
          </view>
        </view>
        <view class="action">
          <view class="text-grey text-sm">ID:{{item.id}}</view>

          <view class="text-red text-bold text-lg">￥{{item.reward}}</view>
        </view>
      </view>
    </view>

    <!-- 状态 -->
    <view class="bg-white padding-xs solid-bottom">
      <view class="grid margin-bottom text-center col-4">
        <view class="text-center solid-left padding-tb-sm">
          <text class="text-bold text-lg">{{item.useup}}人</text>
          <text class="block text-grey text-xs margin-top-xs">已完成</text>
        </view>

        <view class="text-center solid-left padding-tb-sm">
          <text class="text-bold text-lg">{{dayjs(item.created).fromNow()}}</text>
          <text class="block text-grey text-xs margin-top-xs">创建时间</text>
        </view>
        <view class="text-center solid-left padding-tb-sm">
          <text class="text-bold text-lg">{{item.reviewTime}}天</text>
          <text class="block text-grey text-xs margin-top-xs">审核周期</text>
        </view>
        <view class="text-center solid-left padding-tb-sm">
          <text class="text-bold text-lg">￥{{item.trusteeship}}</text>
          <text class="block text-grey text-xs margin-top-xs">托管金额</text>
        </view>
      </view>
    </view>

    <!-- 任务进度 -->
    <view class="cu-bar bg-white solid-bottom margin-top-xs">
      <view class="action">
        <text class="cuIcon-title text-blue"></text>
        <text class="text-black text-bold">任务进度</text>
      </view>
    </view>
    <view class="bg-white padding">
      <view class="cu-steps">
        <view
          class="cu-item"
          :class="index>getStage()?'':'text-blue'"
          v-for="(num,index) in numList"
          :key="index"
        >
          <text
            class="num"
            :class="(index==3&&item.registry&&item.registry.decide=='fail')?'err':''"
            :data-index="index + 1"
          ></text>
          {{num.name}}
        </view>
      </view>
    </view>

    <!-- 设备 -->
    <view class="cu-bar bg-white solid-bottom margin-top-sm">
      <view class="action">
        <text class="cuIcon-title text-blue"></text>
        <text class="text-black text-bold">操作设备</text>
      </view>
    </view>
    <view class="bg-white padding-xs platform-cut">
      <image class="cu-platform round sm" src="../../static/platform/android.png" mode="widthFix" />
      <image class="cu-platform round sm" src="../../static/platform/iphone.png" mode="widthFix" />
      <image class="cu-platform round sm" src="../../static/platform/h5.png" mode="widthFix" />
    </view>

    <!-- 相关地址 -->
    <view class="cu-bar bg-white solid-bottom margin-top-sm" @click="copyUrl">
      <view class="action">
        <text class="cuIcon-title text-blue"></text>
        <text class="text-black text-bold">相关地址</text>
        <text class="text-grey text-sm">[点击复制]</text>
      </view>
    </view>
    <view class="bg-white padding-sm padding-tb-sm" @click="copyUrl">
      <text>{{item.url}}</text>
    </view>

    <!-- 任务说明 -->
    <view class="cu-bar bg-white solid-bottom margin-top-sm">
      <view class="action">
        <text class="cuIcon-title text-blue"></text>
        <text class="text-black text-bold">任务说明</text>
      </view>
    </view>
    <view class="bg-white padding-sm padding-tb-sm">
      <text>{{item.requirements}}</text>
    </view>

    <!-- 任务步骤 -->
    <view class="cu-bar bg-white solid-bottom margin-top-sm">
      <view class="action">
        <text class="cuIcon-title text-blue"></text>
        <text class="text-black text-bold">任务步骤</text>
        <text class="text-grey text-sm">[点击图片后长按保存]</text>
      </view>
    </view>
    <view class="bg-white padding-sm padding-tb-sm">
      <view class v-for="(stage, index) in item.stages" :key="stage.title">
        <view class="cu-tag round bg-blue margin-right-xs">{{index+1}}</view>
        <text>{{stage.title}}</text>
        <view class="margin-bottom margin-top-xs text-center padding-xs">
          <!-- <view class="text-center solid">
            <image :src="BaseURL + (stage.urls&&stage.urls[0].url)" mode="aspectFit" @click="previewImage(stage.urls.map(a=>a.url))" />
            <view class="cu-tag badge bg-orange" style="padding:10px;">示例图</view>
          </view>
          <view class="text-center align-center solid">
         
          </view>-->

          <!-- 轮播 -->
          <swiper
            class="screen-swiper"
            :class=" 'round-dot'"
            :indicator-dots="true"
            :circular="true"
            :autoplay="true"
            interval="5000"
            duration="500"
            @click="previewImage(stage.urls.map(a=>a.url))"
          >
            <swiper-item v-for="(item,index) in stage.urls" :key="index">
              <image :src="BaseURL+item.url" mode="aspectFit" />
            </swiper-item>
          </swiper>
        </view>
      </view>
    </view>

    <!-- 上传验证 -->
    <view class="cu-bar bg-white solid-bottom margin-top-sm" v-if="item.registry">
      <view class="action">
        <text class="cuIcon-title text-blue"></text>
        <text class="text-black text-bold">上传验证</text>
      </view>
    </view>
    <view class="bg-white padding-sm padding-tb-sm" v-if="item.registry">
      <view class v-for="(stage,index) in uploadedStages" :key="stage.title">
        <view class="cu-tag round bg-blue margin-right-xs">{{index+1}}</view>
        <text>{{stage.title}}</text>
        <view class="grid margin-bottom margin-top-xs text-center padding-xs">
          <view class="uni-uploader-body">
            <view class="uni-uploader__files">
              <block v-for="(image,i) in stage.assignment.urls" :key="i">
                <view class="uni-uploader__file">
                  <image
                    class="uni-uploader__img"
                    :src="BaseURL+image"
                    :data-src="BaseURL+image"
                    @tap="previewImage(stage.assignment.urls, i)"
                  />

                  <view
                    class="cuIcon-close text-red"
                    @click="removeAssignmentImage(index,image, stage.assignment)"
                  ></view>
                </view>
              </block>
              <view class="uni-uploader__input-box">
                <view
                  class="uni-uploader__input"
                  @tap="uploadAssignStageImage(index, stage.assignment)"
                ></view>
              </view>
            </view>
          </view>

          <!-- <view class="text-center solid">
            <image
              :src="getAssignedImage(index)"
              mode="widthFix"
              @click="previewImage(stage.urls)"
            />
            <view class="cu-tag badge bg-orange" style="padding:10px;">上传图</view>
          </view>
          <view class="text-center align-center solid" v-if="item.registry&&!approved">
            <image
              @click="uploadAssignStageImage(index)"
              src="../../static/upload.png"
              mode="widthFix"
              class="margin-top-lg"
              style="width: 120upx;height: 120upx;"
            />
          </view>-->
        </view>
      </view>
    </view>

    <!-- 参与者 -->
    <view class="cu-bar bg-white solid-bottom margin-top-sm">
      <view class="action">
        <text class="cuIcon-title text-blue"></text>
        <text class="text-black text-bold">参与者</text>
      </view>
    </view>
    <view class="bg-white padding-xs platform-cut">
      <view class="cu-list menu-avatar">
        <view
          class="cu-item move-box-0 no-avatar"
          v-for="(user) in item.registration"
          :key="user.userId"
        >
          <!-- <view class="cu-avatar round lg" :style="`backgroundImage:url(${user.avatar})`">
            <view class="cu-tag badge">99+</view>
          </view>-->
          <view class="content">
            <view>
              <view class="text-cut">{{user.name}}</view>
              <view class="cu-tag round bg-grey sm">{{dayjs(user.created).fromNow()}}</view>
            </view>
          </view>
          <view class="action">
            <view class="text-gray text-sm">
              <text
                class="cuIcon-infofill margin-right-xs"
                :class="user.stage==4? 'text-green': 'text-yellow'"
              ></text>
              {{config.taskEnum[user.stage-1]}}
            </view>
          </view>
          <view class="move">
            <view class="bg-grey">置顶</view>
            <view class="bg-red">删除</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 留白 -->
    <view class="margin-top-footer"></view>

    <!-- 底部 -->
    <view class="cu-bar bg-white tabbar border shop fixed-footer solid-top">
      <button class="action" open-type="contact" @click="audit" v-if="user.isAdmin&&needApproved">
        <!-- TODO:　 -->
        <view class="cuIcon-service text-green">
          <view class="cu-tag badge" v-show="!approved"></view>
        </view>审核
      </button>
      <!-- <view class="bg-blue submit" @click="enroll">审核</view> -->
      <!-- <view class="action text-orange">
        <view class="cuIcon-favorfill"></view>已收
      </view>-->

      <view class="action solid-right">
        <!-- <view class="cuIcon-cart">
					<view class="cu-tag badge">99</view>
        </view>-->
        <view class="text-center text-bold margin-bottom-xs text-lg">{{item.remain}}</view>剩余名额
      </view>
      <view class="action">
        <view class="text-center text-bold margin-bottom-xs text-lg">{{item.bail}}</view>押金
      </view>
      <view
        :class="`enrolled ${actionButton.style} submit`"
        v-if="item.registry||item.isFull"
      >{{actionButton.text}}</view>
      <view class="bg-blue submit" v-else @click="enroll">立即报名</view>
    </view>
  </view>
  <view class="cu-load loading" v-else></view>
</template>

<script>
import share from "@/commons/share.js";
import request, { BaseURL } from "../../utils/request";
import { Task } from "../../store/task";
import { mapActions, mapState, mapGetters } from "vuex";
import h5Copy from "@/js_sdk/junyi-h5-copy/junyi-h5-copy.js";
import userList from "../../components/user-list";
import { dayjs } from "@/utils/tools";

export default {
  components: { userList },
  data() {
    return {
      numList: [
        { name: "报名" },
        { name: "操作" },
        { name: "上传验证" },
        { name: "等审核" },
        { name: "完成" }
      ],
      // num: 0,
      scroll: 0,

      option: {},
      item: {},
      pageOption: {},
      taskId: "",
      userId: "",
      BaseURL
    };
  },
  computed: {
    ...mapState("user", ["user", "config"]),
    ...mapGetters("user", ["getLevelString"]),
    // registry() {
    //   return this.userId && this.item.registration
    //     ? this.item.registration.find(a => a.userId == this.userId)
    //     : null;
    // },
    approved() {
      return this.item.registry && this.item.registry.stage == 4;
    },
    actionButton() {
      let btn = this.approved
        ? { text: "已审核通过", style: "bg-green" }
        : { text: "已报名", style: "bg-green" };

      btn =
        this.item.isFull && this.item.registry == null
          ? { text: "已满额", style: "bg-red" }
          : btn;

      return btn;
    },
    needApproved() {
      return this.item.registry && this.item.registry.stage == 3;
    },

    uploadedStages() {
      return this.item.stages.map((s, i) => {
        return {
          ...s,
          assignment:
            this.item.registry.assignments.find(a => a.id == `S${i}`) || {} // 获取上传后的指派
        };
      });
    }
  },
  onLoad(option) {
    console.log("option", option); //打印出上个页面传递的参数。
    this.taskId = option.id;
    this.userId = option.userId || (this.user && this.user._id) || "";

    this.loadTask();
  },
  onBackPress() {
    //监听back键，关闭弹出菜单
    // if (this.shareObj.shareMenu.isVisible()) {
    //   this.shareObj.shareMenu.hide();
    //   this.shareObj.alphaBg.hide();
    //   return true;
    // }
  },
  methods: {
    ...mapActions("task", [
      "enrollTask",
      "approveTask",
      "updateTaskAssignment"
    ]),
    dayjs,

    uploadAssignStageImage(stageId, oldAssignment) {
      uni.chooseImage({
        count: 3, //默认9
        sizeType: ["compressed"], //"original",
        success: chooseImageRes => {
          const tempFilePaths = chooseImageRes.tempFilePaths;

          // // 手动批量上传
          const allImages = tempFilePaths.map(
            file =>
              new Promise((resolve, reject) =>
                uni.uploadFile({
                  filePath: file,
                  url: BaseURL + "/upload/images", //仅为示例，非真实的接口地址
                  name: "photo",
                  success: ({ data }) => resolve(JSON.parse(data))
                })
              )
          );

          Promise.all(allImages).then(result => {
            this.updateTaskAssignment({
              taskId: this.item._id,
              userId: this.userId,
              stageId: "S" + stageId,
              urls: result.map(a => a.imageUrl).concat(oldAssignment.urls || [])
            }).then(() => this.loadTask());
          });

          // const uploadTask = uni.uploadFile({
          //   url: BaseURL + "/upload/task-assignment", //仅为示例，非真实的接口地址
          //   files: chooseImageRes.tempFiles.map(f => ({
          //     name: f.name,
          //     uri: f.path
          //   })),
          //   filePath: tempFilePaths[0],
          //   name: "image",
          //   formData: {
          //     taskId: this.item._id,
          //     userId: this.userId,
          //     stageId: "S" + stageId
          //   },
          //   success: uploadFileRes => {
          //     console.log(uploadFileRes.data);

          //     this.loadTask();
          //   }
          // });

          // uploadTask.onProgressUpdate(res => {
          //   console.log("上传进度" + res.progress);
          //   console.log("已经上传的数据长度" + res.totalBytesSent);
          //   console.log(
          //     "预期需要上传的数据总长度" + res.totalBytesExpectedToSend
          //   );

          //   // 测试条件，取消上传任务。
          //   // if (res.progress > 50) {
          //   //   uploadTask.abort();
          //   // }
          // });
        }
      });
    },
    removeAssignmentImage(stageIndex, imageUrl, assignment) {
      this.updateTaskAssignment({
        taskId: this.item._id,
        userId: this.userId,
        stageId: "S" + stageIndex,
        urls: assignment.urls.filter(a => a != imageUrl)
      }).then(() => this.loadTask());
    },
    previewImage(urls, current) {
      uni.previewImage({
        current,
        urls: urls.map(a => BaseURL + a)
      });
    },
    copyUrl() {
      const result = h5Copy(this.item.url);
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
    },
    getStage() {
      if (!this.item.registry) return 0;

      // const stage = this.item.registry ? this.item.registry.stage : 0;
      // if (this.item.stages.length === this.item.registry.assignments.length) {
      //   return stage + 1;
      // }
      return this.item.registry.stage;
    },

    audit() {
      if (this.approved) return;

      // 审核通过
      uni.showModal({
        title: "审核通过",
        content: "是否确认审核通过？",
        success: res => {
          if (res.confirm) {
            console.log("用户点击确定");
            this.approveTask({ taskId: this.taskId, userId: this.userId }).then(
              this.loadTask.bind(this)
            );
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    },

    async loadTask() {
      try {
        uni.showLoading({ title: "加载中", mask: true });

        const { data } = await request.get("task/query", {
          params: { _id: this.taskId, userId: this.userId }
        });
        if (data._id) {
          this.item = new Task(data);
          uni.hideLoading();
        }
      } catch (error) {
        console.error("error", error); //打印出上个页面传递的参数。
        uni.hideLoading();
      }
    },
    getAssignedImage(index) {
      const placeholder = "../../static/demo.png";
      if (
        this.item.registry &&
        this.item.registry.assignments &&
        this.item.registry.assignments.length > index
      ) {
        const assignItem = this.item.registry.assignments.find(
          a => a.id === "S" + index
        );
        return assignItem ? BaseURL + assignItem.url : placeholder;
      }
      return placeholder;
    },
    async enroll() {
      if (!this.user || !this.userId) {
        uni.showModal({
          content: "请登陆后再报名",
          showCancel: false
        });
        uni.navigateTo({
          url: "../login/login"
        });
        return;
      }

      const level = this.config.levels[this.item.level];
      if (
        this.user.level.id < this.item.level ||
        this.user.availableBalance < level.bail
      ) {
        uni.showModal({
          content: `等级未达到或保证金未达到${level.bail}，充值并领取任务`,
          showCancel: false
        });
        return;
      }
      await this.enrollTask([this.item._id]).then(() => this.loadTask());
    },
    BackPage() {
      uni.navigateBack({
        delta: 1
      });
    },
    // Share(){
    // 	uni.share({
    // 		provider: "qq",
    // 		scene: "WXSceneSession",
    // 		type: 1,
    // 		summary: "我正在使用HBuilderX开发uni-app，赶紧跟我一起来体验！",
    // 		success: function (res) {
    // 			console.log("success:" + JSON.stringify(res));
    // 		},
    // 		fail: function (err) {
    // 			console.log("fail:" + JSON.stringify(err));
    // 		}
    // 	});
    // },
    shareInfo() {
      let shareInfo = {
        href: "https://uniapp.dcloud.io",
        title: "分享测试",
        desc: "分享测试",
        imgUrl: "/static/logo.png"
      };
      let shareList = [
        {
          icon: "/static/sharemenu/wx.png",
          text: "微信好友"
        },
        {
          icon: "/static/sharemenu/pyq.png",
          text: "朋友圈"
        },
        {
          icon: "/static/sharemenu/weibo.png",
          text: "微博"
        },
        {
          icon: "/static/sharemenu/qq.png",
          text: "QQ"
        },
        {
          icon: "/static/sharemenu/copy.png",
          text: "复制"
        },
        {
          icon: "/static/sharemenu/more.png",
          text: "更多"
        }
      ];
      this.shareObj = share(shareInfo, shareList, function(index) {
        console.log("点击按钮的序号: " + index);
        let shareObj = {
          href: shareInfo.href || "",
          title: shareInfo.title || "",
          summary: shareInfo.desc || "",
          success: res => {
            console.log("success:" + JSON.stringify(res));
          },
          fail: err => {
            console.log("fail:" + JSON.stringify(err));
          }
        };
        switch (index) {
          case 0:
            shareObj.provider = "weixin";
            shareObj.scene = "WXSceneSession";
            shareObj.type = 0;
            shareObj.imageUrl = shareInfo.imgUrl || "";
            uni.share(shareObj);
            break;
          case 1:
            shareObj.provider = "weixin";
            shareObj.scene = "WXSenceTimeline";
            shareObj.type = 0;
            shareObj.imageUrl = shareInfo.imgUrl || "";
            uni.share(shareObj);
            break;
          case 2:
            shareObj.provider = "sinaweibo";
            shareObj.type = 0;
            shareObj.imageUrl = shareInfo.imgUrl || "";
            uni.share(shareObj);
            break;
          case 3:
            shareObj.provider = "qq";
            shareObj.type = 1;
            shareObj.imageUrl = shareInfo.imgUrl || "";
            uni.share(shareObj);
            break;
          case 4:
            uni.setClipboardData({
              data: shareInfo.href,
              complete() {
                uni.showToast({
                  title: "已复制到剪贴板"
                });
              }
            });
            break;
          case 5:
            plus.share.sendWithSystem({
              type: "web",
              title: shareInfo.title || "",
              thumbs: [shareInfo.imgUrl || ""],
              href: shareInfo.href || "",
              content: shareInfo.desc || ""
            });
            break;
        }
      });
      this.$nextTick(() => {
        this.shareObj.alphaBg.show();
        this.shareObj.shareMenu.show();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.user-box {
  min-height: 180upx;
}

.cu-platform {
  width: 50upx;
  height: 50upx;
  margin-left: 18upx;
}

.fixed-footer {
  width: 100vw;
  bottom: 0;
  left: 0;
  position: fixed;
}

.margin-top-footer {
  height: 120upx;
}

/* 上传 */
.uni-uploader {
  flex: 1;
  flex-direction: column;
}
.uni-uploader-head {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.uni-uploader-info {
  color: #b2b2b2;
}
.uni-uploader-body {
  margin-top: 16rpx;
}
.uni-uploader__files {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.uni-uploader__file {
  margin: 10rpx;
  width: 210rpx;
  height: 210rpx;
  position: relative;

  .cuIcon-close {
    position: absolute;
    top: 0;
    right: 0;
    background-color: #fff;
    width: 35px;
    height: 28px;
    line-height: 28px;
    font-weight: bolder;
    opacity: 0.8;
    font-size: 22px;
  }
}
.uni-uploader__img {
  display: block;
  width: 210rpx;
  height: 210rpx;
}
.uni-uploader__input-box {
  position: relative;
  margin: 10rpx;
  width: 208rpx;
  height: 208rpx;
  border: 2rpx solid #d9d9d9;
}
.uni-uploader__input-box:before,
.uni-uploader__input-box:after {
  content: " ";
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  background-color: #d9d9d9;
}
.uni-uploader__input-box:before {
  width: 4rpx;
  height: 79rpx;
}
.uni-uploader__input-box:after {
  width: 79rpx;
  height: 4rpx;
}
.uni-uploader__input-box:active {
  border-color: #999999;
}
.uni-uploader__input-box:active:before,
.uni-uploader__input-box:active:after {
  background-color: #999999;
}
.uni-uploader__input {
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}
</style>
