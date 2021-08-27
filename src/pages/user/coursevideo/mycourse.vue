<template>
	<view>
		<view class="product-list-wrapper">
			<rf-product-list :eid="'courseVideoId'" :bottom="0" :list="productList" :isList="isList" :style="{ paddingTop: dropScreenH + 10 + 'upx' }"></rf-product-list>
		</view>
		<rf-load-more :status="loadingType" v-if="productList.length > 0"></rf-load-more>
		<!--页面加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
		<rf-empty class="empty" info="暂无已购买商品" v-if="productList.length === 0 && !loading"></rf-empty>
	</view>
</template>

<script>
	import rfProductList from '@/components/rf-product-list/index';
	import rfLoadMore from '@/components/rf-load-more/rf-load-more';
	import {
		myProductList,
	} from '@/api/product';
	export default {
		components: {
			rfProductList,
			rfLoadMore,
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.page = 0
			this.productList.length = 0;
			this.getProductList('refresh');
		},
		// 加载更多
		onReachBottom() {
			if (this.loadingType === 'nomore') return;
			this.page++;
			this.getProductList();
		},
		onShow() {
			this.productList = [];
			this.getProductList();
		},
		data() {
			return {
				productList: [], //产品数据
				isList: false, //是否以列表展示  | 列表或大图
				dropScreenH: 0, //下拉筛选框距顶部距离
				page: 0,
				loadingType: 'more', //加载更多
				loading: true, //下拉刷新加载
			};
		},
		methods: {
			// 获取我的商品列表
			async getProductList(type) {
				this.loading = true;
				await this.$http
					.get(`${myProductList}`, {
						size: 10,
						page: this.page,
					})
					.then(async (r) => {
						this.loading = false;
						if (type === 'refresh') {
							uni.stopPullDownRefresh();
						}
						this.loadingType = r.totalElements > 10 && r.content.length == 10 ? 'more' : 'nomore';
						this.productList = [...this.productList, ...r.content];
					})
					.catch((err) => {
						this.loading = false;
						if (type === 'refresh') {
							uni.stopPullDownRefresh();
						}
					});
			},
		},
	};
</script>

<style lang="scss">
</style>
