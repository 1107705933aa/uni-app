<template>
	<view>
		<web-view :src="url"></web-view>
		<!--顶部下拉菜单-->
		<rf-nav-detail @hide="hideNavDetail" :popupShow="navDetailShow"></rf-nav-detail>
	</view>
</template>
<script>
	var _self;
	import {
		browseCount,
	} from '@/api/product';
	export default {
		data() {
			return {
				url: '',
				id: '',
				navDetailShow: false,
			}
		},
		onLoad: function(e) {
			_self = this;
			_self.url = e.url;
			if (e.id) {
				this.$http.post(browseCount + e.id).then(res => {

				})
			}
		},
		methods:{
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
		}
	}
</script>

<style>

</style>
