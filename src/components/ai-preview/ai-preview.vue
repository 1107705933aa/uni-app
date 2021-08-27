<template>
	<view>
		<image :src="imgUrl" mode="widthFix" class="img" @click="preview"></image>
		<view class="close" @click="close" v-if="!isMark && !flag">&times;</view>
		<view class="mask" v-if="!flag" @click="clickMask"></view>
		<view class="image" v-if="!flag">
			<image :src="imgUrl" class="image" @click="clickImg" @longpress='handleLongPress' @touchstart="handleTouchStart"
			 @touchend="handleTouchEnd"></image>
		</view>
	</view>
</template>

<script>
	export default {
		name: "ai-preview",
		props: {
			// 图片路径
			imgUrl: {
				type: String
			},
			// 点击遮罩层是否关闭
			isMark: {
				type: Boolean,
				default: true
			},
			itemList: {
				type: Array,
				default: () => []
			}
		},
		data() {
			return {
				// 控制图片显隐
				flag: true,
				startTime: 0,
				endTime: 0,
				// 当前图片
				activeIndex: -1
			}
		},
		methods: {
			// 点击图片预览
			preview() {
				this.flag = !this.flag
			},
			// 点击遮罩层
			clickMask() {
				if (this.isMark) this.flag = true
			},
			// 点击预览图片
			clickImg() {
				this.$emit('clickImg')
			},
			handleTouchStart(e) {
				e.preventDefault()
				this.startTime = e.timeStamp;
			},
			//touch end
			handleTouchEnd(e) {
				e.preventDefault()
				this.endTime = e.timeStamp;
			},
			handleLongPress(e) {
				if (this.itemList.length) {
					e.preventDefault()
					uni.showActionSheet({
						itemList: this.itemList,
						success: (res) => {
							this.flag = true
							this.$emit('clickItem', res.tapIndex)
						},
						fail: (err) => {
							console.log(err.errMsg)
						}
					})
				}
			},
			close() {
				this.flag = true
				this.$emit('close')
			}
		},
		mounted() {
			//#ifdef H5
			window.addEventListener('contextmenu', (e) => {
				e.preventDefault()
			})
			//#endif
		}
	}
</script>

<style scoped lang="scss">
	* {
		padding: 0;
		margin: 0;
	}

	.image {
		width: 400rpx;
		height: 400rpx;
	}

	.img {
		width: 100%;
		height: auto;
	}

	.close {
		font-size: 42px;
		position: absolute;
		top: 10rpx;
		right: 20rpx;
		color: #fff;
		z-index: 9999;
	}

	.mask {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background: rgba(0, 0, 0, .8);
	}

	.image {
		z-index: 99;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}
</style>
