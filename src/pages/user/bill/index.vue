<template>
	<view class="">
		<uni-list>
			<uni-list-item v-for="item in mineBillList" :key="item.id" :show-arrow="true" :title="'发票名称：'+item.billName" :note="item.addTime | time"
			 :to="'/pages/user/bill/detail?billUrl='+item.billUrl" />
		</uni-list>

		<rf-empty class="empty" info="暂无电子发票" v-if="mineBillList.length === 0 && !loading"></rf-empty>
		<rfLoading isFullScreen :active="loading"></rfLoading>
	</view>
</template>

<script>
	import {
		minebillUrl
	} from '@/api/checkservice';
	import moment from '@/common/moment';

	export default {
		data() {
			return {
				mineBillList: [],
				loading: true,
			}
		},
		filters: {
			time(val) {
				return moment(val * 1000).format('YYYY-MM-DD HH:mm:ss');
			},
		},
		onLoad() {
			this.initData();
		},
		methods: {
			initData() {
				this.$http.get(minebillUrl).then(res => {
					this.loading = false;
					if (res && res.length > 0) {
						this.mineBillList = res;
					}
				}).catch(err=>{
					this.loading = false;
					console.dir(err)
				})
			}
		},
	}
</script>

<style>
</style>
