<template>
  <view v-if="config._id">
    <!-- 搜索框 -->
    <view class="cu-bar search fixed bg-gradual-blue nav-bar">
      <view class="cu-avatar round" :style="`background-image:url(${user.avatar});`"></view>
      <view class="search-form round">
        <text class="cuIcon-search"></text>
        <input
          @focus="InputFocus"
          @blur="InputBlur"
          :adjust-position="false"
          @tap="search"
          type="text"
          placeholder="搜索任务"
          confirm-type="search"
        />
      </view>
      <view class="action">
        <!-- @tap="popup_bottom()" -->
        <!-- <text v-text="address">徐州</text>
        <text class="cuIcon-triangledownfill"></text>-->
      </view>
    </view>
    <!-- <view class="margin-top-bar"></view> -->

    <!-- 地区选择 -->
    <!-- <linkAddress ref="linkAddress" :height="height" @confirmCallback="confirmCallback()"></linkAddress> -->

    <scroll-view
      :scroll-y="true"
      class="scroll"
      :style="mainScrollStyle"
      @scrolltoupper="upper"
      @scrolltolower="lower"
    >
      <!-- 轮播 -->
      <swiper
        class="screen-swiper"
        :class="dotStyle?'square-dot':'round-dot'"
        :indicator-dots="true"
        :circular="true"
        :autoplay="true"
        interval="5000"
        duration="500"
      >
        <swiper-item v-for="(item) in config.indexBanner" :key="item.uid">
          <image :src="$BaseURL+item.url" mode="aspectFill" v-if="item.type=='image'" />
          <video
            :src="$BaseURL+item.url"
            autoplay
            loop
            muted
            :show-play-btn="false"
            :controls="false"
            objectFit="cover"
            v-if="item.type=='video'"
          ></video>
        </swiper-item>
      </swiper>

      <uni-notice-bar :show-icon="true" :scrollable="true" :single="true" :text="config.notices" />

      <!-- 等级 -->
      <view class="cu-list grid col-4 no-border">
        <view
          v-for="level in config.levels"
          class="cu-item"
          :key="level.name"
          @click="hallSwitch(level)"
        >
          <view
            class="cu-avatar round category-img"
            :style="`background-image:url(${level.icon});`"
          >
            <!-- <view class="cu-tag badge">99+</view> -->
          </view>
          <text>{{level.name}}</text>
        </view>
      </view>

      <!-- 		
				<view class="example-body">
					<uni-notice-bar :single="true" :show-icon="true" text="uni-app行业峰会频频亮相，开发者反响热烈!" />
					<uni-notice-bar :show-icon="true" text="8月12日DCloud受邀参加iWEB峰会后，9月19日DCloud CEO 王安在千人小程序峰会——见实大会，做了主题为《App和小程序，鱼与熊掌如何兼得？》的分享。" />
				</view>
		<view class="example-body">
			<uni-notice-bar :scrollable="true" :single="true" text="uni-app行业峰会频频亮相，开发者反响热烈!" />
			<uni-notice-bar :show-icon="true" :scrollable="true" :single="true" text="uni-app 1.6版正式发布，开发一次，同时发布iOS、Android、H5、微信小程序、支付宝小程序、百度小程序、头条小程序等7大平台。" />
			<uni-notice-bar :scrollable="true" text="8月12日DCloud受邀参加iWEB峰会后，9月19日DCloud CEO 王安在千人小程序峰会——见实大会，做了主题为《App和小程序，鱼与熊掌如何兼得？》的分享。" />
		</view>
      -->

      <!-- 活动 -->
      <view class="activity">
        <navigator url="../my/invitation">
          <image src="../../static/activity/banner_laren.jpg" class="activity_img" mode="widthFix" />
        </navigator>
      </view>

      <!-- 任务推荐 -->
      <view class="cu-bar bg-white recommend solid-bottom">
        <view class="action sub-title">
          <text class="text-xl text-bold cuIcon-title text-blue">推荐任务</text>
          <text class="text-ABC text-blue">recommend</text>
        </view>

        <view
          class="right-action cu-tag cu-cate bg-blue light view-all"
          v-if="viewAll"
          @click="showAllTask"
        >显示全部</view>
      </view>

      <!-- list -->
      <view class="cu-list menu-avatar">
        <view class="cu-item no-avatar" v-for="(item) in tasks" :key="item._id">
          <!-- <view class="cu-avatar radius lg" style="background-image:url(https://ossweb-img.qq.com/images/lol/img/champion/Taric.png);">
            <view class="cu-tag badge">v1</view>
          </view>-->

          <task-item :task="item" />
        </view>
      </view>

      <view class="cu-load loading" v-show="onBottom"></view>
      <view class="text-grey text-xs cu-load" v-show="isEmpty&&!onBottom">--------到底了--------</view>
    </scroll-view>

    <!-- 留白 -->
    <!-- <view class="margin-top-footer"></view> -->
  </view>
  <view class="cu-load loading" v-else></view>
</template>

<script>
import uniNoticeBar from "@/components/uni-notice-bar/uni-notice-bar.vue";
import linkAddress from "@/components/xuan-linkAddress/xuan-linkAddress.vue";
import taskItem from "../../components/task-item";
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";

export default {
  components: {
    uniNoticeBar,
    linkAddress,
    taskItem
  },
  computed: {
    ...mapState("task", ["tasks", "categories"]),
    ...mapState("user", ["user", "config"])
  },
  data() {
    return {
      // swiperList: this.config && this.config.indexBanner,
      // .map(a=>) [
      //   {
      //     id: 0,
      //     type: "image",
      //     url: "../../static/home/ad.jpg"
      //   },
      //   {
      //     id: 1,
      //     type: "image",
      //     url: "../../static/home/ad.jpg"
      //   }
      // ],

      dotStyle: true,
      towerStart: 0,
      direction: "",
      modalName: null,
      mainScrollStyle: "",

      height: "500px",
      address: "北京",
      viewAll: false,
      // levels: User.levelDef,

      onBottom: false,
      isEmpty: false,
      pageParams: {
        current: 1,
        pageSize: 25,
        level: 0
      }
    };
  },
  onLoad() {
    this.profile().then(() => this.init(this.pageParams));
  },
  onReady() {
    this.mainScrollStyle = `height:${this.sysInfo.windowHeight - 50}px`;
  },
  methods: {
    ...mapActions("task", ["init"]),
    ...mapActions("user", ["profile"]),
    ...mapMutations("task", ["updateState"]),

    showAllTask() {
      this.pageParams.current = 1;
      const params = Object.assign({ isNewCategory: true }, this.pageParams);
      delete params.level;
      this.init(params);
      this.viewAll = false;
    },
    hallSwitch(level) {
      // uni.switchTab({
      //   url: "../hall/hall"
      // });
      this.pageParams.level = level.id;
      this.pageParams.current = 1;

      this.init({ isNewCategory: true, ...this.pageParams }).then(() => {
        // this.tasks.length > 5 &&
          // uni.pageScrollTo({
          //   scrollTop: 400,
          //   duration: 300
          // });
        this.viewAll = true;

      });
      // this.updateState({payload:{ currentCategory: category.name }});
    },
    InputFocus(e) {
      this.InputBottom = e.detail.height;
      console.log(this.InputBottom);
    },
    InputBlur(e) {
      this.InputBottom = 0;
    },
    search(e) {
      uni.navigateTo({
        url: "../search/search"
      });
    },

    onPageBottom() {
      console.log(`到底了，哥们儿`);
    },
    upper: function(e) {
      console.log(e);
      this.onBottom = false;
    },
    lower: function(e) {
      console.log(e);
      this.onBottom = true;
      this.pageParams.current++;
      this.init(this.pageParams).then(length => {
        setTimeout(() => {
          this.onBottom = false;
          this.isEmpty = length === 0;
        }, 500);
      });
    },
    scroll: function(e) {
      console.log(e);
      // this.old.scrollTop = e.detail.scrollTop
    },

    //点击弹出弹窗
    popup_bottom: function() {
      this.height = "550rpx";
      //显示
      this.show_popup();
    },
    //显示弹窗
    show_popup: function() {
      this.$refs.linkAddress.show();
    },
    //回掉
    confirmCallback: function() {
      let ads = this.$store.state.user_address;
      // this.address=ads.province+ads.city+ads.district;
      console.log(ads.province);

      switch (ads.province) {
        case "北京市":
          this.address = ads.province.slice(0, -1);
          break;
        case "上海市":
          this.address = ads.province.slice(0, -1);
          break;
        case "天津市":
          this.address = ads.province.slice(0, -1);
          break;
        case "重庆市":
          this.address = ads.province.slice(0, -1);
          break;
        case "香港特别行政区":
          this.address = "香港";
          break;
        case "澳门特别行政区":
          this.address = "澳门";
          break;
        case "台湾":
          this.address = ads.province;
          break;
        default:
          this.address = ads.city.slice(0, -1);
          break;
      }
    }
  }
};
</script>

<style scoped>
.recommend {
  margin-top: 8upx;
  /* #ifdef APP-PLUS */
  padding-top: 0;
  /* #endif */
}

/* 列表 */
.cu-list.menu-avatar > .cu-item {
  height: 160upx;
}

.platform-cut {
  margin-left: 20upx;
}

.cu-platform {
  width: 30upx;
  height: 30upx;
  margin-left: 10upx;
}

.cu-cate {
  font-size: 24upx;
  height: auto;
}

/* 活动 */
.activity {
  width: 100vw;
}

.activity_img {
  width: 100vw;
}

.scroll {
  /* #ifdef H5 */
  padding-top: 100upx;
  /* #endif */
  /* #ifdef APP-PLUS */
  padding-top: 160upx;
  /* #endif */
}
.margin-top-bar {
  height: 100upx;
}
.margin-top-footer {
  height: 100upx;
}

.view-all {
  margin-right: 20upx;
  height: 60upx;
}

.category-img {
  width: 128upx;
  height: 128upx;
  background-color: transparent;
  align-self: center;
}
</style>
