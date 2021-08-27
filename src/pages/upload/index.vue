<template>
  <view>
    <l-file ref="lFile" @up-success="upSuccess"></l-file>
    <button @tap="chooseFile">选择文件</button>
  </view>
</template>
<script>
import lFile from '../../components/l-file/l-file.vue';
import { uploadImage } from '@/api/userInfo';
import indexConfig from '@/config/index.config';
import { mapMutations } from 'vuex';
export default {
  components: {
    lFile,
  },
  data() {
    return {
      uploadUrl: '',
    };
  },
  computed: {},
  filters: {},
  onShow() {},
  onLoad(options) {},
  methods: {
    upSuccess(e) {
      this.data = e;
    },
    chooseFile() {
      let _this = this;
      this.uploadUrl = indexConfig.baseUrl + uploadImage;
      this.$refs.lFile.upload({
        // #ifdef APP-PLUS
        currentWebview: this.$mp.page.$getAppWebview(),
        // #endif
        url: _this.uploadUrl,
        name: 'file',
      });
    },

    aa(aa) {
      this.data = aa;
    },
  },
};
</script>
<style lang="scss">
</style>
