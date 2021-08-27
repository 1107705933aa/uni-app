<template>
	<view class="rf-product-detail">
		<!--顶部返回按钮-->
		<!--#ifdef H5 || APP-PLUS -->
		<!-- <text class="back-btn iconfont iconzuo" @tap="navBack"></text> -->
		<!--#endif-->
		<!--header-->
		<view class="detail" v-if="product.video">
			<!--顶部视频播放图-->
			<view class="carousel">
				<view>
					<view>
						<video style="width:100%" id="myVideo" :src="product.video.videoUrl" :initial-time="product.video.startTime"
						 @error="videoErrorCallback" loop=true :duration="product.video.duration" danmu-btn controls></video>
					</view>
				</view>
			</view>
			<!--商品信息-->
			<view class="introduce-section">
				<view class="introduce-first-line">
					<view class="price-box point-box" v-if="product.point_exchange_type == 4">
						该商品仅需
						<text class="price">{{ product.point_exchange }} 积分</text>
					</view>
					<view class="price-box" v-else>
						<view class="price-first-line">
							<text class="price" :class="'text-' + themeColor.name">{{ moneySymbol }}{{ product.price }}</text>
						</view>
					</view>
					<view class="collect" @tap="toFavorite">
						<view @tap.stop="addShow(product)" class="iconfont" :class="[ product.favorite  ? `text-${themeColor.name} iconshoucang2` : 'iconshoucang4']"></view>
						<text>收藏</text>
					</view>
				</view>
				<view class="introduce-second-line">
					<view class="title">
						<text>{{ product.courseName }}</text>
						<text class="sketch">{{ product.sketch }}</text>
					</view>
					<view class="share">
						<rf-tag type="gray" size="small" tui-tag-class="tui-tag-share tui-size" shape="circleLeft">
							<button class="share-btn" open-type="share" :class="'text-' + themeColor.name" @tap.stop="share()">
								<text class="iconfont iconfenxiang"></text>
								<text class="tui-share-text tui-gray">分享</text>
							</button>
						</rf-tag>
					</view>
				</view>
				<!--商品参数-->
				<view class="c-list">
					<!--优惠券-->
					<rf-item-popup title="优惠券" @hide="hideService" :specClass="couponClass" @show="showPopupService('couponClass', product.canReceiveCoupon)"
					 :isEmpty="product.canReceiveCoupon.length === 0" empty="暂无可领取优惠券">
						<view slot="content">
							<text class="con t-r">领取优惠券</text>
						</view>
						<view slot="right" v-if="product.canReceiveCoupon.length > 0"><text class="iconfont iconyou"></text></view>
						<view slot="popup" class="service">
							<!-- 优惠券列表 -->
							<view class="sub-list valid">
								<view class="row" v-for="(row, index) in product.canReceiveCoupon" :key="index" @tap.stop="getCoupon(row)">
									<!-- content -->
									<view class="carrier">
										<view class="title">
											<view>
												<text class="cell-icon" :class="'bg-' + themeColor.name">培</text>
												<text class="cell-title">{{ row.title}}</text>
											</view>
											<view :class="'text-' + themeColor.name">
												<text class="price">{{ moneySymbol }}{{row.couponPrice}}</text>
											</view>

										</view>
										<view class="term">
											<text>{{ row.addTime | time }} ~ {{ row.endTime | time }}</text>
											<text class="at_least">满{{ row.useMinPrice }}可用</text>
										</view>
										<view class="usage">
											<text>仅用于{{product.courseName}}</text>
											<view>
												{{
																								row.totalCount === 0
																									? '不限'
																									: `数量有限`
																							}}
												已领{{ row.totalCount - row.remainCount }}
												<text class="last" v-if="row.remainCount">剩余{{ row.remainCount }}</text>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</rf-item-popup>
				</view>
			</view>
			<!--底部商品详情-->
			<view class="detail-desc">
				<view class="d-header">
					<text>商品详情</text>
				</view>
				<rf-parser :html="product.details" lazy-load></rf-parser>
			</view>
			<!-- 底部操作菜单 -->
			<view class="page-bottom">
				<view class="page-bottom-bth-wrapper">
					<navigator url="/pages/index/index" open-type="switchTab" class="p-b-btn">
						<i class="iconfont iconzhuyedefuben"></i>
						<text>首页</text>
					</navigator>
					<navigator url="/pages/cart/cart" open-type="switchTab" class="p-b-btn cart">
						<i class="iconfont icongouwuche2"></i>
						<text>购物车</text>
						<rf-badge v-if="hasLogin && cartNum && cartNum > 0" type="error" size="small" class="badge" :text="cartNum"></rf-badge>
					</navigator>
					<view @tap="kefuShow = true" class="p-b-btn">
						<i class="iconfont iconkefu2"></i>
						<text>客服</text>
					</view>
				</view>
				<view class="action-btn-group">
					<button class="action-btn" :class="'bg-' + themeColor.name" @tap="addCart('buy')">
						立即购买
					</button>
					<button class="action-btn" :class="'bg-' + themeColor.name" @click="addShop(product)">
						{{this.product.shopcart ? "移除购物车" : "加入购物车"}}
					</button>
				</view>
			</view>
		</view>
		<view class="hideCanvasView" v-if="canvasShow">
			<canvas class="hideCanvas" canvas-id="default_PosterCanvasId" :style="{width: (poster.width||10) + 'px', height: (poster.height||10) + 'px'}"></canvas>
		</view>
		<!--回到顶部-->
		<!--#ifdef MP-->
		<rf-nav></rf-nav>
		<!--#endif-->
		<view class="popup spec show" v-if="kefuShow" @touchmove.stop.prevent="stopPrevent" @tap="hide">
			<!-- 遮罩层 -->
			<view class="mask" @tap="hide"></view>
			<view class="kefu-bg">
				<image :src="appServiceQr"></image>
			</view>
		</view>
	</view>
</template>
<script>
	/**
	 *@des 封装商品详情
	 *@author stav stavyan@qq.com
	 *@blog https://stavtop.club
	 *@date 2020/05/15 16:22:24
	 */
	import rfItemPopup from '@/components/rf-item-popup';
	import moment from '@/common/moment';
	import rfAttrContent from '@/components/rf-attr-content';
	import rfRate from '@/components/rf-rate/rf-rate';
	import rfBadge from '@/components/rf-badge/rf-badge';
	import uniTag from '@/components/uni-tag/uni-tag';
	import rfNav from '@/components/rf-nav';
	import {
		cartItemDel,
		cartItemCreate,
		addFavorite,
		removeFavorite,
		cartItemCount
	} from '@/api/product';
	import {
		collectCreate,
		collectDel,
		pickupPointIndex,
		transmitCreate
	} from '@/api/basic';
	import {
		couponReceive,
		addressList
	} from '@/api/userInfo';
	import {
		mapMutations
	} from 'vuex';
	export default {
		name: 'rfProductDetail',
		props: {
			product: {
				type: Object,
				default () {
					return {};
				}
			},
			userInfo: {
				type: Object,
				default () {
					return {};
				}
			},
			url: {
				type: String,
				default: ''
			},
			marketType: {
				type: String,
				default: 'buy_now'
			}
		},
		components: {
			rfNav,
			rfItemPopup,
			rfBadge,
			rfRate,
			uniTag,
			rfAttrContent
		},
		onReady: function(res) {
			// #ifndef MP-ALIPAY
			this.videoContext = uni.createVideoContext('myVideo')
			// #endif
		},
		data() {
			return {
				appServiceQr: this.$mSettingConfig.appServiceQr,
				kefuShow: false,
				addressClass: 'none',
				canvasShow: true,
				logo: this.$mSettingConfig.appLogo,
				vipPrice: this.$mAssetsPath.vipPrice,
				posterShow: false,
				serviceClass: 'none', // 服务弹窗
				ladderPreferentialClass: 'none', // 阶梯优惠弹窗
				attributeValueClass: 'none', // 商品参数弹窗
				specClass: 'none', // 商品参数弹窗
				couponClass: 'none', // 优惠券弹窗
				shareClass: 'none', // 分享引导弹窗
				fullGiveClass: 'none', // 满减送弹窗
				cartType: null, // 下单类型
				couponList: [], // 优惠券列表
				currentStock: null,
				currentSkuPrice: null,
				currentSkuName: null,
				currentCartCount: 1,
				evaluateList: [],
				hasLogin: this.$mStore.getters.hasLogin,
				cartNum: uni.getStorageSync('cartNum'),
				addressTypeList: this.$mConstDataConfig.addressTypeList,
				tabCurrentIndex: 0,
				loading: true,
				errorInfo: '',
				headImg: this.$mAssetsPath.headImg,
				isPointExchange: false,
				shareBg: this.$mAssetsPath.shareBg,
				appServiceType: this.$mSettingConfig.appServiceType,
				productPosterQrType: this.$mSettingConfig.productPosterQrType,
				appName: this.$mSettingConfig.appName,
				shareFrom: '',
				poster: {},
				promoCode: '',
				addressList: [],
				moneySymbol: this.moneySymbol,
				state: 1,
				singleSkuText: this.singleSkuText,
				thirdPartyQrCodeImg: '',
				addflag: false, //防止多次点击事件 加入购物车
				showflag: false,
				flag:false,//购物券
			};
		},
		filters: {
			time(val) {
				return moment(val * 1000).format('YYYY-MM-DD HH:mm');
			},
			pointExchangeTypeFilter(val) {
				const type = [
					'',
					'非积分兑换',
					'积分加现金',
					'积分兑换或直接购买',
					'只支持积分兑换'
				];
				return type[parseInt(val, 10)];
			},
			integralGiveTypeFilter(val) {
				const type = ['固定积分', '百分比'];
				return type[parseInt(val, 10)];
			},
			givePointFilter(val) {
				return val.integral_give_type === '1' ?
					Math.round((parseInt(val.give_point, 10) / 100) * parseInt(val.minSkuPrice, 10)) :
					parseInt(val.give_point, 10);
			}
		},
		computed: {
			type() {
				return 'buy_now';
			},
			favorite() {
				return !!this.product.myCollect;
			},
			currentProductPrice() {
				let price;
				if (this.type === 'buy_now') {
					if (this.product.memberDiscount && this.product.memberDiscount.length !== 0) {
						// eslint-disable-next-line
						this.product.minSkuPrice = this.product.minSkuPrice * (1 - this.product.memberDiscount.discount / 100).toFixed(2);
						// eslint-disable-next-line
						this.product.maxSkuPrice = this.product.maxSkuPrice ? (this.product.maxSkuPrice * (1 - this.product.memberDiscount
							.discount / 100)).toFixed(2) : 0;
					}
					// eslint-disable-next-line
					price = this.currentSkuPrice || ((this.product.maxSkuPrice && (this.product.minSkuPrice !== this.product.maxSkuPrice)) ?
						(this.product.minSkuPrice + ' ~ ' + this.product.maxSkuPrice) : parseFloat(this.product.minSkuPrice).toFixed(2));
					return price;
				}
				return parseFloat(price || '0').toFixed(2);
			}
		},
		methods: {
			...mapMutations(['setCartNum']),
			// 返回上一页
			navBack() {
				this.$mRouter.back();
			},
			hide() {
				this.kefuShow = false;
			},
			// 分享商品
			share() {
				// #ifdef H5
				if (this.$mPayment.isWechat()) {
					this.shareClass = 'show';
				} else {
					this.$mHelper.h5Copy(this.url);
				}
				// #endif
				// #ifdef APP-PLUS
				this.$mHelper.handleAppShare(this.url, this.appName, this.product.courseName, this.product.image);
				// #endif
			},
			// 通用跳转
			navTo(route) {
				if (this.appServiceType === '1' && route === '/pages/product/service/index') {
					this.kefuShow = true;
					return;
				}
				if (!this.hasLogin) {
					this.$mHelper.backToLogin();
				} else {
					if (this.appServiceType === '0') {
						this.$mHelper.toast('暂不提供客服功能');
					} else {
						this.$mRouter.push({
							route
						});
					}
				}
			},
			// 视频播放错误提示
			videoErrorCallback: function(e) {
				uni.showModal({
					content: "网络故障，请稍后重试",
					showCancel: false
				})
			},
			// 添加商品至购物车
			async addShop(item) {
				if (!this.hasLogin) {
					await this.$mHelper.backToLogin();
					return;
				}
				if (this.addflag) {
					return;
				}
				this.addflag = true;
				if (item.shopcart) {
					const body = {
						id: item.id,
					}
					await this.$http.post(cartItemDel, body).then(res => {
						this.$mHelper.toast('已从购物车中移除');
						item.shopcart = false;
						this.addflag = false;
					}).catch(err=>{
						this.addflag = false;
					})
				} else {
					const body = {
						productId: item.id,
						type: '培训服务'
					}
					await this.$http.post(cartItemCreate, body).then(res => {
						this.$mHelper.toast('添加购物车成功');
						item.shopcart = true;
						this.addflag = false;
					}).catch(err=>{
						this.addflag = false;
					})
				}

			},
			// 添加收藏
			async addShow(item) {
				if (!this.hasLogin) {
					await this.$mHelper.backToLogin();
					return;
				}
				if (this.showflag) {
					return;
				}
				this.showflag = true;
				if (item.favorite) {
					const body = {
						id: item.id,
					}
					this.$http.post(removeFavorite, body).then(res => {
						this.$mHelper.toast('已从收藏夹中移除');
						item.favorite = false;
						this.showflag = false;
					}).catch(err=>{
						this.showflag = false;
					})
				} else {
					const body = {
						cid: item.id,
					}
					await this.$http.post(addFavorite, body).then(res => {
						this.$mHelper.toast('添加收藏成功');
						item.favorite = true;
						this.showflag = false;
					}).catch(err=>{
						this.showflag = false;
					})
				}
			},
			// 弹窗显示
			async showPopupService(type, list) {
				if (!this.hasLogin) {
					await this.$mHelper.backToLogin();
					return;
				}
				if (list.length === 0) return;
				this[type] = 'show';
			},
			// 关闭服务弹窗
			hideService() {
				this.specClass = 'none';
				this.couponClass = 'none';
				this.serviceClass = 'none';
				this.ladderPreferentialClass = 'none';
				this.attributeValueClass = 'none';
				this.fullGiveClass = 'none';
			},
			// 顶部tab点击
			tabClick(index, state) {
				this.page = 0
				this.addressList.length = 0;
				this.tabCurrentIndex = index;
				this.state = state;
				const api = (this.state === 1 ? addressList : pickupPointIndex);
				this.getAddressList(api);
			}, // 获取收货地址列表
			async getAddressList(api) {
				await this.$http
					.get(api, {})
					.then(r => {
						this.addressList = r.data;
					});
			},
			hideSpec() {
				this.specClass = 'hide';
				setTimeout(() => {
					this.specClass = 'none';
				}, 250);
			},
			hideShareSpec() {
				this.shareClass = 'hide';
				setTimeout(() => {
					this.shareClass = 'none';
				}, 250);
			},
			// 领取优惠券
			async getCoupon(item) {
				if (!this.hasLogin) {
					await this.$mHelper.backToLogin();
					return;
				}
				if (this.flag) {
					return;
				}
				this.flag = true;
				let data = [{
					cid: this.product.id,
					uid: '',
					couponTitle: item.title,
					addTime: '',
					endTime: '',
					useTime: 0,
					type: 'get',
					status: 0,
					isFail: 0,
					coupontype: '培训服务'
				}];
				const body = {
					param: data,
					cid: item.cid,
					iid: item.id,
					productID: this.product.id,
				}
				await this.$http
					.post(`${couponReceive}`, body)
					.then((res) => {
						this.$mHelper.toast('领取成功');
						this.flag = false;
						this.hideService();
						this.sendData();
					});
			},
			//调用子组件方法
			sendData(data) {
				uni.$emit('update', {
					msg: '页面更新'
				}) // 调用父组件的刷新方法
			},
			async buy(skuId) {
				const params = {};
				let data = [];
				data.push(this.product.id);
				params.type = this.type;
				params.data = data;
				this.$mRouter.push({
					route: `/pages/order/create/order?data=${JSON.stringify(params)}&promo_code=${this.promoCode}`
				});
			},
			addCart(type, isPointExchange) {
				if (!this.product.id) return;
				if (!this.hasLogin) {
					this.$mHelper.backToLogin();
					return;
				}
				this.cartType = type; //直接下单购买
				this.isPointExchange = isPointExchange;
				this.buy(this.product.id);
			},
			stopPrevent() {}
		}
	};
</script>
<style lang="scss">
	.rf-product-detail {
		.back-btn {
			position: fixed;
			left: 40upx;
			z-index: 9999;
			padding-top: var(--status-bar-height);
			top: 40upx;
			font-size: 40upx;
			color: $font-color-dark;
			// #ifdef MP-WEIXIN
			top: 5upx;
			// #endif
		}

		.carousel {
			height: 100%;
			position: relative;
		}

		.detail {
			padding-bottom: 60upx;
		}

		.service {
			padding: $spacing-base $spacing-lg 0;

			.row {
				font-size: $font-lg;
				margin-bottom: $spacing-sm;
			}
		}

		.selected-text {
			margin-right: 4upx;
		}

		.sub-list {
			margin: 40upx 0 80upx;

			.row {
				width: 100%;
				margin-bottom: $spacing-lg;
			}
		}

		.share-bg {
			image {
				position: fixed;
				z-index: 100;
				width: 70vw;
				height: 45vw;
				right: $spacing-base;
				top: $spacing-base;
			}
		}

		.layer {
			position: fixed;
			z-index: 99;
			bottom: 0;
			width: 100%;
			border-radius: 10upx 10upx 0 0;
			background-color: #fff;

			.rf-list {
				max-height: 60vh;
				padding-bottom: 0;
				margin-bottom: $spacing-sm;
			}
		}

		// 拼团公告
		.rf-swiper-slide {
			margin-top: 20upx;

			.label {
				margin-left: 10upx;
			}
		}

		// 玩法介绍
		.play-way {
			background-color: $color-white;
			padding: 0 20upx;
			margin: 20upx 0;
			font-size: $font-base;

			.title {
				border-bottom: 1px solid #eee;
				padding: $spacing-base 0;
				display: flex;
				justify-content: space-between;

				.iconfont {
					margin-left: 0.13rem;
					font-size: 0.28rem;
					color: #717171;
				}
			}

			.way {
				font-size: $font-base - 2upx;
				padding: 20upx 0;
				display: flex;

				.item {
					flex: 1;
					text-align: center;

					.tip {
						font-size: 0.22rem;
						color: #a5a5a5;
					}
				}

				.arrow {
					width: 40upx;

					.iconfont {
						color: $font-color-light;
						font-weight: 100;
					}
				}
			}
		}

		.assemble {
			background-color: #fff;

			.assemble-item {
				height: 120upx;
				border-bottom: 1px solid #f0f0f0;

				.pictxt {
					display: flex;
					justify-content: space-between;

					.picture {
						display: flex;

						image {
							width: 80upx;
							height: 80upx;
							margin: 20upx 0;
							border-radius: 50%;
						}

						.text {
							line-height: 120upx;
							margin-left: 20upx;
						}
					}

					.right {
						display: flex;
						align-items: center;

						.time-wrapper {
							text-align: right;
							margin-right: 20upx;

							.lack {
								font-size: $font-sm;

								.font-color-red {
									margin: 0 4upx;
								}
							}

							.time {
								font-size: $font-sm;
								color: $font-color-light;
							}
						}

						.spellBnt {
							font-size: $font-sm;
							width: 120upx;
							height: 48upx;
							display: flex;
							justify-content: center;
							align-items: center;
							border-radius: 48upx;
						}
					}
				}
			}
		}

		.c-list {
			font-size: $font-sm + 2upx;
			color: $font-color-base;
			background: #fff;

			.c-row {
				display: flex;
				align-items: center;
				padding: 20upx 30upx;
				position: relative;
			}

			.tit {
				width: 140upx;
			}

			.con {
				flex: 1;
				color: $font-color-dark;

				.selected-text {
					margin-right: 10upx;
				}
			}

			.bz-list {
				height: 40upx;
				font-size: $font-sm + 2upx;
				color: $font-color-dark;

				text {
					display: inline-block;
					margin-right: 30upx;
				}
			}

			.con-list {
				flex: 1;
				display: flex;
				flex-direction: column;
				color: $font-color-dark;
				line-height: 40upx;

				.buy-now {
					color: $uni-color-primary;
				}
			}

			.red {
				color: $uni-color-primary;
			}
		}

		.kefu-bg {
			height: 100vh;
			display: flex;
			justify-content: center;
			align-items: center;
			z-index: 98;

			image {
				width: 60vw;
				height: 60vw;
				border-radius: 12upx;
				z-index: 98;
			}
		}
	}
</style>
