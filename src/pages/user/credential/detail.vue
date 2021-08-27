<template>
	<view class="">
		<web-view :src="viewUrl" style="width: 100vw;height: scle(100vh-50px);"></web-view>
	</view>
</template>

<script>

	export default {
		data() {
			return {
				viewUrl: ""
			}
		},
		onLoad(option) {
			this.viewUrl = option.credentialUrl
		}
	}
</script>

<style>
</style>
