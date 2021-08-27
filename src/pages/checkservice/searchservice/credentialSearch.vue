<template>
	<view>
		<!--顶部下拉菜单-->
		<rf-nav-detail @hide="hideNavDetail" :popupShow="navDetailShow"></rf-nav-detail>
		<view class="main_content">
			<view>
				<view class="content_header_img">
					<img :src="hotBgImg" alt />
				</view>
				<view class="content_header">
					<view class="header_title">
						<h2>珠宝玉石证书在线查询</h2>
					</view>
				</view>
				<view class="content_body">
					<view class="first-item">
						<text class="iconfont iconnodata" :class="'text-' + themeColor.name"></text>
						<text class="tit tit-find">有无查询码：</text>
						<radio-group @change="handleChange">
							<label class="gender-item" v-for="(item, index) in trueOrFalse" :key="index">
								<radio class="gender-item-radio" :color="themeColor.color" :value="item.value" :checked="item.value === searchCondition.hasCode" />
								<text class="gender-item-text">{{ item.name }}</text>
							</label>
						</radio-group>
					</view>
					<view class="first-item">
						<text class="iconfont icon-shuqianbiaozhubiaojizhengshurenzhengxianxing" :class="'text-' + themeColor.name"></text>
						<text class="tit">证书编号：</text>
						<input class="input" type="text" v-model="searchCondition.credentialNo" placeholder="请输入证书编号" />
					</view>
					<view class="first-item" v-if="hasCode">
						<text class="iconfont iconliebiaoqiehuan" :class="'text-' + themeColor.name"></text>
						<text class="tit">查询码：</text>
						<input class="input" type="text" v-model="searchCondition.searchCode" placeholder="请输入查询码" />
					</view>
					<view class="first-item" v-if="!hasCode">
						<text class="iconfont iconjinhangzhongdeyongjin" :class="'text-' + themeColor.name"></text>
						<text class="tit">质量/m(g)：</text>
						<input class="input" type="text" v-model="searchCondition.sampleQuality" placeholder="请输入质量/m(g)" />
					</view>

					<view class="btn_view">
						<button class="form_btn" :loading="btnLoading" @tap="search" size="mini" :class="'bg-' + themeColor.name">查询</button>
					</view>
				</view>
				<view class="content_footer">
					<b>亲爱的顾客：</b>
					<view class="end_tips">
						1、如果您的证书或标签
						<text class="specialText">有查询码</text>，请根据
						<text class="specialText">证书编号</text>与
						<text class="specialText">查询码</text>进行查询
					</view>
					<view class="end_tips">
						2、如果您的证书或标签
						<text class="specialText">没有查询码</text>，请根据
						<text class="specialText">证书编号</text>与
						<text class="specialText">质量</text>进行查询
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				navDetailShow: false,
				searchCondition: {
					credentialNo: '',
					searchCode: '',
					sampleQuality: '',
					hasCode: '1',
				},
				hasCode: true,
				btnLoading: false,
				hotBgImg : this.$mAssetsPath.hotBgImg,
				trueOrFalse: [{
						name: '有',
						value: '1',
					},
					{
						name: '无',
						value: '0',
					},
				],
			};
		},
		methods: {
			// #ifndef MP
			onNavigationBarButtonTap(e) {
				console.log(e.index);
				const index = e.index;
				if (index === 0) {
					this.navDetailShow = true;
				}
			},
			// #endif

			// 隐藏顶部导航
			hideNavDetail() {
				this.navDetailShow = false;
			},
			search() {
				this.btnLoading = true;
				if (!this.searchCondition.credentialNo) {
					this.$mHelper.toast("请输入证书编号!");
					this.btnLoading = false;
					return;
				}
				if ('1' == this.searchCondition.hasCode && !this.searchCondition.searchCode) {
					this.$mHelper.toast("请输入查询码!");
					this.btnLoading = false;
					return;
				}
				if ('0' == this.searchCondition.hasCode && !this.searchCondition.sampleQuality) {
					this.$mHelper.toast("请输入质量!");
					this.btnLoading = false;
					return;
				}
				const route =
					"/pages/checkservice/searchservice/credentialDetail?condition=" +
					JSON.stringify(this.searchCondition);
				this.$mRouter.push({
					route: route
				});
				this.btnLoading = false;
			},
			// 监听有无查询码更改
			handleChange(e) {
				this.hasCode = e.detail.value == '1' ? true : false;
				this.searchCondition.hasCode = e.detail.value;
			},
		},
	};
</script>

<style lang="scss">
	.main_content {
		height: 100vh;
		background-color: #fff;
		padding: 40upx 60upx;
		display: flex;
		align-items: center;
	}

	.content_header_img {
		img {
			width: 100%;
			height: 320upx;
			padding-bottom: 40upx;
		}
	}

	.content_header {
		padding-bottom: 80upx;

		.header_title {
			display: flex;
			justify-content: center;
			font-family: '宋体';
		}
	}

	.first-item {
		position: relative;
		display: flex;
		padding: 0 10upx;
		height: 80upx;
		line-height: 65upx;
		border-radius: 4px;
		margin-bottom: 45upx;
		border-bottom: 1px solid #e5e5e5;

		.tit {
			width: 250upx;
			font-size: $font-base + 2upx;
			color: $font-color-base;
			margin-left: 70upx;
		}

		.iconfont {
			font-size: 55upx;
			position: absolute;
			left: 0;
		}

		.tit-find {
			width: 180upx;
		}

		input {
			height: 60upx;
			width: calc(100% - 100upx);
			line-height: 60upx;
			font-size: $font-base + 7upx;
		}

		.gender-item {
			margin-right: 20upx;

			.gender-item-radio {
				transform: scale(0.7);
			}

			.gender-item-text {
				font-size: $font-lg;
				font-size: $font-base + 7upx;
			}

			radio .wx-radio-input.wx-radio-input-checked {
				background: $uni-color-primary;
				border-color: $uni-color-primary;
			}
		}
	}

	.btn_view {
		display: flex;

		.form_btn {
			width: 100%;
			height: 80upx;
			font-size: $font-lg;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}

	.content_footer {
		margin-top: 100upx;
		color: #797c80;

		.end_tips {
			text-indent: 2em;
			font-size: 24upx;

			.specialText {
				font-weight: bold;
				color: red;
			}
		}
	}
</style>
