/*
 * 路由表对象：
 * 该文件挂载在Vue原型中 $mRoutesConfig
 * 作用：调用$mRouter对象的方法 传入以下对应的路由对象，详细见common目录下的router.js
 * 示例：this.$mRouter.push({route:this.$mRoutesConfig.main,query:{a:1}})
 * 注意：所有在pages目录下新建的页面都必须在"路由表"中进行声明，并且在框架的pages.json注册。
 *
 * 配置参数项说明：
 * name:可选配置 （路由名称）
 * path:必填配置 （路由地址）
 * requiresAuth:可选配置 （是否权限路由）
 */

export default {
	// 权限路由 在main.js可实现路由拦截 所以路由都需要注册 待完善
	promoCode: {
		name: '创建订单',
		path: '/pages/order/create/order',
		requiresAuth: true
	},
	appointmentDetection: {
		name: '预约检测',
		path: '/pages/checkservice/bookservice/checkbooking',
		requiresAuth: true
	},
	storeUpload: {
		name: '商城上传',
		path: '/pages/marketing/live/list',
		requiresAuth: true
	},
	myCourse: {
		name: '我的课程',
		path: '/pages/user/coursevideo/mycourse',
		requiresAuth: true
	},
	courseVideo: {
		name: '课程视频',
		path: '/pages/user/coursevideo/coursevideo',
		requiresAuth: true
	},

	// 非权限路由
	main: {
		name: '首页',
		path: '/pages/index/index'
	},
	category: {
		name: '分类',
		path: '/pages/category/category'
	},
	cart: {
		name: '购物车',
		path: '/pages/cart/cart'
	},
	login: {
		name: '登录',
		path: '/pages/public/login'
	},
	index: {
		name: '注册',
		path: '/pages/public/register'
	},
	loginType: {
		name: '登录类型',
		path: '/pages/public/logintype'
	},
	trainGroup: {
		name: '培训群',
		path: '/pages/trainservice/traingroup'
	},
	detectionTrends: {
		name: '检测动态',
		path: '/pages/checkservice/searchservice/progressSearch'
	},
	certificateInquiry: {
		name: '证书查询',
		path: '/pages/checkservice/searchservice/credentialSearch'
	},
	lecturerIntroduction: {
		name: '讲师介绍',
		path: '/pages/trainservice/teacher'
	},
	trainingCourse: {
		name: '培训课程',
		path: '/pages/trainservice/traincourse'
	}
};
