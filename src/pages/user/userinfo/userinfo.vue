<template>
	<view class="userinfo">
		<!--头像 + 背景-->
		<view class="user-section" :class="'bg-' + themeColor.name">
			<image class="bg" :src="userBg"></image>
			<!--#ifdef H5-->
			<!--h5直接上传头像-->
			
			<!-- #endif -->
			<view class="portrait-box" @tap="uploadImage">
				<image class="portrait" :src="profileInfo.avatar || headImg"></image>
			</view>
			<!--#ifndef H5-->
			<!--非h5裁剪头像上传-->
			<!-- <view class="portrait-box">
				<avatar canRotate="false" selWidth="200px" selHeight="400upx" @upload="handleUploadFile" :avatarSrc="profileInfo.avatar || headImg"
				 avatarStyle="width: 200upx; height: 200upx; border-radius: 100%; border: 6upx solid #fff;">
				</avatar>
			</view> -->
			<!-- #endif -->
		</view>
		<view class="input-content">
			<view class="input-item">
				<text class="tit">昵 称</text>
				<input type="text" v-model="profileInfo.nickName" disabled placeholder="请输入您的昵称" />
			</view>
			<view class="input-item">
				<text class="tit">手机号</text>
				<input type="text" v-model="profileInfo.phone" placeholder="请输入手机号码" />
			</view>
			<view class="input-item">
				<text class="tit">姓　名</text>
				<input type="text" v-model="profileInfo.realName" placeholder="请输入您的姓名" />
			</view>
			<view class="input-item">
				<text class="tit">生　日</text>
				<picker mode="date" v-model="date" @change="bindDateChange">
					<view class="date" style="background: none;">{{
					 date || '请选择日期'
					}}</view>
				</picker>
			</view>
			<button class="confirm-btn" :class="'bg-' + themeColor.name" :disabled="btnLoading" :loading="btnLoading" @tap="toUpdateInfo">
				修改资料
			</button>
		</view>

		<!--加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>

		<!--进度条加载-->
		<rf-load-progress :height="CustomBar" :progress="loadProgress"></rf-load-progress>
	</view>
</template>

<script>
	/**
	 * @des 修改用户信息
	 *
	 * @author stav stavyan@qq.com
	 * @date 2020-01-10 14:28
	 * @copyright 2019
	 */
	import {
		memberInfo,
		memberUpdate,
		uploadBase64Image
	} from '@/api/userInfo';
	import avatar from '@/components/rf-avatar/rf-avatar';
	import moment from '@/common/moment';
	var _self;
	export default {
		components: {
			avatar
		},
		data() {
			return {
				loadProgress: 0,
				CustomBar: this.CustomBar,
				profileInfo: {},
				genders: [{
						value: '未知',
						name: '未知'
					},
					{
						value: '男',
						name: '男'
					},
					{
						value: '女',
						name: '女'
					}
				],
				date: '',
				token: null,
				loading: true,
				headImg: this.$mAssetsPath.headImg,
				userBg: this.$mAssetsPath.userBg,
				btnLoading: false
			};
		},
		async onShow() {
			await this.initData();
		},
		onLoad: function() {
			_self = this;
		},
		filters: {
			time(val) {
				return moment(val * 1000).format('YYYY-MM-DD');
			},
		},
		methods: {
			// 上传头像
			uploadImage() {
				// 从相册选择图片
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album'],
					success: function(res) {
						_self.handleUploadFile(res.tempFilePaths);
					}
				});
			},
			// 上传头像
			async handleUploadFile(data) {
				const filePath = data.path || data[0];
				this.$http.upload(uploadBase64Image, {
					filePath,
					name: 'file',
					formData: {
						id: _self.profileInfo.id
					}
				}).then(res => {
					const userData = uni.getStorageSync('userInfo');
					userData.avatar = res.data;
					_self.profileInfo.avatar = 'data:image/jpg;base64,' + res.data;
					this.$mHelper.toast(res.message);
					// 更新本地缓存信息
					uni.setStorage({
						key: 'userInfo',
						data: userData,
					});
				}), err => {
					this.$mHelper.toast('用户头像修改失败');
				}
			},
			// 监听日期更改
			bindDateChange(e) {
				this.date = e.target.value;
			},
			// 监听性别更改
			handleGenderChange(e) {
				this.profileInfo.sex = e.detail.value;
			},
			// 数据初始化
			initData() {
				this.profileInfo = uni.getStorageSync('userInfo');
				if (this.profileInfo.birthday != null) {
					this.date = moment(this.profileInfo.birthday * 1000).format('YYYY-MM-DD'); //将时间戳转化为日期
				}
				if (this.profileInfo.avatar != null) {
					this.profileInfo.avatar = 'data:image/jpg;base64,' + this.profileInfo.avatar;
				}
				this.loading = false;
			},
			// 更新用户信息
			async toUpdateInfo() {
				this.handleUpdateInfo();
			},
			// 更新用户信息
			async handleUpdateInfo() {
				this.btnLoading = true;
				this.loadProgress = this.loadProgress + 6;
				const timer = setInterval(() => {
					this.loadProgress = this.loadProgress + 6;
				}, 50);
				const data = {
					nickname: this.profileInfo.nickName,
					realName: this.profileInfo.realName,
					date: this.date,
					phone: this.profileInfo.phone
				}
				this.$http.post(memberUpdate, data).then(res => {
					if (res) {
						clearInterval(timer);
						this.btnLoading = false;
						this.loadProgress = 0;
						this.$mHelper.toast(res.message);
						//更新本地缓存信息
						let data = uni.getStorageSync('userInfo'); //获取当前本地信息
						data.nickName = res.data.nickname;
						data.phone = res.data.phone;
						data.birthday = res.data.birthday;
						data.realName = res.data.realName;
						uni.setStorage({
							key: 'userInfo',
							data: data,
						});
						setTimeout(() => {
							this.$mRouter.back();
						}, 1 * 1000);
					} else {
						this.btnLoading = false;
						this.$mHelper.toast(res.message);
					}
				}).catch(err => {
					this.btnLoading = false;
					this.profileInfo.phone === uni.getStorageSync('userInfo').phone;
				})
			}
		}
	};
</script>

<style lang="scss" scoped>
	page {
		background-color: $color-white;
	}

	.userinfo {
		.user-section {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 320upx;
			padding: 40upx 30upx 0;
			overflow: hidden;
			position: relative;

			.bg {
				position: absolute;
				left: 0;
				top: 0;
				width: 100vw;
				opacity: 0.84;
			}

			.portrait-box {
				clear: both;
				z-index: 2;
			}

			.portrait {
				position: relative;
				width: 200upx;
				height: 200upx;
				border-radius: 50%;
				border: 6upx solid #fff;
			}

			.yticon {
				position: absolute;
				line-height: 1;
				z-index: 5;
				font-size: 48upx;
				color: #fff;
				padding: 4upx 6upx;
				border-radius: 6upx;
				background: rgba(0, 0, 0, 0.4);
			}

			.pt-upload-btn {
				right: 0;
				bottom: 10upx;
			}

			.bg-upload-btn {
				right: 20upx;
				bottom: 16upx;
			}
		}

		.input-content {
			padding: 40upx 60upx;

			.input-item {
				display: flex;
				padding: 0 30upx;
				background: $page-color-light;
				height: 80upx;
				line-height: 80upx;
				border-radius: 4px;
				margin-bottom: 30upx;

				&:last-child {
					margin-bottom: 0;
				}

				.tit {
					width: 100upx;
					font-size: $font-sm + 2upx;
					color: $font-color-base;
				}

				input {
					width: calc(100% - 100upx);
					height: 80upx;
					line-height: 80upx;
					font-size: $font-base + 2upx;
					color: $font-color-dark;
				}

				.date {
					height: 80upx;
					line-height: 80upx;
					font-size: $font-base + 2upx;
					color: $font-color-dark;
				}

				.gender-item {
					margin-right: 20upx;

					.gender-item-text {
						padding-left: 10upx;
					}

					radio .wx-radio-input.wx-radio-input-checked {
						background: $uni-color-primary;
						border-color: $uni-color-primary;
					}
				}
			}
		}
	}
</style>
