<template>
	<view>
		<video style="width:100%" :src="videoUrl" :autoplay="true" :title="title" @error="videoErrorCallback" @waiting="videoWaiting"
		 loop=false controls></video>
		<!--顶部下拉菜单-->
		<rf-nav-detail @hide="hideNavDetail" :popupShow="navDetailShow"></rf-nav-detail>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				videoUrl: '',
				title: '',
				navDetailShow: false,
			}
		},
		onLoad(options) {
			this.videoUrl = options.videoUrl;
			this.title = options.title;
		},
		methods: {
			// #ifndef MP
			onNavigationBarButtonTap(e) {
				const index = e.index;
				if (index === 0) {
					this.navDetailShow = true;
				}
			},
			// #endif
			hideNavDetail() {
				this.navDetailShow = false;
			},
			videoErrorCallback: function(e) {
				uni.showModal({
					content: '网络连接错误',
					showCancel: false
				})
			},
			videoWaiting: function(e) {
				uni.showToast({
					title: '加载中，请稍等..',
					mask: true,
					icon: 'loading'
				})
			}
		}
	}
</script>

<style>

</style>
