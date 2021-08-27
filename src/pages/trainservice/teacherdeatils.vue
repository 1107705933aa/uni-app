<template>
  <view class="content">
    <!--顶部讲师介绍-->
    <view class="detail-desc">
      <view class="d-header">
        <text>讲师信息</text>
      </view>
      <rf-parser
        style="padding: 10upx"
        class="teacher-info"
        :html="teacherdata.details"
        lazy-load
      ></rf-parser>
      <view class="d-header">
        <text>课程信息</text>
      </view>
      <uni-list
        v-for="(item, index) in courseslist"
        :key="index"
        v-show="false"
      >
        <uni-list-item
          :title="item.courseName"
          :note="item.openTime | time"
          :rightText="item.openLocation"
          showArrow
          :clickable="true"
          @click="
            navTo(
              `/pages/trainservice/train-course-deatail?id=${item.product_id}`,
              item.isProduct
            )
          "
        ></uni-list-item>
      </uni-list>
      <view class="product-list-wrapper">
        <rf-product-list
          :eid="'teacherdeatilsId'"
          :bottom="0"
          :list="courseslist"
          :isList="isList"
          :style="{ paddingTop: dropScreenH + 10 + 'upx' }"
        ></rf-product-list>
      </view>
      <rf-empty
        class="empty"
        info="暂无讲师课程信息"
        v-if="courseslist === null || courseslist.length == 0"
      ></rf-empty>
    </view>
  </view>
</template>

<script>
import uniList from '@/components/uni-list/uni-list.vue';
import uniListItem from '@/components/uni-list-item/uni-list-item.vue';
import moment from '@/common/moment';
import rfProductList from '@/components/rf-product-list/index';
export default {
  components: {
    uniList,
    uniListItem,
    rfProductList,
  },
  onLoad(options) {
    this.teacherdata = uni.getStorageSync('teacher')
    this.courseslist = this.teacherdata.courseslist;
  },
  filters: {
    // 格式化时间
    time(val) {
      return moment(val * 1000).format('YYYY-MM-DD');
    },
    // 格式化时间
    timeFull(val) {
      return moment(val * 1000).format('YYYY-MM-DD HH:mm:ss');
    },
  },
  data() {
    return {
      dropScreenH: 0, //下拉筛选框距顶部距离
      isList: false, //是否以列表展示  | 列表或大图
      teacherdata: {},
      courseslist: [],
    };
  },
  methods: {
    // 统一跳转接口
    navTo(route, type) {
      if (!type) {
        return;
      }
      this.$mRouter.push({
        route,
      });
    },
  },
};
</script>

<style lang="scss">

</style>
