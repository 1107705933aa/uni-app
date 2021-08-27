<template>
	<view class="input-content">
		<view class="form-content">
			<view class="input-item">
				<text class="iconfont icon-gongzuoxingzhi" :class="'text-' + themeColor.name"></text>
				<text class="tit">商品类型：</text>
				<picker :range="property" range-key="label" :value="propertyType" @change="bindPickerChange($event)" placeholder="请选择商品类型">
					<view>{{ pickerDataProperty }}</view>
				</picker>
			</view>

			<view class="input-item">
				<text class="iconfont icongouwux" :class="'text-' + themeColor.name"></text>
				<text class="tit">商品名称：</text>
				<input class="input" type="text" v-model="form.storeName" placeholder="请输入商品名称" />
			</view>

			<view class="input-item">
				<text class="iconfont iconiconfontfenxiangjitianchong" :class="'text-' + themeColor.name"></text>
				<text class="tit">商品链接：</text>
				<input class="input" type="text" v-model="form.storeInfo" placeholder="请输入商品链接" />
			</view>

			<view class="input-item">
				<text class="iconfont icon-zuocelan" :class="'text-' + themeColor.name"></text>
				<text class="tit">封面左侧：</text>
				<input class="input" type="text" v-model="form.sketch" maxlength="7" placeholder="请输入封面左侧内容" />
			</view>

			<view class="input-item">
				<text class="iconfont icon-youcelan" :class="'text-' + themeColor.name"></text>
				<text class="tit">封面右侧：</text>
				<input class="input" type="text" v-model="form.teachkey" maxlength="7" placeholder="请输入封面右侧内容" />
			</view>

			<view class="input-item">
				<text class="iconfont icongouwux" :class="'text-' + themeColor.name"></text>
				<text class="tit">店铺名：</text>
				<input class="input" type="text" v-model="form.unitName" placeholder="请输入店铺名" />
			</view>

			<view class="comb-item">
				<view class="first-item" style="border:0;">
					<text class="iconfont iconicontianjiatupian" :class="'text-' + themeColor.name"></text>
					<text class="tit">样品图片：</text>
				</view>
			</view>
			<!-- 图片上传 -->
			<imgUpload style="margin-bottom:16vh;" ref="imgUpload" previewMany :imgArr="imgArray" loading async imgCount="1"
			 :url="uploadUrl" @result="resultUrl" @delImg="delImg"></imgUpload>

			<view class="btn_view">
				<button class="form_btn" :loading="btnLoading" @click="reduceActive" size="default" :class="'bg-' + themeColor.name">商品提交</button>
			</view>
		</view>
		<!--底部提示-->
		<view class="detail-desc" v-if="marketUrl!=''">
			<view class="d-header">
				<text>{{marketName}}</text>
			</view>
			<rf-parser :html="marketUrl" lazy-load></rf-parser>
		</view>
		<view class="btn_view">
			<!--加载动画-->
			<rfLoading isFullScreen :active="loading"></rfLoading>
		</view>
	</view>
</template>
<script>
	/**
	 * @des 佣金明细
	 *
	 * @author stav stavyan@qq.com
	 * @date 2020-01-13 11:18
	 * @copyright 2019
	 */
	var _self;
	import rfLoadMore from '@/components/rf-load-more/rf-load-more.vue';
	import moment from '@/common/moment';
	import imgUpload from '@/components/poiuy-uImgUpload/imgUpload';
	import {
		uploadImage
	} from '@/api/userInfo';
	import {
		getUserType
	} from '@/api/basic.js';
	import indexConfig from '@/config/index.config';
	import {
		getRegistration
	} from '@/api/login';
	import {
		getStoreCategoryType,
		uploadStoreProduct
	} from '@/api/product';
	export default {
		components: {
			rfLoadMore,
			imgUpload
		},
		data() {
			return {
				pickerDataProperty: undefined,
				property: undefined,
				loading: false,
				btnLoading: false,
				form: {
					image: '',
					storeName: '',
					storeInfo: '', //暂存商品链接
					// otPrice:0,//市场价
					keyword: '', //关键字 == 商品类别
					cateId: '', //分类ID
					// price:0,//目前默认为2
					sketch: '', //封面左侧内容
					teachkey: '', //封面右侧内容
					browse: 0, //浏览量-->默认为0
					description: '商城商品', //商品详情
					sliderImage: '', //商品轮播图
					// cost:0,//成本价
					isShow: 0, //默认为下架状态
					isDel: 0,
					type: 0, //-->培训课程商品
					unitName: '', //店铺名
				},
				marketName: '',
				uploadUrl: '',
				marketUrl: '',
				imgArray: [], //图片数组
				propertyType: 0
			}
		},
		onLoad() {
			_self = this;
			this.uploadUrl = indexConfig.baseUrl + uploadImage;
			//判断权限
			this.$http.get(getUserType).then(res => {
				if (res) {
					this.getRegistration();
					this.getYxStoreCategory();
				} else {
					uni.showModal({
						title: '提示',
						content: '仅限系统授权的商户访问，您暂无权限访问',
						success() {
							_self.$mRouter.reLaunch({ //返回主页
								route: '/pages/index/index',
							});
						},
						fail(e) {
							_self.$mRouter.reLaunch({ //返回主页
								route: '/pages/index/index',
							});
						}
					})
				}
			})

		},
		methods: {
			//图片上传成功
			resultUrl(e) {
				//成功默认为0
				if (e.statusCode == 201) {
					let data = JSON.parse(e.data);
					this.form.image = data.link;
				}
			},
			delImg(e) {
				this.imgArray.splice(e, 1); //为删除图片数组的下标
			},
			// 页面picker change事件
			bindPickerChange(e) {
				this.propertyType = e.detail.value;
				this.pickerDataProperty = this.property[this.propertyType].label;
				this.form.cateId = this.property[this.propertyType].id;
				this.form.keyword = this.property[this.propertyType].label;
			},
			//下方提示
			getRegistration() {
				this.$http.get(getRegistration, {
					page: 0,
					size: 10,
					sort: 'sort,asc'
				}).then(res => {
					if (res) {
						this.marketName = res.content[0].marketName;
						this.marketUrl = res.content[0].marketUrl;
					}
				})
			},
			//获取商品类型
			getYxStoreCategory() {
				this.$http.post(getStoreCategoryType, {
					code: 1111
				}).then(res => {
					if (res.children.length != 0) {
						this.property = res.children;
						this.pickerDataProperty = this.property[this.propertyType].label;
						this.form.cateId = this.property[this.propertyType].id; //默认值
						this.form.keyword = this.pickerDataProperty; //默认值
					}
				})
			},
			//提交订单
			reduceActive() {
				const cheRes = this.$mGraceChecker.check(
					this.form,
					this.$mFormRule.getStoreProductRule
				);
				if (!cheRes) {
					this.$mHelper.toast(this.$mGraceChecker.error);
					return;
				};
				this.btnLoading = true;
				this.$http.post(uploadStoreProduct, this.form).then(res => {
					this.btnLoading = false;
					this.$mHelper.toast('商品提交成功')
					this.resetForm();
				})

			},
			//重置表单
			resetForm() {
				this.form = {
					image: '',
					storeName: '',
					storeInfo: '', //暂存商品链接
					// otPrice:0,//市场价
					keyword: '', //关键字 == 商品类别
					cateId: '', //分类ID
					// price:0,//目前默认为2
					sketch: '', //封面左侧内容
					teachkey: '', //封面右侧内容
					browse: 0, //浏览量-->默认为0
					description: '商城商品', //商品详情
					// cost:0,//成本价
					isShow: 0, //默认为下架状态
					isDel: 0,
					sliderImage: '', //商品轮播图
					type: 0, //-->培训课程商品
					unitName: '', //店铺名
				};
				this.marketName = '';
				this.uploadUrl = '';
				this.marketUrl = '';
				this.imgArray = []; //图片数组
				this.propertyType = 0;
			}
		},
	}
</script>
<style scoped lang="scss">
	.input-content {
		position: relative;
		// height: 100vh;
		padding: 40upx 30upx;
		background: #fff;

		.form-content {
			padding: 0 40upx;
			margin-top: 20upx;
			border-style: solid;
			border-color: rgba(240, 240, 240);
		}

		.btn_view {
			display: flex;
			margin-bottom: 70upx;
			margin-top: -70rpx;

			.form_btn {
				height: 70upx;
				display: flex;
				align-items: center;
				font-size: $font-base + 2upx;
			}
		}

		.comb-item {
			display: flex;
			line-height: 60upx;
			margin-top: 90upx;
			margin-bottom: 80upx;

			.first-item {
				width: 100vw;

				.tit {
					font-size: $font-base + 2upx;
					color: $font-color-base;
					margin-left: 5upx;
				}

				.checkbox-content {
					height: 35vh;
					padding: 0 30upx;
					font-size: $font-base + 7upx;
					overflow-y: auto;
					margin-top: 20upx;
					color: #787676;
				}

				.checkbox-itemm {
					margin-left: 20upx;
					margin-bottom: 20upx;
				}
			}
		}

		.input-item {
			position: relative;
			display: flex;
			padding: 0 30upx;
			height: 80upx;
			line-height: 65upx;
			border-radius: 4px;
			margin-bottom: 55upx;
			margin-top: 55upx;
			border-bottom: 1px solid #e5e5e5;

			.iconfont {
				font-size: 55upx;
				position: absolute;
				left: 0;
			}

			&:last-child {
				margin-bottom: 0;
			}

			.tit {
				width: 200upx;
				font-size: $font-base + 2upx;
				color: $font-color-base;
				margin-left: 50upx;
			}

			input {
				height: 60upx;
				width: calc(100% - 100upx);
				line-height: 60upx;
				font-size: $font-base + 7upx;
			}

			picker {
				width: calc(100% - 100upx);
				height: 60upx;
				line-height: 60upx;
				font-size: $font-base + 7upx;
				color: $font-color-dark;

				view {
					line-height: 60upx;
				}
			}

			uni-picker uni-view[data-v-4af2c966] {
				font-size: $font-base + 7upx;
			}
		}
	}
</style>
