<template>
	<view class="my-coupon">
		<view>
			<!--顶部导航栏-->
			<view class="tabr" :style="{ top: headerTop }">
				<view :class="typeClass == 'valid' ? `text-${themeColor.name} on` : ''" @tap="switchType('valid', 0,0)">可用
					<text v-if="state === 0">({{ totalElements }})</text>
				</view>
				<view :class="typeClass == 'used' ? `text-${themeColor.name} on` : ''" @tap="switchType('used', 1,1)">已使用
					<text v-if="state === 1">({{ totalElements }})</text>
				</view>
				<view :class="typeClass == 'invalid' ? `text-${themeColor.name} on` : ''" @tap="switchType('invalid', 2,0)">已失效
					<text v-if="state === 2">({{ totalElements}})</text>
				</view>
				<view class="border" :class="[typeClass, 'bg-' + themeColor.name]"></view>
			</view>
			<!--占位符-->
			<view class="place"></view>
			<!--优惠券列表-->
			<view class="coupon-list">
				<view v-if="state === 2&& couponList.length > 0 && !loading" class="empty-invalid" :class="'text-' + themeColor.name"
				 @tap.stop="emptyInvalidCoupon">
					清空失效优惠券
				</view>
				<!-- 优惠券列表 -->
				<view class="sub-list valid" :style="{ marginTop: state === 2 ? '50upx' : 0 }">
					<view class="row" v-for="(row, index) in couponList" :key="index">
						<!-- content -->
						<view class="carrier">
							<view class="left">
								<view class="in1line title">
									<text class="cell-icon" :class="'bg-' + themeColor.name">{{row.coupontype === '培训服务' ? '培':'检'}}</text>
									{{ row.couponTitle }}
								</view>
								<view class="term" v-if="state != 1">
									{{ row.addTime | time }} ~ {{ row.endTime | time }}
								</view>
								<view class="term" v-else>
									使用时间：{{ row.useTime | timeFull }}
								</view>
								<view class="overdue" v-if="state === 2">
									<text class="iconfont iconyiguoqi2" :class="'text-' + themeColor.name"></text>
								</view>
								<view class="overdue" v-if="state === 1">
									<text class="iconfont iconyishiyong"></text>
								</view>
								<view class="usage">
									{{
										row.coupontype === '培训服务'
											? '仅用于' + row.productName
											: '仅用于检验服务'
									}}
								</view>
							</view>
							<view class="right" :class="state === 0 ? 'valid' : 'invalid'">
								<view class="ticket">
									<view class="num">
										￥{{row.couponPrice}}
									</view>
								</view>
								<view class="criteria"> 满{{ row.useMinPrice }}可用</view>
								<view class="use" :class="'text-' + themeColor.name" v-if="state == 0 && row.coupontype === '培训服务'" @tap="navTo('/pages/trainservice/train-course-deatail?id='+row.cid)">
									去使用
								</view>
								<view class="use" :class="'text-' + themeColor.name" v-if="state == 0 && row.coupontype === '检测服务'" @tap="navTo('/pages/checkservice/bookservice/checkbooking')">
									去使用
								</view>
							</view>
						</view>
					</view>
				</view>
				<rf-load-more :status="loadingType" v-if="couponList.length > 0"></rf-load-more>
			</view>
		</view>
		<rf-empty class="empty" info="暂无优惠券" v-if="couponList.length === 0 && !loading"></rf-empty>
		<rfLoading isFullScreen :active="loading"></rfLoading>
	</view>
</template>
<script>
	/**
	 * @des 优惠券管理
	 *
	 * @author stav stavyan@qq.com
	 * @date 2019-12-09 10:13
	 * @copyright 2019
	 */
	import {
		couponClear,
		myCouponList
	} from '@/api/userInfo';
	import rfLoadMore from '@/components/rf-load-more/rf-load-more';
	import moment from '@/common/moment';
	export default {
		components: {
			rfLoadMore,
		},
		data() {
			return {
				headerTop: 0,
				// 控制滑动效果
				typeClass: 'valid',
				state: 0,
				status: 0, //购物券状态
				couponList: [],
				totalElements:0,//优惠券数量
				loadingType: 'more',
				token: null,
				page: 0,
				loading: true,
				uid: uni.getStorageSync('userInfo').id
			};
		},
		filters: {
			// 格式化时间
			time(val) {
				return moment(val * 1000).format('YYYY-MM-DD');
			},
			// 格式化时间
			timeFull(val) {
				return moment(val * 1000).format('YYYY-MM-DD HH:mm:ss');
			}
		},
		// 下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
		onPullDownRefresh() {
			this.totalElements = 0;
			this.page = 0;
			this.couponList = [];
			this.getMyCouponList('refresh');
		},
		// 加载更多
		onReachBottom() {
			if (this.loadingType === 'nomore') return;
			this.page++;
			this.getMyCouponList();
		},
		onLoad() {
			// 数据初始化
			this.initData();
			// 兼容H5下排序栏位置
			// #ifdef H5
			// 定时器方式循环获取高度为止，这么写的原因是onLoad中head未必已经渲染出来。
			let Timer = setInterval(() => {
				let uniHead = document.getElementsByTagName('uni-page-head');
				if (uniHead.length > 0) {
					this.headerTop = uniHead[0].offsetHeight + 'px';
					clearInterval(Timer); // 清除定时器
				}
			}, 1);
			// #endif
		},
		methods: {
			// 切换顶部优惠券类型
			switchType(type, state, status) {
				if (this.typeClass === type) {
					return;
				}
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 0
				});
				this.typeClass = type;
				this.state = state;
				this.status = status;
				this.page = 0;
				this.couponList = [];
				this.totalElements = 0;
				this.loading = true;
				this.getMyCouponList();
			},
			// 清空失效优惠券
			async emptyInvalidCoupon() {
				const body = [];
				for (let i = 0; i < this.couponList.length; i++) {
					let data = {
						id: this.couponList[i].id,
						isFail: 1
					}
					body.push(data);
				}
				await this.$http.post(`${couponClear}`, body).then(() => {
					this.$mHelper.toast('失效购物券已清空');
					this.couponList = [];
					this.getMyCouponList();
				});
			},
			// 初始化数据
			initData() {
				this.totalElements = 0;
				this.page = 0;
				this.couponList = [];
				this.getMyCouponList();
			},
			// 跳转详情
			navTo(route) {
				this.$mRouter.push({
					route
				});
			},
			// 获取我的优惠券列表
			async getMyCouponList(type) {
				this.loading = true;
				await this.$http
					.get(`${myCouponList}`, {
						page: this.page,
						size: 10,
						status: this.status,
						state: this.state,
						isFail: 0,
						uid: this.uid
					})
					.then(r => {
						this.loading = false;
						if (type === 'refresh') {
							uni.stopPullDownRefresh();
						}
						this.totalElements = r.totalElements ;
						this.loadingType = r.totalElements > 10 && r.content.length ==10 ? 'more' : 'nomore';
						this.couponList = [...this.couponList, ...r.content];
					})
					.catch(() => {
						this.loading = false;
						if (type === 'refresh') {
							uni.stopPullDownRefresh();
						}
					});
			}
		}
	};
</script>
<style lang="scss">
	view {
		display: flex;
		flex-wrap: wrap;
	}

	page {
		position: relative;
		background-color: $page-color-base;
	}

	.my-coupon {
		.place {
			width: 100%;
			height: 95upx;
		}

		.tabr {
			background-color: #fff;
			width: 100%;
			height: 95upx;
			padding: 0 3%;
			border-bottom: solid 1upx #dedede;
			position: fixed;
			top: 0;
			z-index: 10;

			view {
				width: 33.3%;
				height: 90upx;
				justify-content: center;
				align-items: center;
				font-size: 32upx;
			}

			.border {
				height: 4upx;

				&.used {
					transform: translate3d(100%, 0, 0);
				}

				&.invalid {
					transform: translate3d(200%, 0, 0);
				}
			}
		}
	}

	.coupon-list {
		width: 100%;
		display: block;
		position: relative;

		.empty-invalid {
			position: absolute;
			right: 20upx;
			top: 10upx;
			font-size: $font-base;
		}
	}

	@keyframes showValid {
		0% {
			transform: translateX(-100%);
		}

		100% {
			transform: translateX(0);
		}
	}

	@keyframes showInvalid {
		0% {
			transform: translateX(0);
		}

		100% {
			transform: translateX(-100%);
		}
	}

	.sub-list {
		width: 100%;

		&.invalid {
			position: absolute;
			top: 0;
			left: 100%;
			display: none;
		}

		&.showvalid {
			display: flex;
			animation: showValid 0.2s linear both;
		}

		&.showinvalid {
			display: flex;
			animation: showInvalid 0.2s linear both;
		}

		.tis {
			width: 100%;
			height: 60upx;
			justify-content: center;
			align-items: center;
			font-size: 32upx;
		}

		.row {
			width: 92%;
			height: 24vw;
			margin: 20upx auto 10upx auto;
			border-radius: 8upx;
			// box-shadow: 0upx 0 10upx rgba(0,0,0,0.1);
			align-items: center;
			position: relative;
			overflow: hidden;
			z-index: 4;
			border: 0;

			.carrier {
				@keyframes showMenu {
					0% {
						transform: translateX(0);
					}

					100% {
						transform: translateX(-28%);
					}
				}

				@keyframes closeMenu {
					0% {
						transform: translateX(-28%);
					}

					100% {
						transform: translateX(0);
					}
				}

				&.open {
					animation: showMenu 0.25s linear both;
				}

				&.close {
					animation: closeMenu 0.15s linear both;
				}

				background-color: #fff;
				position: absolute;
				width: 100%;
				padding: 0 0;
				height: 100%;
				z-index: 3;
				flex-wrap: nowrap;

				.left {
					width: 100%;
					position: relative;

					.title {
						padding-top: 3vw;
						width: 90%;
						margin: 0 5%;
						font-size: 36upx;

						.cell-icon {
							display: inline-block;
							height: 32upx;
							margin-top: 15upx;
							width: 32upx;
							font-size: 22upx;
							text-align: center;
							line-height: 32upx;
							border-radius: 4upx;
							margin-right: 12upx;

							&.hb {
								background: #ffaa0e;
							}

							&.lpk {
								background: #3ab54a;
							}
						}
					}

					.term {
						width: 90%;
						margin: 0 5%;
						font-size: 26upx;
						color: #999;
					}

					.usage {
						width: 90%;
						margin: 0 5%;
						font-size: 26upx;
						color: $font-color-light;
					}

					.gap-top,
					.gap-bottom {
						position: absolute;
						width: 20upx;
						height: 20upx;
						right: -10upx;
						border-radius: 100%;
						background-color: #f5f5f5;
					}

					.gap-top {
						top: -10upx;
					}

					.gap-bottom {
						bottom: -10upx;
					}

					.overdue {
						position: absolute;
						right: 10upx;
						top: 0;

						.iconyiguoqi2 {
							font-size: $font-lg + 40upx;
						}

						.iconyishiyong {
							font-size: $font-lg + 40upx;
							color: $font-color-base;
						}
					}
				}

				.right {
					flex-shrink: 0;
					width: 28%;
					color: #fff;

					&.invalid {
						background: linear-gradient(to right, #aaa, #999);

						.use {
							color: #aaa;
						}
					}

					&.valid {
						background: rgb(229, 77, 66);

						.use {
							color: rgb(229, 77, 66);
						}
					}

					justify-content: center;

					.ticket,
					.criteria {
						width: 100%;
					}

					.ticket {
						padding-top: 1vw;
						justify-content: center;
						align-items: baseline;
						height: 6vw;

						.num {
							font-size: 42upx;
							font-weight: 600;
						}

						.unit {
							font-size: 24upx;
						}
					}

					.criteria {
						justify-content: center;

						font-size: 28upx;
					}

					.use {
						width: 45%;
						margin: 0 2.5%;
						height: 40upx;
						justify-content: center;
						align-items: center;
						font-size: 24upx;
						background-color: #fff;
						border-radius: 40upx;
						padding: 0 4upx;
					}
				}
			}
		}
	}

	.empty {
		width: 100vw;
		display: block;
	}
</style>
