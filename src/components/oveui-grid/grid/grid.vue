<template>
	<view class="grid-content">
		<view v-if="title" class="o-title">{{title}}</view>
		<view class="grid" :class="['cols-'+Col, Border]" ><slot /></view>
	</view>
</template>

<script>
	export default {
		name:'grid',
		props:{
			col:{
				type:[Number,String],
				default:4
			},
			border:{
				type:[Number,String],
				default:'true'
			},
			hoverClass:{
				type:String,
				default:''
			},
			title:{
				type:String,
				default:''
			}
		},
		
		computed:{
			Col(){
				if (this.col < 2) return 2;
				else if(this.col > 5) return 5;
				else return this.col;
			},
			Border(){
				if(this.border == 'false' || this.border == 0) return 'noborder';
				else return '';
			}
		}
	}
</script>

<style lang="scss" scoped>

	.grid[class*="cols-"]{
		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
	}
	.o-title{
		font-size:28rpx;
		color:#888;
		height:50rpx;
		line-height:50rpx;
		position:relative;
		padding-left:30rpx;
		padding-top:10rpx;
		box-sizing:content-box;
		&::after{
			position:absolute;
			content:"";
			left:10rpx;top:22rpx;
			height:24rpx;width:6rpx;
			border-radius:30px;
			background-color:#999;
			z-index:2;
		}
	}

</style>
