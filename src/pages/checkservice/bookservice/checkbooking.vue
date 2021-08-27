<template>
	<view class="input-content">
		<!-- 步骤条 -->
		<uni-steps :activeColor="themeColor.color" :options="stepList" :active="stepActive" @sendMsg="getStepActive"></uni-steps>
		<view class="form-content">
			<view v-show="stepActive === 0">
				<view class="input-item">
					<text class="iconfont icon-gongzuoxingzhi" :class="'text-' + themeColor.name"></text>
					<text class="tit">检验性质：</text>
					<picker :range="propertyPickerData" range-key="label" :value="pagePickerIndexs.property" @change="bindPickerChange($event, 'checkProperty')"
					 placeholder="请选择检验性质">
						<view>{{ pickerDataProperty }}</view>
					</picker>
				</view>
				<view class="input-item">
					<text class="iconfont icon-jianyanleixingweihu" :class="'text-' + themeColor.name"></text>
					<text class="tit">检验类型：</text>
					<picker :range="typePickerData" range-key="label" :value="pagePickerIndexs.type" @change="bindPickerChange($event, 'checkType')"
					 placeholder="请选择检验类型">
						<view>{{ pickerDataType }}</view>
					</picker>
				</view>
				<view class="input-item">
					<text class="iconfont icon-04-lingyufenlei" :class="'text-' + themeColor.name"></text>

					<text class="tit">领域分类：</text>
					<picker :range="areaPickerData" rangeKey="label" :value="pagePickerIndexs.area" @change="bindPickerChange($event, 'areaCatagroy')"
					 placeholder="请选择领域分类">
						<view>{{ pickerDataArea }}</view>
					</picker>
				</view>
				<view class="input-item">
					<text class="iconfont icon-chousongjiandanwei" :class="'text-' + themeColor.name"></text>
					<text class="tit">送检单位：</text>
					<input class="input" type="text" v-model="bookCheckingData.checkCompany" placeholder="请输入送检单位" />
				</view>
				<view class="input-item">
					<text class="iconfont icon-guanxiaobaotubiao16" :class="'text-' + themeColor.name"></text>
					<text class="tit">送检部门：</text>
					<input class="input" type="text" v-model="bookCheckingData.checkDept" placeholder="请输入送检部门" />
				</view>
				<view class="input-item">
					<text class="iconfont icon-ren" :class="'text-' + themeColor.name"></text>
					<text class="tit">联系人：</text>
					<input class="input" type="text" v-model="bookCheckingData.contact" placeholder="请输入联系人" />
				</view>
				<view class="input-item">
					<text class="iconfont icon-dianhua" :class="'text-' + themeColor.name"></text>
					<text class="tit">联系电话：</text>
					<input class="input" type="text" v-model="bookCheckingData.mobile" placeholder="请输入联系电话" />
				</view>
				<view class="btn_view">
					<button class="form_btn" :loading="btnLoading" @click="addActiveOne" size="default" :class="'bg-' + themeColor.name">
						下一步
					</button>
				</view>
			</view>
			<view v-show="stepActive === 1">
				<view class="comb-item">
					<view class="first-item" style="border: 0">
						<text class="iconfont icon-yangpin" :class="'text-' + themeColor.name"></text>
						<text class="tit">样品图片：</text>
					</view>
				</view>
				<!-- 图片上传 -->
				<imgUpload style="margin-bottom: 16vh" ref="imgUpload" :imgArr="imgArray" :imgType="imgUpload.imgType" :imgSize="imgUpload.imgSize"
				 :imgCount="imgUpload.imgCount" :imgMaxSize="imgUpload.imgMaxSize" :url="uploadUrl" @funcurls="getImgs" previewMany
				 loading></imgUpload>
				<view class="btn_view">
					<button class="form_btn" :loading="btnLoading" @click="reduceActive" size="default" :class="'bg-' + themeColor.name">
						上一步
					</button>
					<button class="form_btn" :loading="btnLoading" @click="addActiveTwo" size="default" :class="'bg-' + themeColor.name">
						下一步
					</button>
				</view>
			</view>
			<view v-show="stepActive === 2">
				<view class="comb-item">
					<view class="first-item" style="border: 0">
						<text class="iconfont icon-shipin" :class="'text-' + themeColor.name"></text>
						<text class="tit">样品视频：</text>
					</view>
				</view>
				<!-- 视频上传 -->
				<videoUpload style="margin-bottom: 16vh" ref="videoUpload" :videoArr="videoArray" :videoType="videoUpload.videoType"
				 :videoSize="videoUpload.videoSize" :videoCount="videoUpload.videoCount" :url="uploadUrl" @funcurls="getVideos"
				 previewMany loading></videoUpload>
				<view class="btn_view">
					<button class="form_btn" :loading="btnLoading" @click="reduceActive" size="default" :class="'bg-' + themeColor.name">
						上一步
					</button>
					<button class="form_btn" :loading="btnLoading" @click="addActiveThree" size="mini" :class="'bg-' + themeColor.name">
						下一步
					</button>
				</view>
			</view>
			<view v-show="stepActive === 3">
				<view class="checkbox-item">
					<view class="first-item">
						<text class="iconfont icon-dingzhifuwu" :class="'text-' + themeColor.name"></text>
						<text class="tit">基础服务：</text>
						<checkbox-group class="checkbox-content" @change="checBasicServices">
							<label v-for="item of basicItems" :key="item.code">
								<checkbox class="checkbox-itemm" :value="item.code" :checked="item.checked" style="transform: scale(0.7)"></checkbox>
								{{ item.name }}
								<br />
							</label>
						</checkbox-group>
					</view>
				</view>
				<view class="btn_view">
					<button class="form_btn" :loading="btnLoading" @click="reduceActive" size="default" :class="'bg-' + themeColor.name">
						上一步
					</button>
					<button class="form_btn" :loading="btnLoading" @click="addActiveFour" size="mini" :class="'bg-' + themeColor.name">
						下一步
					</button>
				</view>
			</view>
			<view v-show="stepActive === 4">
				<view class="input-item">
					<text class="iconfont icon-feiyongyugu" :class="'text-' + themeColor.name"></text>
					<text class="tit">费用预估：</text>
					<input class="input" type="text" :value="getPrice" disabled="true" />
				</view>
				<view class="checkbox-item">
					<view class="first-item">
						<text class="iconfont icon-dingzhifuwu" :class="'text-' + themeColor.name"></text>
						<text class="tit">定制服务：</text>
						<checkbox-group class="checkbox-content" @change="checServices">
							<label v-for="item of increaseItems" :key="item.code">
								<checkbox class="checkbox-itemm" :value="item.code" :checked="item.checked" style="transform: scale(0.7)"></checkbox>
								{{ item.name }}
								<br />
							</label>
						</checkbox-group>
					</view>
				</view>

				<view class="btn_view">
					<button class="form_btn" :loading="btnLoading" @click="reduceActive" size="default" :class="'bg-' + themeColor.name">
						上一步
					</button>
					<button class="form_btn" :loading="btnLoading" @click="confirm" size="mini" :class="'bg-' + themeColor.name">
						预约提交
					</button>
				</view>
			</view>
		</view>
		<view class="footer">
			<b>提示：</b>
			<view class="end-tip">1、提交预约检测申点击后2个工作日内会电话确认预约检测订单，如未接到电话，点击咨询服务。</view>
		</view>
	</view>
</template>
<script>
	import {
		bookcheckUrl,
		checkItemsUrl
	} from '@/api/checkservice';
	import {
		webConfig
	} from '@/api/basic';
	import indexConfig from '@/config/index.config';
	import {
		uploadImage
	} from '@/api/userInfo';
	import uniSteps from '@/components/uni-steps/uni-steps.vue';
	import tmUpload from '@/components/tm-upload/tm-upload.vue';
	import imgUpload from '@/components/poiuy-uImgUpload/imgUpload.vue';
	import videoUpload from '@/components/poiuy-uVideoUpload/videoUpload.vue';

	export default {
		components: {
			uniSteps,
			imgUpload,
			tmUpload,
			videoUpload,
		},
		data() {
			return {
				// 步骤列表
				stepList: [{
						title: '基本信息',
					},
					{
						title: '样品图片',
					},
					{
						title: '样品视频',
					},
					{
						title: '基础服务',
					},
					{
						title: '其他服务',
					},
				],
				stepActive: 0, // 当前步骤
				storeIndex: [], //存储选中过的步骤

				// 预约检测表单元素对象
				bookCheckingData: {
					checkProperty: '', // 检验性质
					checkType: '', // 检验类型
					areaCatagroy: '', // 领域分类
					checkCompany: '', // 送检单位
					checkDept: '', // 送检部门
					contact: '', // 联系人
					mobile: '', // 联系电话
					sampleImg: '', // 样品图片
					sampleVideo: '', // 样品视频
					basicItems: '', // 基础服务
					increaseItems: '', // 定制服务
					price: 0, // 费用预估
				},

				propertyPickerData: [], // 检验性质下拉框待选项
				typePickerData: [], // 检验类型下拉框待选项
				areaPickerData: [], // 领域类型下拉框待选项
				pagePickerIndexs: {
					property: 0, // 检验性质下拉选择框选中的值在待选项数组中的下标
					type: 0, // 检验类型下拉选择框选中的值在待选项数组中的下标
					area: 0, // 领域分类下拉选择框选中的值在待选项数组中的下标
				},
				pickerDataProperty: undefined, // 检验性质下拉选择中展示出来的数据
				pickerDataType: undefined, // 检验类型下拉选择中展示出来的数据
				pickerDataArea: undefined, // 领域分类下拉选择中展示出来的数据

				// 图片上传的类型、大小、数量限制
				imgUpload: {
					imgType: [],
					imgSize: undefined,
					imgCount: undefined,
					imgMaxSize: undefined,
				},
				// 视频上传的类型、大小、数量限制
				videoUpload: {
					videoType: [],
					videoSize: undefined,
					videoCount: undefined,
				},
				uploadUrl: '', // 图片、视频上传全路径
				imgArray: [], // 图片展示列表
				videoArray: [], // 视频展示列表
				choosedImgs: [], // 选中未上传的图片列表
				choosedVideos: [], // 选中未上传的图片列表
				dictVideoType: [], // 字典中配置的视频类型对照关系

				basicItems: [], // 检测项目：基础服务待选项
				increaseItems: [], // 检测项目：定制服务待选项
				choosedBaseItems: [], // 选中的基础服务
				choosedIncreaseItems: [], // 选中的增值服务

				regBody: {}, // 表单中需要校验的字段
				btnLoading: false, // 按钮加载状态
			};
		},
		created() {
			this.uploadUrl = indexConfig.baseUrl + uploadImage; // 拼接文件上传的全路径
			this.getDictDetail(); // 从字典获取相关信息
			this.getCheckItems(); // 获取检测项目信息：基础服务、定制服务
			this.storeIndex.push(this.stepActive); // 默认第一个步骤被选中
		},
		computed: {
			getPrice() {
				let price = 0;
				this.choosedBaseItems.forEach((item) => {
					if (item.price) {
						price += item.price;
					}
				});
				this.choosedIncreaseItems.forEach((item) => {
					if (item.price) {
						price += item.price;
					}
				});

				return price;
			},
		},
		methods: {
			// 查询字典详情
			async getDictDetail() {
				const types = [
					'check_property',
					'check_type',
					'area_catagroy',
					'video_type_table',
				];
				await this.$mHelper.getDictData(types.join(',')).then((res) => {
					this.propertyPickerData = res['check_property'];
					this.typePickerData = res['check_type'];
					this.areaPickerData = res['area_catagroy'];
					this.pickerDataProperty = this.propertyPickerData[
						this.pagePickerIndexs.property
					].label;
					(this.pickerDataType = this.typePickerData[
						this.pagePickerIndexs.type
					].label),
					(this.pickerDataArea = this.areaPickerData[
						this.pagePickerIndexs.area
					].label),
					(this.bookCheckingData.checkProperty = this.propertyPickerData[
						this.pagePickerIndexs.property
					].value);
					this.bookCheckingData.checkType = this.typePickerData[
						this.pagePickerIndexs.type
					].value;
					this.bookCheckingData.areaCatagroy = this.areaPickerData[
						this.pagePickerIndexs.area
					].value;

					// 取出视频类型对照表，生成新的可上传视频类型
					this.dictVideoType = res['video_type_table'];

					this.queryWebConfig();
				});
			},
			// 获取照片、视频上传时相关限制配置
			queryWebConfig() {
				this.$http.get(webConfig).then((groups) => {
					if (groups.length) {
						groups.forEach((res) => {
							// 可上传类型
							if (res.menuName && res.menuName == 'check_photo_type') {
								this.imgUpload.imgType = res.value.split(',');
								// console.log(this.imgUpload.imgType);
							}
							// 单张图片大小
							if (res.menuName && res.menuName == 'check_photo_size_one') {
								this.imgUpload.imgSize = Number(res.value);
							}
							// 可上传数量
							if (res.menuName && res.menuName == 'check_photo_num') {
								this.imgUpload.imgCount = res.value;
							}
							// 所有图片大小
							if (res.menuName && res.menuName == 'check_photo_size_total') {
								this.imgUpload.imgMaxSize = Number(res.value);
							}
							// 可上传视频格式
							if (res.menuName && res.menuName == 'check_video_type') {
								const checkVideoTypes = res.value.split(',');
								const mimeTypes = [];
								checkVideoTypes.forEach((m) => {
									this.dictVideoType.forEach((n) => {
										if (m == n.value) {
											mimeTypes.push(n.label);
										}
									});
								});
								this.videoUpload.videoType = mimeTypes.filter(
									(item, index) => mimeTypes.indexOf(item, 0) === index
								);
								// console.log(this.videoUpload.videoType);
							}
							// 可上传视频大小
							if (res.menuName && res.menuName == 'check_video_size') {
								this.videoUpload.videoSize = Number(res.value);
							}
							// 可上传视频数量
							if (res.menuName && res.menuName == 'check_video_time') {
								this.videoUpload.videoCount = res.value;
							}
						});
					}
				});
			},
			// 查询检测项目
			async getCheckItems() {
				await this.$http.get(checkItemsUrl).then((res) => {
					if (res) {
						res.forEach((e) => {
							e.checked = false;
						});
						this.basicItems = res.filter((e) => e.type == '1');
						this.increaseItems = res.filter((e) => e.type == '2');
					}
				});
			},

			// 页面picker change事件
			bindPickerChange(e, type) {
				switch (type) {
					case 'checkProperty':
						this.pagePickerIndexs.property = e.detail.value;
						this.bookCheckingData.checkProperty = this.propertyPickerData[
							e.detail.value
						].value;
						this.pickerDataProperty = this.propertyPickerData[
							e.detail.value
						].label;
						break;
					case 'checkType':
						this.pagePickerIndexs.type = e.detail.value;
						this.bookCheckingData.checkType = this.typePickerData[
							e.detail.value
						].value;
						this.pickerDataType = this.typePickerData[e.detail.value].label;
						break;
					case 'areaCatagroy':
						this.pagePickerIndexs.area = e.detail.value;
						this.bookCheckingData.areaCatagroy = this.areaPickerData[
							e.detail.value
						].value;
						this.pickerDataArea = this.areaPickerData[e.detail.value].label;
						break;
					default:
						break;
				}
				this.setPickerValue(e.detail.value, type);
			},
			// 赋值给表单中的select
			setPickerValue(index, type) {
				switch (type) {
					case 'checkProperty':
						this.bookCheckingData.checkProperty = this.propertyPickerData[
							index
						].value;
						break;
					case 'checkType':
						this.bookCheckingData.checkType = this.typePickerData[index].value;
						break;
					case 'areaCatagroy':
						this.bookCheckingData.areaCatagroy = this.areaPickerData[index].value;
						break;
					default:
						break;
				}
			},

			// 选中基础服务
			checBasicServices(e) {
				this.choosedBaseItems = [];
				const choosedBaseService = e.detail.value;
				// 通过选中的
				this.basicItems.filter((item) => {
					let flag = choosedBaseService.some((e) => e === item.code);
					if (flag) {
						this.choosedBaseItems.push(item);
					}
				});
				this.bookCheckingData.basicItems = choosedBaseService.toString();
			},
			// 选中定制服务
			checServices(e) {
				this.choosedIncreaseItems = [];
				const choosedIncreaseService = e.detail.value;
				// 通过选中的
				this.increaseItems.filter((item) => {
					let flag = choosedIncreaseService.some((e) => e === item.code);
					if (flag) {
						this.choosedIncreaseItems.push(item);
					}
				});
				this.bookCheckingData.increaseItems = choosedIncreaseService.toString();
			},

			// step0 => step1
			addActiveOne() {
				this.regBody['checkProperty'] = this.bookCheckingData.checkProperty;
				this.regBody['checkType'] = this.bookCheckingData.checkType;
				this.regBody['areaCatagroy'] = this.bookCheckingData.areaCatagroy;
				this.regBody['checkCompany'] = this.bookCheckingData.checkCompany;
				this.regBody['checkDept'] = this.bookCheckingData.checkDept;
				this.regBody['contact'] = this.bookCheckingData.contact;
				this.regBody['mobile'] = this.bookCheckingData.mobile;
				const formValid = this.$mGraceChecker.check(
					this.regBody,
					this.$mFormRule.bookingCheckRuleOne
				);
				if (!formValid) {
					this.$mHelper.toast(this.$mGraceChecker.error);
					this.btnLoading = false;
					return;
				}
				// 步骤条跳到下一个步骤，并存储下一个步骤
				this.addActive();
			},
			// step1 => step2
			addActiveTwo() {
				this.regBody['sampleImg'] = this.choosedImgs;
				const formValid = this.$mGraceChecker.check(
					this.regBody,
					this.$mFormRule.bookingCheckRuleTwo
				);
				if (!formValid) {
					this.$mHelper.toast(this.$mGraceChecker.error);
					this.btnLoading = false;
					return;
				}
				// 步骤条跳到下一个步骤，并存储下一个步骤
				this.addActive();
			},
			// step2 => step3
			addActiveThree() {
				this.regBody['sampleVideo'] = this.choosedVideos;
				const formValid = this.$mGraceChecker.check(
					this.regBody,
					this.$mFormRule.bookingCheckRuleThree
				);
				if (!formValid) {
					this.$mHelper.toast(this.$mGraceChecker.error);
					this.btnLoading = false;
					return;
				}
				// 步骤条跳到下一个步骤，并存储下一个步骤
				this.addActive();
			},
			// step3 => step4
			addActiveFour() {
				this.regBody['basicItems'] = this.bookCheckingData.basicItems;
				const formValid = this.$mGraceChecker.check(
					this.regBody,
					this.$mFormRule.bookingCheckRuleFour
				);
				if (!formValid) {
					this.$mHelper.toast(this.$mGraceChecker.error);
					this.btnLoading = false;
					return;
				}
				// 步骤条跳到下一个步骤，并存储下一个步骤
				this.addActive();
			},
			// preview :上一步
			reduceActive() {
				this.stepActive -= 1;
			},
			// next :下一步
			addActive() {
				this.stepActive += 1;
				this.storeIndex.push(this.stepActive);
			},
			getStepActive(index) {
				this.regBody['checkProperty'] = this.bookCheckingData.checkProperty;
				this.regBody['checkType'] = this.bookCheckingData.checkType;
				this.regBody['areaCatagroy'] = this.bookCheckingData.areaCatagroy;
				this.regBody['checkCompany'] = this.bookCheckingData.checkCompany;
				this.regBody['checkDept'] = this.bookCheckingData.checkDept;
				this.regBody['contact'] = this.bookCheckingData.contact;
				this.regBody['mobile'] = this.bookCheckingData.mobile;
				const formValid = this.$mGraceChecker.check(
					this.regBody,
					this.$mFormRule.bookingCheckRuleOne
				);
				if (!formValid && this.storeIndex.length >= 1) {
					this.storeIndex.splice(1, 5)
				}
				if (this.choosedImgs.length === 0 && this.storeIndex.length >= 2) {
					this.storeIndex.splice(2, 5)
				}
				if (this.choosedVideos.length === 0 && this.storeIndex.length >= 3) {
					this.storeIndex.splice(3, 5)
				}
				if (this.bookCheckingData.basicItems.length === 0 && this.storeIndex.length >= 4) {
					this.storeIndex.splice(4, 5)
				}
				for (let i = 0; i < this.storeIndex.length; i++) {
					if (index == this.storeIndex[i]) {
						this.stepActive = index;
					}
				}
			},

			// 获取选中未上传的图片列表
			getImgs(data) {
				this.choosedImgs = data;
			},
			// 获取选中未上传的视频列表
			getVideos(data) {
				this.choosedVideos = data;
			},

			submit() {},

			// 提交表单
			confirm() {
				this.btnLoading = true;
				// 价格赋值给表单提交对象
				this.bookCheckingData.price = this.getPrice;

				// 上传样品图片至后台
				this.$refs.imgUpload.upload((res) => {
					if (res.code == 0) {
						//0为正常返回，将回调的线上图片数组 赋值给需要提交的表单里
						this.bookCheckingData.sampleImg = res.urlArray.toString();

						// 继续上传视频文件
						this.$refs.videoUpload.upload((resp) => {
							if (resp.code == 0) {
								this.bookCheckingData.sampleVideo = resp.urlArray.toString();
							} else {
								this.btnLoading = false;
							}

							// 这时候再提交表单
							this.$http
								.post(bookcheckUrl, this.bookCheckingData)
								.then((res) => {
									if (res) {
										this.$mHelper.toast('添加成功');
									}
									this.btnLoading = false;
								})
								.catch(() => {
									this.btnLoading = false;
								});
						});
					} else {
						this.btnLoading = false;
					}
				});
			},
		},
	};
</script>

<style lang='scss'>
	.input-content {
		position: relative;
		// height: 100vh;
		padding: 40upx 30upx;
		background: #fff;

		.form-content {
			padding: 0 40upx;
			margin-top: 80upx;
		}

		.input-item {
			position: relative;
			display: flex;
			padding: 0 30upx;
			height: 80upx;
			line-height: 65upx;
			border-radius: 4px;
			margin-bottom: 55upx;
			border-bottom: 1px solid #e5e5e5;

			.iconfont {
				font-size: 55upx;
				position: absolute;
				left: 0;
			}

			&:last-child {
				margin-bottom: 0;
			}

			.tit {
				width: 200upx;
				font-size: $font-base + 2upx;
				color: $font-color-base;
				margin-left: 50upx;
			}

			input {
				height: 60upx;
				width: calc(100% - 100upx);
				line-height: 60upx;
				font-size: $font-base + 7upx;
			}

			picker {
				width: calc(100% - 100upx);
				height: 60upx;
				line-height: 60upx;
				font-size: $font-base + 7upx;
				color: $font-color-dark;

				view {
					line-height: 60upx;
				}
			}

			uni-picker uni-view[data-v-4af2c966] {
				font-size: $font-base + 7upx;
			}
		}

		.checkbox-item {
			position: relative;
			display: flex;
			line-height: 65upx;
			border-radius: 4px;
			margin-bottom: 55upx;

			.iconfont {
				font-size: 55upx;
				margin-right: 10upx;
			}

			&:last-child {
				margin-bottom: 0;
			}

			.first-item {
				width: 100vw;

				.tit {
					font-size: $font-base + 2upx;
					color: $font-color-base;
					margin-left: 5upx;
				}

				.checkbox-content {
					height: 35vh;
					padding: 0 30upx;
					font-size: $font-base + 7upx;
					overflow-y: auto;
					margin-top: 20upx;
					color: #787676;
				}

				.checkbox-itemm {
					margin-left: 20upx;
					margin-bottom: 20upx;
				}
			}

			.second-item {
				height: 120upx;
				overflow: auto;

				.uni-label-pointer {
					width: calc(100% - 400upx);
					cursor: pointer;
					font-size: $font-base + 2upx;
					color: $font-color-dark;
				}
			}

			/*自定义滚动条的伪对象选择器, CSS 可以隐藏滚动条*/
			.second-item::-webkit-scrollbar {
				display: none;
			}
		}

		.comb-item {
			display: flex;
			line-height: 60upx;
			margin-top: 90upx;
			margin-bottom: 80upx;

			.first-item {
				position: relative;
				display: flex;
				padding: 0 0 0 40upx;
				height: 80upx;
				line-height: 65upx;
				border-radius: 4px;
				margin-bottom: 55upx;
				border-bottom: 1px solid #e5e5e5;

				.iconfont {
					font-size: 55upx;
					position: absolute;
					left: 0;
				}

				&:last-child {
					margin-bottom: 0;
				}

				.tit {
					width: 220upx;
					font-size: $font-base + 2upx;
					color: $font-color-base;
					margin-left: 40upx;
				}

				input {
					width: calc(100% - 100upx);
					height: 60upx;
					line-height: 60upx;
					font-size: $font-base + 7upx;
					color: $font-color-dark;
				}
			}

			.second-item {
				height: 70upx;
				line-height: 70upx;
				padding-left: 20upx;

				button {
					width: 120upx;
					height: 70upx;
					font-size: $spacing-base + 5upx;
					line-height: 70upx;
				}
			}
		}

		.btn_view {
			display: flex;
			margin-top: 70upx;

			.form_btn {
				height: 70upx;
				display: flex;
				align-items: center;
				font-size: $font-base + 2upx;
			}
		}

		.footer {
			margin-top: 20upx;
			font-size: $font-sm + 2upx;
			color: #797c80;

			.end-tip {
				font-size: 24upx;
				text-indent: 2em;
			}
		}

		.checkbox-itemm .uni-checkbox-input::before {
			display: block !important;
		}
	}
</style>

<style>
	/* uni-checkbox .wx-checkbox-input::before,
uni-checkbox .uni-checkbox-input::before {
  display: block !important;
} */
</style>
