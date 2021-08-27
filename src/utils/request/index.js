/* eslint-disable */
import Request from './request';
import {
	refreshToken,
	verifyAccessToken
} from '@/api/login';
import indexConfig from '@/config/index.config';
import mHelper from '@/utils/helper';
import store from '@/store';

const http = new Request();

// request全局参数设置
http.setConfig(config => {
	/* 设置全局配置 */
	config.baseUrl = indexConfig.baseUrl; /* 根域名不同 */
	const systemInfo = uni.getSystemInfoSync();
	const systemInfoHeaders = {
		'device-name': systemInfo.brand, // 设备名称
		width: systemInfo.screenWidth, // 屏幕宽度
		height: systemInfo.screenHeight, // 屏幕高度
		os: systemInfo.platform, // 客户端平台
		'os-version': systemInfo.system // 操作系统版本
	};
	config.header = {
		...config.header,
		...systemInfoHeaders
	};
	return config;
});

let isRefreshing = false;
let requests = [];
http.interceptor.request(
	config => {
		/* 请求之前拦截器 */
		// config.header['x-api-key'] = uni.getStorageSync('accessToken');
		config.header['Authorization'] = uni.getStorageSync('accessToken');
		// 单商户
		// config.header['merchant-id'] = uni.getStorageSync('merchantId') || 1;
		return config;
	},
	error => {
		return Promise.reject(error);
	}
);

// 刷新refreshToken
async function handleRefreshToken(refresh_token) {
	const params = {};
	params.group = mHelper.platformGroupFilter();
	params.refreshToken = refresh_token;
	await http.post(refreshToken, params).then(async r => {
		const provideData = {
			access_token: r.token,
			expiration_time: r.expiration_time,
			member: r.user,
			promoter: null,
			refresh_token: r.refreshToken,
		};
		store.commit('login', provideData);
		isRefreshing = false;
	});
}
http.interceptor.response(
	async response => {
		/* 请求之后拦截器 */
		if (response.data.hasOwnProperty("status")) {
			if (response.data.status < 200 || response.data.status > 300) {
				return response.data;
			}
		} else {
			return response.data;
		}

	}, async error => {
		let code = 0;
		try {
			code = error.data.status
		} catch (e) {
			if (error.toString().indexOf('Error: timeout') !== -1) {
				Notification.error({
					title: '网络请求超时',
					duration: 5000
				})
				return Promise.reject(error)
			}
		}
		if (code) {
			switch (code) {
				case 400:
					mHelper.toast(error.data.message);
					return Promise.reject(error.data.message);
				case 401:
					isRefreshing = false;
					if (error.config.url === refreshToken) {
						uni.removeStorageSync('accessToken');
						await store.commit('logout');
						// uni.showModal({
						// 	content: '会话已过期，是否跳转登录页面？',
						// 	success: confirmRes => {
						// 		if (confirmRes.confirm) {
						// 			mHelper.backToLogin();
						// 			throw error.data.message;
						// 		}
						// 	}
						// });
						break;
					} else {
						// 如果refreshToken为空 则直接跳转登录
						if (!store.state.refreshToken) {
							uni.removeStorageSync('accessToken');
							await store.commit('logout');
							// uni.showModal({
							// 	content: '会话已过期，是否跳转登录页面？',
							// 	success: confirmRes => {
							// 		if (confirmRes.confirm) {
							// 			mHelper.backToLogin();
							// 			throw error.data.message;
							// 		}
							// 	}
							// });
							throw error.data.message;
						} else {
							// isRefreshing同一个页面只执行一次
							if (!isRefreshing) {
								isRefreshing = true;
								// 刷新token
								await handleRefreshToken(store.state.refreshToken, error);
								requests.forEach(cb => cb());
								requests = [];
								isRefreshing = false;
								if (error.config.url !== verifyAccessToken) {
									return http.request(error.config);
								}
							} else {
								return new Promise(resolve => {
									// 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
									requests.push(() => {
										resolve(http.request(error.config));
									});
								});
							}
						}
					}
					break;
				case 403:
					mHelper.toast('当前操作不被允许');
					return Promise.reject(error.data.message);
				case 404:
					mHelper.toast(response.data.message);
					return Promise.reject(error.data.message);
				case 429:
					mHelper.toast('请求过多，先休息一下吧');
					return Promise.reject(error.data.message);
				case 500:
					mHelper.toast('服务器打瞌睡了');
					return Promise.reject(error.data.message);

				default:
					mHelper.toast(error.data.message);
					return Promise.reject(error.data.message);
			}
		} else {
			mHelper.toast("请求故障");
			return Promise.reject(error);
		}
	}
);

export {
	http
};
