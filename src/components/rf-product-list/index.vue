<template>
	<view>
		<view class="rf-product-list" v-if="eid === 'traincourseId'">
			<view class="rf-product-list-container">
				<block v-for="(item, index) in list" :key="index">
					<!--商品列表-->
					<view v-if="(index + 1) % 2 !== 0 || isList" class="rf-product-item" @tap.stop=" item.isCourse
                ? navTo(
                    `/pages/trainservice/train-course-deatail?id=${item.id}`
                  )
                : navTo(`/pages/product/web/web?url=${item.storeInfo}&id=${item.id}`)"
					 :class="[isList ? 'rf-product-flex-list' : '']" hover-class="hover" :hover-start-time="150">
						<view class="rf-product-image-wrapper">
							<image :src="item.image" mode="widthFix" :preview="false" :class="[isList ? 'rf-product-list-img' : 'rf-product-img']"></image>
							<text class="sketch in1line">{{ item.sketch }}
								<span style="float: right">{{ item.teachkey }}</span>
							</text>
							<view class="triangle-wrapper">
								<image class="triangle-tag" :src="item | filterTagName"></image>
							</view>
						</view>
						<view class="rf-pro-content">
							<view class="rf-pro-tit">
								<span style="
                    overflow: hidden;
                    text-overflow: ellipsis;
                    width: 100%;
                    height: 20px;
                    display: block;
                  ">
									{{ item.isCourse ? item.courseName : item.storeName }}
								</span>

								<view v-if="item.isCourse" style="
                    font-size: small;
                    color: #8799a3;
                    height: 15px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  ">
									{{ item.teachname }}
								</view>
							</view>
							<view>
								<view class="rf-pro-price" v-if="item.isCourse">
									<text class="rf-sale-price" :class="'text-' + themeColor.name">{{ moneySymbol }}{{ item.price }}</text>
									<text class="rf-factory-price" v-if="item.market_price > item.price">{{ moneySymbol }}{{ item.market_price }}</text>
								</view>
								<view class="rf-pro-price" v-else>
									<text class="rf-sale-price" :class="'text-' + themeColor.name">{{ moneySymbol }}9999</text>
									<span style="
                      color: red;
                      font-size: 15rpx;
                      border-radius: 10px;
                      border: 2px solid rgb(255, 117, 140);
                      text-align: center;
                      margin-left: 20rpx;
                      height: 30rpx;
                    ">微信商城</span>
								</view>
								<view class="rf-pro-pay" v-if="item.isCourse">
									<text><text :class="'text-' + themeColor.name">{{
                      item.totalSales == null ?  0 : item.totalSales
                    }}</text>
										人付款</text>
									<text @tap.stop="addShow(item)" :class="
                      item.favorite
                        ? 'iconfont iconshoucang2  '
                        : 'iconfont iconshoucang4 '
                    "
									 style="margin-right: -100rpx; color: red"></text>
									<text @tap.stop="addShop(item)" :class="
                      item.shopcart
                        ? 'iconfont icongouwuche_ '
                        : 'iconfont icongouwuche2 '
                    "
									 style="color: red"></text>
								</view>
								<view class="rf-pro-pay" v-else>
									<text style="
                      width: 60%;
                      overflow: hidden;
                      white-space: nowrap;
                      text-overflow: ellipsis;
                    ">{{ item.unitName }}</text>
									<text @tap.stop="addShow(item)" :class="
                      item.favorite
                        ? 'iconfont iconshoucang2  '
                        : 'iconfont iconshoucang4 '
                    "
									 style="float: right; color: red"></text>
								</view>
							</view>
						</view>
					</view>
					<!--商品列表-->
				</block>
			</view>
			<view class="rf-product-list-container" v-if="!isList">
				<block v-for="(item, index) in list" :key="index">
					<!--商品列表-->
					<view v-if="(index + 1) % 2 === 0" class="rf-product-item" @tap.stop="
              item.isCourse
                ? navTo(
                    `/pages/trainservice/train-course-deatail?id=${item.id}`
                  )
                : navTo(`/pages/product/web/web?url=${item.storeInfo}&id=${item.id}`)
            "
					 :class="[isList ? 'rf-product-flex-list' : '']" hover-class="hover" :hover-start-time="150">
						<view class="rf-product-image-wrapper">
							<image :src="item.image" mode="widthFix" :preview="false" :class="[isList ? 'rf-product-list-img' : 'rf-product-img']"></image>
							<text class="sketch in1line">{{ item.sketch }}</text>
							<view class="triangle-wrapper" v-if="
                  item.shipping_type === '1' ||
                  item.is_virtual === '1' ||
                  item.commissionRate ||
                  item.is_open_presell === '1'
                ">
								<image class="triangle-tag" :src="item | filterTagName"></image>
							</view>
						</view>
						<view class="rf-pro-content">
							<view class="rf-pro-tit">
								<span style="
                    overflow: hidden;
                    text-overflow: ellipsis;
                    width: 100%;
                    height: 20px;
                    display: block;
                  ">
									{{ item.isCourse ? item.courseName : item.storeName }}
								</span>

								<view v-if="item.isCourse" style="
                    font-size: small;
                    color: #8799a3;
                    height: 15px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  ">
									{{ item.teachname }}
								</view>
							</view>
							<view>
								<view class="rf-pro-price" v-if="item.isCourse">
									<text class="rf-sale-price" :class="'text-' + themeColor.name">{{ moneySymbol }}{{ item.price }}</text>
									<text class="rf-factory-price" v-if="item.market_price > item.price">{{ moneySymbol }}{{ item.market_price }}</text>
								</view>
								<view class="rf-pro-price" v-else>
									<text class="rf-sale-price" :class="'text-' + themeColor.name">{{ moneySymbol }}9999</text>
									<span style="
                      color: red;
                      font-size: 15rpx;
                      border-radius: 10px;
                      border: 2px solid rgb(255, 117, 140);
                      text-align: center;
                      margin-left: 20rpx;
                      height: 30rpx;
                    ">微信商城</span>
								</view>
								<view class="rf-pro-pay" v-if="item.isCourse">
									<text><text :class="'text-' + themeColor.name">{{
                      item.totalSales == null ?  0 : item.totalSales
                    }}</text>
										人付款</text>
									<text @tap.stop="addShow(item)" :class="
                      item.favorite
                        ? 'iconfont iconshoucang2  '
                        : 'iconfont iconshoucang4 '
                    "
									 style="margin-right: -100rpx; color: red"></text>
									<text @tap.stop="addShop(item)" :class="
                      item.shopcart
                        ? 'iconfont icongouwuche_ '
                        : 'iconfont icongouwuche2 '
                    "
									 style="color: red"></text>
								</view>
								<view class="rf-pro-pay" v-else>
									<text style="
                      width: 60%;
                      overflow: hidden;
                      white-space: nowrap;
                      text-overflow: ellipsis;
                    ">{{ item.unitName }}</text>
									<text @tap.stop="addShow(item)" :class="
                      item.favorite
                        ? 'iconfont iconshoucang2  '
                        : 'iconfont iconshoucang4 '
                    "
									 style="float: right; color: red"></text>
								</view>
							</view>
						</view>
					</view>
					<!--商品列表-->
				</block>
			</view>
			<!-- 规格-模态层弹窗 -->
			<view class="popup spec show" v-if="specClass === 'show'" @touchmove.stop.prevent="stopPrevent" @tap="hideSpec">
				<!-- 遮罩层 -->
				<view class="mask" @tap="hideSpec"></view>
				<view class="layer" :style="{ bottom: bottom ? `${bottom}upx` : 0 }" @tap.stop="stopPrevent">
					<rf-attr-content :product="productDetail" @toggle="toggleSpec" :showBuyBtn="true"></rf-attr-content>
				</view>
			</view>
		</view>
		<view class="rf-product-list" v-if="eid === 'teacherId'">
			<view class="rf-product-list-container">
				<block v-for="(item, index) in list" :key="index">
					<view v-if="(index + 1) % 2 !== 0 || isList" class="rf-product-item" @click="jumpPro(item)" :class="[isList ? 'rf-product-flex-list' : '']"
					 hover-class="hover" :hover-start-time="150">
						<view class="rf-product-image-wrapper">
							<image :src="item.picture" mode="widthFix" :preview="false" :class="[isList ? 'rf-product-list-img' : 'rf-product-img']"></image>
							<text class="sketch in1line">{{ item.courseName2 }} </text>
						</view>
						<view class="rf-pro-content">
							<view class="rf-pro-tit">
								<span style="
                    overflow: hidden;
                    text-overflow: ellipsis;
                    width: 100%;
                    height: 20px;
                    display: block;
                  ">
									{{ item.name }}
								</span>
								<view style="
                    font-size: small;
                    color: #8799a3;
                    height: 15px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  ">
									{{ item.detailsMsg }}
								</view>
							</view>
						</view>
					</view>
				</block>
			</view>
			<view class="rf-product-list-container" v-if="!isList">
				<block v-for="(item, index) in list" :key="index">
					<view v-if="(index + 1) % 2 === 0" class="rf-product-item" @click="jumpTeacher(item)" :class="[isList ? 'rf-product-flex-list' : '']"
					 hover-class="hover" :hover-start-time="150">
						<view class="rf-product-image-wrapper">
							<image :src="item.picture" mode="widthFix" :preview="false" :class="[isList ? 'rf-product-list-img' : 'rf-product-img']"></image>
							<text class="sketch in1line">{{ item.courseName2 }}</text>
							<view class="triangle-wrapper" v-if="
                  item.shipping_type === '1' ||
                  item.is_virtual === '1' ||
                  item.commissionRate ||
                  item.is_open_presell === '1'
                ">
								<image class="triangle-tag" :src="item | filterTagName"></image>
							</view>
						</view>
						<view class="rf-pro-content">
							<view class="rf-pro-tit">
								<span style="
                    overflow: hidden;
                    text-overflow: ellipsis;
                    width: 100%;
                    height: 20px;
                    display: block;
                  ">
									{{ item.name }}
								</span>
								<view style="
                    font-size: small;
                    color: #8799a3;
                    height: 15px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  ">
									{{ item.detailsMsg }}
								</view>
							</view>
						</view>
					</view>
					<!--商品列表-->
				</block>
			</view>
			<!-- 规格-模态层弹窗 -->
			<view class="popup spec show" v-if="specClass === 'show'" @touchmove.stop.prevent="stopPrevent" @tap="hideSpec">
				<!-- 遮罩层 -->
				<view class="mask" @tap="hideSpec"></view>
				<view class="layer" :style="{ bottom: bottom ? `${bottom}upx` : 0 }" @tap.stop="stopPrevent">
					<rf-attr-content :product="productDetail" @toggle="toggleSpec" :showBuyBtn="true"></rf-attr-content>
				</view>
			</view>
		</view>
		<view class="rf-product-list" v-if="eid === 'teacherdeatilsId'">
			<view class="rf-product-list-container">
				<block v-for="(item, index) in list" :key="index">
					<view v-if="(index + 1) % 2 !== 0 || isList" class="rf-product-item" @click="jumpDetail(item)" :class="[isList ? 'rf-product-flex-list' : '']"
					 hover-class="hover" :hover-start-time="150">
						<view class="rf-product-image-wrapper">
							<image :src="item.image" mode="widthFix" :preview="false" :class="[isList ? 'rf-product-list-img' : 'rf-product-img']"></image>
							<text class="sketch in1line">{{ item.openTime | time }} </text>
						</view>
						<view class="rf-pro-content">
							<view class="rf-pro-tit">
								<span style="
                    overflow: hidden;
                    text-overflow: ellipsis;
                    width: 100%;
                    height: 20px;
                    display: block;
                  ">
									{{ item.courseName }}
								</span>
								<view style="
                    font-size: small;
                    color: #8799a3;
                    height: 15px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  ">
									{{ item.openLocation }}
								</view>
							</view>
						</view>
					</view>
				</block>
			</view>
			<view class="rf-product-list-container" v-if="!isList">
				<block v-for="(item, index) in list" :key="index">
					<view v-if="(index + 1) % 2 === 0" class="rf-product-item" @click="jumpDetail(item)" :class="[isList ? 'rf-product-flex-list' : '']"
					 hover-class="hover" :hover-start-time="150">
						<view class="rf-product-image-wrapper">
							<image :src="item.image" mode="widthFix" :preview="false" :class="[isList ? 'rf-product-list-img' : 'rf-product-img']"></image>
							<text class="sketch in1line">{{ item.openTime | time }}</text>
							<view class="triangle-wrapper" v-if="
                  item.shipping_type === '1' ||
                  item.is_virtual === '1' ||
                  item.commissionRate ||
                  item.is_open_presell === '1'
                ">
								<image class="triangle-tag" :src="item | filterTagName"></image>
							</view>
						</view>
						<view class="rf-pro-content">
							<view class="rf-pro-tit">
								<span style="
                    overflow: hidden;
                    text-overflow: ellipsis;
                    width: 100%;
                    height: 20px;
                    display: block;
                  ">
									{{ item.courseName }}
								</span>
								<view style="
                    font-size: small;
                    color: #8799a3;
                    height: 15px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  ">
									{{ item.openLocation }}
								</view>
							</view>
						</view>
					</view>
					<!--商品列表-->
				</block>
			</view>
			<!-- 规格-模态层弹窗 -->
			<view class="popup spec show" v-if="specClass === 'show'" @touchmove.stop.prevent="stopPrevent" @tap="hideSpec">
				<!-- 遮罩层 -->
				<view class="mask" @tap="hideSpec"></view>
				<view class="layer" :style="{ bottom: bottom ? `${bottom}upx` : 0 }" @tap.stop="stopPrevent">
					<rf-attr-content :product="productDetail" @toggle="toggleSpec" :showBuyBtn="true"></rf-attr-content>
				</view>
			</view>
		</view>

		<view class="rf-product-list" v-if="eid === 'courseVideoId'">
			<view class="rf-product-list-container">
				<block v-for="(item, index) in list" :key="index">
					<!--商品列表-->
					<view v-if="(index + 1) % 2 !== 0 || isList" class="rf-product-item" @tap.stop=" navTo(
		                `/pages/user/coursevideo/coursevideo?id=${item.cid}&orderTime=${item.orderTime}`
		              )"
					 :class="[isList ? 'rf-product-flex-list' : '']" hover-class="hover" :hover-start-time="150">
						<view class="rf-product-image-wrapper">
							<image :src="item.image" mode="widthFix" :preview="false" :class="[isList ? 'rf-product-list-img' : 'rf-product-img']"></image>
							<text class="sketch in1line">{{ item.sketch }}
								<span style="float: right">{{ item.teachkey }}</span>
							</text>
							<view class="triangle-wrapper">
								<image class="triangle-tag" :src="item | filterTagName"></image>
							</view>
						</view>
						<view class="rf-pro-content">
							<view class="rf-pro-tit">
								<span style="
		                overflow: hidden;
		                text-overflow: ellipsis;
		                width: 100%;
		                height: 20px;
		                display: block;
		              ">
									{{ item.isCourse ? item.courseName : item.storeName }}
								</span>

								<view v-if="item.isCourse" style="
		                font-size: small;
		                color: #8799a3;
		                height: 15px;
		                overflow: hidden;
		                text-overflow: ellipsis;
		              ">
									{{ item.teachname }}
								</view>
							</view>
							<view>
								<view class="rf-pro-price" v-if="item.isCourse">
									<text class="rf-sale-price" :class="'text-' + themeColor.name">{{ moneySymbol }}{{ item.price }}</text>
									<text class="rf-factory-price" v-if="item.market_price > item.price">{{ moneySymbol }}{{ item.market_price }}</text>
								</view>
								<view class="rf-pro-price" v-else>
									<text class="rf-sale-price" :class="'text-' + themeColor.name">{{ moneySymbol }}9999</text>
									<span style="
		                  color: red;
		                  font-size: 15rpx;
		                  border-radius: 10px;
		                  border: 2px solid rgb(255, 117, 140);
		                  text-align: center;
		                  margin-left: 20rpx;
		                  height: 30rpx;
		                ">微信商城</span>
								</view>
							</view>
						</view>
					</view>
					<!--商品列表-->
				</block>
			</view>
			<view class="rf-product-list-container" v-if="!isList">
				<block v-for="(item, index) in list" :key="index">
					<!--商品列表-->
					<view v-if="(index + 1) % 2 === 0" class="rf-product-item" @tap.stop="
		          item.isCourse
		            ? navTo(
		                `/pages/trainservice/train-course-deatail?id=${item.id}&orderTime=${item.orderTime}`
		              )
		            : navTo(`/pages/product/web/web?url=${item.storeInfo}&id=${item.id}`)
		        "
					 :class="[isList ? 'rf-product-flex-list' : '']" hover-class="hover" :hover-start-time="150">
						<view class="rf-product-image-wrapper">
							<image :src="item.image" mode="widthFix" :preview="false" :class="[isList ? 'rf-product-list-img' : 'rf-product-img']"></image>
							<text class="sketch in1line">{{ item.sketch }}</text>
							<view class="triangle-wrapper" v-if="
		              item.shipping_type === '1' ||
		              item.is_virtual === '1' ||
		              item.commissionRate ||
		              item.is_open_presell === '1'
		            ">
								<image class="triangle-tag" :src="item | filterTagName"></image>
							</view>
						</view>
						<view class="rf-pro-content">
							<view class="rf-pro-tit">
								<span style="
		                overflow: hidden;
		                text-overflow: ellipsis;
		                width: 100%;
		                height: 20px;
		                display: block;
		              ">
									{{ item.isCourse ? item.courseName : item.storeName }}
								</span>

								<view v-if="item.isCourse" style="
		                font-size: small;
		                color: #8799a3;
		                height: 15px;
		                overflow: hidden;
		                text-overflow: ellipsis;
		              ">
									{{ item.teachname }}
								</view>
							</view>
							<view>
								<view class="rf-pro-price" v-if="item.isCourse">
									<text class="rf-sale-price" :class="'text-' + themeColor.name">{{ moneySymbol }}{{ item.price }}</text>
									<text class="rf-factory-price" v-if="item.market_price > item.price">{{ moneySymbol }}{{ item.market_price }}</text>
								</view>
								<view class="rf-pro-price" v-else>
									<text class="rf-sale-price" :class="'text-' + themeColor.name">{{ moneySymbol }}9999</text>
									<span style="
		                  color: red;
		                  font-size: 15rpx;
		                  border-radius: 10px;
		                  border: 2px solid rgb(255, 117, 140);
		                  text-align: center;
		                  margin-left: 20rpx;
		                  height: 30rpx;
		                ">微信商城</span>
								</view>
							</view>
						</view>
					</view>
					<!--商品列表-->
				</block>
			</view>
			<!-- 规格-模态层弹窗 -->
			<view class="popup spec show" v-if="specClass === 'show'" @touchmove.stop.prevent="stopPrevent" @tap="hideSpec">
				<!-- 遮罩层 -->
				<view class="mask" @tap="hideSpec"></view>
				<view class="layer" :style="{ bottom: bottom ? `${bottom}upx` : 0 }" @tap.stop="stopPrevent">
					<rf-attr-content :product="productDetail" @toggle="toggleSpec" :showBuyBtn="true"></rf-attr-content>
				</view>
			</view>
		</view>

	</view>
</template>
<script>
	/**
	 * @des 商品列表
	 *
	 * @author stav stavyan@qq.com
	 * @date 2020-05-15 10:49
	 */
	import {
		//   productDetail,
		cartItemDel,
		cartItemCreate,
		addFavorite,
		removeFavorite,
		cartItemCount,
	} from '@/api/product';
	import rfAttrContent from '@/components/rf-attr-content';
	import $mAssetsPath from '@/config/assets.config';
	import {
		mapMutations
	} from 'vuex';
	import moment from '@/common/moment';
	export default {
		name: 'rfProductList',
		props: {
			list: {
				type: Array,
				default () {
					return [];
				},
			},
			// 是否以列表展示 | 列表或大图
			isList: {
				type: Boolean,
				default: false,
			},
			// 是否以列表展示 | 列表或大图
			bottom: {
				type: Number,
				default: 0,
			},
			eid: {
				type: String,
				default: '',
			},
		},
		components: {
			rfAttrContent,
		},
		data() {
			return {
				specClass: 'none',
				moneySymbol: this.moneySymbol,
				productDetail: {},
				hasLogin: this.$mStore.getters.hasLogin,
				addflag: false, //防止多次点击事件 加入购物车
				showflag: false,
			};
		},
		filters: {
			// 格式化时间
			time(val) {
				return moment(val * 1000).format('YYYY-MM-DD');
			},
			filterTotalSales(val) {
				if (val > 10000) {
					val = `${(val / 10000).toFixed(2)}w`;
				}
				return val;
			},
			filterTagName(val) {
				if (val.commissionRate) {
					// 分销商品
					return $mAssetsPath.distribution;
				} else if (val.is_virtual === '1') {
					// 虚拟产品
					return $mAssetsPath.virtual;
				} else if (val.shipping_type === '1') {
					// 包邮产品
					return $mAssetsPath.pinkage;
				}
			},
		},
		methods: {
			jumpProduct(item) {
				if (item.isCourse === true) {
					this.navTo(`/pages/trainservice/train-course-deatail?id=${item.id}`);
				} else if (item.isCourse === false) {
					this.navTo(`/pages/product/web/web?url=${item.storeInfo}`);
				}
			},

			// 视频播放错误提示
			videoErrorCallback: function(e) {
				uni.showModal({
					content: "网络故障，请稍后重试",
					showCancel: false
				})
			},

			jumpPro(item) {
				this.navTo('/pages/trainservice/teacherdeatils', item);
			},
			jumpTeacher(item) {
				this.navTo('/pages/trainservice/teacherdeatils', item);
			},
			jumpDetail(item) {
				if (item.product_id !== null) {
					this.navTo(
						`/pages/trainservice/train-course-deatail?id=${item.product_id}`,
						item.isProduct
					);
				}
			},
			...mapMutations(['setCartNum']),
			// 跳转详情
			navTo(route, data) {
				if (data) {
					uni.setStorageSync('teacher', data);
				}
				this.$mRouter.push({
					route,
				});
			},
			// 添加商品至购物车
			async addShop(item) {
				if (!this.hasLogin) {
					await this.$mHelper.backToLogin();
					return;
				}
				if (this.addflag) {
					return;
				}
				this.addflag = true;
				if (item.shopcart) {
					const body = {
						id: item.id,
					};
					await this.$http.post(cartItemDel, body).then((res) => {
						this.$mHelper.toast('已从购物车中移除');
						item.shopcart = false;
						this.addflag = false;
					}).catch(err => {
						this.addflag = false;
					});
				} else {
					const body = {
						productId: item.id,
						type: '培训服务',
					};
					await this.$http.post(cartItemCreate, body).then((res) => {
						this.$mHelper.toast('添加购物车成功');
						item.shopcart = true;
						this.addflag = false;
					}).catch(err => {
						this.addflag = false;
					});
				}
			},
			// 添加收藏
			async addShow(item) {
				if (!this.hasLogin) {
					await this.$mHelper.backToLogin();
					return;
				}
				if (this.showflag) {
					return;
				}
				this.showflag = true;
				if (item.favorite) {
					const body = {
						id: item.id,
					};
					this.$http.post(removeFavorite, body).then((res) => {
						this.$mHelper.toast('已从收藏夹中移除');
						item.favorite = false;
						this.showflag = true;
					}).catch(err => {
						this.showflag = false;
					});
				} else {
					const body = {
						cid: item.id,
					};
					this.$http.post(addFavorite, body).then((res) => {
						this.$mHelper.toast('添加收藏成功');
						item.favorite = true;
						this.showflag = true;
					}).catch(err => {
						this.showflag = false;
					});
				}
			},
		},
	};
</script>
