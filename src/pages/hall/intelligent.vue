<template>
  <div class="page">
    <!-- 导航栏 -->

    <cu-custom bg-color="bg-gradual-blue" :isBack="false">
      <block slot="backText">返回</block>
      <block slot="content">智能抢单</block>
    </cu-custom>

    <div id="transform" class="transform">
      <div class="bg_shade">
        <div class="circles circles-a">
          <div class="trio">
            <p>淘宝</p>
            <i></i>
          </div>
          <div class="pos">
            <span></span>
          </div>
        </div>
        <div class="circles circles-b">
          <div class="trio">
            <p>京东</p>
            <i></i>
          </div>
          <div class="pos">
            <span></span>
            <span></span>
          </div>
        </div>
        <div class="circles circles-c">
          <div class="trio">
            <p>天猫</p>
            <i></i>
          </div>
          <div class="pos">
            <span></span>
            <span></span>
          </div>
        </div>
        <div class="circles circles-d active">
          <div class="trio">
            <p style="font-size: 12px">唯品会</p>
            <i></i>
          </div>
          <div class="pos">
            <span></span>
            <span></span>
          </div>
        </div>

        <div class="circles circles-e">
          <div class="trio">
            <p style="font-size: 12px">拼多多</p>
            <i></i>
          </div>
          <div class="pos">
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
      <div class="heart_box">
        <div class="heart"></div>
        <div
          id="shan"
          class="shan"
          style="transform: rotate(166deg);display: none;"
          v-show="scanning"
        ></div>
      </div>
    </div>

    <view class="padding flex flex-direction">
      <button class="cu-btn bg-blue margin-tb-sm lg" @click="scan" v-show="!scanning">开始抢单</button>
      <button class="cu-btn bg-blue margin-tb-sm lg" v-show="scanning">
        正在玩命抢单中
        <span class="dotload">·····</span>
      </button>
    </view>

    <!-- 任务推荐 -->
    <view class="cu-bar bg-white recommend solid-bottom" v-if="tasks.length">
      <view class="action sub-title">
        <text class="text-xl text-bold cuIcon-title text-blue">智能任务</text>
        <text class="text-ABC text-blue">Intelligent</text>
      </view>
    </view>

    <!-- list -->
    <view class="cu-list menu-avatar" v-if="tasks.length">
      <view class="cu-item no-avatar" v-for="(task) in tasks" :key="task._id">
        <!-- <task-item :task="item" /> -->

        <view class="content">
          <view class="text-grey">
            <view class="text-cut">{{task.title}}</view>
          </view>

          <view class="text-gray text-sm flex">
            <!-- <view class="cu-tag cu-cate bg-orange">{{task.category}}</view> -->
            <view class="cu-tag cu-cate bg-blue light">押金{{task.bail}}</view>
            <view class="cu-tag cu-cate bg-olive">{{task.earnPoint}}积分</view>
            <view class="cu-tag cu-cate bg-gradual-green">精品任务</view>
          </view>
        </view>
        <view class="action text-right">
          <!-- <view class="text-grey text-sm text-cut">{{task.merchant}}</view>
          <view class="text-grey text-sm">剩{{task.total-task.useup}}</view>-->
          <view class="text-red text-lg">￥{{task.reward}}</view>
        </view>
      </view>
    </view>
    <view class="padding flex flex-direction">
      <button class="cu-btn bg-green margin-tb-sm lg text-bold" v-if="tasks.length" @click="accept">
        接受{{tasks.length}}单
        <view class="text-sm">(总佣金:{{totalReward}}元, 押金:{{totalBail}})元</view>
      </button>
    </view>

    <view class="cu-bar bg-white solid-bottom margin-top-sm">
      <view class="action">
        <text class="cuIcon-title text-blue"></text>
        <text class="text-black text-bold">抢单说明</text>
      </view>
    </view>
    <view class="bg-white padding-sm padding-tb-sm">
      <ol>
        <li>国内电商抢单，审核时间6小时</li>
        <li>亚马逊抢单，审核时间12个小时</li>
        <li>你将额外获得下级抢单奖金16%的奖励</li>
        <li>你将额外获得下下级抢单奖金8%的奖励</li>
        <li>所有订单由大数据匹配，为了保障店家利益，请素质做单</li>
        <li>所有违规行为，一经发现，立即封号</li>
      </ol>
    </view>
  </div>
</template>

<script>
import request from "../../utils/request";
import { Task } from "../../store/task";
import taskItem from "../../components/task-item";
import { mapActions, mapState } from "vuex";
import { fixedIntger } from "@/utils/tools";

export default {
  components: {
    taskItem
  },
  data() {
    return { scanning: false, tasks: [] };
  },
  computed: {
    ...mapState("user", ["user"]),
    totalBail() {
      return this.sum(this.tasks.map(a => a.bail));
    },
    totalReward() {
      return this.sum(this.tasks.map(a => a.reward));
    }
  },
  methods: {
    ...mapActions("task", ["enrollTask"]),
    sum(value) {
      return fixedIntger(
        value.reduce((a, b) => a + (b || 0), 0),
        2
      );
    },
    accept() {
      const ran = max => parseInt(Math.random() * max);
      let duration = ran(3000);
      const duration2 = ran(3000);
      uni.showToast({
        title: "远程服务器正在进行订单分配",
        mask: true,
        icon: "loading",
        duration
      });
      if (!this.user._id) {
        uni.showToast({
          title: `请登陆后再接单`,
          mask: true,
          icon: "none"
        });
        return;
      }

      if (this.user.availableBalance < this.totalBail) {
        uni.showToast({
          title: `您的押金${this.user.availableBalance}，不足${this.totalBail}元接受此任务`,
          mask: true,
          icon: "none",
          duration
        });
        return;
      }

      uni.showToast({
        title: "商家系统正在确认订单",
        mask: true,
        icon: "loading",
        duration: 60 * 1000
      });

      setTimeout(
        () =>
          this.enrollTask(this.tasks.map(a => a._id)).then(() => {
            this.tasks = [];
            uni.hideToast();
          }),
        duration + duration2
      );
    },
    scan() {
      this.scanning = true;

      setTimeout(
        () =>
          request
            .get("utils/intelligent")
            .then(({ data }) => {
              if (data.message) {
                uni.showToast({
                  title: data.message,
                  mask: true,
                  icon: "none",
                  duration: 3000
                });
                return;
              }
              this.tasks = data.map(task => new Task(task));
            })
            .finally(() => (this.scanning = false)),
        2000
      );
    }
  },
  onLoad() {}
};
</script>

<style lang="scss" scoped>
.page {
  background-color: #fff;
}
.transform {
  /*width: 375px;*/
  height: 295px;
  text-align: center;
  /*margin-top: 35px;*/
}

.transform .trans_bg {
  /*position: relative;*/
  /*float: left;*/
  /*margin-left: 26px;*/
  width: 300px;
  height: 300px;
  margin: 0 auto;
}

.transform .bg_shade {
  background: url("../../static/quan_bg.png") no-repeat;
  background-size: 300px;
  width: 300px;
  height: 300px;
  /*width: 390px;*/
  margin: 0 auto;
  /*position: absolute;*/
  /*left: -56px;*/
  /*top: -39px;*/
}

.transform .circles {
  /*position: absolute;*/
}

.circles .topcircle {
  left: 119px;
  top: -15px;
}

.circles .active .pos span {
  color: #00c8d4;
}

.circles .pos {
  position: relative;
  width: 133px;
}

.circles .trio {
  color: #ffffff;
  font-size: 16px;
  text-align: center;
  margin: 0 auto;
  width: 60px;
  height: 60px;
  line-height: 60px;
  background: #00c8d4;
  position: relative;
  border-radius: 50%;
}

.circles-a .trio {
  top: 10px;
}
.circles-b .trio {
  top: 10px;
  left: -100px;
}
.circles-c .trio {
  top: -60px;
  left: 100px;
}
.circles-d .trio {
  top: -20px;
  left: -70px;
}

.circles-e .trio {
  top: -90px;
  left: 60px;
}

.circles .trio p {
  width: 38px;
  margin-left: 11px;
  margin-top: 8px;
}

.circles .pos span {
  color: #999fb1;
  font-size: 14px;
}

.circles .circles.active .trio i {
  width: 18px;
  height: 18px;
  // background: url(/static/home/mobile//images/quan_active.png) no-repeat;
  display: inline-block;
  position: absolute;
  top: 43px;
  left: 35px;
}

.heart_box {
  position: relative;
  margin: 0 auto;
  margin-top: -214px;
  /*width: 340px;*/
  /*height: 340px;*/
}

.heart_box .heart {
  /*position: absolute;*/
  margin: 0 auto;
  width: 88px;
  height: 88px;
  background: url("../../static/quan_circle.png") no-repeat;
}

.heart_box .shan {
  margin: 0 auto;
  margin-top: -164px;
  width: 211px;
  height: 129px;
  background: url("../../static/quan_rotate.png") no-repeat;
  top: 25px;
  left: 42px;
  /*position: absolute;*/
  -webkit-transform-origin: 107px 124px;
  transform-origin: 108px 124px;
  transform: rotate(0deg);
  animation: radar 1s linear infinite;
}

@keyframes radar {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.gbtn {
  -webkit-box-flex: 1;
  text-align: center;
  height: auto;
  margin: 20px 40px;
  padding: 15px;
  border-radius: 10px;
  color: #fff;
}
.dotload {
  display: inline-block;
  width: 5ch;
  text-indent: -2ch;
  vertical-align: bottom;
  overflow: hidden;
  animation: dot 1s infinite step-start both;
  font-family: Consolas, Monaco, monospace;
}

@keyframes dot {
  30% {
    text-indent: -3ch;
  }
  60% {
    text-indent: -2ch;
  }
  90% {
    text-indent: -1ch;
  }
}
</style>
