<template>
	<view class="empty">
		<view class="empty-content" :class="{ emptyOnly: !isRecommendShow }">
			<text class="iconfont icon-zanwuxinxi" :class="'text-'+themeColor.name"></text>
			<text class="empty-content-info">{{ info }}</text>
		</view>
		<rf-recommend :bottom="bottom" v-if="isRecommendShow" :params="params" :list="list" class="recommend" />
	</view>
</template>

<script>
	export default {
		props: {
			src: {
				type: String,
				default: 'empty'
			},
			isRecommendShow: {
				type: Boolean,
				default: true
			},
			info: {
				type: String,
				default: ''
			},
			bottom: {
				type: Number,
				default: 0
			},
			list: {
				type: Array,
				default () {
					return [];
				}
			},
			params: {
				type: Object,
				default: function() {
					return {
						size: 10,
						page: 0,
						sort: 'id,desc',
						isShow: 1,
						isDel: 0,
						isHot: 1,
					};
				}
			}
		},
		data() {
			return {};
		},
		computed: {}
	};
</script>

<style lang="scss">
	.empty {
		background-color: $color-white;

		.empty-content {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			padding: 20upx 0 80upx;

			.empty-content-info {
				font-size: $font-base - 2upx;
			}

			.iconfont {
				font-size: 240upx;
			}

			&-image {
				width: 200upx;
				height: 200upx;
			}
		}

		.emptyOnly {
			position: fixed;
			left: 0;
			top: 0;
			right: 0;
			bottom: 0;
		}
	}
</style>
