<template>
	<view class="login-type">
		<view class="logo">
			<rf-image :preview="false" :src="logo"></rf-image>
		</view>
		<view>
			<button class="confirm-btn confirm-btn-bg" :disabled="btnLoading" :class="'text-' + themeColor.name" @tap="navTo('/pages/public/login')">
				已有账号登录
			</button>
			<button class="confirm-btn confirm-btn-bg" :disabled="btnLoading" :class="'text-' + themeColor.name" @tap="navTo('/pages/public/login?id='+1)">
				立即注册
			</button>
			<button class="confirm-btn confirm-btn-bg" :disabled="btnLoading" :class="'text-' + themeColor.name" @tap="navTo('/pages/public/registerprogress')">
				进度查询
			</button>
		</view>
		<!--协议popup-->
		<rf-protocol-popup ref="mapState" @popupState="popupState"
		 :protocolPath="protocolPath"
		 :policyPath="policyPath"
		 :registrationName="registrationName"
		 :secretName="secretName" v-if="isRfProtocolPopupShow"></rf-protocol-popup>
		<!-- 底部协议 -->
		<view class="footer-protocol">
			<text @tap="handleRfProtocolPopupShow" class="cuIcon" :class="appAgreementDefaultSelect ? `text-${themeColor.name} cuIcon-radiobox` : 'cuIcon-round'"></text>
			<text class="content">登录表示同意</text>
			<!-- 协议地址 -->
			<text :class="'text-' + themeColor.name" @tap="handleRfProtocolPopupShow">《{{appName}} 协议》</text>
		</view>
	</view>
</template>
<script>
	/**
	 * @des 登录类型
	 *
	 * @author stav stavyan@qq.com
	 * @date 2020-01-13 12:02
	 * @copyright 2019
	 */
	import {
		mpWechatLogin,
		wechatH5Login,
		thirdPartyWechatOpenPlatform,
		thirdPartyApple
	} from '@/api/login';
	import rfProtocolPopup from '@/components/rf-protocol-popup/index';
	import {
		loginBySmsCode,
		registerByPass,
		getRegistration
	} from '@/api/login';
	export default {
		components: {
			rfProtocolPopup
		},
		data() {
			return {
				btnLoading: false,
				isRfProtocolPopupShow: false, // 控制协议popup显示
				appAgreementDefaultSelect: this.$mSettingConfig.appAgreementDefaultSelect, // 是否允许点击登录按钮
				logo: this.$mSettingConfig.appLogo,
				appName: this.$mSettingConfig.appName,
				protocolPath:'',
				policyPath:'',
				registrationName: '',
				applicationUrl: '',
				secretName: '',
				secretUrl: '',
			};
		},
		onShow() {
			this.btnLoading = false;
			this.getRegistration();
		},
		methods: {
			// 通用跳转
			navTo(route) {
				if (!this.appAgreementDefaultSelect) {
					this.$mHelper.toast('请勾选并阅读协议，才能进行下一步哦', 1.5 * 1000);
					return;
				}
				this.$mRouter.redirectTo({
					route
				});
			},

			//获取申请资料
			getRegistration() {
				this.$http.get(getRegistration, {
					page: 0,
					size: 10,
					sort: 'sort,asc'
				}).then(res => {
					if (res) {
						this.registrationName = res.content[0].registrationName;
						this.protocolPath = "/pages/set/about/detail?field=protocol_register&title=注册协议&type=1";
						uni.setStorageSync('zcdetail',res.content[0].registrationUrl);
						uni.setStorageSync('ysdetail',res.content[0].secretUrl);
						this.secretName = res.content[0].secretName;
						this.policyPath = "/pages/set/about/detail?field=protocol_register&title=隐私协议&type=2";
					}
				})
			},

			// 显示协议popup
			handleRfProtocolPopupShow() {
				this.isRfProtocolPopupShow = true;
			},
			// 监听是否同意协议
			popupState(e) {
				if (e) {
					this.appAgreementDefaultSelect = true;
					uni.setStorageSync('notFirstTimeLogin', true);
					this.isRfProtocolPopupShow = false;
				} else {
					this.appAgreementDefaultSelect = false;
					this.isRfProtocolPopupShow = false;
				}
			},
		}
	};
</script>
<style lang="scss">
	page {
		background: #fff;
		height: calc(100% - 88upx);
	}

	.login-type {
		padding-top: 80upx;

		.logo {
			text-align: center;
			margin-bottom: 80upx;

			image {
				width: 180upx;
				height: 180upx;
				border-radius: 28upx;
			}
		}

		.confirm-btn {
			width: 84%;
			margin: 0 7% 50upx;
			height: 84upx;
			line-height: 84upx;
			font-size: $font-lg;
			border: 1upx solid;
		}

		.confirm-btn-bg {
			background: none;
		}

		.footer {
			width: 100%;
			text-align: center;
			position: fixed;
			bottom: 40upx;
			font-size: $font-sm + 2upx;

			.protocol {
				color: $base-color;
				margin: 0 10upx;
			}

			.d-header {
				display: flex;
				justify-content: center;
				align-items: center;
				height: 80upx;
				margin-bottom: $spacing-base;
				font-size: $font-base + 2upx;
				color: $font-color-base;
				position: relative;

				text {
					padding: 0 $spacing-lg;
					background: #fff;
					position: relative;
					z-index: 1;
				}

				&:after {
					position: absolute;
					left: 50%;
					top: 50%;
					transform: translateX(-50%);
					width: 300upx;
					height: 0;
					content: '';
					border-bottom: 1px solid #ccc;
				}
			}

			.login-type-list {
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: center;

				.login-type-btn {
					border: none;
					background: none;
					padding: 0 40upx 0 0;
					margin: 0;

					.image {
						width: 64upx;
						height: 64upx;
					}

					&:after {
						border: none;
					}
				}

				.iconfont {
					font-size: 50upx;
					color: $font-color-base;
				}
			}
		}
	}
</style>
