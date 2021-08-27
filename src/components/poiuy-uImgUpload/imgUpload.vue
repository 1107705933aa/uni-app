<template>
  <view class="w-100">
    <view class="w-100 flex_wrap">
      <view class="imgs-view" v-for="(v, i) in imgArray" :key="i">
        <image @click="preview(v, i)" :src="v.url"></image>
        <view class="del-btn" @click="delImg(i)">
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
            <image
              :src="
                config.loadIcon ||
                'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAACIUlEQVRIS72Xu4oVQRCGv/8VXAxE30ANxGuoKAhGKigGXmHRBzAwUFFxE8EFI0ER74ku4iaCgoKBgcvuYuIDCF4S0cz4l1pmlnNmemZ69+ychubAqer6qntq+q8RIwzbBn4AP4FPwIykuZyQynFq8inAVXOAH0q63xa7D3DJWwTuSHqeSqBPcMm7LulGFT4OcDBr8FHBW4DNQPzGPNzyXI9LmintI4GrENtngWlgXUMCy/A1BZcw2++B/Qn4oqQd8X8v4Ahs+wlwOgG/EK9ab+AC/h3YVIHPS9rVN/gg8Dax6329gotdv05U+91xgG8CV2rHPcpdnbPW9lHgVcX32zh2vLFQsEH2PzUozFZJX3N21OVjewPwq+K3BE6V/AlJL7qC5thtHwLe1I7a9mdgd8UwJelqTuAuH9uXgalacdm+DVysGGYlHekKmmO3HYUVBTY4puOoY7ex6+o4J+lxTvAmn0I0HiXse5aquuG4/0qaGBH8J6FUc5KWweeBewnIB0kHVgNvUahhkbC9AGxPQJ5KOrMSeIsy1WXR9kngWQMgWthJSe/aErAdovAgoUjlslNl8zd0c9m+Fv1RS/BZIC6WL0DZP0dxbstofYb6rtqVmQFfyamXvnnNnu1jwMvVEBJrhpq80t4oEgX8UkPB5eQUDf2twc5ycFGnOtmOV20S2JlDA+ajwNbsE8b2XiAeQSSwvpiRy+9iBjA+2j7mJPgfs4zO01msgbsAAAAASUVORK5CYII='
              "
            ></image>
            <view class="upload-txt">{{ config.loadText || '上传中...' }}</view>
          </view>
        </view>
        <view class="result" v-if="config.resultTip && v.upload">
          <label class="success" v-if="v.result === false">上传成功</label>
          <label class="error" v-if="v.result === true">上传失败</label>
        </view>
      </view>
      <view
        v-if="imgArray.length < imgCount"
        class="upload-img-view flex_xy_center"
        @click="upPhoto"
      >
        <image
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAArklEQVRIS2NkGCDAOED2Mgw9i9vb2xVAoVVZWfmAnFAj28ddXV33QRaWlZUp0tvi/1CLyXI8WZpAFnZ1dY1aTFJUjwY10cE1mriIDiqoQpTEBSoGmZmZ9zMwMICLQyqC08zMzDHFxcW3YGYODotJ8eFo4iIltEBqR0suokNsNHERHVTYSi5SNA9kUJ+CtrnMSHEw1iKTFAN6e3vVQOqRy19S9JOdj0mxBJvakWcxAFpiZB+QSLWnAAAAAElFTkSuQmCC"
        ></image>
      </view>
    </view>
    <view v-if="!closeTip && !prompt" class="tip"
      >* 最多上传{{ imgCount }}张图片(<label> {{ imgArray.length }} </label>/{{
        imgCount
      }})</view
    >
    <view class="tip" v-show="prompt">*{{ prompt }}</view>
  </view>
</template>

<script>
export default {
  name: 'imgUpload',
  props: {
    imgArr: {
      //图片数组
      type: [Array],
    },
    uploadImgCount: {
      //一次上传图片数
      type: String,
      default: '3',
    },
    imgCount: {
      //可上传图片总数
      type: String,
      default: '3',
    },
    imgSize: {
      //图片大小 单位M
      type: Number,
      default: 2,
    },
    imgMaxSize: {
      //图片大小 单位M
      type: Number,
      default: 2,
    },
    formData: {
      type: Object,
      default: function () {
        return {};
      },
    },
    imgType: {
      //如果是小程序，这个值则没用作用
      type: Array,
      default: function () {
        return ['jpg', 'jpeg', 'png'];
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
          delIcon: '', //删除图片icon
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
      imgArray: [],
      canUpCount: '',
      startUpload: false,
      prompt: '',
      headers: {},
      totalSize: 0,
    };
  },
  created() {
    this.imgArray = this.imgArr || [];
    this.changeImgArr(true);
    this.canUpCount = Number(this.uploadImgCount);
    if (this.url) {
      this.prompt = '';
    } else {
      this.prompt = '你没有传入上传url,请检查传入参数';
    }
    this.changeHeader(this.header);
  },
  watch: {
    imgArr(n, o) {
      this.imgArray = n || [];
      this.changeImgArr(true);
    },
    imgCount(n, o) {
      // this.uploadImgCount = n;
      // this.canUpCount = Number(this.uploadImgCount);
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
        Number(that.imgCount - that.imgArray.length) <
        Number(that.uploadImgCount)
      ) {
        that.canUpCount = Number(that.imgCount - that.imgArray.length);
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
                      if (item.size > that.imgSize * 1024 * 1024) {
                        uni.showToast({
                          title: `图片不能大于${that.imgSize}M`,
                          icon: 'none',
                        });
                        return false;
                      }

                      if (item.type) {
                        let r = that.imgType.some((v) => {
                          let type = item.type.split('/');
                          if (type.length) return v === type[1];
                        });
                        if (!r) {
                          uni.showToast({
                            title: `只允许上传${that.imgType}的类型`,
                            icon: 'none',
                          });
                          return false;
                        }
                      }
                    }
                  }
                  let startIndex = that.imgArray.length;
                  that.imgArray = [...that.imgArray, ...res.tempFilePaths];

                  that.changeImgArr(false);
                  if (that.async) {
                    //直接上传
                    that.asyncUpload(startIndex);
                  }
                }
              },
            });
          } else if (res.tapIndex == 1) {
            uni.chooseImage({
              count: Number(that.canUpCount),
              sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
              sourceType: ['album'], //从相册选择
              success: function (res) {
                console.log(res);
                if (res) {
                  if (res.tempFiles) {
                    for (let item of res.tempFiles) {
                      if (item.size > that.imgSize * 1024 * 1024) {
                        uni.showToast({
                          title: `图片不能大于${that.imgSize}M`,
                          icon: 'none',
                        });
                        return false;
                      }
                      that.totalSize =
                        that.totalSize + Number(item.size / 1024 / 1024);
                      if (that.totalSize > that.imgMaxSize) {
                        uni.showToast({
                          title: `图片总共不能大于${that.imgMaxSize}M`,
                          icon: 'none',
                        });
                        return false;
                      }
                      if (item.size) {
                        let r = that.imgType.some((v) => {
                          // #ifdef MP-WEIXIN
                          item.type = item.path.substring(
                            item.path.length - 3,
                            item.path.length
                          );
                          let type = item.type;
                          if (type.length)
                            return v.substring(v.length - 3, v.length) === type;
                          // #endif
                          // #ifdef H5 || APP-PLUS
                          let type = item.type.split('/');
                          if (type.length) return v === type[1];
                          // #endif
                        });
                        if (!r) {
                          uni.showToast({
                            title: `只允许上传${that.imgType}的类型`,
                            icon: 'none',
                          });
                          return false;
                        }
                      }
                    }
                  }
                  let startIndex = that.imgArray.length;

                  that.imgArray = [...that.imgArray, ...res.tempFilePaths];
                  that.$emit('funcurls', that.imgArray); // 选中的图片赋值给父组件
                  that.changeImgArr(false); // 处理处理数据，便于照片回显在页面上
                  if (that.async) {
                    that.asyncUpload(startIndex); //直接上传
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
    getImgUrl() {
      this.$emit('img-urls', this.imgArray);
    },
    preview(obj, index) {
      if (this.previewMany) {
        let urls = [];
        urls.push(obj.url);
        this.imgArray.map((item) => {
          if (obj.id != item.id) {
            urls.push(item.url);
          }
        });
        uni.previewImage({
          urls: urls,
        });
      } else {
        // 预览图片(单张)
        uni.previewImage({
          urls: [obj.url],
        });
      }
    },

    // 处理处理数据，便于照片回显在页面上
    changeImgArr(type) {
      this.imgArray.forEach((item, index) => {
        if (!item.upload) {
          if (false === item.upload) {
            this.imgArray[index].url = item.url;
          } else {
            this.imgArray[index] = {
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
      if (this.imgArray.length) {
        this.startUpload = true;
        _this.prompt = '';
        for (let i = index; i < this.imgArray.length; i++) {
          let item = this.imgArray[i];
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

    delImg(i) {
      const _this = this;
      uni.showModal({
        title: '提示',
        content: '是否删除这张照片？',
        success: function (res) {
          if (res.confirm) {
            _this.imgArray.splice(i, 1);
            _this.$emit('funcurls', _this.imgArray); // 选中的图片赋值给父组件
            if (_this.async) {
              _this.$emit('delImg', i);
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
        if (_this.imgArray.length) {
          this.startUpload = true;
          let successNum = 0;
          let urlArr = [];
          for (let item of _this.imgArray) {
            _this.uploadImg(item, (res) => {
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
              if (urlArr.length == _this.imgArray.length) {
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
          _this.prompt = '请先选择图片后上传！';
        }
      } else {
        _this.prompt = '在异步模式下无法调用upload方法。';
      }
    },

    // 返回结果处理
    result(urlArr, successNum) {
      let result = {
        result: 'success',
        code: 0,
        urlArray: urlArr,
        success: successNum,
      };
      return result;
    },

    uploadImg(item, callback) {
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
            msg: '图片上传失败',
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

.upload-img-view {
  height: 200rpx;
  width: 32%;
  border-radius: 10rpx;
  border: 4rpx dotted #f1f1f1;
}

.upload-img-view > image {
  width: 70upx;
  height: 70upx;
}

.upload-txt {
  font-size: 24upx;
  color: #ffffff;
}

.imgs-view {
  height: 200rpx;
  width: 31.5%;
  border-radius: 10rpx;
  margin-right: 1.8%;
  margin-bottom: 16rpx;
  border: 1upx solid #f1f1f1;
  box-sizing: border-box;
  position: relative;
}

.result {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 45rpx;
  font-size: 26rpx;
  left: 0;
  background-color: rgba(0, 0, 0, 0.6);
  text-align: center;
  line-height: 45rpx;
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
  z-index: 9;
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

.imgs-view > image {
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
  z-index: 999;
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
