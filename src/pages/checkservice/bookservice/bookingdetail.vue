<template>
	<view class="example-body">
		<uni-card :isShadow="true" :title="bookingDetail.orderNo" mode="title" :thumbnail="bookingDetail.sampleImg" extra="true"
		 :note="bookingDetail.addTime | time">
			<view>
				<view class="image-box">
					<!-- <image class="image" mode="aspectFill" src="https://img-cdn-qiniu.dcloud.net.cn/new-page/uni.png" /> -->
					<video class="image" :src="bookingDetail.sampleVideo"></video>
				</view>
				<view class="content-box">
					<view class="content-item" v-if="bookingDetail.dealerName">
						<view class="item-label">受理人：</view>
						<view class="item-main">{{bookingDetail.dealerName}}</view>
					</view>
					<view class="content-item" v-if="bookingDetail.checkProperty">
						<text class="item-label">检验性质：</text>
						<text class="item-main">{{bookingDetail.checkPropertyStr}}</text>
					</view>
					<view class="content-item" v-if="bookingDetail.checkType">
						<text class="item-label">检验类型：</text>
						<text class="item-main">{{bookingDetail.checkTypeStr}}</text>
					</view>
					<view class="content-item" v-if="bookingDetail.checkCompany">
						<text class="item-label">送检单位：</text>
						<text class="item-main">{{bookingDetail.checkCompany}}</text>
					</view>
					<view class="content-item" v-if="bookingDetail.checkDept">
						<text class="item-label">送检部门：</text>
						<text class="item-main">{{bookingDetail.checkDept}}</text>
					</view>
					<view class="content-item" v-if="bookingDetail.contact">
						<text class="item-label">联系人：</text>
						<text class="item-main">{{bookingDetail.contact}}</text>
					</view>
					<view class="content-item" v-if="bookingDetail.mobile">
						<text class="item-label">联系电话：</text>
						<text class="item-main">{{bookingDetail.mobile}}</text>
					</view>
					<view class="content-item" v-if="bookingDetail.price">
						<text class="item-label">预估费用：</text>
						<text class="item-main">{{bookingDetail.price}}</text>
					</view>
					<view class="content-item" v-if="bookingDetail.increaseItems">
						<text class="item-label">定制服务：</text>
						<text class="item-main">{{bookingDetail.increaseItemsStr}}</text>
					</view>
				</view>
			</view>
			<template slot="extra">
				<text :style="{color: bookingDetail.statusColor}">{{bookingDetail.statusStr}}</text>
			</template>
		</uni-card>
	</view>
</template>

<script>
	import UniCard from '@/components/uni-card/uni-card.vue';
	import {
		bookingdetailUrl
	} from '@/api/checkservice';
	import moment from '@/common/moment';
	export default {
		data() {
			return {
				bookingDetail: {},
				bookings: []
			}
		},
		components: {
			UniCard,
		},
		filters: {
			time(val) {
				return moment(val * 1000).format('YYYY-MM-DD HH:mm:ss');
			},
		},
		onLoad(option) {
			this.initData(option)
		},
		methods: {
			initData(option) {
				const bookid = option.bookid;
				let url = bookingdetailUrl + "/" + bookid;
				console.dir(url);
				// 查询预约记录详情
				this.$http.get(url).then(res => {
					console.dir(res);
					if (res) {
						this.bookingDetail = res;
					}
				})
			}
		},
	}
</script>

<style>
	.example-body {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		padding: 1px 0;
	}

	.example-box {
		margin: 12px 0;
	}

	.image-box {
		/* #ifndef APP-NVUE */
		display: flex;
		flex-direction: column;
		/* #endif */
		height: 350rpx;
		overflow: hidden;
	}

	.image {
		/* #ifndef APP-NVUE */
		width: 100%;
		height: 100%;
		/* #endif */
		flex: 1;
	}

	.content-box {
		padding-top: 20rpx;
	}

	.content-item {
		font-size: 12px;
		line-height: 22px;
		display: flex;
	}

	.item-label {
		font-weight: bold;
		width: 30%;
	}

	.item-main {
		text-align: center;
		width: 70%;
	}

	.footer-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		justify-content: space-between;
		flex-direction: row;

	}

	.footer-box__item {
		align-items: center;
		padding: 2px 0;
		font-size: 12px;
		color: #666;
	}
</style>
