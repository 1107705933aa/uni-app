<script>
/* eslint-disable */
import Vue from 'vue';
import { verifyAccessToken } from '@/api/login';
import { mapMutations } from 'vuex';
export default {
  async onLaunch() {
    await this.initData();
  },
  methods: {
    ...mapMutations(['setCartNum', 'setNotifyNum']),
    // 数据初始化
    async initData() {
      uni.setTabBarStyle({
        selectedColor: this.themeColor.color,
        borderStyle: 'white',
      });
      this.themeColor.tabList &&
        this.themeColor.tabList.forEach((selectedIconPath, index) => {
          uni.setTabBarItem({
            index,
            selectedIconPath,
          });
        });
      // 获取页面设置配置
      const token = uni.getStorageSync('accessToken');
      // 获取系统title高度
      await this.initSystemInfo();
      if (token) {
        await this.handleVerifyAccessToken(token.split(' ')[1]);
      }
      if (this.$mStore.getters.hasLogin) {
        // 初始化购物车数量
        this.setCartNum(uni.getStorageSync('cartNum') || 0);
        this.setNotifyNum(uni.getStorageSync('notifyNum') || 0);
        // #ifdef APP-PLUS
        const info = plus.push.getClientInfo();
        // #endif
      }
      // #ifdef H5
      // if (this.isWechat()) {
      //   await this.$mPayment.wxConfigH5(window.location.href);
      // }
      // #endif
    },
    // 初始化系统信息
    initSystemInfo() {
      uni.getSystemInfo({
        success(e) {
          // #ifndef MP
          Vue.prototype.StatusBar = e.statusBarHeight;
          if (e.platform === 'android') {
            Vue.prototype.CustomBar = e.statusBarHeight + 50;
          } else {
            Vue.prototype.CustomBar = e.statusBarHeight + 43;
          }
          // #endif
          // #ifdef MP-WEIXIN
          Vue.prototype.StatusBar = e.statusBarHeight;
          // eslint-disable-next-line
          const custom = wx.getMenuButtonBoundingClientRect();
          Vue.prototype.Custom = custom;
          Vue.prototype.CustomBar = custom.top - e.statusBarHeight;
          // #endif
          // #ifdef MP-ALIPAY
          Vue.prototype.StatusBar = e.statusBarHeight;
          Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
          // #endif
        },
      });
    },
    // 检验token是否有效
    async handleVerifyAccessToken(token) {
      await this.$http.post(verifyAccessToken, { token }).then((r) => {
        console.log(r);
        if (!r) {
          this.$mStore.commit('logout');
        }
      });
    },
  },
};
</script>
<style lang="scss">
@import './static/css/iconfont-test/iconfont.css';
@import './static/css/iconfont-hugb/iconfont.css';
@import './static/css/iconfont-lims/iconfont.css';
// 导入colorUI
@import '/static/css/colorui/main.css';
@import '/static/css/colorui/icon.css';
@import '/static/css/colorui/animation.css';
// 导入阿里巴巴矢量图标库
/*#ifdef MP*/
@import './static/css/iconfont/iconfont.css';

/*#endif*/
/*#ifndef MP*/
@import url('./static/css/common/font_1681579_dwilkcq6mvg.css');
/*#endif*/
@import './static/css/reset.scss';
@import './static/css/uni.scss';
// @import './static/css/grid.scss';
// @import './static/css/grid-item.scss';
// @import './static/css/swiper.scss';

checkbox .checkbox-input {
  border-radius: 3upx !important;
  color: #ffffff !important;
}

checkbox .checkbox-input.checkbox-input-checked {
  color: #fff;
  border-color: #848484;
  background: #848484;
}

checkbox .checkbox-input.checkbox-input-checked:after {
  font-size: 18px;
}

.grid.cols-4 .grid-item .o-text {
  font-size: 29upx !important;
  line-height: 13px;
}

.grid .grid-item .sub [class*='o-i'] image {
  display: block;
  width: 100%;
  height: 100% !important;
  margin: auto;
}

.grid.cols-4 .grid-item [class*='o-i'] {
  margin-bottom: 6px;
  width: 90upx !important;
  height: 90upx !important;
}

.lx-skeleton {
  background-color: #fff;
  padding: 0px !important;
  margin: 0 auto;
}

.row-class {
  width: 100%;
  height: 16px;
  background-color: #f2f3f5;
  margin-left: 29upx !important;
}
</style>
