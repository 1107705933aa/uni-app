<template>
	<view class="uni-flex uni-column uni-bg-white">
		<view class="flex-item flex-item-V"></view>
		<view class="flex-item flex-item-V uni-bg-blue view-text" @tap="navTo('/pages/checkservice/bookservice/index')">预约检测</view>
		<view class="flex-item flex-item-V"></view>
		<view class="flex-item flex-item-V uni-bg-green view-text" @tap="navTo('/pages/checkservice/searchservice/progressSearch')">检测动态</view>
		<view class="flex-item flex-item-V"></view>
		<view class="flex-item flex-item-V uni-bg-red view-text" @tap="navTo('/pages/checkservice/bookservice/index')">证书查询</view>
	</view>
</template>

<script>
	import minetest1 from '@/api/basic';
	export default {
		methods: {
			// 通用跳转
			navTo(route) {
				this.$mRouter.push({
					route
				});
			},
			testRequest() {
				console.log("111")
				this.$http.post(`${minetest1}`).then((m) => {
					console.log("111");
					console.log(m);
				})
			}
		}
	}
</script>

<style lang="scss">
	.flex-item {
		width: 33.3%;
		height: 200rpx;
		text-align: center;
		line-height: 200rpx;
	}

	.flex-item-V {
		width: 100%;
		height: 150rpx;
		text-align: center;
		line-height: 150rpx;
	}

	.view-text {
		font-size: 36rpx;
		color: #FFFFFF;
	}

	.uni-bg-blue {
		background-color: #2D8CF0;
	}

	.uni-bg-green {
		background-color: #19BE6B;
	}

	.uni-bg-red {
		background-color: #ED4014;
	}
</style>
