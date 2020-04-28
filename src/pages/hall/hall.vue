<template>
  <view class>
    <!-- 导航栏 -->
    <cu-custom bg-color="bg-gradual-blue" :isBack="false">
      <block slot="backText">返回</block>
      <block slot="content">悬赏大厅</block>
    </cu-custom>

    <!-- 过滤 -->
    <sl-filter
      :topFixed="true"
      :independence="true"
      :color="titleColor"
      :themeColor="themeColor"
      :menuList.sync="menuList"
      @result="result"
    ></sl-filter>

    <!-- 任务推荐 -->
    <view class="cu-bar bg-white solid-bottom">
      <view class="action">
        <text class="text-gray">检索到 10 条数据</text>
      </view>
    </view>

    <!-- list -->
    <view class="cu-list menu-avatar">
      <view class="cu-item no-avatar" v-for="(item,index) in (filteredTasks || task)" :key="index">
        <!-- <view
          class="cu-avatar radius lg"
          style="background-image:url(https://ossweb-img.qq.com/images/lol/img/champion/Taric.png);"
        >
          <view class="cu-tag badge">v1</view>
        </view>-->
        <!-- <view class="content">
          <view class="text-grey">
            <view class="text-cut">注册任务</view>
            <view class="platform-cut">
              <image class="cu-platform round sm" src="../../static/platform/android.png" mode />
              <image class="cu-platform round sm" src="../../static/platform/iphone.png" mode />
              <image class="cu-platform round sm" src="../../static/platform/h5.png" mode />
            </view>
          </view>
          <view class="text-gray text-sm flex">
            <view class="text-cut">37 人 已赚，剩余 7 个</view>
          </view>
          <view class="text-gray text-sm flex">
            <view class="text-cut">
              <view class="cu-tag cu-cate bg-orange">认证注册</view>
            </view>
          </view>
        </view>
        <view class="action">
          <view class="text-grey text-sm">22:20</view>
          <view class="text-red text-lg">5￥</view>
        </view>-->

        <task-item :task="item" />
      </view>
    </view>

    <!-- 留白 -->
    <view class="margin-top-footer"></view>
  </view>
</template>

<script>
import slFilter from "@/components/sl-filter/sl-filter.vue";
import { mapState, mapActions, mapMutations } from "vuex";
import taskItem from "../../components/task-item";
import request from "../../utils/request";

export default {
  components: {
    slFilter,
    taskItem
  },
  computed: {
    ...mapState("task", ["tasks", "currentCategory"]),
    ...mapState("user", ['config'])
  },
  data() {
    return {
      themeColor: "#0081FF",
      titleColor: "#666666",
      filterResult: {},
      menuList: [
        {
          title: "类型",
          detailTitle: "请选择类型（可多选）",
          isMutiple: true,
          key: "category",
          detailList: [
            {
              title: "不限",
              value: ""
            }
          ]
        },
        {
          title: "金额",
          key: "salary",
          isMutiple: true,
          detailList: [
            {
              title: "不限",
              value: ""
            },
            {
              title: "0.1~1",
              value: "0.1~1"
            },
            {
              title: "1~5",
              value: "1~5"
            },
            {
              title: "5~10",
              value: "5~10"
            },
            {
              title: "10以上",
              value: "10~1000000"
            }
          ]
        },
        {
          title: "难度",
          key: "single",
          isMutiple: false,
          detailTitle: "请选择（单选）",
          reflexTitle: true,
          // defaultSelectedIndex: 2,
          detailList: [
            {
              title: "不限",
              value: ""
            },
            {
              title: "简单",
              value: "test_1"
            },
            {
              title: "中级",
              value: "test_2"
            },
            {
              title: "高级",
              value: "test_3"
            }
          ]
        },
        {
          title: "排序",
          key: "sort",
          isSort: true,
          reflexTitle: true,
          // defaultSelectedIndex: 2,
          detailList: [
            {
              title: "默认排序",
              value: ""
            },
            {
              title: "发布时间",
              value: "add_time"
            },
            {
              title: "薪资最高",
              value: "wages_up"
            },
            {
              title: "离我最近",
              value: "location"
            }
          ]
        }
      ],
      filteredTasks: []
    };
  },
  methods: {
    ...mapActions("task", ["loadTask"]),
    loadTask(filter) {
      const params = { $sortdesc: "created", $limit: 35 };

      if (this.currentCategory) {
        params.category = this.currentCategory;
      }
      if (filter) {
        Object.assign(params, filter);
      }

      request.get("api/tasks", { params }).then(({ data }) => {
        this.filteredTasks = data;
      });
    },
    result(val) {
      console.log("filter_result:" + JSON.stringify(val));
      this.filterResult = JSON.stringify(val, null, 2);
      this.loadTask({ category: { $in: val.category } });
    },
  
  },
  onReady() {
    // this.config.levels.forEach(a =>
    //   this.menuList[0].detailList.push({ title: a.name, value: a.name })
    // );
    this.loadTask({})
  }
};
</script>

<style>
/* 列表 */
.cu-list {
  z-index: 1000000;
}
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
.margin-top-footer {
  height: 40upx;
}
</style>
