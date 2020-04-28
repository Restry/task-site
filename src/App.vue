<script>
import Vue from "vue";
// import { mapActions, mapState } from "vuex";
export default Vue.extend({
  mpType: "app",
  onLaunch: function() {
    // console.log("App Launch");
    uni.getSystemInfo({
      success: function(e) {
        Vue.prototype.sysInfo = e;
        // #ifndef MP
        Vue.prototype.StatusBar = e.statusBarHeight;
        if (e.platform == "android") {
          Vue.prototype.CustomBar = e.statusBarHeight + 50;
        } else {
          Vue.prototype.CustomBar = e.statusBarHeight + 45;
        }
        // #endif
        // #ifdef MP-WEIXIN
        Vue.prototype.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        Vue.prototype.Custom = custom;
        Vue.prototype.CustomBar =
          custom.bottom + custom.top - e.statusBarHeight;
        // #endif
        // #ifdef MP-ALIPAY
        Vue.prototype.StatusBar = e.statusBarHeight;
        Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
        // #endif
      }
    });
    this.$store.commit({ type: "user/userSetup" });
    // user.profile();
  },
  onShow() {
    // console.log("App Show");
  },
  onHide() {
    // console.log("App Hide");
  }
});
</script>

<style>
/*每个页面公共css */

/*每个页面公共css */
/* @import "colorui/uni.css"; */
@import "colorui/main.css";
@import "colorui/icon.css";
@import "colorui/animation.css";

.page-nobar{
  overflow: hidden auto;
  height: 100vh;
}

.page {
  height: calc(100vh - 50px);
  overflow: hidden auto;
  width: 100vw;
  /* #ifdef APP-PLUS */
  padding-top: 64upx;
  /* #endif */
  /* #ifdef H5 */
  padding-top: 0upx;
  /* #endif */
}

.page.show {
  overflow: hidden;
}
/* #ifdef APP-PLUS */
.nav-bar {
  padding-top: 60upx;
  min-height: 100upx;
  line-height: 100upx;
}
/* #endif */

.cu-custom {
  height: 0;
}
</style>
