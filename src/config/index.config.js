const CONFIG = {
    // 开发环境配置
    development: {
        assetsPath: '/static', // 静态资源路径
        baseUrl: 'http://localhost:8001', // 后台接口请求地址
        baseUrl: 'http://localhost:8001', // 后台接口请求地址
        // baseUrl: 'http://192.168.3.47:8001', // 后台接口请求地址
        baseUrl: 'http://192.168.90.72:8001', // 后台接口请求地址
		// baseUrl: 'http://192.168.90.43:8001', // 后台接口请求地址
		// fileUrl: 'http://192.168.90.43:8009',//文件请求地址
        hostUrl: 'http://localhost:7012', // H5地址(前端运行地址)
        websocketUrl: '', // websocket服务端地址
        weixinAppId: 'wx19077e73ea64d311' // 微信公众号appid
    },
    // 生产环境配置
    production: {
        assetsPath: '/static', // 静态资源路径
        baseUrl: '/wechat-api/', // 后台接口请求地址
        hostUrl: 'http://172.16.4.204:7021', // H5地址(前端运行地址)
				fileUrl: 'http://192.168.90.43:8009',//文件请求地址
        websocketUrl: '', // websocket服务端地址
        weixinAppId: 'wx19077e73ea64d311' // 微信公众号appid
    }

};
export default CONFIG[process.env.NODE_ENV];
