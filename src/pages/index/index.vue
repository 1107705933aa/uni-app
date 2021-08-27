<template>
  <view>
    <view class="w-upload" style="margin-top: 100px" v-show="false">
      <button class="w-btn" type="primary" @click="uploadOpen" plain="true">
        上传
      </button>
      <button
        class="w-btn w-btn1"
        type="primary"
        @click="wpriven(src)"
        plain="true"
      >
        下载
      </button>
      <w-upload
        ref="wUpload"
        :token="token"
        :fileShow="fileShow"
        :imgShow="imgShow"
        :uploadName="uploadName"
        :requestUrl="requestUrl"
        :fileType="fileType"
        :imgType="imgType"
        @updateImgList="updateImgList"
        @updateFileList="updateFileList"
        :fileList="fileList"
        :imgList="imgList"
        @imgSuccess="imgSuccess"
        @fileSuccess="fileSuccess"
      ></w-upload>
    </view>
    <!-- 搜索 -->
    <rf-search-bar
      @search="toSearch"
      title="扫一扫"
      icon="iconsaomiao"
      :placeholder="hotSearchDefault"
    />
    <!-- 轮播图1 -->
    <view class="swiper">
      <view class="swiper-box">
        <rf-swipe-dot
          :info="carouselList"
          mode="nav"
          :current="current"
          field="title"
        >
          <swiper @change="handleDotChange" autoplay="true">
            <swiper-item
              v-for="(item, index) in carouselList"
              @tap="navTo(item.url)"
              :key="index"
            >
              <view class="swiper-item">
                <image :src="item.image" mode="aspectFill" />
              </view>
            </swiper-item>
          </swiper>
        </rf-swipe-dot>
      </view>
    </view>

    <!-- 公告 -->
    <rf-swiper-slide
      v-show="isShowNews"
      :class="'bg-' + themeColor.name"
      v-if="announceList.length > 0"
      :list="announceList"
      @navTo="navNoticeTo"
    >
      <view slot="header" class="swiper-slide-header">
        <text class="iconfont icongonggao"></text>
      </view>
    </rf-swiper-slide>

    <!--宫格菜单 -->
    <view class="gongge">
      <swiper
        :indicator-active-color="themeColor.color"
        indicator-color="#666"
        :indicator-dots="menuList.length > 8"
        class="category-list-wrapper"
        v-if="menuList.length > 0"
      >
        <swiper-item
          class="category-list"
          v-for="(fItem, fIndex) in swipeCateList"
          :key="fIndex"
        >
          <view>
            <!-- #ifdef H5 || APP-PLUS -->
            <grid col="4">
              <grid-item
                v-for="(item, index) in fItem"
                :key="item.title"
                :order="index"
                :iconImg="item.cover"
                :text="item.title"
                :url="item.url"
                :isGong="isGong"
              ></grid-item>
            </grid>
            <!-- #endif -->
            <!-- #ifdef MP-WEIXIN -->
            <ju-navigator-grid
              element-id="navigatorMenu"
              :list="fItem"
              height="180"
              size="90"
              @press="onPress"
            />
            <!-- #endif -->
          </view>
        </swiper-item>
      </swiper>
    </view>

    <!--热门榜单 -->
    <view class="hot">
      <view class="title-content" :class="'bg-' + themeColor.name">
        <view>
          <text class="iconfont icon-1remenbangdan"></text>
          <text class="hot-title">热门榜单</text>
        </view>
        <view class="more" @tap="navToCategory()">
          <text class="hot-title2">更多</text>
          <text class="iconfont icon-fanhui"></text>
        </view>
        <view class="triangle"></view>
        <view class="triangle2"></view>
      </view>
      <view class="details-content">
        <swiper
          class="swiper"
          circular
          :indicator-dots="indicatorDots"
          :autoplay="autoplay"
          :interval="interval"
          :duration="duration"
          :display-multiple-items="slideNum"
        >
          <swiper-item v-for="(item, index) in hotList" :key="index">
            <view class="swiper-item uni-bg-red" @tap.stop="jumpHot(item)">
              <image :src="item.image" />
              <view>
                <text>{{ item.courseName }}</text>
              </view>
            </view>
          </swiper-item>
        </swiper>
      </view>
    </view>
  </view>
</template>

<script>
var _self;
import Vue from 'vue';
import { indexList, productList, cartItemCount } from '@/api/product';
import rfSwipeDot from '@/components/rf-swipe-dot';
import rfSearchBar from '@/components/rf-search-bar';
import gridItem from '@/components/oveui-grid/grid-item/grid-item.vue';
import grid from '@/components/oveui-grid/grid/grid.vue';
import juNavigatorGrid from '../../components/ju-navigator-grid/ju-navigator-grid';
import {
  groupData,
  yxStoreProductByWechat,
  webConfig,
  allStaticImage,
} from '@/api/basic';
import rfSwiperSlide from '@/components/rf-swiper-slide';
import wUpload from '../../components/file-img-upload/w-upload';
import loginVue from '../public/login.vue';

export default {
  components: {
    rfSwipeDot,
    grid,
    gridItem,
    rfSwiperSlide,
    wUpload,
    rfSearchBar,
    juNavigatorGrid,
  },
  data() {
    return {
      hotSearchDefault: '请输入关键字', // 搜索默认关键字
      search: {},
      current: 0, // 轮播图index
      indicatorDots: false,
      autoplay: false,
      interval: 2000,
      duration: 500,
      slideNum: 3,
      hotList: [],
      carouselList: [],
      announceList: [], // 公告
      isShowNews: true,
      menuList: [],
      isGong: Boolean,
      // 文件上传
      imgShow: true, // 是否展示图片列表
      fileShow: true, // 是否展示文件列表
      token: '', // 非必填
      requestUrl: '', // 上传文件/图片的请求地址，必填
      uploadName: 'upload_resource', // 看上传文件/图片接口的名字关键字，必填
      fileType: 'file', // 看上传接口要求的文件格式关键字，必填
      imgType: 'pictures', // 看上传接口要求上传的图片格式关键字，必填
      fileList: [],
      imgList: [],
      src: '', // 下载文件的网络地址
      setList: [], // 个人设置
    };
  },
  onLoad() {
    _self = this;
    this.initData();
  },
  onShow() {
    this.setCartItemCount();
  },
  onReady: function (res) {
    this.videoContext = uni.createVideoContext('myVideo');
  },
  computed: {
    swipeCateList() {
      const list = this.menuList;
      let result = [];
      for (let i = 0, len = list.length; i < len; i += 8) {
        result.push(list.slice(i, i + 8));
      }
      return result;
    },
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.menuList = [];
    (this.hotSearchDefault = '请输入关键字'),
      (this.current = 0), // 轮播图index
      (this.hotList = []),
      (this.carouselList = []),
      (this.announceList = []), // 公告
      (this.menuList = []),
      this.getGroupData('refresh');
    this.queryWebConfig();
  },
  methods: {
    // 跳转至搜索详情页
    toSearch() {
      this.$mRouter.push({
        route: `/pages/index/search/search?data=${JSON.stringify(this.search)}`,
      });
    },

    // 宫格跳转
    onPress(url) {
      let newUrl = this.$mRoutesConfig[url].path;
      this.$mRouter.push({ route: this.$mRoutesConfig[url].path });
    },

    // 跳转至公告页
    navNoticeTo() {
      let _this = this;
      uni.setStorage({
        key: 'announceList_nfo',
        data: _this.announceList,
        success: function () {
          _this.$mRouter.push({
            route: '/pages/index/notice/notice',
          });
        },
      });
    },

    // 文件上传
    // 打开上传文件弹窗
    uploadOpen() {
      this.$refs.wUpload.uploadOpen();
    },
    // 下载预览文件/图片
    wpriven(url) {
      this.$refs.wUpload.wpriven(url);
    },
    // 返回被删除的文件和索引号
    updateFileList(val) {
      // console.log(val);
    },
    // 返回被删除的图片和索引号
    updateImgList(val) {
      // console.log(val);
    },
    // 返回图片上传成功后的图片信息
    imgSuccess(val) {
      // console.log(val);
    },
    // 返回文件/图片上传成功后的文件信息
    fileSuccess(val) {
      // console.log(val);
    },

    /**
     * 初始化数据
     */
    initData() {
      this.getGroupData();
      this.queryWebConfig();
      this.getConfigList();
    },

    //获取首页导航菜单
    async getGroupData(type) {
      await this.$http.get(groupData).then((groups) => {
        if (groups.length) {
          groups.forEach((group) => {
            if (group.groupName && group.groupName == 'yshop_home_banner') {
              const carouse = JSON.parse(group.value);
              this.carouselList.push({
                image: carouse.pic,
                iconImg: carouse.pic,
                title: carouse.name,
                url: carouse.url,
              });
            }
            if (group.groupName && group.groupName == 'yshop_home_menus') {
              const carouse = JSON.parse(group.value);
              this.menuList.push({
                cover: carouse.pic,
                icon: carouse.pic,
                title: carouse.name,
                url: carouse.url,
              });
              if (this.menuList.length === 0) {
                this.isGong = false;
              } else if (this.menuList.length !== 0) {
                this.isGong = true;
              }
            }
            if (group.groupName && group.groupName == 'yshop_home_roll_news') {
              const carouse = JSON.parse(group.value);
              if (carouse.title !== undefined) {
                this.announceList.push(carouse);
              }
            }
            if (type === 'refresh') {
              uni.stopPullDownRefresh();
            }
            // 个人设置
            if (group.groupName && group.groupName == 'yshop_my_menus') {
              var _this = this;
              const carouse = JSON.parse(group.value);
              this.setList.push({
                content: '',
                title: carouse.name,
                url: carouse.uniapp_url,
              });
              this.$store.commit('setValue', _this.setList);
            }
          });
        }
      });
      await this.$http
        .get(yxStoreProductByWechat, {
          size: 10,
          page: 0,
          sort: 'id,desc',
          isShow: 1,
          isDel: 0,
          isHot: 1,
        })
        .then((res) => {
          this.hotList = res.content;
        });
    },
    queryWebConfig() {},
    // 监听轮播图切换
    handleDotChange(e) {
      this.current = e.detail.current;
    },
    // 跳转到热门详情
    jumpHot(item) {
      if (item.isCourse === true) {
        this.navTo(`/pages/trainservice/train-course-deatail?id=${item.id}`);
      } else if (item.isCourse === false) {
        this.navTo(
          `/pages/product/web/web?url=${item.storeInfo}&id=${item.id}`
        );
      }
    },
    // 设置购物车数量角标
    async setCartItemCount() {
      if (!this.$mStore.getters.hasLogin) {
        return;
      }
      await this.$http.get(`${cartItemCount}`).then((r) => {
        if (parseInt(r, 10) > 0) {
          uni.setTabBarBadge({
            index: _self.$mConstDataConfig.cartIndex,
            text: r.toString(),
            success() {},
            fail(res) {
              console.log(res);
            },
          });
        } else {
          uni.removeStorageSync('cartNum');
          uni.removeTabBarBadge({
            index: this.$mConstDataConfig.cartIndex,
          });
        }
      });
    },
    // 跳转至分类模块
    navToCategory() {
      this.navTo(`/pages/product/list?isHot=1`);
    },
    // 通用跳转
    navTo(route) {
      this.$mRouter.push({
        route,
      });
    },

    // 获取静态图片信息
    async getConfigList() {
      await this.$http
        .get(`${allStaticImage}`)
        .then((r) => {
          this.loading = false;
          r.forEach((element) => {
            if (element.location == 'loginPic') {
              this.$mAssetsPath.loginPic = element.image;
            } else if (element.location == 'vipPrice') {
              this.$mAssetsPath.vipPrice = element.image;
            } else if (element.location == 'vipCardBg') {
              this.$mAssetsPath.vipCardBg = element.image;
            } else if (element.location == 'loginPic') {
              this.$mAssetsPath.loginPic = element.image;
            } else if (element.location == 'headImg') {
              this.$mAssetsPath.headImg = element.image;
            } else if (element.location == 'errorImage') {
              this.$mAssetsPath.errorImage = element.image;
            } else if (element.location == 'logo') {
              this.$mAssetsPath.logo = element.image;
            } else if (element.location == 'userBg') {
              this.$mAssetsPath.userBg = element.image;
            } else if (element.location == 'arc') {
              this.$mAssetsPath.arc = element.image;
            } else if (element.location == 'noNetWorkImg') {
              this.$mAssetsPath.noNetWorkImg = element.image;
            } else if (element.location == 'notFoundImg') {
              this.$mAssetsPath.notFoundImg = element.image;
            } else if (element.location == 'upgradeTop') {
              this.$mAssetsPath.upgradeTop = element.image;
            } else if (element.location == 'backTop') {
              this.$mAssetsPath.backTop = element.image;
            } else if (element.location == 'shareBg') {
              this.$mAssetsPath.shareBg = element.image;
            } else if (element.location == 'wechat') {
              this.$mAssetsPath.wechat = element.image;
            } else if (element.location == 'checkBgImg') {
              this.$mAssetsPath.checkBgImg = element.image;
            } else if (element.location == 'hotBgImg') {
              this.$mAssetsPath.hotBgImg = element.image;
            }
          });
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
page {
  background-color: $page-color-base;
}

// 公告
.swiper-slide-header {
  .iconfont {
    font-size: $font-lg + 8upx;
    font-weight: 600;
  }
}

/*轮播图*/
.swiper {
  width: 100%;
  margin-bottom: 20upx;
  display: flex;
  justify-content: center;
  // #ifdef H5 || APP-PLUS
  margin-top: 20upx;
  // #endif

  .swiper-box {
    width: 100%;
    height: 28vh;
    overflow: hidden;
    border-radius: 15upx;
    box-shadow: 0upx 8upx 25upx rgba(0, 0, 0, 0.2);
    //兼容ios，微信小程序
    position: relative;
    z-index: 1;

    swiper {
      width: 100%;
      height: 28vh;

      swiper-item {
        image {
          width: 100%;
          height: 28vh;
        }
      }
    }
  }
}

/*分类列表*/
.category-list-wrapper {
  .category-list {
    width: 100%;
    padding: $spacing-base;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    .category {
      margin-top: 10upx;
      width: calc(20% - 20upx);
      height: 132upx;
      display: flex;
      text-align: center;
      flex-wrap: wrap;

      .img {
        width: 100%;
        display: flex;
        justify-content: center;

        image {
          width: 12vw;
          height: 12vw;
          border-radius: 50%;
        }
      }

      .text {
        margin-top: 16upx;
        width: 100%;
        display: flex;
        justify-content: center;
        font-size: 24upx;
        color: #3c3c3c;
      }
    }
  }
}

.rf-index {
  background-color: $color-white;
}

.hot {
  position: relative;
  width: 100%;
  height: 400upx;
  color: $color-white;

  .title-content {
    position: relative;
    display: inline-flex;
    justify-content: space-between;
    width: 100%;
    height: 200upx;
    line-height: 70upx;
    padding: 12upx 20upx;

    .icon-1remenbangdan {
      font-size: $font-lg + 10upx;
      margin-right: 10upx;
    }

    .hot-title {
      font-size: $font-sm + 5upx;
    }

    .more {
      margin-top: 15upx;

      .hot-title2 {
        font-size: $font-sm;
      }

      .icon-fanhui {
        font-size: $font-sm;
        margin-left: 8upx;
      }
    }

    .triangle {
      position: absolute;
      width: 0;
      height: 0;
      bottom: 0;
      left: 0;
      border-left: 15vw solid transparent;
      border-right: 15vw solid transparent;
      border-bottom: 70upx solid $color-white;
    }

    .triangle2 {
      position: absolute;
      width: 0;
      height: 0;
      bottom: 0;
      right: 0;
      border-left: 15vw solid transparent;
      border-right: 15vw solid transparent;
      border-bottom: 70upx solid $color-white;
    }
  }

  .details-content {
    position: absolute;
    top: 85upx;
    width: 93%;
    height: 310upx;
    padding: 10upx;
    border-radius: 25upx;
    margin-left: 3.5%;
    background: #fff;

    .swiper {
      height: 300rpx;
    }

    .swiper-item {
      position: relative;
      display: block;
      height: 300rpx;
      line-height: 300rpx;
      padding: 8upx;
      text-align: center;

      image {
        height: 220upx;
        border-radius: 15upx;
      }

      text {
        position: absolute;
        left: 0;
        bottom: 35upx;
        font-size: $font-sm - 1upx;
        color: #393939;
      }
    }

    .swiper-list {
      margin-top: 40rpx;
      margin-bottom: 0;
    }

    .uni-common-mt {
      margin-top: 60rpx;
      position: relative;
    }

    .info {
      position: absolute;
      right: 20rpx;
    }

    .uni-padding-wrap {
      width: 550rpx;
      padding: 0 100rpx;
    }
  }
}

.gongge {
  background: #fff;
}

.gongge .grid .grid-item[data-v-3503cc5c] {
  text-align: center;
  box-sizing: border-box;
  position: relative;
  background-color: #fff;
  border: 0;
}

.gongge .grid .grid-item::before,
.grid .grid-item::after {
  content: '';
  position: absolute;
  right: 0;
  bottom: 0;
  background-color: #fff;
}

.gongge view {
  width: 100%;
  font-size: 16px;
  line-height: 1.5;
}

.gongge swiper {
  height: 415upx;
}
</style>
