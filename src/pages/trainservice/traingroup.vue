<template>
  <view
    style="background-color: rgb(240, 248, 250); height: 1500rpx; width: 750rpx"
  >
    <!-- 文件上传 -->
    <!-- <web-view src="../../hybrid/html/index.html" @message="handleMessage"></web-view> -->
    <!-- <view class="content">
      <button type="primary" @tap="openFile">打开文件选择器</button>
      <view>文件路径为:</view>
      <view class="path">{{ path }}</view>
      <tki-file-manager
        ref="filemanager"
        @result="resultPath"
      ></tki-file-manager>
    </view> -->

    <view v-if="qrCodeData.length > 0">
      <view style="width: 80%; margin-left: 10%">
        <image
          :src="qrCodeData[0].image"
          mode="widthFix"
          style="margin-top: 50rpx"
        ></image>
      </view>
      <!--底部培训群信息-->
      <view style="background-color: rgb(240, 248, 250)">
        <view style="text-align: center">
          <text>{{ qrCodeData[0].msg }}</text>
        </view>
      </view>
      <!--底部培训群详情-->
      <view
        class="detail-desc"
        v-if="qrCodeData[0].details != ''"
        style="background-color: rgb(240, 248, 250)"
      >
        <view class="d-header">
          <text>群简介</text>
        </view>
        <rf-parser :html="qrCodeData[0].details" lazy-load></rf-parser>
      </view>
    </view>

    <rf-empty
      class="empty"
      info="暂无培训群信息"
      v-if="qrCodeData.length === 0 && !loading"
    ></rf-empty>
    <rfLoading isFullScreen :active="loading"></rfLoading>
  </view>
</template>

<script>
// import tkiFileManager from '@/components/tki-file-manager/tki-file-manager.vue';
// import tkiFileManager from '../../components/tki-file-manager/tki-file-manager';
import { getGroupApi } from '@/api/product';
export default {
  data() {
    return {
      qrCodeData: [],
      loading: true,
      //   //   文件上传
      //   title: '',
      //   path: '',
    };
  },
  // 注册组件
  components: {
    // tkiFileManager,
  },
  onShow() {
    (this.qrCodeData = []), this.getGroup();
  },
  methods: {
    // //   文件上传
    handleMessage(evt) {
    //   let msg = '@message传递数据：' + JSON.stringify(evt.detail.data);
    //   uni.showModal({
    //     content: msg,
    //     showCancel: false,
    //   });
    //   console.log(msg);
      // todo 写入到store中
    },
    // openFile() {
    //   this.$refs.filemanager._openFile();
    // },
    // resultPath(e) {
    //   this.path = e;
    // },
    async getGroup() {
      this.loading = true;
      await this.$http
        .get(`${getGroupApi}`, {
          page: 0,
          size: 10,
          sort: 'sort,asc',
        })
        .then((r) => {
          this.loading = false;
          this.qrCodeData = r.content; //默认取第一条
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="scss">
// 文件上传
.content {
  width: 100%;
  overflow: hidden;
}
.path {
  font-size: 14px;
  word-break: break-all;
}
</style>
