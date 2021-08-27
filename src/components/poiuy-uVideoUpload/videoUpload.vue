<template>
  <!-- https://ext.dcloud.net.cn/plugin?id=1968 -->
  <view class="w-100">
    <view class="w-100 flex_wrap">
      <view class="videos-view" v-for="(v, i) in videoArray" :key="i">
        <video :src="v.url"></video>
        <view class="del-btn" @click="delVideo(i)">
          <image
            :src="
              config.delIcon ||
              'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA5UlEQVQ4T2NkQAP3fTXs//1njPvP8N+BkYFBCST9n4HhHiMD4wEmxv+LFDffOIishRGZc89HY9Z/BoZUdEPRNMxW2nIjDSYGN+COj8YORgYGd3yaYXL/GRh2qmy54QHigw0gxmZ0gxkZGMAuYYT4meEAMTajq2FiZHBgvOujOZeB4X8SOQYwMDDOY7zjo3EXFtqkGgKOnbs+Gv9hGsVKexm4jG3xmvPt7GGGV93FcDUoBvD7xTGwyijiNeD3k/sMHzctQhhABS9QGIgURyPFCQkWGhQlZZghxCRpWBLGyEwwAVKzMwB5V2gPAYXmLgAAAABJRU5ErkJggg=='
            "
          ></image>
        </view>
        <view
          class="uploading flex_xy_center"
          v-if="!v.upload && loading && startUpload"
        >
          <view>
            <cover-image
              :src="
                config.loadIcon ||
                'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAACIUlEQVRIS72Xu4oVQRCGv/8VXAxE30ANxGuoKAhGKigGXmHRBzAwUFFxE8EFI0ER74ku4iaCgoKBgcvuYuIDCF4S0cz4l1pmlnNmemZ69+ychubAqer6qntq+q8RIwzbBn4AP4FPwIykuZyQynFq8inAVXOAH0q63xa7D3DJWwTuSHqeSqBPcMm7LulGFT4OcDBr8FHBW4DNQPzGPNzyXI9LmintI4GrENtngWlgXUMCy/A1BZcw2++B/Qn4oqQd8X8v4Ahs+wlwOgG/EK9ab+AC/h3YVIHPS9rVN/gg8Dax6329gotdv05U+91xgG8CV2rHPcpdnbPW9lHgVcX32zh2vLFQsEH2PzUozFZJX3N21OVjewPwq+K3BE6V/AlJL7qC5thtHwLe1I7a9mdgd8UwJelqTuAuH9uXgalacdm+DVysGGYlHekKmmO3HYUVBTY4puOoY7ex6+o4J+lxTvAmn0I0HiXse5aquuG4/0qaGBH8J6FUc5KWweeBewnIB0kHVgNvUahhkbC9AGxPQJ5KOrMSeIsy1WXR9kngWQMgWthJSe/aErAdovAgoUjlslNl8zd0c9m+Fv1RS/BZIC6WL0DZP0dxbstofYb6rtqVmQFfyamXvnnNnu1jwMvVEBJrhpq80t4oEgX8UkPB5eQUDf2twc5ycFGnOtmOV20S2JlDA+ajwNbsE8b2XiAeQSSwvpiRy+9iBjA+2j7mJPgfs4zO01msgbsAAAAASUVORK5CYII='
              "
            ></cover-image>
            <view class="upload-txt">{{ config.loadText || '上传中...' }}</view>
          </view>
        </view>
        <view class="result" v-if="config.resultTip && v.upload">
          <label class="success" v-if="v.result === false">上传成功</label>
          <label class="error" v-if="v.result === true">上传失败</label>
        </view>
      </view>
      <view
        v-if="videoArray.length < videoCount"
        class="upload-video-view flex_xy_center"
        @click="upPhoto"
      >
        <image
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAArklEQVRIS2NkGCDAOED2Mgw9i9vb2xVAoVVZWfmAnFAj28ddXV33QRaWlZUp0tvi/1CLyXI8WZpAFnZ1dY1aTFJUjwY10cE1mriIDiqoQpTEBSoGmZmZ9zMwMICLQyqC08zMzDHFxcW3YGYODotJ8eFo4iIltEBqR0suokNsNHERHVTYSi5SNA9kUJ+CtrnMSHEw1iKTFAN6e3vVQOqRy19S9JOdj0mxBJvakWcxAFpiZB+QSLWnAAAAAElFTkSuQmCC"
        ></image>
      </view>
    </view>
    <view v-if="!closeTip && !prompt" class="tip"
      >* 最多上传{{ videoCount }}部视频(<label> {{ videoArray.length }} </label
      >/{{ videoCount }})</view
    >
    <view class="tip" v-show="prompt">*{{ prompt }}</view>
  </view>
</template>

<script>
export default {
  name: 'videoUpload',
  props: {
    videoArr: {
      //视频数组
      type: [Array],
    },
    uploadVideoCount: {
      //一次上传视频数
      type: String,
      default: '3',
    },
    videoCount: {
      //可上传视频总数
      type: String,
      default: '3',
    },
    videoSize: {
      //视频大小 单位M
      type: Number,
      default: 2,
    },
    formData: {
      type: Object,
      default: function () {
        return {};
      },
    },
    videoType: {
      //如果是小程序，这个值则没用作用
      type: [Array],
      default: function () {
        return ['mp4'];
      },
    },
    closeTip: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: true,
    },
    url: {
      //上传视频Url
      type: String,
    },
    async: {
      type: Boolean,
      default: false,
    },
    header: {
      type: Array,
      default: function () {
        return [];
      },
    },
    previewMany: {
      //多图预览
      type: Boolean,
      default: false,
    },
    config: {
      type: Object,
      default: function () {
        return {
          delIcon: '', //删除视频icon
          resultTip: true, //结果提示
          resultType: '1', //结果展示类型
          loadIcon: '', //加载时的图标
          loadText: '', //加载时的文字
        };
      },
    },
  },
  data() {
    return {
      videoArray: [],
      canUpCount: '',
      startUpload: false,
      prompt: '',
      headers: {},
    };
  },
  created() {
    this.videoArray = this.videoArr || [];
    this.changevideoArr(true);
    this.canUpCount = Number(this.uploadVideoCount);
    if (this.url) {
      this.prompt = '';
    } else {
      this.prompt = '你没有传入上传url,请检查传入参数';
    }
    this.changeHeader(this.header);
  },
  watch: {
    videoArr(n, o) {
      this.videoArray = n || [];
      this.changevideoArr(true);
    },
    videoCount(n, o) {
      //   this.uploadVideoCount = n;
      //   this.canUpCount = Number(this.uploadVideoCount);
    },
    url(n, o) {
      if (n) {
        this.prompt = '';
      } else {
        this.prompt = '你没有传入上传url,请检查传入参数';
      }
    },
    header(n, o) {
      this.changeHeader(n);
    },
  },
  methods: {
    upPhoto() {
      let that = this;
      if (!that.url) {
        that.prompt = '你没有传入上传url,请检查！';
        return;
      }
      if (
        Number(that.videoCount - that.videoArray.length) <
        Number(that.uploadVideoCount)
      ) {
        that.canUpCount = Number(that.videoCount - that.videoArray.length);
      }
      that.prompt = '';
      uni.showActionSheet({
        itemList: ['拍照上传', '从相册中选择'],
        success: function (res) {
          if (res.tapIndex == 0) {
            uni.chooseImage({
              count: Number(that.canUpCount),
              sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
              sourceType: ['camera'], //从相册选择
              success: function (res) {
                if (res) {
                  if (res.tempFiles) {
                    for (let item of res.tempFiles) {
                      if (item.size > that.videoSize * 1024 * 1024) {
                        uni.showToast({
                          title: `视频不能大于${that.videoSize}M`,
                          icon: 'none',
                        });
                        return false;
                      }
                      if (item.type) {
                        // let r = that.videoType.some((v) => {
                        // 	let type = item.type.split('/');
                        // 	if (type.length) return v === type[1];
                        // });
                        let r = that.videoType.some((v) => {
                          return v === item.type;
                        });
                        if (!r) {
                          uni.showToast({
                            title: `只允许上传${that.videoType}的类型`,
                            icon: 'none',
                          });
                          return false;
                        }
                      }
                    }
                  }
                  let startIndex = that.videoArray.length;
                  that.videoArray = [...that.videoArray, ...res.tempFilePaths];

                  that.changevideoArr(false);
                  if (that.async) {
                    //直接上传
                    that.asyncUpload(startIndex);
                  }
                }
              },
            });
          } else if (res.tapIndex == 1) {
            uni.chooseVideo({
              count: Number(that.canUpCount),
              sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
              sourceType: ['camera', 'album', 'qlv'], //从相册选择
              success: function (res) {
                if (res) {
                  // #ifdef MP-WEIXIN
                  let tempFiles = [];
                  let aType = res.tempFilePath.substring(
                    res.tempFilePath.length - 3,
                    res.tempFilePath.length
                  );
                  tempFiles.push({
                    type: aType,
                    size: res.size,
                  });

                  // #endif
                  // #ifdef H5 || APP-PLUS
                  let tempFiles = [];
                  let aType = res.tempFile.type.split('/');
                  tempFiles.push({
                    size: res.tempFile.size,
                    type: aType[1],
                  });
                  // #endif
                  if (tempFiles) {
                    for (let item of tempFiles) {
                      if (item.size > that.videoSize * 1024 * 1024) {
                        uni.showToast({
                          title: `视频不能大于${that.videoSize}M`,
                          icon: 'none',
                        });
                        return false;
                      }
                      if (item.type) {
                        let r = that.videoType.some((v) => {
                          return (
                            v.substring(v.length - 3, v.length) === item.type
                          );
                        });
                        if (!r) {
                          uni.showToast({
                            title: `只允许上传${that.videoType}的类型`,
                            icon: 'none',
                          });
                          return false;
                        }
                      }
                    }
                  }
                  let startIndex = that.videoArray.length;
                  let tempFilePaths = [];
                  tempFilePaths.push(res.tempFilePath);
                  that.videoArray = [...that.videoArray, ...tempFilePaths];
                  that.$emit('funcurls', that.videoArray); // 父组件存储未上传视频
                  that.changevideoArr(false); // 视频回显
                  if (that.async) {
                    //直接上传
                    that.asyncUpload(startIndex);
                  } else {
                    that.$emit('result', {
                      code: 500,
                      msg: '同步模式下,我不会被调用哦~',
                    });
                  }
                }
              },
            });
          }
        },
        fail: function (res) {
          // console.log(res.errMsg);
        },
      });
    },
    getVideoUrl() {
      this.$emit('img-urls', this.videoArray);
    },
    preview(obj, index) {
      if (this.previewMany) {
        let urls = [];
        urls.push(obj.url);
        this.videoArray.map((item) => {
          if (obj.id != item.id) {
            urls.push(item.url);
          }
        });
        uni.previewImage({
          urls: urls,
        });
      } else {
        // 预览视频(单张)
        uni.previewImage({
          urls: [obj.url],
        });
      }
    },

    changevideoArr(type) {
      this.videoArray.forEach((item, index) => {
        if (!item.upload) {
          if (item.upload === false) {
            this.videoArray[index].url = item.url;
          } else {
            this.videoArray[index] = {
              id: index,
              upload: type,
              url: item,
              result: null,
            };
          }
        }
      });
    },

    asyncUpload(index) {
      const _this = this;
      if (this.videoArray.length) {
        this.startUpload = true;
        _this.prompt = '';
        for (let i = index; i < this.videoArray.length; i++) {
          let item = this.videoArray[i];
          uni.uploadFile({
            url: _this.url,
            filePath: item.url,
            name: 'file',
            header: _this.headers,
            formData: _this.formData,
            success: (uploadFileRes) => {
              if (uploadFileRes.statusCode == 200) {
                let res = JSON.parse(uploadFileRes.data);
                item.result = true;
                res.code = 0;
                _this.$emit('result', res);
              } else {
                item.result = false;
                _this.$emit('result', uploadFileRes);
              }
              item.upload = true;
              _this.startUpload = false;
              _this.$forceUpdate();
            },
            fail: (e) => {
              item.result = false;
              _this.startUpload = false;
              _this.prompt = '上传失败，请检查！';
              _this.$forceUpdate();
            },
          });
        }
      }
    },

    delVideo(i) {
      const _this = this;
      uni.showModal({
        title: '提示',
        content: '是否删除这部视频？',
        success: function (res) {
          if (res.confirm) {
            _this.videoArray.splice(i, 1);
            if (_this.async) {
              _this.$emit('delVideo', i);
            }
          } else if (res.cancel) {
          }
        },
      });
    },

    upload(callback) {
      const _this = this;
      if (!_this.async) {
        _this.prompt = '';
        if (_this.videoArray.length) {
          this.startUpload = true;
          let successNum = 0;
          let urlArr = [];
          for (let item of _this.videoArray) {
            _this.uploadVideo(item, (res) => {
              if (res.resCode == 0) {
                successNum++;
                urlArr.push(res.link);
                item.result = true;
              } else {
                urlArr.push(res);
                item.result = false;
              }
              item.upload = true;
              _this.$forceUpdate();
              _this.prompt =
                '正在上传...(成功' + successNum + '张/' + urlArr.length + '张)';
              if (urlArr.length == _this.videoArray.length) {
                _this.prompt = '已全部上传完成！';
                if (successNum > 0) {
                  _this.startUpload = false;
                  callback(_this.result(urlArr, successNum));
                } else {
                  _this.startUpload = false;
                  callback(urlArr); //错误的返回
                }
              }
            });
          }
        } else {
          _this.prompt = '请先选择视频后上传！';
        }
      } else {
        _this.prompt = '在异步模式下无法调用upload方法。';
      }
    },

    result(urlArr, successNum) {
      let result = {
        result: 'success',
        code: 0,
        urlArray: urlArr,
        success: successNum,
      };
      return result;
    },

    uploadVideo(item, callback) {
      const _this = this;
      uni.uploadFile({
        url: _this.url,
        filePath: item.url,
        formData: _this.formData,
        header: _this.headers,
        name: 'file',
        success: (uploadFileRes) => {
          if (uploadFileRes) {
            let res = JSON.parse(uploadFileRes.data);
            res.resCode = 0;
            callback(res);
          }
        },
        fail: (e) => {
          callback({
            resCode: 500,
            msg: '视频上传失败',
            localUrl: item,
            reason: e,
          });
        },
      });
    },

    changeHeader(header) {
      const _this = this;
      if (Array.isArray(header)) {
        for (let item of header) {
          for (let key in item) {
            _this.headers[key] = item[key];
          }
        }
      } else {
        _this.prompt = '请使用数组格式的Header传参';
      }
    },
  },
};
</script>


<style scoped>
.w-100 {
  width: 100%;
}

.flex {
  /* 转为弹性盒模型*/
  display: flex;
}

.flex_bet {
  /* 两端左右*/
  display: flex;
  justify-content: space-between;
}

.flex_wrap {
  /* 转为弹性盒模型并自动换行*/
  display: flex;
  flex-wrap: wrap;
}

.flex_xy_center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.upload-video-view {
  height: 200rpx;
  width: 32%;
  border-radius: 10rpx;
  border: 4rpx dotted #f1f1f1;
}

.upload-video-view > image {
  width: 70upx;
  height: 70upx;
}

.upload-txt {
  font-size: 24upx;
  color: #ffffff;
}

.videos-view {
  height: 320rpx;
  width: 100%;
  border-radius: 10rpx;
  margin-right: 1.8%;
  margin-bottom: 16rpx;
  border: 1upx solid #f1f1f1;
  box-sizing: border-box;
  position: relative;
}

.result {
  position: absolute;
  bottom: 0rpx;
  width: 100%;
  height: 28rpx;
  font-size: 26rpx;
  left: 0;
  background-color: rgba(0, 0, 0, 0.6);
  text-align: center;
  line-height: 30rpx;
  border-bottom-left-radius: 10rpx;
  border-bottom-right-radius: 10rpx;
}

.result > .success {
  color: #00b900;
}

.result > .error {
  color: #b52e25;
}

.uploading {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  text-align: center;
  line-height: 100%;
  z-index: 999;
}

.uploading image {
  width: 60rpx;
  height: 60rpx;
  z-index: 1000;
  animation: rotation 0.6s linear infinite;
  -moz-animation: rotation 0.6s linear infinite;
  -webkit-animation: rotation 0.6s linear infinite;
  -o-animation: rotation 0.6s linear infinite;
}

@keyframes rotation {
  from {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -o-transform: rotate(0deg);
  }

  to {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -o-transform: rotate(360deg);
  }
}

.videos-view > video {
  width: 100%;
  height: 100%;
  border-radius: 10upx;
}

.tip {
  font-size: 24upx;
  color: #ff0000;
  margin-top: 12upx;
}

.tip > label {
  color: #009100;
}

.del-btn {
  position: absolute;
  top: 0;
  right: 0;
  width: 32upx;
  height: 32upx;
  z-index: 9;
}

.del-btn > image {
  width: 100%;
  height: 100%;
  display: flex;
}

.css2 {
  border-style: solid;
  border-width: 0px 0px 100px 100px;
  border-color: transparent transparent blue transparent;
  width: 0px;
  height: 0px;
}
</style>
