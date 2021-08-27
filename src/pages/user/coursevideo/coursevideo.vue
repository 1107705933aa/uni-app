<template>
	<view>
		<uni-list>
			<uni-list :border="true" v-for="(item , index) in productList" :key="index" >
				<!-- 显示圆形头像 -->
				<uni-list-chat :avatar-circle="true" :title="item.name" :avatar="item.image" :clickable= "true"
				 @click="navTo(item)"
				 :note="item.remark" :time="item.createTime | timeFull"></uni-list-chat>
			</uni-list>
		</uni-list>
		<rf-load-more :status="loadingType" v-if="productList.length > 0"></rf-load-more>
		<!--页面加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
		<rf-empty class="empty" info="该课程暂无对应视频" v-if="productList.length === 0 && !loading"></rf-empty>
	</view>
</template>

<script>
	import rfProductList from '@/components/rf-product-list/index';
	import rfLoadMore from '@/components/rf-load-more/rf-load-more';
	import uniList from '@/components/uni-list/uni-list.vue'
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue'
	import moment from '@/common/moment';
	import {
		myCourseVideo,
	} from '@/api/userInfo.js';
	export default {
		components: {
			rfProductList,
			rfLoadMore,
			uniList,
			uniListItem
		},
		filters: {
			// 格式化时间
			time(val) {
				return moment(val * 1000).format('YYYY-MM-DD');
			},
			// 格式化时间
			timeFull(val) {
				return moment(val * 1000).format('YYYY-MM-DD HH:mm');
			}
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
		onLoad(options) {
			this.id = options.id;
			this.orderTime = options.orderTime;
			this.productList = [];
			this.getProductList();
		},
		data() {
			return {
				productList: [], //产品数据
				isList: true, //是否以列表展示  | 列表或大图
				dropScreenH: 0, //下拉筛选框距顶部距离
				page: 0,
				id: '', //对应的课程id
				loadingType: 'more', //加载更多
				loading: true, //下拉刷新加载
				orderTime:'',
			};
		},
		methods: {
			// 获取我的商品列表
			async getProductList(type) {
				this.loading = true;
				await this.$http
					.get(`${myCourseVideo}`, {
						cid: this.id,
						size: 10,
						days:this.orderTime,
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
			// 跳转详情
			navTo(data) {
				let route = '/pages/user/coursevideo/videoplay?videoUrl='+data.videoUrl+'&title='+data.name;
				this.$mRouter.push({
					route,
				});
			},
		},
	};
</script>

<style lang="scss">
</style>
