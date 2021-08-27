<template>
	<view>
		<uni-section title="证书信息" type="line"></uni-section>
		<uni-card v-if="false" style="margin-top: 0"  :title="credentialDetail.credentialName" mode="style" :is-shadow="true"
		 thumbnail="https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/cbd.jpg" :extra="credentialDetail.sampleType" :note="credentialDetail.credentialNo"
		 @previewImg="previewImg">
			<template v-slot:footer>
				<view class="footer-box" style="display: flex; justify-content: space-between">
					<view class="form_btn btn-style" v-if="!credentialDetail.isCredentialAdd" @tap="addToCard(credentialDetail, 'credential')"
					 size="mini">
						添加到卡包
					</view>
					<view v-if="credentialDetail.isCredentialAdd"></view>
					<view>
						<!-- #ifdef H5 -->
						<a class="form_btn" :href="credentialDetail.credentialUrl" target="_blank">下载证书</a>
						<!-- #endif -->
						<!-- #ifndef H5 -->
						<a class="form_btn" @tap="downLoadFile(credentialDetail.credentialUrl)" target="_blank">
							下载证书
						</a>
						<!-- #endif -->
					</view>
				</view>
			</template>
		</uni-card>
		<view  style="position: relative">
			<web-view style="width: 100%; height: 197px" :src="credentialDetail.credentialUrl"></web-view>
			<uni-card :is-shadow="true" style="top: 197px" >
				<view style="display: flex; justify-content: space-between">
					<view class="form_btn" v-if="!credentialDetail.isCredentialAdd" @tap="addToCard(credentialDetail, 'credential')" size="mini">添加到卡包</view>
					<view v-if="credentialDetail.isCredentialAdd"></view>
					<view>
						<!-- #ifdef H5 -->
						<a class="form_btn" :href="credentialDetail.credentialUrl" target="_blank">下载证书</a>
						<!-- #endif -->
						<!-- #ifndef H5 -->
						<a class="form_btn" @tap="downLoadFile(credentialDetail.credentialUrl)" target="_blank">
							下载证书
						</a>
						<!-- #endif -->
					</view>
				</view>
			</uni-card>
		</view>

		<uni-section v-show="false" title="发票信息" type="line"  v-if="hasdata && credentialDetail.hasbill == '1'"></uni-section>
		<uni-section  title="发票信息" type="line" style="margin-top: 210px" v-if="hasdata && credentialDetail.hasbill == '1'"></uni-section>
		<view v-if="hasdata && credentialDetail.hasbill == '1'" style="position: relative">
			<web-view style="width: 100%; height: 200px; top: 0px" :src="credentialDetail.billUrl"></web-view>
			<uni-card :is-shadow="true" style="top: 188px">
				<view style="display: flex; justify-content: space-between">
					<view class="form_btn" v-if="!credentialDetail.isBillAdd" @tap="addToCard(credentialDetail, 'bill')" size="mini">添加到卡包</view>
					<view v-if="credentialDetail.isBillAdd"></view>
					<view>
						<!-- #ifdef H5 -->
						<a class="form_btn" :href="credentialDetail.billUrl" target="_blank">下载发票</a>
						<!-- #endif -->
						<!-- #ifndef H5 -->
						<a class="form_btn" @tap="downLoadFile(credentialDetail.billUrl)" target="_blank">
							下载发票dd
						</a>
						<!-- #endif -->
					</view>
				</view>
			</uni-card>
		</view>

		<uni-section title="检测视频" type="line" style="margin-top: 200px" v-if="hasdata && credentialDetail.hasvideo == '1'"></uni-section>
		<view v-if="hasdata && credentialDetail.hasvideo == '1'" style="position: relative">
			<web-view style="width: 100%; height: 200px; top: 0px" :src="credentialDetail.videoUrl"></web-view>
			<uni-card :is-shadow="true" style="top: 200px">
				<view style="display: flex; justify-content: space-between">
					<view>
						<!-- #ifdef H5 -->
						<a class="form_btn" :href="credentialDetail.videoUrl" target="_blank">下载视频</a>
						<!-- #endif -->
						<!-- #ifndef H5 -->
						<a class="form_btn" @tap="downLoadFile(credentialDetail.videoUrl)" target="_blank">
							下载视频
						</a>
						<!-- #endif -->
					</view>
				</view>
			</uni-card>
		</view>

		<!-- 下面部分是广告宣传、商品推荐 -->
		<uni-section style="margin-top: 350upx"></uni-section>
		<view v-if="hasdata" style="position: relative;">
			<rf-recommend :params="params" :list="[]" class="recommend" />
		</view>
		<view v-else>
			<rf-empty class="empty" info="暂无证书信息~" v-if="!hasdata && !loading" :params="params"></rf-empty>
		</view>

		<rfLoading isFullScreen :active="loading"></rfLoading>
	</view>
</template>

<script>
	import {
		credentialqueryUrl,
		credentialaddtopackageUrl,
		billaddtopackageUrl,
	} from '@/api/checkservice';
	import pdfobject from 'pdfobject';
	export default {
		data() {
			return {
				credentialDetail: {
					orderNo: '',
					credentialNo: '',
					credentialName: '',
					credentialUrl: '',
					sampleType: '',
					searchCode: '',
					sampleQuality: '',
					hasbill: '',
					billName: '',
					billUrl: '',
					hasvideo: '',
					videoName: '',
					videoUrl: '',
					isCredentialAdd: false,
					isBillAdd: false,
				},
				hasdata: false,
				loading: true,
				haslogin: false,
				params: {
					size: 10,
					page: 0,
					sort: 'id,desc',
					isShow: 1,
					isDel: 0,
					type: 0,
					keyword: '',
				},
				option: '',
				isCredentialImg:true
			};
		},

		onLoad(option) {
			// 先判断用户是否登录
			const userinfo = uni.getStorageSync('userInfo');
			if (userinfo) {
				this.haslogin = true;
			} else {
				this.haslogin = false;
			}
			this.option = option;
			// document.getElementById('#pdf-view');

			this.initData(this.option);
		},
		methods: {
			// 图片预览
			previewImg() {
				// 预览图片
				uni.previewImage({
					urls: ['https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/cbd.jpg'],
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏'],
						success: function(data) {},
						fail: function(err) {},
					},
				});
			},
			// 初始化
			initData(option) {
				const condition = JSON.parse(option.condition);
				this.$http
					.post(credentialqueryUrl, condition)
					.then((res) => {
						if (res.retcode == '0000') {
							this.credentialDetail = res.content;
							this.hasdata = true;
							if (this.credentialDetail.sampleType) {
								this.params.keyword = this.credentialDetail.sampleType;
								console.dir(this.params);
							}
						}
						this.loading = false;
					})
					.catch((e) => {
						this.loading = false;
					});
			},
			// 下载文件
			downLoadFile(url) {
				uni.downloadFile({
					url: url,
					success: (data) => {
						if (data.statusCode === 200) {
							// 文件保存到本地
							uni.saveFile({
								tempFilePath: data.tempFilePath,
								success: (res) => {
									uni.showToast({
										icon: 'none',
										mask: true,
										title: '文件已保存至：' + res.savedFilePath,
										duration: 3000,
									});
								},
							});
						}
					},
					fail: (err) => {
						console.dir(err);
						uni.showToast({
							icon: 'none',
							mask: true,
							title: '失败请重新下载',
						});
					},
				});
			},

			//添加到卡包
			addToCard(item, type) {
				if (!this.haslogin) {
					this.$mHelper.backToLogin();
				} else {
					// 先判断当前证书是否已经添加到我的卡包
					let url = '',
						addFlag = false;
					if (type == 'credential') {
						url = credentialaddtopackageUrl;
						addFlag = this.credentialDetail.isCredentialAdd;
					} else {
						url = billaddtopackageUrl;
						addFlag = this.credentialDetail.isBillAdd;
					}
					if (addFlag) {
						uni.showToast({
							icon: 'none',
							mask: true,
							title: '无须重复添加到卡包',
						});
					} else {
						this.$http.post(url, item).then((res) => {
							if (res.retcode == '0000') {
								this.$mHelper.toast('添加到卡包成功');
								type == 'credential' ?
									(this.credentialDetail.isCredentialAdd = true) :
									(this.credentialDetail.isBillAdd = true);
							} else if (res.retcode == '-1') {
								this.$mHelper.toast('无需重复添加');
								type == 'credential' ?
									(this.credentialDetail.isCredentialAdd = true) :
									(this.credentialDetail.isBillAdd = true);
							}
						});
					}
				}
			},
		},
	};
</script>

<style lang="scss">
	a {
		border-style: none;
		text-decoration: none;
	}

	.btn_view {
		display: flex;
		margin-top: 20upx;
		margin-bottom: 20upx;

		.form_btn {
			height: 70upx;
			display: flex;
			align-items: center;
			font-size: $font-base + 2upx;
		}

		.btn-style {
			border: 0;
		}
	}

	.view_item {
		line-height: 60upx;
		padding: 10upx 60upx;
	}

	.pdf_view {
		width: 100%;
		height: 200upx;
	}

	.pdfobject-container {
		width: 100%;
		height: 200upx;
		margin: 2em 0;
	}
</style>
<style scoped>
	.uni-card--shadow[data-v-3afcb0a4] {
		position: relative;
		box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.1);
		width: 100%;
		left: -33upx;
	}
</style>
