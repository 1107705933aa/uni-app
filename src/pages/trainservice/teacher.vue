<template>
  <view class="container">
    <!-- 左侧显示略缩图、图标 -->
    <!-- <uni-list v-for="(item, index) in teacherList" v-show="false" :key="index">
      <uni-list-item
        :title="item.name"
        :note="item.detailsMsg"
        :thumb="item.avacator"
        thumb-size="lg"
        :ellipsis="1"
        :clickable="true"
        :rightText="
          item.courseslist != null && item.courseslist.length != 0
            ? item.courseslist[0].courseName
            : '暂未发布主讲课程'
        "
        @click="
          navTo(
            '/pages/trainservice/teacherdeatils?data=' + JSON.stringify(item)
          )
        "
        showArrow="true"
        switchChecked="true"
      ></uni-list-item>
    </uni-list> -->

    <view class="product-list-wrapper">
      <rf-product-list
        :eid="'teacherId'"
        :bottom="0"
        :list="teacherList"
        :isList="isList"
        :style="{ paddingTop: dropScreenH + 10 + 'upx' }"
      ></rf-product-list>
    </view>
    <rf-load-more
      :status="loadingType"
      v-if="teacherList.length > 0"
    ></rf-load-more>
    <rf-empty
      class="empty"
      info="暂无讲师"
      v-if="teacherList.length === 0 && !loading"
    ></rf-empty>
    <rfLoading isFullScreen :active="loading"></rfLoading>
  </view>
</template>

<script>
import rfLoadMore from '@/components/rf-load-more/rf-load-more';
import teacherdeatils from './teacherdeatils.vue';
import rfProductList from '@/components/rf-product-list/index';
import { teacherList } from '@/api/trainservice';
export default {
  components: {
    rfLoadMore,
    teacherdeatils,
    rfProductList,
  },
  data() {
    return {
      page: 0,
      teacherList: [],
      loadingType: 'more',
      loading: true,
      dropScreenH: 0, //下拉筛选框距顶部距离
      isList: false, //是否以列表展示  | 列表或大图
    };
  },
  // 下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
  onPullDownRefresh() {
    this.page = 0
    this.teacherList = [];
    this.getTeacherList('refresh');
  },
  // 加载更多
  onReachBottom() {
    if (this.loadingType === 'nomore') return;
    this.page++;
    this.getMyCouponList();
  },
  async onShow() {
    // 初始化数据
    await this.initData();
  },
  methods: {
    initData() {
      this.page = 0;
      (this.teacherList = []), this.getTeacherList();
    },
    getTeacherList(type) {
      this.loading = true;
      //获取讲师信息
      this.$http
        .get(`${teacherList}`, {
          // name:'',
          page: 0,
          size: 10,
          sort: 'id,desc',
        })
        .then((res) => {
          this.loading = false;
          if (type === 'refresh') {
            uni.stopPullDownRefresh();
          }
          this.loadingType =
            parseInt(res.totalElements) > 10 ? 'more' : 'nomore';
          this.teacherList = [...this.teacherList, ...res.content];
          console.log(this.teacherList);
          for (let i = 0; i < this.teacherList.length; i++) {
            this.teacherList[i].courseName2 = this.teacherList[
              i
            ].courseslist[0].courseName;
          }
        })
        .catch(() => {
          this.loading = false;
          if (type === 'refresh') {
            uni.stopPullDownRefresh();
          }
        });
    },
    // 统一跳转路由
    navTo(route) {
      this.$mRouter.push({
        route,
      });
    },
  },
};
</script>

<style lang="scss">
.container {
  height: 100vh;
  background: #fff;
}

.empty {
  width: 100vw;
  display: block;
}
img {
  width: 100upx;
}
</style>
