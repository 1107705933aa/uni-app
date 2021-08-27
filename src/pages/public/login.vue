<template>
	<view class="login">
		<view class="login-type-2">
			<!--顶部返回按钮-->
			<text class="back-btn iconfont iconzuo" @tap="navBack"></text>
			<view class="login-top" :class="'bg-' + themeColor.name">
				<view class="desc">
					<view class="title">Hi~</view>
					<text>重庆质检员欢迎您</text>
				</view>
				<image class="login-pic" :src="loginPic" />
			</view>
			<view class="login-type-content">
				<image class="login-bg" :src="loginBg" :style="{height: tabCurrentIndex === 1 ? current == 1 ? '200vw': '160vw' : '94vw'}" />
				<view class="main">
					<view class="nav-bar">
						<view class="nav-bar-item" v-for="(item, index) in typeList" :key="index" :class="tabCurrentIndex === index ? `text-${themeColor.name} nav-bar-item-active` : ``"
						 @tap="tabClick(index)">{{ item.text }}</view>
					</view>
					<block v-if="tabCurrentIndex === 0">
						<view class="login-type-form">
							<view class="input-item">
								<text class="iconfont iconwode" :class="'text-' + themeColor.name"></text>
								<input class="login-type-input" type="text" v-model="loginParams.phone" placeholder="请输入手机号" maxlength="11" />
							</view>
							<view class="input-item">
								<text class="iconfont iconmimaffffffpx" :class="'text-' + themeColor.name"></text>
								<input class="login-type-input" type="password" v-model="loginParams.password" placeholder="请输入密码" maxlength="20" />
							</view>
							<view class="input-item input-item-sms-code">
								<text class="iconfont iconmimaffffffpx" :class="'text-' + themeColor.name"></text>
								<view class="input-wrapper">
									<input class="login-type-input" type="text" v-model="loginParams.code" placeholder="请输入验证码" maxlength="5" />
									<image style="height:80upx;width:220upx" :src="codeBase64.img" @tap="resetCode()" />
								</view>
							</view>
						</view>
						<view class="login-type-tips">
							<!-- <text @tap="navTo('/pages/public/password')">忘记密码？</text> -->
							<text @tap="forgetPassword">忘记密码？</text>
						</view>
						<button class="confirm-btn" :class="'bg-' + themeColor.name" :disabled="btnLoading" :loading="btnLoading" @tap="toLogin">登录</button>
					</block>
					<block v-if="tabCurrentIndex === 1">
						<view class="login-type-form">
							<view class="input-item">
								<text class="iconfont iconwode" :class="'text-' + themeColor.name"></text>
								<input class="login-type-input" type="text" v-model="registerParams.username" placeholder="请输入账号名称" maxlength="20" />
							</view>
							<view class="input-item">
								<text class="iconfont iconmimaffffffpx" :class="'text-' + themeColor.name"></text>
								<input class="login-type-input" type="password" v-model="registerParams.password" placeholder="请输入密码" maxlength="20" />
							</view>
							<view class="input-item">
								<text class="iconfont iconmimaffffffpx" :class="'text-' + themeColor.name"></text>
								<input class="login-type-input" type="password" v-model="registerParams.password_repetition" placeholder="请输入确认密码"
								 maxlength="20" />
							</view>
							<view class="input-item">
								<text class="iconfont iconwode" :class="'text-' + themeColor.name"></text>
								<input class="login-type-input" type="text" v-model="registerParams.personname" placeholder="请输入真实姓名" maxlength="20" />
							</view>
							<view class="input-item">
								<text class="iconfont icondianhua" :class="'text-' + themeColor.name"></text>
								<input class="login-type-input" type="number" name="mobile" v-model="registerParams.mobile" placeholder="请输入手机号码"
								 maxlength="11" />
							</view>
							<view class="input-item input-item-sms-code">
								<text class="iconfont iconyanzhengma" :class="'text-' + themeColor.name"></text>
								<view class="input-wrapper">
									<view class="rf-input-wrapper">
										<input type="number" class="login-type-input" v-model="registerParams.code" placeholder="请输入验证码" maxlength="4" />
									</view>
									<button class="sms-code-btn" :disabled="smsCodeBtnDisabled" @tap.stop="getSmsCode()">
										<text v-if="!smsCodeBtnDisabled">获取验证码</text>
										<text v-else class="sms-code-resend">
											{{
                      `重新发送 (${codeSeconds})`
                      }}
										</text>
									</button>
								</view>
							</view>

							<view class="input-item">
								<radio-group @change="radioChange">
									<label v-for="(item, index) in items" :key="item.value" :class="'text-' + themeColor.name">
										<radio :value="item.value" :checked="index === current" :color="themeColor.name" />{{item.name}}</label>
								</radio-group>
							</view>

							<view v-if="current == 1">
								<view class="comb-item">
									<view class="first-item" style="border:0;">
										<text class="iconfont iconicontianjiatupian" :class="'text-' + themeColor.name"></text>
										<text class="tit">商家客户申请资料：</text>
									</view>
								</view>
								<!-- 图片上传 -->
								<imgUpload style="margin-bottom:16vh;" ref="imgUpload" previewMany :imgArr="imgArray" loading async imgCount="1"
								 :url="uploadUrl" @result="resultUrl" @delImg="delImg"></imgUpload>
							</view>

						</view>
						<button class="confirm-btn" :class="'bg-' + themeColor.name" :disabled="btnLoading" :loading="btnLoading" @tap="toRegister">注册</button>
					</block>
				</view>
			</view>
			<view v-if="tabCurrentIndex === 1 && current == 1">
				<view style="margin-left: 10%;">
					<text>{{applicationName || '客户账号申请资料.excel'}}</text>
					<text class="iconfont iconGroup-" style="margin-left : 10px; color:red;" @tap="download()"></text>
					<text @tap="navTo('/pages/public/registerprogress')" class="iconfont iconsousuo" size="mini" style="margin-left : 30px; color: rgb(229,77,66);">进度查询</text>
				</view>
				<view style="color: rgb(98,114,133); margin: 30rpx 30rpx; font-size:15rpx">
					<b>提示：</b>
					<br />1.请先下载申请文件，按照要求完善并上传申请资料，待资料注册通过后登陆
					<br />2.提交注册申请后可查询注册进度，如3个工作日后没通过注册，请咨询客服
				</view>
			</view>
			<view class="login-type-bottom" :class="'text-' + themeColor.name" v-if="this.appName!=''&this.appName!=undefined">{{ appName }}
				版权所有</view>
		</view>
	</view>
</template>
<script>
	var _self;
	import moment from '@/common/moment';
	import imgUpload from '@/components/poiuy-uImgUpload/imgUpload';
	import {
		uploadImage
	} from '@/api/userInfo';
	import indexConfig from '@/config/index.config';
	import {
		loginBySmsCode,
		registerByPass,
		getRegistration
	} from '@/api/login';
	import {
		authcode
	} from '@/api/basic';
	import {
		encrypt
	} from '@/utils/rsaEncrypt';

	export default {
		components: {
			imgUpload
		},
		data() {
			return {
				loginParams: {
					phone: '',
					password: '',
					code: '',
				},
				registerParams: {
					username: '',
					mobile: '',
					personname: '',
					password: '',
					password_repetition: '',
					code: '',
					image: '',
					imageMsg: '',
				},
				items: [{
						value: "0",
						name: '个人用户',
						checked: 'true'
					},
					{
						value: "1",
						name: '商家用户',
					},
				],
				current: 0,
				btnLoading: false,
				reqBody: {},
				codeSeconds: 0, // 验证码发送时间间隔
				smsCodeBtnDisabled: true,
				userInfo: null,
				loginBg: this.$mAssetsPath.loginBg,
				loginPic: this.$mAssetsPath.loginPic,
				appName: this.$mSettingConfig.appName,
				tabCurrentIndex: 0,
				imgArray: [],
				applicationUrl: '',
				applicationName: '',
				type: null,
				uploadUrl: '',
				codeBase64: {
					//登录验证码base64码
					img: '',
					uuid: '',
				},
				typeList: [{
						text: '登录',
					},
					{
						text: '注册',
					},
				],
			};
		},
		onLoad(options) {
			this.uploadUrl = indexConfig.baseUrl + uploadImage;
			_self = this;
			if (options.id == '1') {
				this.tabClick(1);
			}
			this.resetCode();
			this.getRegistration();
			this.loginParams.mobile = uni.getStorageSync('loginMobile') || '';
			this.loginParams.password = uni.getStorageSync('loginPassword') || '';
			this.userInfo = uni.getStorageSync('wechatUserInfo');
		},
		onShow() {},
		methods: {
			// 上传头像
			uploadImage() {
				// 从相册选择图片
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album'],
					success: function(res) {
						_self.handleUploadFile(res.tempFilePaths); //此时的this 代指 succ...因此选用_this
					},
				});
			},
			//获取申请资料
			getRegistration() {
				this.$http
					.get(getRegistration, {
						page: 0,
						size: 10,
						sort: 'sort,asc',
					})
					.then((res) => {
						if (
							res.content[0].applicationUrl != '' &&
							res.content[0].applicationUrl != null
						) {
							this.applicationName = res.content[0].applicationName;
							this.applicationUrl = res.content[0].applicationUrl;
						}
					});
			},
			// 上传图片
			async handleUploadFile(data) {
				const filePath = data.path || data[0];
				this.$http
					.upload(uploadImage, {
						filePath,
						name: 'file',
					})
					.then((res) => {
						this.registerParams.imageMsg = '图片上传成功';
						this.registerParams.image = res.link;
					}),
					(err) => {
						this.$mHelper.toast('图片上传失败');
					};
			},
			//图片上传成功
			resultUrl(e) {
				//成功默认为0
				if (e.statusCode == 201) {
					let data = JSON.parse(e.data);
					this.registerParams.image = data.link;
				}
			},
			delImg(e) {
				this.imgArray.splice(e, 1); //为删除图片数组的下标
			},
			/**
			 * 获取验证码
			 */
			resetCode() {
				this.$http.get(authcode).then((code) => {
					if (code) {
						this.codeBase64.img = code.img;
						this.codeBase64.uuid = code.uuid;
					}
				});
			},
			/**
			 * 下载模板
			 */
			download() {
				uni.showLoading({
					title: '下载中'
				});
				uni.downloadFile({
					url: this.applicationUrl,
					success: function(res) {
						uni.hideLoading();
						var filePath = res.tempFilePath;
						uni.openDocument({
							filePath: filePath,
						})
					},
					fail: function() {
						uni.hideLoading();
						this.$mHelper.toast('文件下载失败，请稍后重试！！');
					}
				});
			},
			// 获取手机验证码
			async getSmsCode() {
				this.reqBody['mobile'] = this.registerParams['mobile'];
				let checkSendCode = this.$mGraceChecker.check(
					this.reqBody,
					this.$mFormRule.sendCodeRule
				);
				if (!checkSendCode) {
					this.$mHelper.toast(this.$mGraceChecker.error);
					return;
				}
				await this.$http
					.post(smsCode, {
						mobile: this.registerParams.mobile,
						usage: 'up-pwd',
					})
					.then((r) => {
						if (r.data) {
							this.$mHelper.toast(`验证码发送成功, 验证码是${r.data}`);
						} else {
							this.$mHelper.toast('验证码已发送.');
						}
						this.smsCodeBtnDisabled = true;
						uni.setStorageSync('pwdSmsCodeTime', moment().valueOf() / 1000);
						this.handleSmsCodeTime(59);
					});
			},
			handleSmsCodeTime(time) {
				let timer = setInterval(() => {
					if (time === 0) {
						clearInterval(timer);
						this.smsCodeBtnDisabled = false;
					} else {
						this.codeSeconds = time;
						this.smsCodeBtnDisabled = true;
						time--;
					}
				}, 1000);
			},
			// 返回上一页
			navBack() {
				this.$mRouter.back();
			},
			// 统一跳转路由
			navTo(route) {
				this.$mRouter.push({
					route,
				});
			},

			// 忘记密码，暂时处理为弹窗提示联系后台管理员处理
			forgetPassword() {
				this.$mHelper.toast('请联系客服热线处理：00-000000');
			},

			// 返回主页
			toHome() {
				this.$mRouter.reLaunch({
					route: '/pages/index/index',
				});
			},
			// 提交表单
			async toLogin() {
				if (this.$mSettingConfig.closeLogin) {
					this.$mHelper.toast('暂未开放登录，敬请期待～');
					return;
				}
				uni.removeStorageSync('loginMobile');
				uni.removeStorageSync('loginPassword');
				const cheRes = this.$mGraceChecker.check(
					this.loginParams,
					this.$mFormRule.loginByPassRule
				);
				if (!cheRes) {
					this.$mHelper.toast(this.$mGraceChecker.error);
					return;
				}
				const backUrl = uni.getStorageSync('backToPage');
				this.reqBody = {
					username: this.loginParams.phone,
					password: encrypt(this.loginParams.password),
					group: this.$mHelper.platformGroupFilter(),
					code: this.loginParams.code,
					uuid: this.codeBase64.uuid,
				};
				if (backUrl.indexOf('promo_code') !== -1) {
					this.reqBody.promo_code = JSON.parse(backUrl)['query']['promo_code'];
				}
				this.btnLoading = true;
				await this.$http
					.post(loginBySmsCode, this.reqBody)
					.then((res) => {
						this.$mHelper.toast('恭喜您，登录成功！');
						const provideData = {
							access_token: res.token,
							expiration_time: res.expiration_time,
							member: res.user,
							promoter: null,
							refresh_token: res.refreshToken,
						};
						this.$mStore.commit('login', provideData);
						if (this.userInfo) {
							this.btnLoading = false;
							const oauthClientParams = {};
							/*  #ifdef MP-WEIXIN */
							oauthClientParams.oauth_client = 'wechatMp';
							/*  #endif  */
							/*  #ifndef MP-WEIXIN */
							oauthClientParams.oauth_client = 'wechat';
							/*  #endif  */
							const userInfo = JSON.parse(this.userInfo);
							this.$http.post(authLogin, {
								...userInfo,
								...oauthClientParams,
								gender: userInfo.sex || userInfo.gender,
								oauth_client_user_id: userInfo.openid || userInfo.openId,
								head_portrait: userInfo.headimgurl || userInfo.avatarUrl,
							});
						}
						uni.removeStorageSync('wechatUserInfo');
						const backToPage = uni.getStorageSync('backToPage');
						uni.removeStorageSync('backToPage');
						if (backToPage) {
							if (
								backToPage.indexOf('/pages/profile/profile') !== -1 ||
								backToPage.indexOf('/pages/cart/cart') !== -1 ||
								backToPage.indexOf('/pages/index/index') !== -1 ||
								backToPage.indexOf('/pages/notify/notify') !== -1 ||
								backToPage.indexOf('/pages/category/category') !== -1
							) {
								this.$mRouter.reLaunch(JSON.parse(backToPage));
							} else {
								this.$mRouter.redirectTo(JSON.parse(backToPage));
							}
						} else {
							this.toHome();
						}
					})
					.catch((err) => {
						this.btnLoading = false;
						this.loginParams.password = '';
						this.loginParams.code = '';
						this.resetCode();
					});
			},
			// 切换登录/注册
			tabClick(index) {
				this.tabCurrentIndex = index;
			},
			// 注册账号
			async toRegister() {
				const cheRes = this.$mGraceChecker.check(
					this.registerParams,
					this.$mFormRule.registerRule
				);
				if (!cheRes) {
					this.$mHelper.toast(this.$mGraceChecker.error);
					return;
				}
				if (
					this.registerParams.password != this.registerParams.password_repetition
				) {
					this.$mHelper.toast('请确保两次输入密码一致！');
					return;
				}
				if (this.registerParams.image == '' && this.current == 1) {
					this.$mHelper.toast('请上传申请资料！');
					return;
				}
				_self.register();
			},

			radioChange: function(evt) {
				for (let i = 0; i < this.items.length; i++) {
					if (this.items[i].value === evt.target.value) {
						this.current = i;
						break;
					}
				}
			},

			register() {
				this.btnLoading = true;
				const body = {
					username: this.registerParams.username,
					realName: this.registerParams.personname,
					password: this.registerParams.password,
					phone: this.registerParams.mobile,
					code: this.registerParams.code,
					image: this.registerParams.image,
				};
				this.$http.post(registerByPass, body).then((res) => {
					if (res.data) {
						this.btnLoading = false;
						this.$mHelper.toast(res.message);
						if (this.current == 0) {
							this.loginParams.phone = this.registerParams.mobile;
							this.loginParams.password = this.registerParams.password;
							this.tabCurrentIndex = 0; //切换到登录
						} else {
							setTimeout(r => {
								this.loginParams.phone = '';
								this.loginParams.password = '';
								this.toHome()
							}, 1000);

						}
					} else {
						this.btnLoading = false;
						this.$mHelper.toast(res.message);
						this.registerParams.username = '';
						this.registerParams.code = '';
					}
				});
			}
		},
	};
</script>
<style lang="scss">
	page {
		background: $color-white;
	}

	.container {
		padding-top: 115px;
		position: relative;
		width: 100vw;
		overflow: hidden;
		background: #fff;

		.wrapper {
			position: relative;
			z-index: 90;
			background: #fff;
			padding-bottom: 40upx;
		}

		.back-btn {
			position: absolute;
			left: 40upx;
			z-index: 9999;
			padding-top: var(--status-bar-height);
			top: 40upx;
			font-size: 40upx;
			color: $font-color-dark;
		}

		.left-top-sign {
			font-size: 120upx;
			color: $page-color-base;
			position: relative;
			left: -16upx;
		}

		.right-top-sign {
			position: absolute;
			top: 80upx;
			right: -30upx;
			z-index: 95;

			&:before,
			&:after {
				display: block;
				content: '';
				width: 400upx;
				height: 80upx;
				background: #b4f3e2;
			}

			&:before {
				transform: rotate(50deg);
				border-radius: 0 50px 0 0;
			}

			&:after {
				position: absolute;
				right: -198upx;
				top: 0;
				transform: rotate(-50deg);
				border-radius: 50px 0 0 0;
				/* background: pink; */
			}
		}

		.left-bottom-sign {
			position: absolute;
			left: -270upx;
			bottom: -320upx;
			border: 100upx solid #d0d1fd;
			border-radius: 50%;
			padding: 180upx;
		}

		.welcome {
			position: relative;
			left: 50upx;
			top: -90upx;
			font-size: 46upx;
			color: #555;
			text-shadow: 1px 0px 1px rgba(0, 0, 0, 0.3);
		}

		.input-content {
			padding: 0 60upx;
		}

		.input-item {
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			justify-content: center;
			padding: 0 30upx;
			background: $page-color-light;
			height: 120upx;
			border-radius: 4px;
			margin-bottom: 50upx;

			&:last-child {
				margin-bottom: 0;
			}

			.tit {
				height: 50upx;
				line-height: 56upx;
				font-size: $font-sm + 2upx;
				color: $font-color-base;
			}

			input {
				height: 60upx;
				font-size: $font-base + 2upx;
				color: $font-color-dark;
				width: 100%;
			}
		}

		.input-item-sms-code {
			position: relative;
			width: 100%;

			.sms-code-btn {
				position: absolute;
				color: #111;
				right: 20upx;
				bottom: 20upx;
				font-size: 28upx;
			}

			.sms-code-resend {
				color: #999;
			}

			.sms-code-btn:after {
				border: none;
				background-color: transparent;
			}
		}

		.forget-section {
			font-size: $font-sm + 2upx;
			color: $font-color-spec;
			text-align: center;
			margin-top: 40upx;
		}

		.register-section {
			margin: 30upx 0 50upx 0;
			width: 100%;
			font-size: $font-sm + 2upx;
			color: $font-color-base;
			text-align: center;

			text {
				color: $font-color-spec;
				margin-left: 10upx;
			}

			text:first-child {
				margin-right: 10upx;
			}
		}

		.btn-group {
			display: flex;
			margin-bottom: 20upx;
		}
	}

	.login-type-2 {
		width: 100%;
		position: relative;

		.back-btn {
			position: absolute;
			left: 40upx;
			z-index: 9999;
			padding-top: var(--status-bar-height);
			top: 40upx;
			font-size: 48upx;
			color: $color-white;
		}

		.login-top {
			height: 460upx;
			position: relative;

			.desc {
				position: absolute;
				top: 200upx;
				left: 40upx;
				font-size: 48upx;

				.title {
					font-size: 48upx;
				}
			}

			.login-pic {
				position: absolute;
				width: 220upx;
				height: 270upx;
				right: 30upx;
				top: 100upx;
			}
		}

		.login-type-content {
			position: relative;
			top: -72upx;

			.login-bg {
				width: 94vw;
				height: 94vw;
				margin: 0 3vw;
			}

			.main {
				width: 94vw;
				position: absolute;
				top: 0;
				left: 3vw;

				.nav-bar {
					display: flex;
					height: 100upx;
					justify-content: center;
					align-items: center;
					position: relative;
					z-index: 10;

					.nav-bar-item {
						flex: 1;
						display: flex;
						height: 100%;
						line-height: 96upx;
						font-size: $font-lg;
						display: flex;
						margin: 0 120upx;
						justify-content: center;
					}

					.nav-bar-item-active {
						border-bottom: 5upx solid;
					}
				}

				.login-type-form {
					width: 80%;
					margin: 50upx auto;

					.input-item {
						position: relative;
						height: 90upx;
						line-height: 90upx;
						margin-bottom: $spacing-lg;

						.iconfont {
							font-size: 50upx;
							position: absolute;
							left: 0;
						}

						.login-type-input {
							height: 90upx;
							padding-left: 80upx;
							border-bottom: 1upx solid rgba(0, 0, 0, 0.1);
						}

						.sms-code-btn,
						sms-code-resend {
							width: 240upx;
							font-size: $font-base - 2upx;
						}
					}
				}

				.login-type-tips {
					padding: 0 50upx;
					display: flex;
					justify-content: space-between;
				}

				.confirm-btn {
					height: 80upx;
					line-height: 80upx;
				}
			}
		}

		.login-type-bottom {
			width: 100%;
			margin-top: 20rpx;
			padding-bottom: 30upx;
			text-align: center;
			font-size: $font-lg;
		}
	}
</style>
