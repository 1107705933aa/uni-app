/**
 *@des 登录注册相关接口
 *@date 2019/11/15 15:14:47
 *@param login.js
 */

// 密码注册
const registerByPass = '/api/wxuser/wxregister';

// 密码登录
// const loginByPassApi = '/auth/loginbywx';
const loginByPassApi = '/api/wxuser/wxlogin';

// 微信授权登录
const wechatH5Login = '/tiny-shop/v1/third-party/wechat';

// 微信小程序授权登录
const mpWechatLogin = '/tiny-shop/v1/third-party/wechat-mp';

// App微信授权登录
const thirdPartyWechatOpenPlatform = '/tiny-shop/v1/third-party/wechat-open-platform';

// 密码重置
const updatePassword = '/api/wxuser/updatepswd';

// 第三方绑定
const authLogin = '/tiny-shop/v1/member/auth/create';

// 查询绑定状态
const isBindingCheck = '/tiny-shop/v1/member/auth/is-binding';

// 手机号登录
const loginBySmsCode = '/auth/login/phone';

// 获取手机验证码
const smsCode = '/tiny-shop/v1/site/sms-code';

// 退出登录
const logout = '/auth/logout';

// 刷新token
const refreshToken = '/auth/refresh-token';

// 登录令牌有效性检测
const verifyAccessToken = '/auth/verify-access-token';

//注册进度查询
const getProgress = '/api/wxuser/getProgress'

//获取协议信息
const getRegistration = '/api/registration/selectByWechat'

export {
	registerByPass,
	loginByPassApi,
	isBindingCheck,
	wechatH5Login,
	mpWechatLogin,
	thirdPartyWechatOpenPlatform,
	authLogin,
	updatePassword,
	smsCode,
	loginBySmsCode,
	logout,
	refreshToken,
	verifyAccessToken,
	getProgress,
	getRegistration
};
