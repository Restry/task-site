<template>
  <view class="page">
    <!-- 导航栏 -->
    <cu-custom bg-color="bg-gradual-blue" :isBack="true">
      <block slot="backText">返回</block>
      <block slot="content">添加任务</block>
    </cu-custom>

    <form @submit="formSubmit" @reset="formReset">
      <view class="cu-form-group">
        <view class="title">
          <text class="cuIcon-mobile text-orange"></text>
        </view>
        <input placeholder="标题" name="title" />
      </view>
      <view class="cu-form-group">
        <view class="title">
          <text class="cuIcon-mobile text-orange"></text>
        </view>
        <input placeholder="商家" name="merchant" />
      </view>

      <view class="cu-form-group">
        <view class="title">
          <text class="cuIcon-mobile text-orange"></text>
        </view>
        <input placeholder="类别" v-model="category" name="category" @click="pickCategory" disabled />
      </view>
      <view class="cu-form-group">
        <view class="title">
          <text class="cuIcon-mobile text-orange"></text>
        </view>
        <input placeholder="审核周期/天" type="number" name="reviewTime" />
      </view>
      <!-- <view class="cu-form-group">
        <view class="title">
          <text class="cuIcon-mobile text-orange">是否截图</text>
        </view>
        <switch name="screenshot" checked />
      </view>-->

      <view class="cu-form-group">
        <view class="title">
          <text class="cuIcon-mobile text-orange"></text>
        </view>
        <!-- <input placeholder="等级要求" type="number" name="level" /> -->
        <input placeholder="等级要求" v-model="level.name" name="level" @click="pickLevel" disabled />
      </view>
      <view class="cu-form-group">
        <view class="title">
          <text class="cuIcon-mobile text-orange"></text>
        </view>
        <input placeholder="任务奖励" type="number" name="reward" />
      </view>
      <view class="cu-form-group">
        <view class="title">
          <text class="cuIcon-mobile text-orange"></text>
        </view>
        <input placeholder="积分" type="number" name="points" />
      </view>
      <view class="cu-form-group">
        <view class="title">
          <text class="cuIcon-mobile text-orange"></text>
        </view>
        <input placeholder="总数量" type="number" name="total" />
      </view>
      <view class="cu-form-group">
        <view class="title">
          <text class="cuIcon-mobile text-orange"></text>
        </view>
        <input placeholder="托管金额" type="number" name="trusteeship" />
      </view>

      <view class="cu-form-group">
        <view class="title">
          <text class="cuIcon-mobile text-orange"></text>
        </view>
        <input placeholder="相关地址" name="url" />
      </view>

      <view class="cu-form-group">
        <view class="title">
          <text class="cuIcon-peoplelist text-orange"></text>
        </view>
        <textarea placeholder="需求" name="requirements" auto-height size="8" />
      </view>

      <view class="cu-form-group">
        <view class="title">
          <text class="cuIcon-peoplelist text-orange"></text>
        </view>
        <textarea placeholder="步骤,点加号添加图片" v-model="stageTitle" name="stages" auto-height />

        <view class="action" @click="addImage">
          <text class="cu-tag cuIcon-add text-while add-btn bg-olive"></text>
        </view>
      </view>

      <uni-steps :options="stages" direction="column" :active="0"></uni-steps>

      <view class="padding flex flex-direction">
        <button class="cu-btn bg-blue margin-tb-sm lg" form-type="submit">提 交</button>
        <button class="cu-btn bg-grey margin-tb-sm lg" type="default" @click="addRandomTask">添加测试任务</button>
      </view>
    </form>
  </view>
</template>

<script>
import { mapActions, mapState } from "vuex";
import UniCard from "../../components/uni-card/uni-card.vue";
import request, { BaseURL } from "../../utils/request";

export default {
  components: {
    UniCard
  },
  data() {
    return {
      category: "",
      level: "",
      stageTitle: "",
      stages: [],
      categories: [
        { name: "试玩游戏", icon: "cuIcon-cardboardfill text-red", badge: 0 },
        { name: "微信转发", icon: "cuIcon-recordfill text-orange" },
        { name: "简单关注", icon: "cuIcon-picfill text-yellow" },
        { name: "注册认证", icon: "cuIcon-noticefill text-olive" },
        { name: "下载试玩", icon: "cuIcon-upstagefill text-cyan" },
        { name: "网络投票", icon: "cuIcon-clothesfill text-blue" },
        { name: "网店推广", icon: "cuIcon-discoverfill text-purple" },
        { name: "问卷调查", icon: "cuIcon-questionfill text-mauve" }
      ]
    };
  },
  computed: {
    ...mapState("user", ["config"])
  },
  methods: {
    ...mapActions("task", ["newTask"]),
    addImage() {
      const id = Date.now();
      if (this.stageTitle == "") return;

      uni.chooseImage({
        count: 3,
        sizeType: ["compressed"],
        // sourceType: ["album"],
        success: res => {
          // // 预览图片
          // uni.previewImage({
          //   urls: res.tempFilePaths,
          // });
          console.log("预览图片", res);

          // setTimeout(() => {
          //   uni.uploadFile({
          //     files: res.tempFilePaths.map(f => ({ name: "photo", uri: f })),
          //     url: BaseURL + "/upload/images", //仅为示例，非真实的接口地址
          //     name: "photo",
          //     formData: {},
          //     success: () => {}
          //   });
          // }, 1000);

          // // debugger;
          // // 手动批量上传
          const allImages = res.tempFilePaths.map(
            file =>
              new Promise((resolve, reject) =>
                uni.uploadFile({
                  filePath: file,
                  url: BaseURL + "/upload/images", //仅为示例，非真实的接口地址
                  name: "photo",
                  formData: {},
                  success: ({ data }) => resolve(JSON.parse(data))
                })
              )
          );

          Promise.all(allImages).then(result => {
            this.stages.push({
              id,
              title: this.stageTitle,
              urls: result.map(a => BaseURL + a.imageUrl)
            });

            this.stageTitle = "";
          });
        }
      });
    },
    pickCategory() {
      uni.showActionSheet({
        itemList: this.categories.map(a => a.name),
        success: res => {
          console.log(
            "选中了第" + (res.tapIndex + 1) + "个按钮",
            this.categories[res.tapIndex]
          );
          this.category = this.categories[res.tapIndex].name;
        },
        fail: function(res) {
          console.log(res.errMsg);
        }
      });
    },
    pickLevel() {
      uni.showActionSheet({
        itemList: this.config.levels.map(a => a.name),
        success: res => {
          console.log("选中了第" + (res.tapIndex + 1) + "个按钮");
          this.level = this.config.levels[res.tapIndex];
        },
        fail: function(res) {
          console.log(res.errMsg);
        }
      });
    },
    formSubmit: function(e) {
      console.log(
        "form发生了submit事件，携带数据为：" + JSON.stringify(e.detail.value)
      );
      var formdata = e.detail.value;
      // uni.showModal({
      //   content: '表单数据内容：' + JSON.stringify(formdata),
      //   showCancel: false
      // });
      formdata.stages = this.stages;
      formdata.level = this.level.id;

      this.newTask(formdata);
    },
    formReset: function(e) {
      console.log("清空数据");
    },
    addRandomTask() {
      const tasksList = [];
      const ran = max => parseInt(Math.random() * max);
      this.config.levels.forEach(level => {
        const task = {
          title: `${level.name}任务标题${ran(1000)}`,
          merchant: "腾讯",
          category: this.categories[parseInt(Math.random() * 6)].name,
          reviewTime: ran(30),
          level: level.id,
          points: ran(10),
          reward: ran(100),
          total: ran(300),
          trusteeship: ran(100),
          url: "http://www.baidu.com",
          requirements: `必须通过连接砍价，并且有成功截图，否则一律不过。砍0元没关系。
                          每人每天只能帮3个人砍，今天砍价次数超出已经不能砍的无效。
                          任务截图至少要看到头像，截不到图可以从任务链接重新进去。
                          无图/不是帮我砍的图/看不到头像一律不通过，谢谢。`,
          stages: [
            {
              title: "测试任务步骤1",
              urls: [
                {
                  uid: "rc-upload-1586531034770-5",
                  name: "images-0fbf264147e0a.jpg",
                  status: "done",
                  url:
                    "https://www.xinyarenwu.com/uploads/20200401/79838c22adf2c2a50b7cc44e4b1af69f.jpg"
                }
              ]
            },
            {
              title: "必须通过连接砍价",
              urls: [
                {
                  uid: "rc-upload-1586531034770-5",
                  name: "images-0fbf264147e0a.jpg",
                  status: "done",
                  url:
                    "https://www.xinyarenwu.com/uploads/20200401/79838c22adf2c2a50b7cc44e4b1af69f.jpg"
                }
              ]
            }
          ],
          useup: 0,
          registration: []
        };

        tasksList.push(task);
      });

      request.post("/api/tasks", tasksList).then(({ data }) => {
        console.log("添加成功：", data);
        console.table(data.ops);
      });
    }
  }
};
</script>

<style lang="scss">
.cu-form-group {
  // background: #FFF0F0;
  border-radius: 20upx;
  border: none;
  width: 90vw;
  margin: 20upx auto;
  // min-height: 80upx;

  .action {
    .add-btn {
      padding: 20upx 36upx;
      border-radius: 60upx;
    }
  }
}
</style>
