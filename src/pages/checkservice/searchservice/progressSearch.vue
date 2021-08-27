<template>
  <view class="content">
    <!--顶部下拉菜单-->
		<rf-nav-detail
			@hide="hideNavDetail"
			:popupShow="navDetailShow"
		>
		</rf-nav-detail>
    <view>
      <image class="news-pic" :src="checkBgImg" />
    </view>
    <view class="main-content">
      <view>
        <view class="first-item">
          <text class="iconfont icontuanduidingdan" :class="'text-' + themeColor.name"></text>
          <text class="tit">订单号：</text>
          <input class="input" type="text" v-model="searchCondition.orderno" placeholder="请输入订单号" />
        </view>
        <view class="first-item">
          <text class="iconfont icondianhua" :class="'text-' + themeColor.name"></text>
          <text class="tit">手机号：</text>
          <input class="input" type="text" v-model="searchCondition.mobile" placeholder="请输入手机号" />
        </view>
        <view class="comb-item">
          <view class="first-item">
            <text class="iconfont iconyanzhengma" :class="'text-' + themeColor.name"></text>
            <text class="tit">验证码：</text>
            <input
              class="input"
              type="text"
              v-model="searchCondition.checkcode"
              placeholder="请输入验证码"
            />
          </view>
          <view class="second-item">
            <button :class="'bg-' + themeColor.name" size="mini">获取验证码</button>
          </view>
        </view>

        <view class="btn_view">
          <button
            class="form_btn"
            :loading="btnLoading"
            @click="search"
            size="mini"
            :class="'bg-' + themeColor.name"
          >查询</button>
        </view>
        <view class="footer">
          <b>提示：</b>
          <view class="end_tips">请输入下单填写的手机号，获取验证码之后即可查询检测动态</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      navDetailShow: false,
      searchCondition: {
        orderno: '',
        mobile: '',
        checkcode: '',
      },
			checkBgImg:this.$mAssetsPath.checkBgImg,
      btnLoading: false,
    };
  },
  methods: {
    // #ifndef MP
    onNavigationBarButtonTap(e) {
      console.log(e.index);
      const index = e.index;
      if (index === 0) {
        this.navDetailShow = true;
      }
    },
		// #endif
    // 隐藏顶部导航
		hideNavDetail() {
			this.navDetailShow = false;
		},
    search() {},
  },
};
</script>

<style lang='scss'>
.content {
  height: 100vh;
  background: #fff;

  .news-pic {
    width: 100%;
  }

  .main-content {
    padding: 40upx 60upx;
    display: flex;
    align-items: center;

    .comb-item {
      display: flex;
      height: 60upx;
      line-height: 60upx;
      margin-bottom: 20upx;

      .tit {
        width: 190upx !important;
      }

      .second-item {
        padding-left: 20upx;

        button {
          width: 200upx;
          height: 72upx;
          font-size: $font-sm + 2upx;
          line-height: 72upx;
        }
      }
    }

    .first-item {
      position: relative;
      display: flex;
      padding: 0 10upx;
      height: 80upx;
      line-height: 65upx;
      border-radius: 4px;
      margin-bottom: 45upx;
      border-bottom: 1px solid #e5e5e5;

      .tit {
        width: 160upx;
        font-size: $font-base + 2upx;
        color: $font-color-base;
        margin-left: 70upx;
      }

      .iconfont {
        font-size: 55upx;
        position: absolute;
        left: 0;
      }

      input {
        height: 60upx;
        width: calc(100% - 100upx);
        line-height: 60upx;
        font-size: $font-base + 7upx;
      }
    }

    .btn_view {
      display: flex;
      padding-top: 40upx;

      .form_btn {
        width: 100%;
        height: 80upx;
        font-size: $font-lg;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .footer {
      margin-top: 100upx;
      font-size: $font-sm + 2upx;
      color: #797c80;
    }

    .end_tips {
      font-size: 24upx;
      text-indent: 2em;
    }
  }
}
</style>
