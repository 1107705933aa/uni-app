<template>
	<view class="">
		<view class="">
			<uni-list>
				<uni-list-item v-for="item in mineBookingList" :key="item.id" :show-arrow="true" :title="item.orderNo" :note="item.addTime | time"
				 :thumb="item.sampleImg" thumbSize="lg" :rightText="statusFormat(item.status)" :rightTextColor="colorFormat(item.status)"
				 :to="'/pages/checkservice/bookservice/bookingdetail?bookid='+item.id" />
			</uni-list>
		</view>
		<rf-empty class="empty" info="暂无预约记录~" v-if="mineBookingList.length === 0 && !loading"></rf-empty>
		<rfLoading isFullScreen :active="loading"></rfLoading>
	</view>

</template>

<script>
	import UniCard from '@/components/uni-card/uni-card.vue';
	import UniList from '@/components/uni-list/uni-list.vue';
	import UniListItem from '@/components/uni-list-item/uni-list-item.vue';
	import {
		minebookingUrl
	} from '@/api/checkservice';
	import moment from '@/common/moment';

	export default {
		data() {
			return {
				mineBookingList: [],
				loading: true
			}
		},
		components: {
			UniCard,
			UniList,
			UniListItem
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
				this.$http.get(minebookingUrl).then(res => {
					this.loading = false;
					if (res && res.length > 0) {
						this.mineBookingList = res;
						this.mineBookingList.forEach(e => {
							if (e.hasorder == 1) {
								e.status = "1"
							} else {
								e.status = "0"
							}
						})
					}
				})
			},
			statusFormat(value) {
				let str = '';
				str = value == '0' ? '未确认' : value == '1' ? '已受理' : value == '2' ? '已退单' : str;
				return str
			},
			colorFormat(value) {
				let str = '#999';
				str = value == '0' ? 'red' : value == '1' ? 'green' : value == '2' ? 'darkgray' : str;
				return str;
			}
		},
	}
</script>

<style>

</style>
