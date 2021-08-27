<template>
  <view class="rf-swiper-slide" :class="'bg-' + themeColor.name">
    <slot name="header" v-if="list.length > 0"></slot>
    <swiper
      class="rf-swiper"
      :indicator-dots="indicatorDots"
      :autoplay="autoplay"
      :interval="interval"
      :duration="duration"
      vertical="true"
    >
      <swiper-item class="rf-swiper-item" @tap="navTo" v-for="(item, index) in list" :key="index">
        <view class="text in1line">
          <text class="newsTitle">
            {{
            item.title || `${item.member_nickname}`
            }}
          </text>
        </view>
        <text class="iconfont iconyou" style="color:#fff;"></text>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
export default {
  name: 'rf-swiper-slide',
  data() {
    return {
      indicatorDots: false,
      autoplay: true,
      interval: 2000,
      duration: 500,
    };
  },
  props: {
    list: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  methods: {
    navTo() {
      this.$emit('navTo');
    },
  },
};
</script>

<style scoped lang="scss">
.rf-swiper-slide {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 75upx;
  padding: 0 $spacing-lg;
  margin: 0 20upx;
  border-radius: 50upx;
  // background-color: $color-white;
  .rf-swiper {
    height: 100%;
    flex: 1;
    margin-left: 30upx;
    border-radius: 10upx;
    .rf-swiper-item {
      display: flex;
      justify-content: space-between;
      .text,
      .iconfont {
        height: 80upx;
        line-height: 80upx;
      }
      .iconfont {
        color: $font-color-light;
      }
    }
  }
}

.rf-swiper-slide .rf-swiper .rf-swiper-item .iconfont[data-v-3dd1c9a6] {
  color: #fff;
}
</style>
